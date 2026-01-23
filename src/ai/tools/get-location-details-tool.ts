'use server';

/**
 * @fileOverview A Genkit tool to get details about a location.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const LocationDetailsSchema = z.object({
    summary: z.string().describe("A brief, engaging one-paragraph summary of the location."),
    attractions: z.array(z.string()).describe("A list of 3-5 major attractions or points of interest."),
    restaurants: z.array(z.string()).describe("A list of 3-5 popular or highly-rated restaurants."),
    funFact: z.string().describe("A surprising or little-known fun fact about the location."),
    imageDataUri: z.string().optional().describe("A data URI of a fetched image representing the location. Should be in 'data:image/jpeg;base64,...' format."),
});

async function fetchImageAsDataUri(url: string): Promise<string | null> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Fail gracefully if image can't be fetched
            return null;
        }
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        return `data:${contentType};base64,${base64}`;
    } catch (error) {
        // Fail gracefully
        return null;
    }
}

// Function to create a numeric seed from a string
function locationToSeed(location: string): number {
  return location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}


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

        // First, try to find a curated image from our list
        const cityName = location.split(',')[0].trim().toLowerCase();
        const foundImage = PlaceHolderImages.find(img => img.id === `destination-${cityName}`);
        
        let imageUrl: string | null = foundImage?.imageUrl || null;

        // If no curated image is found, use a dynamic placeholder from a photo service
        if (!imageUrl) {
            const seed = locationToSeed(location);
            imageUrl = `https://picsum.photos/seed/${seed}/400/300`;
        }

        // Generate text and fetch image in parallel
        const [textResult, imageDataUri] = await Promise.all([
            ai.generate({
                prompt: textPrompt,
                model: 'googleai/gemini-2.5-flash',
                output: {
                    schema: LocationDetailsSchema.omit({ imageDataUri: true }),
                }
            }),
            imageUrl ? fetchImageAsDataUri(imageUrl) : Promise.resolve(null)
        ]);
        
        const output = textResult.output!;

        return {
            ...output,
            imageDataUri: imageDataUri || undefined,
        };
    }
);
