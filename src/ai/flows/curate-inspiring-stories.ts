
// src/ai/flows/curate-inspiring-stories.ts
'use server';

/**
 * @fileOverview AI agent that curates inspiring real-life stories based on user profiles and challenges, with a focus on emotional comfort, resilience, and variety.
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
    .min(1, "User profile details help in curating relevant stories.")
    .optional()
    .or(z.literal("")), // Allow empty string if user skips
  currentChallenges: z
    .string()
    .min(10, 'Please describe your current challenges in a bit more detail (at least 10 characters).'),
});
export type CurateInspiringStoriesInput = z.infer<
  typeof CurateInspiringStoriesInputSchema
>;

const CurateInspiringStoriesOutputSchema = z.object({
  stories: z
    .array(z.string())
    .describe('An array of 3-4 inspiring real-life stories relevant to the user, offering comfort and resilience. Each story should be a concise paragraph.'),
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
  prompt: `You are AatmAI, an AI assistant designed to provide inspiring and relevant real-life stories to users based on their profile and current challenges. Your primary goal is to offer emotional comfort, highlight resilience, and provide a sense of hope and perspective.

  User Profile: {{{userProfile}}}
  Current Challenges: {{{currentChallenges}}}

  Based on the user's profile (if provided) and their current challenges, curate a list of 3-4 concise, inspiring real-life stories.
  Each story should be a short paragraph that clearly summarizes the key points and the inspirational aspects. Ensure the curated stories are distinct and offer varied perspectives on overcoming challenges.
  Focus sharply on stories that offer genuine emotional comfort, demonstrate resilience in the face of adversity, and instill a sense of hope. Avoid generic advice or overly simplistic narratives.
  If appropriate and aligned with the user's context, you can include stories that echo themes from philosophies like the Bhagavad Gita or similar wisdom traditions, focusing on universal values of strength, hope, perseverance, and finding meaning. Frame these in a general, non-denominational way that is broadly relatable.
  The stories should feel authentic and impactful.

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
    const response = await prompt({
        userProfile: input.userProfile || "User chose not to share profile details.",
        currentChallenges: input.currentChallenges,
    });
    if (!response.output) {
      console.error("AI prompt 'curateInspiringStoriesPrompt' did not return a valid output.", response);
      throw new Error("AI failed to generate a valid response structure for curated stories.");
    }
    return response.output;
  }
);
