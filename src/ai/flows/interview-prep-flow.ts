
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
    {{this.role}}: {{this.content}}
  {{/each}}
{{else}}
  This is the beginning of the interview.
{{/if}}

Current State:
- Questions already asked by you (Interviewer): {{{questionsAsked}}}
- User's current answer (to your last question, if any): {{#if currentAnswer}} {{{currentAnswer}}} {{else}} (No answer provided yet for this turn) {{/if}}


Instructions:
1.  If 'questionsAsked' is 0 (this is the start of the interview):
    *   Introduce yourself briefly.
    *   State the domain you are interviewing for.
    *   Ask the first relevant technical or behavioral question for the '{{{domain}}}' role.
    *   Set 'isInterviewOver' to false.
    *   Set 'aiResponse' to your introduction and first question.
    *   Set 'questionsAsked' to 1 for the output.
2.  If 'questionsAsked' is greater than 0 and less than ${MAX_QUESTIONS}:
    *   The user has provided '{{{currentAnswer}}}' for your previous question.
    *   Briefly acknowledge their answer if appropriate (e.g., "Okay, regarding your point on X...").
    *   Ask the NEXT relevant technical or behavioral question for the '{{{domain}}}' role. Ensure it's different from previous questions recorded in the Interview History.
    *   Set 'isInterviewOver' to false.
    *   Set 'aiResponse' to your acknowledgement (optional) and the next question.
    *   Increment the input 'questionsAsked' by 1 for the output 'questionsAsked'.
3.  If 'questionsAsked' is equal to ${MAX_QUESTIONS}:
    *   The user has provided '{{{currentAnswer}}}' for your final question.
    *   This is the end of the interview.
    *   Provide an overall 'feedbackSummary' based on ALL the user's answers in the 'interviewHistory' and their '{{currentAnswer}}'. Be constructive and specific.
    *   List 2-3 key 'areasForImprovement' as an array of strings.
    *   Provide an 'interviewScore' (0-100) based on their overall performance.
    *   Set 'isInterviewOver' to true.
    *   Set 'aiResponse' to a concluding remark (e.g., "That concludes our mock interview. Here's my feedback:").
    *   Set 'questionsAsked' to ${MAX_QUESTIONS} for the output.

Keep your questions and feedback professional, clear, and relevant to the specified domain. Your primary goal is to help the user practice and improve.
Do not ask for personal information. Focus on skills, experience (hypothetical if needed), problem-solving, and behavioral aspects relevant to the domain.
Ensure the 'questionsAsked' output field always reflects the number of questions the AI (you) has asked *after* the current turn.
If providing feedback, ensure 'feedbackSummary', 'areasForImprovement', and 'interviewScore' are populated. If asking a question, these fields should be omitted or empty.
`,
});

const interviewPrepFlow = ai.defineFlow(
  {
    name: 'interviewPrepFlow',
    inputSchema: InterviewPrepInputSchema, // Uses local schema
    outputSchema: InterviewPrepOutputSchema, // Uses local schema
  },
  async (input: InterviewPrepInput) => {
    const {output} = await prompt(input);
    if (!output) {
      console.error("AI prompt 'interviewPrepPrompt' did not return a valid output.");
      throw new Error('AI failed to generate a valid response for the interview.');
    }
    
    // Ensure questionsAsked is correctly incremented or set by the AI's output
    // If the AI doesn't provide it, make a best guess based on the logic.
    // This is a fallback, the prompt should guide the AI to set it correctly.
    if (output.questionsAsked === undefined) {
        if (input.questionsAsked === 0) {
            output.questionsAsked = 1; // AI asked first question
        } else if (input.questionsAsked < MAX_QUESTIONS) {
            output.questionsAsked = input.questionsAsked + 1; // AI asked another question
        } else {
            output.questionsAsked = MAX_QUESTIONS; // Interview finished
        }
    }

    return output;
  }
);
