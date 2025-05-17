// src/app/actions/generate-speech.ts
'use server';

import { z } from 'zod';

const GenerateSpeechInputSchema = z.object({
  text: z.string().min(1, 'Text to speak cannot be empty.'),
  // You can add more options like voice, quality, speed, etc., as needed
  // For now, we'll use a default voice in the API call.
});

export type GenerateSpeechInput = z.infer<typeof GenerateSpeechInputSchema>;

export type GenerateSpeechOutput = {
  audioUrl?: string;
  error?: string;
};

// This is a common high-quality PlayHT voice.
// Explore PlayHT documentation for voices with specific accents (e.g., en-IN female).
const PLAYHT_VOICE_ID = process.env.PLAYHT_DEFAULT_VOICE_ID || "s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0a8-50a521a08a28/female/manifest.json";


export async function generateSpeechAction(
  input: GenerateSpeechInput
): Promise<GenerateSpeechOutput> {
  const validatedFields = GenerateSpeechInputSchema.safeParse(input);

  if (!validatedFields.success) {
    return { error: 'Invalid input for speech generation.' };
  }

  const { text } = validatedFields.data;
  const apiKey = process.env.PLAYHT_API_KEY;
  const userId = process.env.PLAYHT_USER_ID;

  if (!apiKey || !userId) {
    console.error('PlayHT API Key or User ID is not configured.');
    return { error: 'Speech service is not configured.' };
  }

  try {
    const response = await fetch('https://api.play.ht/api/v2/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-User-ID': userId,
      },
      body: JSON.stringify({
        text: text,
        voice: PLAYHT_VOICE_ID, // You can make this configurable
        output_format: 'mp3', // Or 'wav', etc.
        quality: 'medium', // Or 'low', 'high', 'premium'
        // Add other parameters like speed, sample_rate as needed
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error from PlayHT API' } }));
      console.error('PlayHT API Error:', response.status, errorData);
      return { error: `Speech generation failed: ${errorData?.error?.message || response.statusText}` };
    }

    const data = await response.json();
    
    // PlayHT v2 TTS API returns an event stream or an ID to poll for the audio URL.
    // The simplest way for non-streaming is to get the direct audio URL.
    // This example assumes a direct audio URL is available or can be constructed.
    // For non-streaming synchronous or if it returns an ID for polling:
    // You might need to poll `https://api.play.ht/api/v2/tts/{transcriptionId}`
    // This example assumes the response structure gives us a direct URL or enough info.
    // The typical response for a successful non-streamed generation (after polling or if direct)
    // might look like: { id: "...", status: "complete", audioUrl: "..." }
    // For this example, let's assume 'data.url' or 'data.audio_url' is the direct link.
    // This part HIGHLY depends on the exact PlayHT API version and options used.
    // The PlayHT documentation should be consulted for the correct response structure.
    // For the sake of this example, we'll look for common keys.

    let audioUrl = data.url || data.audio_url || data.audioUrl;

    if (data.id && !audioUrl && (data.status === 'created' || data.status === 'processing')) {
        // If we get an ID and status indicates processing, we need to poll.
        // This is a simplified polling example. In a real app, use more robust polling.
        // For now, we'll just return an error indicating it needs polling.
        // A better approach is to use PlayHT's streaming API if possible for faster feedback.
        // Or have a robust polling mechanism.
        console.log('PlayHT: Audio generation initiated, ID:', data.id);
        // This is a simplified example. Real polling is needed.
        // We are going to try fetching the job status once after a short delay.
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds

        const jobResponse = await fetch(`https://api.play.ht/api/v2/tts/${data.id}`, {
             method: 'GET',
             headers: {
                'Authorization': `Bearer ${apiKey}`,
                'X-User-ID': userId,
             }
        });
        if (jobResponse.ok) {
            const jobData = await jobResponse.json();
            if (jobData.converted) { // 'converted' usually means ready for PlayHT v1, v2 might be different
                 audioUrl = jobData.audio || jobData.url; // Adjust based on actual PlayHT response
            } else {
                 console.warn("PlayHT: Audio still processing after initial poll.", jobData);
                 return { error: "Audio is still processing. Please try again shortly." };
            }
        } else {
            console.error("PlayHT: Failed to poll job status.", jobResponse.status);
            return { error: "Failed to retrieve generated audio status." };
        }
    }


    if (!audioUrl) {
      console.error('PlayHT API did not return an audio URL. Response:', data);
      return { error: 'Speech generation completed, but no audio URL found.' };
    }

    return { audioUrl };

  } catch (error) {
    console.error('Error calling PlayHT API:', error);
    return { error: 'An unexpected error occurred during speech generation.' };
  }
}
