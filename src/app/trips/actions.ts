'use server';
import { generateTripVideo } from '@/ai/flows/generate-trip-video-flow';
import type { Route } from '@/lib/types';

export async function generateVideoAction(route: Route): Promise<{ videoDataUri?: string; error?: string; }> {
  try {
    const result = await generateTripVideo({ route });
    return { videoDataUri: result.videoDataUri };
  } catch (error: any) {
    console.error('Video generation failed:', error);
    return { error: error.message || 'Failed to generate video itinerary.' };
  }
}
