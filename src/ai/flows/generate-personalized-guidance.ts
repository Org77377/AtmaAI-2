'use server';
/**
 * @fileOverview AI-driven personalized guidance flow for career, financial, and relationship issues, tailored to Indian users.
 *
 * - generatePersonalizedGuidance - A function that handles the personalized guidance generation.
 * - PersonalizedGuidanceInput - The input type for the generatePersonalizedGuidance function.
 * - PersonalizedGuidanceOutput - The return type for the generatePersonalizedGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedGuidanceInputSchema = z.object({
  profile: z
    .string()
    .describe('The user profile, including career, financial, and relationship information.'),
  mood: z.string().describe('The current mood of the user.'),
  issue: z
    .string()
    .describe(
      'The specific career, financial, or relationship issue the user needs guidance on.'
    ),
});
export type PersonalizedGuidanceInput = z.infer<typeof PersonalizedGuidanceInputSchema>;

const PersonalizedGuidanceOutputSchema = z.object({
  guidance: z.string().describe('Personalized guidance for the user.'),
  reasoning: z.string().describe('Explanation of why the guidance was given.'),
});
export type PersonalizedGuidanceOutput = z.infer<typeof PersonalizedGuidanceOutputSchema>;

export async function generatePersonalizedGuidance(
  input: PersonalizedGuidanceInput
): Promise<PersonalizedGuidanceOutput> {
  return personalizedGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedGuidancePrompt',
  input: {schema: PersonalizedGuidanceInputSchema},
  output: {schema: PersonalizedGuidanceOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized guidance to Indian users on career, financial, and relationship issues.

  Based on the user's profile, mood, and the specific issue they are facing, provide tailored advice and encouragement.

  Profile: {{{profile}}}
  Mood: {{{mood}}}
  Issue: {{{issue}}}

  Provide guidance that is relevant to the user's situation and helps them make informed decisions to improve their well-being.
  Explain your reasoning for the provided guidance.
  Speak in a supportive and encouraging tone.
  Remember that the user is from India, so cultural context is very important.
  Consider that this application is named Mitra Guide.
  `,
});

const personalizedGuidanceFlow = ai.defineFlow(
  {
    name: 'personalizedGuidanceFlow',
    inputSchema: PersonalizedGuidanceInputSchema,
    outputSchema: PersonalizedGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
