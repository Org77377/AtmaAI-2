
'use server';
/**
 * @fileOverview AI agent that provides tech stack suggestions and implementation guidance for a given project idea.
 *
 * - generateProjectGuidance - A function that generates tech stack and steps.
 * - GenerateProjectGuidanceInput - The input type.
 * - GenerateProjectGuidanceOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define Zod schemas locally - DO NOT EXPORT THEM
const GenerateProjectGuidanceInputSchema = z.object({
  projectTitle: z.string().describe('The title of the project idea.'),
  projectDescription: z.string().describe('The detailed description of the project idea.'),
});
export type GenerateProjectGuidanceInput = z.infer<typeof GenerateProjectGuidanceInputSchema>;

const GenerateProjectGuidanceOutputSchema = z.object({
  suggestedTechStack: z.array(z.string()).describe('A list of suggested technologies or tools (e.g., Python, React, Firebase, Arduino).'),
  highLevelSteps: z.array(z.string()).describe('A list of high-level steps to approach the project implementation.'),
  keyConsiderations: z.array(z.string()).optional().describe('Optional: Key considerations or challenges for the project.'),
});
export type GenerateProjectGuidanceOutput = z.infer<typeof GenerateProjectGuidanceOutputSchema>;

export async function generateProjectGuidance(
  input: GenerateProjectGuidanceInput
): Promise<GenerateProjectGuidanceOutput> {
  return generateProjectGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectGuidancePrompt',
  input: {schema: GenerateProjectGuidanceInputSchema}, // Uses local schema
  output: {schema: GenerateProjectGuidanceOutputSchema}, // Uses local schema
  prompt: `You are an expert project advisor for students. For the given project idea, provide practical and actionable guidance.

Project Title: {{{projectTitle}}}
Project Description: {{{projectDescription}}}

Based on this project idea, suggest the following:
1.  **Suggested Tech Stack:** Provide a concise list of 3-5 relevant technologies, programming languages, frameworks, or tools that would be suitable for implementing this project. Prioritize options that are commonly used, well-documented, and accessible for students. Briefly explain why each suggestion is appropriate if possible.
2.  **High-Level Steps:** Outline a list of 3-5 key, high-level steps a student could take to start and progress with this project. These steps should cover the project lifecycle from planning to a basic implementation (e.g., "1. Define detailed features and user stories.", "2. Design the database schema and user interface mockups.", "3. Develop the core backend logic for feature X.", "4. Build the frontend components for user interaction.", "5. Test core functionalities and iterate.").
3.  **Key Considerations:** List 1-3 important aspects, potential challenges, or best practices the student should keep in mind for this specific project (e.g., "Focus on data privacy if handling user information.", "Consider scalability if it's a web application expected to grow.", "Start with a Minimum Viable Product (MVP) to get feedback early.").

Keep your suggestions practical, clear, and encouraging for a student audience from any stream or background.
`,
});

const generateProjectGuidanceFlow = ai.defineFlow(
  {
    name: 'generateProjectGuidanceFlow',
    inputSchema: GenerateProjectGuidanceInputSchema, // Uses local schema
    outputSchema: GenerateProjectGuidanceOutputSchema, // Uses local schema
  },
  async input => {
    const response = await prompt(input);
    if (!response.output) {
      console.error("AI prompt 'generateProjectGuidancePrompt' did not return a valid output.", response);
      throw new Error("AI failed to generate valid project guidance.");
    }
    return response.output;
  }
);
