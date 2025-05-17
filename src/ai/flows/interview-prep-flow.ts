
'use server';
/**
 * @fileOverview AI agent that simulates an interview for a given domain.
 *
 * - conductInterviewTurn - A function that handles one turn of the interview.
 * - InterviewPrepInput - The input type.
 * - InterviewPrepOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define Zod schemas locally - DO NOT EXPORT THEM
const InterviewMessageSchema = z.object({
  role: z.enum(['interviewer', 'user']),
  content: z.string(),
});

const InterviewPrepInputSchema = z.object({
  domain: z.string().min(1, 'Domain must be specified.'),
  interviewHistory: z.array(InterviewMessageSchema).optional().default([]),
  currentAnswer: z.string().optional().default(''), // User's answer to the previous question
  questionsAsked: z.number().optional().default(0), // Track number of questions asked by AI
});
export type InterviewPrepInput = z.infer<typeof InterviewPrepInputSchema>;

const InterviewPrepOutputSchema = z.object({
  aiResponse: z.string().describe('The AI interviewer_s question or feedback.'),
  isInterviewOver: z.boolean().describe('Indicates if the interview session has concluded.'),
  feedbackSummary: z.string().optional().describe('Overall feedback summary if the interview is over.'),
  areasForImprovement: z.array(z.string()).optional().describe('Specific areas for improvement if the interview is over.'),
  interviewScore: z.number().min(0).max(100).optional().describe('Overall interview score (0-100) if the interview is over.'),
  questionsAsked: z.number().describe('Updated count of questions asked by the AI.'),
});
export type InterviewPrepOutput = z.infer<typeof InterviewPrepOutputSchema>;

export async function conductInterviewTurn(
  input: InterviewPrepInput
): Promise<InterviewPrepOutput> {
  return interviewPrepFlow(input);
}

const MAX_QUESTIONS = 3; // AI will ask 3 questions before concluding

const prompt = ai.definePrompt({
  name: 'interviewPrepPrompt',
  input: {schema: InterviewPrepInputSchema}, // Uses local schema
  output: {schema: InterviewPrepOutputSchema}, // Uses local schema
  prompt: `You are AatmAI, a professional and insightful AI Interviewer.
Your goal is to conduct a mock interview with the user for the specified domain.

Domain: {{{domain}}}
Interview History (Previous questions and answers):
{{#if interviewHistory.length}}
  {{#each interviewHistory}}
    {{#if (eq this.role "interviewer") }}Interviewer: {{this.content}}{{/if}}
    {{#if (eq this.role "user") }}User: {{this.content}}{{/if}}
  {{/each}}
{{else}}
  This is the beginning of the interview.
{{/if}}

Current State:
- Questions already asked by you (Interviewer): {{{questionsAsked}}}

Instructions:
1.  If 'questionsAsked' is 0 (this is the start of the interview):
    *   Introduce yourself briefly.
    *   State the domain you are interviewing for.
    *   Ask the first relevant technical or behavioral question for the '{{{domain}}}' role.
    *   Set 'isInterviewOver' to false.
    *   Increment 'questionsAsked' by 1 for the output.
    *   Set 'aiResponse' to your introduction and first question.
2.  If 'questionsAsked' is less than ${MAX_QUESTIONS} (and greater than 0):
    *   The user has provided '{{currentAnswer}}' for your previous question.
    *   Briefly acknowledge their answer if appropriate (e.g., "Okay, regarding your point on X...").
    *   Ask the NEXT relevant technical or behavioral question for the '{{{domain}}}' role. Ensure it's different from previous questions.
    *   Set 'isInterviewOver' to false.
    *   Increment 'questionsAsked' by 1 for the output.
    *   Set 'aiResponse' to your acknowledgement (optional) and the next question.
3.  If 'questionsAsked' is equal to ${MAX_QUESTIONS}:
    *   The user has provided '{{currentAnswer}}' for your final question.
    *   This is the end of the interview.
    *   Provide an overall 'feedbackSummary' based on ALL the user's answers in the 'interviewHistory' and their '{{currentAnswer}}'. Be constructive and specific.
    *   List 2-3 key 'areasForImprovement' as an array of strings.
    *   Provide an 'interviewScore' (0-100) based on their overall performance.
    *   Set 'isInterviewOver' to true.
    *   Set 'aiResponse' to a concluding remark (e.g., "That concludes our mock interview. Here's my feedback:").
    *   Keep 'questionsAsked' as ${MAX_QUESTIONS} for the output.

Keep your questions and feedback professional, clear, and relevant to the specified domain. Your primary goal is to help the user practice and improve.
Do not ask for personal information. Focus on skills, experience (hypothetical if needed), problem-solving, and behavioral aspects relevant to the domain.
`,
});

const interviewPrepFlow = ai.defineFlow(
  {
    name: 'interviewPrepFlow',
    inputSchema: InterviewPrepInputSchema, // Uses local schema
    outputSchema: InterviewPrepOutputSchema, // Uses local schema
  },
  async (input: InterviewPrepInput) => {
    // Simple logic to manage questionsAsked for the prompt, the AI will be guided by this.
    let nextQuestionsAsked = input.questionsAsked;
    if (input.questionsAsked < MAX_QUESTIONS && input.currentAnswer !== '') { // if it's not the start and user provided an answer
        // The AI will ask a question, so this will be the new count.
    } else if (input.questionsAsked === 0 && input.currentAnswer === '') {
        // Start of interview, AI will ask first question.
    }


    const {output} = await prompt(input);
    if (!output) {
      console.error("AI prompt 'interviewPrepPrompt' did not return a valid output.");
      throw new Error('AI failed to generate a valid response for the interview.');
    }
    
    // The AI's output should contain the updated questionsAsked.
    // If not, we ensure it's at least what was input or incremented.
    if (output.questionsAsked === undefined) {
        if (input.questionsAsked < MAX_QUESTIONS && input.currentAnswer !== '') {
            output.questionsAsked = input.questionsAsked + 1;
        } else if (input.questionsAsked === 0 && input.currentAnswer === '') {
             output.questionsAsked = 1;
        } else {
            output.questionsAsked = input.questionsAsked;
        }
    }


    return output;
  }
);
