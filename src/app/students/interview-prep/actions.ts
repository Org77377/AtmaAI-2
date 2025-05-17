'use server';

import {
  conductInterviewTurn,
  type InterviewPrepInput,
  type InterviewPrepOutput,
} from '@/ai/flows/interview-prep-flow';
import { z } from 'zod';

const InterviewMessageSchema = z.object({
  role: z.enum(['interviewer', 'user']),
  content: z.string(),
});

const InterviewTurnFormSchema = z.object({
  domain: z.string().min(1, 'Domain must be selected.'),
  interviewHistory: z.array(InterviewMessageSchema).optional().default([]),
  currentAnswer: z.string().optional().default(''),
  questionsAsked: z.number().optional().default(0),
});

export type InterviewPrepFormState = {
  message?: string;
  fields?: Record<string, string>;
  interviewData?: InterviewPrepOutput;
  updatedHistory?: z.infer<typeof InterviewMessageSchema>[];
  isError?: boolean;
};

export async function handleInterviewTurnAction(
  input: InterviewPrepInput
): Promise<InterviewPrepFormState> {
  // Input validation is already done by the calling client logic for simplicity here,
  // but in a more robust setup, full Zod validation of `input` against InterviewPrepInputSchema would be good.
  // We trust the `input` object structure for now.

  try {
    const result = await conductInterviewTurn(input);
    
    const newHistory = [...input.interviewHistory];
    if (input.currentAnswer && input.currentAnswer.trim() !== '') {
      newHistory.push({ role: 'user', content: input.currentAnswer });
    }
    newHistory.push({ role: 'interviewer', content: result.aiResponse });

    return {
      message: 'Interview turn processed.',
      interviewData: result,
      updatedHistory: newHistory,
      isError: false,
    };
  } catch (error: any) {
    console.error('Detailed error in handleInterviewTurnAction:', error);
    let errorMessage = 'Failed to process interview turn. AatmAI might be busy or there was an issue.';
    if (error && typeof error.message === 'string') {
      if (error.message.toLowerCase().includes('overloaded') || error.message.toLowerCase().includes('rate limit')) {
        errorMessage = "AatmAI's interview servers are currently busy. Please try again in a few moments.";
      } else if (error.message.includes('AI failed to generate a valid response')) {
        errorMessage = "AatmAI had trouble formulating a response for the interview. Please try again.";
      } else {
        errorMessage = error.message.length < 150 ? error.message : errorMessage;
      }
    }
    return {
      message: errorMessage,
      isError: true,
      updatedHistory: input.interviewHistory, // Return old history on error
    };
  }
}
