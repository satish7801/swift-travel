'use server';

/**
 * @fileOverview A Genkit tool to get details about a location.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const LocationDetailsSchema = z.object({
    summary: z.string().describe("A brief, engaging one-paragraph summary of the location."),
    attractions: z.array(z.string()).describe("A list of 3-5 major attractions or points of interest."),
    restaurants: z.array(z.string()).describe("A list of 3-5 popular or highly-rated restaurants."),
    funFact: z.string().describe("A surprising or little-known fun fact about the location."),
    imageDataUri: z.string().optional().describe("A data URI of a generated image representing the location. Should be in 'data:image/png;base64,...' format."),
});

export const getLocationDetails = ai.defineTool(
    {
        name: 'getLocationDetails',
        description: 'Provides detailed information about a travel destination, including a summary, attractions, restaurants, a fun fact, and a representative image. Use this when a user asks for information about a place, what to do there, or where to eat.',
        inputSchema: z.object({
            location: z.string().describe("The name of the city or location to get details for (e.g., 'Jaipur, India')."),
        }),
        outputSchema: LocationDetailsSchema,
    },
    async ({ location }) => {
        const textPrompt = `Generate a travel guide summary for ${location}. Provide a brief overview, 3-5 key attractions, 3-5 popular restaurants, and one interesting fun fact.`;
        const imagePrompt = `A beautiful, high-quality photograph of a famous landmark in ${location}.`;

        // Generate text and image in parallel
        const [textResult, imageResult] = await Promise.all([
            ai.generate({
                prompt: textPrompt,
                model: 'googleai/gemini-2.5-flash',
                output: {
                    schema: LocationDetailsSchema.omit({ imageDataUri: true }),
                }
            }),
            ai.generate({
                model: googleAI.model('imagen-4.0-fast-generate-001'),
                prompt: imagePrompt,
            })
        ]);
        
        const output = textResult.output!;

        if (imageResult.media?.url) {
            return {
                ...output,
                imageDataUri: imageResult.media.url
            }
        }
        
        return output;
    }
);
