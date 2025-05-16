
// src/ai/flows/curate-inspiring-stories.ts
'use server';

/**
 * @fileOverview AI agent that curates inspiring real-life stories based on user profiles and challenges, with a focus on emotional comfort and resilience.
 *
 * - curateInspiringStories - A function that curates and returns inspiring stories.
 * - CurateInspiringStoriesInput - The input type for the curateInspiringStories function.
 * - CurateInspiringStoriesOutput - The return type for the curateInspiringStories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CurateInspiringStoriesInputSchema = z.object({
  userProfile: z
    .string()
    .describe('Detailed profile of the user, including demographics, interests, and background.'),
  currentChallenges: z
    .string()
    .describe('Description of the users current challenges in life, career, or relationships.'),
});
export type CurateInspiringStoriesInput = z.infer<
  typeof CurateInspiringStoriesInputSchema
>;

const CurateInspiringStoriesOutputSchema = z.object({
  stories: z
    .array(z.string())
    .describe('An array of inspiring real-life stories relevant to the user, offering comfort and resilience.'),
});
export type CurateInspiringStoriesOutput = z.infer<
  typeof CurateInspiringStoriesOutputSchema
>;

export async function curateInspiringStories(
  input: CurateInspiringStoriesInput
): Promise<CurateInspiringStoriesOutput> {
  return curateInspiringStoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'curateInspiringStoriesPrompt',
  input: {schema: CurateInspiringStoriesInputSchema},
  output: {schema: CurateInspiringStoriesOutputSchema},
  prompt: `You are Aatme, an AI assistant designed to provide inspiring and relevant real-life stories to users based on their profile and current challenges. The goal is to offer emotional comfort and highlight resilience.

  User Profile: {{{userProfile}}}
  Current Challenges: {{{currentChallenges}}}

  Based on the user's profile and challenges, curate a list of 3-5 inspiring real-life stories that could provide motivation, perspective, and emotional support. Each story should be a short paragraph summarizing the key points and inspirational aspects of the story.
  Focus on stories that offer emotional comfort and resilience.
  If appropriate and aligned with the user's context, you can include stories that echo themes from the Bhagavad Gita or similar wisdom traditions, focusing on universal values of strength, hope, and perseverance. Frame these in a general, non-denominational way.

  Format the stories as a JSON array of strings.
  `,
});

const curateInspiringStoriesFlow = ai.defineFlow(
  {
    name: 'curateInspiringStoriesFlow',
    inputSchema: CurateInspiringStoriesInputSchema,
    outputSchema: CurateInspiringStoriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
