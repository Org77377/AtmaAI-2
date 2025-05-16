'use server';

import { generatePersonalizedGuidance, type PersonalizedGuidanceInput, type PersonalizedGuidanceOutput } from '@/ai/flows/generate-personalized-guidance';
import { z } from 'zod';

export const guidanceFormSchema = z.object({
  profile: z.string().min(50, "Profile information should be detailed, at least 50 characters."),
  mood: z.string().min(3, "Please describe your current mood."),
  issue: z.string().min(20, "Please describe your issue in detail, at least 20 characters."),
});

export type GuidanceFormState = {
  message?: string;
  fields?: Record<string, string>;
  guidance?: PersonalizedGuidanceOutput;
  isError?: boolean;
};

export async function handleGenerateGuidance(
  prevState: GuidanceFormState,
  formData: FormData
): Promise<GuidanceFormState> {
  const validatedFields = guidanceFormSchema.safeParse({
    profile: formData.get('profile'),
    mood: formData.get('mood'),
    issue: formData.get('issue'),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      fields: validatedFields.error.flatten().fieldErrors as Record<string, string>,
      isError: true,
    };
  }

  try {
    const input: PersonalizedGuidanceInput = validatedFields.data;
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
