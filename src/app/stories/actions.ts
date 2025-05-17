
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
  userProfile: z.string().min(1, "Please provide some profile details.").optional().or(z.literal("")), // Made optional and less restrictive
  currentChallenges: z.string().min(10, "Please describe current challenges in detail, at least 10 characters."), // Kept min 10 for challenges
});

export async function handleCurateStories(
  prevState: StoriesFormState,
  formData: FormData
): Promise<StoriesFormState> {

  const validatedFields = storiesFormSchema.safeParse({
    userProfile: formData.get('userProfile') || "", // Allow empty string
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
  } catch (error) {
    console.error("Error curating stories in server action:", error);
    let errorMessage = "Failed to curate stories. AatmAI might be busy or there was an issue. Please try again later.";
     if (error instanceof Error) {
        errorMessage = error.message; // Use the specific error message from the flow if available
    }
    return {
      message: errorMessage,
      isError: true,
    };
  }
}
