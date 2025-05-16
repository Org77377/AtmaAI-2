'use server';

import { curateInspiringStories, type CurateInspiringStoriesInput, type CurateInspiringStoriesOutput } from '@/ai/flows/curate-inspiring-stories';
import { z } from 'zod';

// storiesFormSchema is now defined inside handleCurateStories

export type StoriesFormState = {
  message?: string;
  fields?: Record<string, string>;
  stories?: CurateInspiringStoriesOutput;
  isError?: boolean;
};

export async function handleCurateStories(
  prevState: StoriesFormState,
  formData: FormData
): Promise<StoriesFormState> {
  const storiesFormSchema = z.object({
    userProfile: z.string().min(50, "User profile should be detailed, at least 50 characters."),
    currentChallenges: z.string().min(20, "Please describe current challenges in detail, at least 20 characters."),
  });

  const validatedFields = storiesFormSchema.safeParse({
    userProfile: formData.get('userProfile'),
    currentChallenges: formData.get('currentChallenges'),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      fields: validatedFields.error.flatten().fieldErrors as Record<string, string>,
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
