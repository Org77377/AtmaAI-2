
'use server';
/**
 * @fileOverview AI agent that generates student notes on a given topic, with options for concise or detailed output.
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
  detailLevel: z.enum(['concise', 'detailed']).optional().default('concise'),
});
export type GenerateStudentNotesInput = z.infer<
  typeof GenerateStudentNotesInputSchema
>;

const GenerateStudentNotesOutputSchema = z.object({
  notes: z.string().describe('Well-structured notes on the given topic, suitable for students. Can be concise bullet points or a more detailed explanation based on input.'),
  detailLevel: z.enum(['concise', 'detailed']),
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
  prompt: `You are an expert academic assistant specializing in creating study notes for students, with an understanding of general educational contexts, including common patterns in Indian education.
  The user will provide a topic and a desired detail level (concise or detailed).

  Topic: {{{topic}}}
  Detail Level: {{{detailLevel}}}

  Instructions:
  - If Detail Level is 'concise':
    - Generate **highly concise, key-point-focused** notes primarily in bullet points or numbered lists.
    - Focus strictly on the **most important concepts, definitions, and facts** relevant for exam preparation.
    - Avoid lengthy theoretical explanations. The goal is a quick, effective summary.
    - Highlight **key terms** using markdown (e.g., **bold**).
    - Frame these notes as "a strong starting point for exam revision" or "a helpful summary of core concepts for exams." Do NOT claim they are definitively "enough" for an exam.
    - Organize points logically for easy understanding and revision.
  - If Detail Level is 'detailed':
    - Provide a **comprehensive, in-depth explanation** of the topic.
    - Expand on the key concepts, explain underlying principles, and provide examples if applicable.
    - Structure the explanation logically with clear paragraphs and headings/subheadings where appropriate (using markdown).
    - This detailed explanation should elaborate significantly beyond the concise bullet points.

  General Style for Both Levels:
  - Notes should be clear, factual, and objective.
  - Ensure the output is a single string containing the formatted notes.
  - If the topic is very broad, try to cover the most critical aspects first.

  Example Output Format (Concise):
  [Brief Introduction to Topic - one sentence]

  *   **Main Concept 1**: Brief explanation or definition.
      *   Sub-point 1.1 (if essential)
  *   **Key Fact 2**: Critical information.
  *   Formula/Rule 3 (if applicable): [Formula] - Brief note on usage.

  Generate the notes now for the topic: {{{topic}}} with detail level: {{{detailLevel}}}.
  `,
});

const generateStudentNotesFlow = ai.defineFlow(
  {
    name: 'generateStudentNotesFlow',
    inputSchema: GenerateStudentNotesInputSchema,
    outputSchema: GenerateStudentNotesOutputSchema,
  },
  async input => {
    const response = await prompt(input); // input already includes detailLevel
    if (!response.output) {
      console.error("AI prompt 'generateStudentNotesPrompt' did not return a valid output.", response);
      throw new Error("AI failed to generate valid notes for the topic.");
    }
    // Ensure the output includes the detailLevel that was processed
    return {
        notes: response.output.notes,
        detailLevel: input.detailLevel || 'concise',
    };
  }
);
