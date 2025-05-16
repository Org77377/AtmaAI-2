
'use server';

import { generatePersonalizedGuidance, type PersonalizedGuidanceInput, type PersonalizedGuidanceOutput } from '@/ai/flows/generate-personalized-guidance';
import { z } from 'zod';

export type GuidanceFormState = {
  message?: string;
  fields?: Record<string, string>;
  guidance?: PersonalizedGuidanceOutput;
  isError?: boolean;
};

const guidanceFormSchema = z.object({
  profile: z.string().min(1, "Profile information is optional but helpful.").or(z.literal("")).optional(),
  mood: z.string().min(3, "Please describe your current mood."),
  issue: z.string().min(20, "Please describe your issue in detail, at least 20 characters."),
});


export async function handleGenerateGuidance(
  prevState: GuidanceFormState,
  formData: FormData
): Promise<GuidanceFormState> {
  
  const validatedFields = guidanceFormSchema.safeParse({
    profile: formData.get('profile') || "", 
    mood: formData.get('mood'),
    issue: formData.get('issue'),
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
  
  // Removed the explicit 50-character minimum check for the profile field
  // The schema's .optional() and .min(1).or(z.literal("")) handle its optional nature
  // and ensure it's not just whitespace if provided.

  try {
    const input: PersonalizedGuidanceInput = {
        profile: validatedFields.data.profile || "User chose not to share profile details.", 
        mood: validatedFields.data.mood,
        issue: validatedFields.data.issue,
    };
    const result = await generatePersonalizedGuidance(input);
    return {
      message: "Guidance generated successfully!",
      guidance: result,
      isError: false,
    };
  } catch (error) {
    console.error("Error generating guidance:", error);
    return {
      message: "Failed to generate guidance. Please try again later.",
      isError: true,
    };
  }
}
