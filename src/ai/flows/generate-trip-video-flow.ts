'use server';

/**
 * @fileOverview A flow to generate a cinematic video itinerary for a travel route.
 *
 * - generateTripVideo - A function that generates a video based on a route.
 * - GenerateTripVideoInput - The input type for the generateTripVideo function.
 * - GenerateTripVideoOutput - The return type for the generateTripVideo function.
 */

import {ai} from '@/ai/genkit';
import type {Route} from '@/lib/types';
import {z} from 'genkit';
import {MediaPart} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const GenerateTripVideoInputSchema = z.object({
  route: z.any().describe('The travel route object.'),
});
export type GenerateTripVideoInput = z.infer<
  typeof GenerateTripVideoInputSchema
>;

const GenerateTripVideoOutputSchema = z.object({
  videoDataUri: z.string().describe('The generated video as a data URI.'),
});
export type GenerateTripVideoOutput = z.infer<
  typeof GenerateTripVideoOutputSchema
>;

export async function generateTripVideo(
  input: GenerateTripVideoInput
): Promise<GenerateTripVideoOutput> {
  return generateTripVideoFlow(input);
}

async function getVideoAsDataUri(video: MediaPart): Promise<string> {
  if (!video.media?.url) {
    throw new Error('Video media URL is missing.');
  }
  const videoDownloadResponse = await fetch(
    `${video.media.url}&key=${process.env.GEMINI_API_KEY}`
  );
  if (!videoDownloadResponse.ok || !videoDownloadResponse.body) {
    throw new Error(
      `Failed to download video: ${videoDownloadResponse.statusText}`
    );
  }
  const videoBuffer = await videoDownloadResponse.arrayBuffer();
  const base64 = Buffer.from(videoBuffer).toString('base64');
  const contentType = video.media.contentType || 'video/mp4';
  return `data:${contentType};base64,${base64}`;
}

const generateTripVideoFlow = ai.defineFlow(
  {
    name: 'generateTripVideoFlow',
    inputSchema: GenerateTripVideoInputSchema,
    outputSchema: GenerateTripVideoOutputSchema,
  },
  async ({route}: {route: Route}) => {
    const from = route.legs[0].departureLocation.split(',')[0];
    const to = route.legs[route.legs.length - 1].arrivalLocation.split(',')[0];
    const modes = route.legs.map(leg => leg.mode).join(' and ');

    const prompt = `Create a short, cinematic travel video about a trip from ${from} to ${to}.
    - Start with a beautiful, sweeping aerial shot of a famous landmark in ${from}.
    - Show a dynamic journey scene using a ${modes}.
    - Show several stunning, fast-paced clips of views and activities in ${to}.
    - The video should be exciting, upbeat, and inspiring. Use dynamic camera movements.
    - End with the text '${to} awaits!' stylishly overlayed on a beautiful final shot of the destination at sunset or sunrise.`;

    let {operation} = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: prompt,
      config: {
        durationSeconds: 8,
        aspectRatio: '9:16',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    while (!operation.done) {
      // Wait for 5 seconds before checking again.
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.checkOperation(operation);
    }

    if (operation.error) {
      throw new Error('Failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find(p => !!p.media);
    if (!video) {
      throw new Error(
        'Failed to find the generated video in the operation result'
      );
    }

    const videoDataUri = await getVideoAsDataUri(video);

    return {videoDataUri};
  }
);
