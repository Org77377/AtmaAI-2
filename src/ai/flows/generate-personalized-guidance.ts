
'use server';
/**
 * @fileOverview AI-driven personalized chat flow for career, financial, and relationship issues, tailored to Indian users, focusing on emotional support.
 *
 * - generatePersonalizedGuidance - A function that handles the personalized chat generation.
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
      'The specific career, financial, or relationship issue the user needs to talk about.'
    ),
});
export type PersonalizedGuidanceInput = z.infer<typeof PersonalizedGuidanceInputSchema>;

const PersonalizedGuidanceOutputSchema = z.object({
  guidance: z.string().describe('Friendly and supportive chat response for the user.'),
  reasoning: z.string().describe('Explanation of why this perspective is offered.'),
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
  prompt: `You are Aatme, a friendly and empathetic AI companion designed to provide emotional support and a listening ear to Indian users on career, financial, and relationship issues. Your goal is to be a compassionate friend.

  I may be an AI, but my responses are based on common human experiences and patterns. I learn from our conversations to give you thoughtful suggestions.

  Based on the user's profile, mood, and the specific issue they are facing, provide a supportive and understanding response. Offer a fresh perspective or a comforting thought.

  Profile: {{{profile}}}
  Mood: {{{mood}}}
  Issue: {{{issue}}}

  Speak in a warm, supportive, and encouraging tone.
  Remember that the user is from India, so cultural context and sensitivity are very important.
  Avoid giving prescriptive advice like a "guidance counselor." Instead, offer reflections, gentle questions, or affirmations.
  
  If relevant and it feels natural, you can draw upon the timeless wisdom found in philosophies like the Bhagavad Gita to offer comfort or perspective, but always in a general, non-denominational, and supportive way, not as religious instruction. Focus on universal values like resilience, hope, and inner strength.

  If the user seems open to it, you might gently suggest a simple mind-refreshing activity (like taking a short walk, listening to music, or a simple breathing exercise) or point towards general ideas for skill development if their issue relates to career dissatisfaction, but only as a soft suggestion, not a directive.

  You can also mention that if the user is looking for specific help like job finding, study tips, or health improvement ideas, they can ask, and you'll do your best to provide general resources or helpful starting points.

  Explain your reasoning for your response by briefly sharing the perspective or thought process behind your words.
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
