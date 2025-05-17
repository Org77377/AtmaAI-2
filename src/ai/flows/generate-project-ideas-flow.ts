
'use server';
/**
 * @fileOverview AI agent that generates project ideas for students based on their field of study, interests, and other preferences.
 *
 * - generateProjectIdeas - A function that generates and returns project ideas.
 * - GenerateProjectIdeasInput - The input type for the generateProjectIdeas function.
 * - GenerateProjectIdeasOutput - The return type for the generateProjectIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectIdeasInputSchema = z.object({
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
    .default('any')
    .describe('Optional: Preferred type of project.'),
  difficultyLevel: z
    .enum(['beginner', 'intermediate', 'advanced', 'any'])
    .optional()
    .default('any')
    .describe('Optional: Desired difficulty level.'),
  additionalContext: z
    .string()
    .optional()
    .describe('Optional: Any other specific requirements, constraints, or context for the project ideas (e.g., specific technologies to use, available resources, duration).')
    .max(500, 'Additional context is too long. Please keep it under 500 characters.'),
});
export type GenerateProjectIdeasInput = z.infer<
  typeof GenerateProjectIdeasInputSchema
>;

const ProjectIdeaSchema = z.object({
  title: z.string().describe('A clear and concise title for the project idea.'),
  description: z.string().describe('A detailed description of the project idea, including its objectives, potential scope, what a student might learn or achieve, and why it is relevant or innovative. Should be at least 2-3 sentences.'),
  keywords: z.array(z.string()).min(2).max(5).describe('An array of 2-5 relevant keywords or technologies associated with the project.'),
  suitability: z.string().optional().describe('A brief note on why this idea might be suitable given the input criteria or how it could be adapted for different levels/types.')
});

const GenerateProjectIdeasOutputSchema = z.object({
  ideas: z.array(ProjectIdeaSchema).min(3).max(5).describe("A list of 3-5 innovative and actionable project ideas tailored to the user's input. Each idea should be distinct."),
});
export type GenerateProjectIdeasOutput = z.infer<
  typeof GenerateProjectIdeasOutputSchema
>;

export async function generateProjectIdeas(
  input: GenerateProjectIdeasInput
): Promise<GenerateProjectIdeasOutput> {
  return generateProjectIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectIdeasPrompt',
  input: {schema: GenerateProjectIdeasInputSchema},
  output: {schema: GenerateProjectIdeasOutputSchema},
  prompt: `You are an expert academic advisor and creative thinker specializing in generating innovative and practical project ideas for students across ALL fields of study and backgrounds.
  Your goal is to provide 3-5 distinct, well-described project ideas based on the student's input.

  Student's Inputs:
  - Field of Study: {{{fieldOfStudy}}}
  - Interests: {{{interests}}}
  {{#if projectType}}- Preferred Project Type: {{{projectType}}} {{else}}- Project Type: Any{{/if}}
  {{#if difficultyLevel}}- Desired Difficulty Level: {{{difficultyLevel}}} {{else}}- Difficulty Level: Any{{/if}}
  {{#if additionalContext}}- Additional Context/Requirements: {{{additionalContext}}}{{/if}}

  Instructions for Generating Project Ideas:
  1.  **Relevance:** Ensure ideas are highly relevant to the student's 'Field of Study' and 'Interests'. If interests are diverse, try to find interdisciplinary ideas.
  2.  **Diversity:** Offer a variety of ideas. Avoid suggesting very similar projects.
  3.  **Actionability:** Ideas should be reasonably achievable by a student, considering typical resources and timelines. For 'advanced' difficulty, ideas can be more complex.
  4.  **Innovation/Creativity:** Aim for ideas that are engaging, potentially innovative, or allow for creative expression and problem-solving.
  5.  **Clarity:** For each idea, provide:
      *   A clear 'title'.
      *   A comprehensive 'description' (2-3 sentences minimum) outlining what the project is, its objectives, potential learning outcomes, and impact.
      *   2-5 relevant 'keywords' or technologies.
      *   Optionally, a brief 'suitability' note explaining its relevance or adaptability.
  6.  **Adaptability:** If inputs are broad (e.g., "any" project type), suggest ideas that could be adapted. For example, an idea might be framed as a software project but could be adapted into a research paper on the same topic.
  7.  **Broad Appeal:** Generate ideas that are suitable for students from any stream or background. If the field of study is very niche, try to suggest related or transferable skill-based projects. If 'fieldOfStudy' is general (e.g., "Science"), provide ideas that span different scientific disciplines or fundamental concepts.

  Consider the Indian educational context where applicable, focusing on practical skills, societal relevance, and opportunities for innovation.

  Generate 3-5 project ideas now based on the provided inputs.
  `,
});

const generateProjectIdeasFlow = ai.defineFlow(
  {
    name: 'generateProjectIdeasFlow',
    inputSchema: GenerateProjectIdeasInputSchema,
    outputSchema: GenerateProjectIdeasOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    if (!response.output || !response.output.ideas || response.output.ideas.length === 0) {
      console.error("AI prompt 'generateProjectIdeasPrompt' did not return valid ideas.", response);
      // Attempt to generate a fallback or throw a specific error
      // For now, let's ensure it doesn't return undefined to the client in case of empty ideas.
      if (response.output && !response.output.ideas) {
          response.output.ideas = []; // Ensure ideas array exists even if empty
      } else if (!response.output) {
          // This case is highly unlikely if the model adheres to the output schema, but as a fallback:
          return { ideas: [{
            title: "AI Error",
            description: "AatmAI had trouble generating ideas for this specific request. Please try rephrasing or adjusting your inputs.",
            keywords: ["error"],
            suitability: "N/A"
          }]};
      }
    }
    return response.output;
  }
);

