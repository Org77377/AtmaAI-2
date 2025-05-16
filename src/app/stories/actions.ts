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
  userProfile: z.string().min(50, "User profile should be detailed, at least 50 characters."),
  currentChallenges: z.string().min(20, "Please describe current challenges in detail, at least 20 characters."),
});

export async function handleCurateStories(
  prevState: StoriesFormState,
  formData: FormData
): Promise<StoriesFormState> {

  const validatedFields = storiesFormSchema.safeParse({
    userProfile: formData.get('userProfile'),
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
    const input: CurateInspiringStoriesInput = validatedFields.data;
    const result = await curateInspiringStories(input);
    return {
      message: "Inspiring stories curated successfully!",
      stories: result,
      isError: false,
    };
  } catch (error) {
    console.error("Error curating stories:", error);
    return {
      message: "Failed to curate stories. Please try again later.",
      isError: true,
    };
  }
}
