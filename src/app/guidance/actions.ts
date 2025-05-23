
'use server';

import { generatePersonalizedGuidance, type PersonalizedGuidanceInput, type PersonalizedGuidanceOutput } from '@/ai/flows/generate-personalized-guidance';
import { z } from 'zod';

export type ChatMessage = {
  role: 'user' | 'model';
  content: string;
};

export type GuidanceFormState = {
  message?: string;
  fields?: Record<string, string>;
  guidance?: PersonalizedGuidanceOutput;
  isError?: boolean;
  updatedConversationHistory?: ChatMessage[];
};

const guidanceFormSchema = z.object({
  profile: z.string().min(1, "Profile information is optional but helpful.").or(z.literal("")).optional(),
  mood: z.string().min(1, "Please describe your current mood.").or(z.literal("")).optional(), // Allow empty string if not provided for follow-ups
  issue: z.string().min(10, "Please describe your issue in a bit more detail (at least 10 characters)."),
  conversationHistory: z.string().optional(), // JSON string of ChatMessage[]
});


export async function handleGenerateGuidance(
  prevState: GuidanceFormState,
  formData: FormData
): Promise<GuidanceFormState> {
  
  const validatedFields = guidanceFormSchema.safeParse({
    profile: formData.get('profile') || "", 
    mood: formData.get('mood') || "", 
    issue: formData.get('issue'),
    conversationHistory: formData.get('conversationHistory'),
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
  
  let parsedConversationHistory: ChatMessage[] = [];
  if (validatedFields.data.conversationHistory) {
    try {
      parsedConversationHistory = JSON.parse(validatedFields.data.conversationHistory);
    } catch (e) {
      console.error("Failed to parse conversation history:", e);
      // Decide if this should be a user-facing error or handled silently
    }
  }

  try {
    const input: PersonalizedGuidanceInput = {
        profile: validatedFields.data.profile || "User chose not to share profile details.", 
        mood: validatedFields.data.mood || "Not specified by user.", 
        issue: validatedFields.data.issue,
        conversationHistory: parsedConversationHistory,
    };
    const result = await generatePersonalizedGuidance(input);

    const newUpdatedConversationHistory = [
      ...parsedConversationHistory,
      { role: 'user' as const, content: validatedFields.data.issue },
      { role: 'model' as const, content: result.guidance },
    ];
    
    return {
      message: "Guidance generated successfully!",
      guidance: result,
      isError: false,
      updatedConversationHistory: newUpdatedConversationHistory,
    };
  } catch (error: any) {
    console.error("Detailed error in handleGenerateGuidance:", error);
    let errorMessage = "Failed to generate guidance. AatmAI might be busy or there was an issue. Please try again later.";
    if (error && typeof error.message === 'string') {
        if (error.message.toLowerCase().includes('overloaded') || error.message.toLowerCase().includes('rate limit')) {
            errorMessage = "AatmAI's servers are currently busy. Please try again in a few moments.";
        } else if (error.message.includes('AI failed to generate a valid response structure')) {
            errorMessage = "AatmAI had trouble understanding the request or formulating a response. Please try rephrasing or try again later.";
        } else {
            // Use the specific error from the flow if it's not too technical
            errorMessage = error.message.length < 100 ? error.message : errorMessage;
        }
    }
    return {
      message: errorMessage,
      isError: true,
      updatedConversationHistory: parsedConversationHistory, // return old history on error
    };
  }
}

