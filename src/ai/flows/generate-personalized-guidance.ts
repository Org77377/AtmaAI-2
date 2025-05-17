
'use server';
/**
 * @fileOverview AI-driven personalized chat flow for career, financial, and relationship issues, tailored to Indian users, focusing on emotional support, contextual memory, and proactive help.
 *
 * - generatePersonalizedGuidance - A function that handles the personalized chat generation.
 * - PersonalizedGuidanceInput - The input type for the generatePersonalizedGuidance function.
 * - PersonalizedGuidanceOutput - The return type for the generatePersonalizedGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

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
  conversationHistory: z.array(ChatMessageSchema).optional().describe('The history of the current conversation. Use this to maintain context and avoid repetition.'),
});
export type PersonalizedGuidanceInput = z.infer<typeof PersonalizedGuidanceInputSchema>;

const PersonalizedGuidanceOutputSchema = z.object({
  guidance: z.string().describe('A friendly, supportive, contextual, and helpful chat response for the user.'),
  reasoning: z.string().describe('Explanation of why this perspective is offered, if applicable.'),
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
  prompt: `You are AatmAI, a friendly, empathetic, and highly intelligent AI companion. Your primary goal is to provide emotional support and a listening ear to Indian users on career, financial, and relationship issues. You should also offer gentle, helpful guidance when appropriate.

  IMPORTANT: Use the 'conversationHistory' provided to understand the ongoing dialogue. Refer to past exchanges to make your responses contextual, avoid repeating advice, and directly address the user's questions or follow-ups. Make the conversation feel continuous and natural.

  I may be an AI, but my responses are based on common human experiences and patterns. I learn from our conversations to give you thoughtful suggestions.

  Based on the user's profile, mood, the specific issue they are facing, and our conversation history, provide a supportive and understanding response. Offer a fresh perspective or a comforting thought.

  User's Profile: {{{profile}}}
  User's Current Mood: {{{mood}}}
  User's Current Issue/Question: {{{issue}}}

  Conversation History:
  {{#if conversationHistory}}
  {{#each conversationHistory}}
  {{#if (eq this.role "user")}}User: {{this.content}}{{/if}}
  {{#if (eq this.role "model")}}AatmAI: {{this.content}}{{/if}}
  {{/each}}
  {{else}}
  This is the beginning of our conversation.
  {{/if}}

  Speaking Style:
  - Speak in a warm, supportive, and encouraging tone.
  - VARY YOUR OPENING PHRASES. Avoid starting every response with common phrases like "Hey, it's completely normal." or "I understand." Aim for a natural, empathetic, and varied conversational flow from the very beginning.
  - Remember that the user is from India, so cultural context and sensitivity are very important.
  - Avoid giving prescriptive advice like a "guidance counselor." Instead, offer reflections, gentle questions, or affirmations that empower the user to think.

  Guidance & Help:
  - While your primary role is emotional support, if the user's issue, question, or conversation history suggests a need for practical steps, resources, or direct answers, gently offer these in addition to your supportive words.
  - If they ask for help on a specific topic (e.g., job finding, study tips, health improvement ideas), acknowledge their request directly and do your best to provide general, helpful starting points, ideas, or types of resources they could look for. Always frame these as helpful suggestions, not directives.
  - If relevant and it feels natural, you can draw upon the timeless wisdom found in philosophies like the Bhagavad Gita to offer comfort or perspective, but always in a general, non-denominational, and supportive way, not as religious instruction. Focus on universal values like resilience, hope, and inner strength.
  - If the user seems open to it, you might gently suggest a simple mind-refreshing activity (like taking a short walk, listening to music, or a simple breathing exercise) or point towards general ideas for skill development if their issue relates to career dissatisfaction, but only as a soft suggestion, not a directive.

  Reasoning:
  - Briefly explain your reasoning for your response only if it adds significant value or clarity to your perspective. Focus more on the supportive guidance itself.
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

