'use server';

import {
  generateStudentNotes,
  type GenerateStudentNotesInput,
  type GenerateStudentNotesOutput,
} from '@/ai/flows/generate-student-notes-flow';
import { z } from 'zod';

export type NotesGeneratorFormState = {
  message?: string;
  fields?: Record<string, string>;
  notes?: string; // Store notes directly as string
  isError?: boolean;
  topicSubmitted?: string;
};

const notesGeneratorFormSchema = z.object({
  topic: z
    .string()
    .min(3, 'Topic must be at least 3 characters long.')
    .max(200, 'Topic must be less than 200 characters long.'),
});

export async function handleGenerateStudentNotes(
  prevState: NotesGeneratorFormState,
  formData: FormData
): Promise<NotesGeneratorFormState> {
  const topic = formData.get('topic');
  const validatedFields = notesGeneratorFormSchema.safeParse({ topic });

  if (!validatedFields.success) {
    const fieldErrors: Record<string, string> = {};
    for (const error of validatedFields.error.issues) {
      if (error.path.length > 0) {
        fieldErrors[error.path[0] as string] = error.message;
      }
    }
    return {
      message: 'Invalid form data. Please check the topic below.',
      fields: fieldErrors,
      isError: true,
      topicSubmitted: typeof topic === 'string' ? topic : undefined,
    };
  }

  try {
    const input: GenerateStudentNotesInput = {
      topic: validatedFields.data.topic,
    };
    const result: GenerateStudentNotesOutput = await generateStudentNotes(input);
    return {
      message: 'Notes generated successfully!',
      notes: result.notes,
      isError: false,
      topicSubmitted: validatedFields.data.topic,
    };
  } catch (error: any) {
    console.error('Detailed error in handleGenerateStudentNotes:', error);
    let errorMessage = 'Failed to generate notes. AatmAI might be busy or there was an issue. Please try again later.';
    if (error && typeof error.message === 'string') {
      if (error.message.toLowerCase().includes('overloaded') || error.message.toLowerCase().includes('rate limit')) {
        errorMessage = "AatmAI's servers are currently busy generating notes. Please try again in a few moments.";
      } else if (error.message.includes('AI failed to generate valid notes')) {
        errorMessage = "AatmAI had trouble understanding the topic or generating notes. Please try rephrasing or try again later.";
      } else {
        errorMessage = error.message.length < 150 ? error.message : errorMessage;
      }
    }
    return {
      message: errorMessage,
      isError: true,
      topicSubmitted: validatedFields.data.topic,
    };
  }
}
