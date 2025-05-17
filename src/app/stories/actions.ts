
'use server';

import { curateInspiringStories, type CurateInspiringStoriesInput, type CurateInspiringStoriesOutput } from '@/ai/flows/curate-inspiring-stories';
import { z } from 'zod';

export type StoriesFormState = {
  message?: string;
  fields?: Record<string, string>;
  stories?: CurateInspiringStoriesOutput;
  isError?: boolean;
};

const storiesFormSchema = z.object({
  userProfile: z.string().optional().or(z.literal("")), // Optional, can be empty
  currentChallenges: z.string().min(10, "Please describe current challenges in detail, at least 10 characters."),
});

export async function handleCurateStories(
  prevState: StoriesFormState,
  formData: FormData
): Promise<StoriesFormState> {

  const validatedFields = storiesFormSchema.safeParse({
    userProfile: formData.get('userProfile') || "", 
    currentChallenges: formData.get('currentChallenges'),
  });

  if (!validatedFields.success) {
    const fieldErrors: Record<string, string> = {};
    for (const error of validatedFields.error.issues) {
        if (error.path.length > 0) {
            fieldErrors[error.path[0] as string] = error.message;
        }
    }
    return {
      message: "Invalid form data. Please check the fields below.",
      fields: fieldErrors,
      isError: true,
    };
  }

  try {
    const input: CurateInspiringStoriesInput = {
        userProfile: validatedFields.data.userProfile || "User chose not to share profile details.",
        currentChallenges: validatedFields.data.currentChallenges,
    };
    const result = await curateInspiringStories(input);
    return {
      message: "Inspiring stories curated successfully!",
      stories: result,
      isError: false,
    };
  } catch (error: any) {
    console.error("Detailed error in handleCurateStories:", error);
    let errorMessage = "Failed to curate stories. AatmAI might be busy or there was an issue. Please try again later.";
    if (error && typeof error.message === 'string') {
        if (error.message.toLowerCase().includes('overloaded') || error.message.toLowerCase().includes('rate limit')) {
            errorMessage = "AatmAI's servers are currently busy finding stories. Please try again in a few moments.";
        } else if (error.message.includes('AI failed to generate a valid response structure')) {
            errorMessage = "AatmAI had trouble understanding the request or finding suitable stories. Please try adjusting your input or try again later.";
        } else {
             // Use the specific error from the flow if it's not too technical
            errorMessage = error.message.length < 100 ? error.message : errorMessage;
        }
    }
    return {
      message: errorMessage,
      isError: true,
    };
  }
}

