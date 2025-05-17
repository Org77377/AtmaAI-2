
'use server';

import {
  generateProjectReport,
  type GenerateProjectReportInput,
  type GenerateProjectReportOutput,
  // GenerateProjectReportInputSchema is no longer imported from the flow file
} from '@/ai/flows/generate-project-report-flow';
import { z } from 'zod'; // Import Zod

export type ProjectReportFormState = {
  message?: string;
  fields?: Record<string, string>;
  report?: GenerateProjectReportOutput;
  isError?: boolean;
  inputSubmitted?: GenerateProjectReportInput;
};

// Define the input schema locally for validation
const projectReportFormSchema = z.object({
  projectTopic: z
    .string()
    .min(5, 'Project topic must be at least 5 characters.')
    .max(200, 'Project topic must be less than 200 characters.'),
  techStackDetails: z
    .string()
    .min(10, 'Please provide some details about the technologies, tools, or methods used (at least 10 characters).')
    .max(1000, 'Technology details must be less than 1000 characters.'),
  reportType: z.enum(['simple', 'detailed']).default('simple'),
});


export async function handleGenerateProjectReport(
  prevState: ProjectReportFormState,
  formData: FormData
): Promise<ProjectReportFormState> {
  const rawFormData = {
    projectTopic: formData.get('projectTopic'),
    techStackDetails: formData.get('techStackDetails'),
    reportType: formData.get('reportType') || 'simple',
  };

  const validatedFields = projectReportFormSchema.safeParse(rawFormData);

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
      inputSubmitted: rawFormData as GenerateProjectReportInput, // Cast for consistency
    };
  }

  const inputForAI: GenerateProjectReportInput = validatedFields.data;

  try {
    const result = await generateProjectReport(inputForAI);
    return {
      message: 'Project report generated successfully!',
      report: result,
      isError: false,
      inputSubmitted: inputForAI,
    };
  } catch (error: any) {
    console.error('Detailed error in handleGenerateProjectReport:', error);
    let errorMessage =
      'Failed to generate project report. AatmAI might be busy or there was an issue. Please try again later.';
    if (error && typeof error.message === 'string') {
      if (
        error.message.toLowerCase().includes('overloaded') ||
        error.message.toLowerCase().includes('rate limit')
      ) {
        errorMessage =
          "AatmAI's servers are currently busy generating the report. Please try again in a few moments.";
      } else if (error.message.includes('AI failed to generate valid response')) {
        errorMessage =
          'AatmAI had trouble understanding your request or generating the report. Please try rephrasing or try again later.';
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
