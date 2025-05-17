
'use server';

import {
  generateProjectIdeas,
  type GenerateProjectIdeasInput,
  type GenerateProjectIdeasOutput,
} from '@/ai/flows/generate-project-ideas-flow';
import {
  generateProjectGuidance,
  type GenerateProjectGuidanceInput,
  type GenerateProjectGuidanceOutput,
  GenerateProjectGuidanceInputSchema,
} from '@/ai/flows/generate-project-guidance-flow';
import { z } from 'zod';

export type ProjectIdeasFormState = {
  message?: string;
  fields?: Record<string, string>;
  ideas?: GenerateProjectIdeasOutput['ideas'];
  isError?: boolean;
  inputSubmitted?: GenerateProjectIdeasInput;
};

const projectIdeasFormSchema = z.object({
  fieldOfStudy: z
    .string()
    .min(3, 'Please specify your field of study (e.g., Computer Science, Arts, Biology).')
    .max(150, 'Field of study is too long. Please keep it under 150 characters.'),
  interests: z
    .string()
    .min(3, 'Describe your interests (e.g., AI, sustainability, healthcare, web development, creative writing).')
    .max(500, 'Interests description is too long. Please keep it under 500 characters.'),
  projectType: z
    .enum(['software_app', 'hardware_device', 'research_paper', 'social_impact_initiative', 'artistic_creation', 'business_plan', 'any'])
    .optional()
    .default('any'),
  difficultyLevel: z
    .enum(['beginner', 'intermediate', 'advanced', 'any'])
    .optional()
    .default('any'),
  additionalContext: z
    .string()
    .max(500, 'Additional context is too long. Please keep it under 500 characters.')
    .optional()
    .default('')
    .transform(val => val || ''), // Ensure empty string if null/undefined
});


export async function handleGenerateProjectIdeas(
  prevState: ProjectIdeasFormState,
  formData: FormData
): Promise<ProjectIdeasFormState> {
  
  const rawFormData = {
    fieldOfStudy: formData.get('fieldOfStudy'),
    interests: formData.get('interests'),
    projectType: formData.get('projectType') || 'any',
    difficultyLevel: formData.get('difficultyLevel') || 'any',
    additionalContext: formData.get('additionalContext') || '',
  };

  const validatedFields = projectIdeasFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const fieldErrors: Record<string, string> = {};
    for (const error of validatedFields.error.issues) {
      if (error.path.length > 0) {
        fieldErrors[error.path[0] as string] = error.message;
      }
    }
    return {
      message: 'Invalid form data. Please check the fields below.',
      fields: fieldErrors,
      isError: true,
      inputSubmitted: rawFormData as GenerateProjectIdeasInput,
    };
  }

  const inputForAI: GenerateProjectIdeasInput = validatedFields.data;

  try {
    const result = await generateProjectIdeas(inputForAI);
    if (!result.ideas || result.ideas.length === 0) {
        return {
            message: "AatmAI couldn't find specific project ideas for your criteria. Try broadening your search or rephrasing your interests.",
            isError: false, 
            ideas: [],
            inputSubmitted: inputForAI,
        };
    }
    return {
      message: 'Project ideas generated successfully!',
      ideas: result.ideas,
      isError: false,
      inputSubmitted: inputForAI,
    };
  } catch (error: any) {
    console.error('Detailed error in handleGenerateProjectIdeas:', error);
    let errorMessage = 'Failed to generate project ideas. AatmAI might be busy or there was an issue. Please try again later.';
    if (error && typeof error.message === 'string') {
      if (error.message.toLowerCase().includes('overloaded') || error.message.toLowerCase().includes('rate limit')) {
        errorMessage = "AatmAI's servers are currently busy generating ideas. Please try again in a few moments.";
      } else if (error.message.includes('AI failed to generate valid ideas')) {
        errorMessage = "AatmAI had trouble understanding your request or generating ideas. Please try rephrasing or try again later.";
      } else {
        errorMessage = error.message.length < 150 ? error.message : errorMessage;
      }
    }
    return {
      message: errorMessage,
      isError: true,
      inputSubmitted: inputForAI,
    };
  }
}

// New types and action for project guidance
export type ProjectGuidanceRequestState = {
  message?: string;
  guidance?: GenerateProjectGuidanceOutput;
  isError?: boolean;
  projectTitle?: string;
};

export async function handleGenerateProjectGuidance(
  input: GenerateProjectGuidanceInput
): Promise<ProjectGuidanceRequestState> {
  
  const validatedFields = GenerateProjectGuidanceInputSchema.safeParse(input);

  if (!validatedFields.success) {
    console.error("Invalid input to handleGenerateProjectGuidance:", validatedFields.error.flatten().fieldErrors);
    return {
      message: 'Invalid project details provided for guidance. Title and description are required.',
      isError: true,
      projectTitle: input.projectTitle,
    };
  }

  try {
    const result = await generateProjectGuidance(validatedFields.data);
    return {
      message: 'Project guidance generated successfully!',
      guidance: result,
      isError: false,
      projectTitle: validatedFields.data.projectTitle,
    };
  } catch (error: any) {
    console.error('Detailed error in handleGenerateProjectGuidance:', error);
    let errorMessage = 'Failed to generate project guidance. AatmAI might be busy or there was an issue.';
     if (error && typeof error.message === 'string') {
      if (error.message.toLowerCase().includes('overloaded') || error.message.toLowerCase().includes('rate limit')) {
        errorMessage = "AatmAI's servers are currently busy generating guidance. Please try again in a few moments.";
      } else if (error.message.includes('AI failed to generate valid project guidance')) {
        errorMessage = "AatmAI had trouble generating specific guidance for this project idea. Please try again.";
      } else {
        errorMessage = error.message.length < 150 ? error.message : errorMessage;
      }
    }
    return {
      message: errorMessage,
      isError: true,
      projectTitle: validatedFields.data.projectTitle,
    };
  }
}
