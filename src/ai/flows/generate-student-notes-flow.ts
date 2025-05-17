'use server';
/**
 * @fileOverview AI agent that generates student notes on a given topic.
 *
 * - generateStudentNotes - A function that generates and returns notes.
 * - GenerateStudentNotesInput - The input type for the generateStudentNotes function.
 * - GenerateStudentNotesOutput - The return type for the generateStudentNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudentNotesInputSchema = z.object({
  topic: z
    .string()
    .min(3, 'Please provide a topic with at least 3 characters.')
    .max(200, 'Topic is too long. Please keep it under 200 characters.'),
});
export type GenerateStudentNotesInput = z.infer<
  typeof GenerateStudentNotesInputSchema
>;

const GenerateStudentNotesOutputSchema = z.object({
  notes: z.string().describe('Well-structured, bullet-point notes on the given topic, suitable for students.'),
});
export type GenerateStudentNotesOutput = z.infer<
  typeof GenerateStudentNotesOutputSchema
>;

export async function generateStudentNotes(
  input: GenerateStudentNotesInput
): Promise<GenerateStudentNotesOutput> {
  return generateStudentNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudentNotesPrompt',
  input: {schema: GenerateStudentNotesInputSchema},
  output: {schema: GenerateStudentNotesOutputSchema},
  prompt: `You are an expert academic assistant specializing in creating concise and informative study notes for students.
  The user will provide a topic. Your task is to generate well-structured notes on this topic.

  Topic: {{{topic}}}

  Instructions:
  - The notes should be clear, concise, and easy to understand.
  - Present the information primarily in bullet points or numbered lists.
  - Start with a brief introductory sentence or two about the topic.
  - Organize key concepts logically. Use sub-bullets if necessary for deeper details.
  - Highlight important terms or definitions if applicable (you can use markdown like **bold** for this).
  - Aim for a summary that captures the core aspects of the topic, suitable for quick revision.
  - The notes should be factual and objective.
  - Ensure the output is a single string containing the formatted notes.

  Example Output Format:
  [Brief Introduction to Topic]

  *   Main Point 1
      *   Sub-point 1.1
      *   Sub-point 1.2
  *   Main Point 2
      *   **Key Term**: Definition or explanation.
  *   Main Point 3

  Generate the notes now.
  `,
});

const generateStudentNotesFlow = ai.defineFlow(
  {
    name: 'generateStudentNotesFlow',
    inputSchema: GenerateStudentNotesInputSchema,
    outputSchema: GenerateStudentNotesOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    if (!response.output) {
      console.error("AI prompt 'generateStudentNotesPrompt' did not return a valid output.", response);
      throw new Error("AI failed to generate valid notes for the topic.");
    }
    return response.output;
  }
);
