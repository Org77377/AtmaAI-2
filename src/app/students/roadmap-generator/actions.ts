'use server';

import {
  generateRoadmap,
  type GenerateRoadmapInput,
  type GenerateRoadmapOutput,
} from '@/ai/flows/generate-roadmap-flow';
import { z } from 'zod';

export type RoadmapGeneratorFormState = {
  message?: string;
  fields?: Record<string, string>;
  roadmap?: GenerateRoadmapOutput;
  isError?: boolean;
  topicSubmitted?: string;
};

const roadmapGeneratorFormSchema = z.object({
  topicOrSkill: z
    .string()
    .min(3, 'Topic or skill must be at least 3 characters long.')
    .max(200, 'Topic or skill must be less than 200 characters long.'),
});

export async function handleGenerateRoadmapAction(
  prevState: RoadmapGeneratorFormState,
  formData: FormData
): Promise<RoadmapGeneratorFormState> {
  const topicOrSkill = formData.get('topicOrSkill');
  
  const validatedFields = roadmapGeneratorFormSchema.safeParse({ topicOrSkill });

  if (!validatedFields.success) {
    const fieldErrors: Record<string, string> = {};
    for (const error of validatedFields.error.issues) {
      if (error.path.length > 0) {
        fieldErrors[error.path[0] as string] = error.message;
      }
    }
    return {
      message: 'Invalid form data. Please check the topic/skill input.',
      fields: fieldErrors,
      isError: true,
      topicSubmitted: typeof topicOrSkill === 'string' ? topicOrSkill : undefined,
    };
  }

  try {
    const input: GenerateRoadmapInput = {
      topicOrSkill: validatedFields.data.topicOrSkill,
    };
    const result: GenerateRoadmapOutput = await generateRoadmap(input);
    return {
      message: `Roadmap for "${validatedFields.data.topicOrSkill}" generated successfully!`,
      roadmap: result,
      isError: false,
      topicSubmitted: validatedFields.data.topicOrSkill,
    };
  } catch (error: any) {
    console.error('Detailed error in handleGenerateRoadmapAction:', error);
    let errorMessage = 'Failed to generate roadmap. AatmAI might be busy or there was an issue. Please try again later.';
    if (error && typeof error.message === 'string') {
      if (error.message.toLowerCase().includes('overloaded') || error.message.toLowerCase().includes('rate limit')) {
        errorMessage = "AatmAI's servers are currently busy generating the roadmap. Please try again in a few moments.";
      } else if (error.message.includes('AI failed to generate valid response')) {
        errorMessage = "AatmAI had trouble understanding the topic/skill or generating the roadmap. Please try rephrasing or try again later.";
      } else {
        errorMessage = error.message.length < 150 ? error.message : errorMessage;
      }
    }
    return {
      message: errorMessage,
      isError: true,
      topicSubmitted: validatedFields.data.topicOrSkill,
    };
  }
}
