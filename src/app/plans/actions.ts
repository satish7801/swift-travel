'use server';

import { summarizeItineraryForSharing } from '@/ai/flows/summarize-itinerary-flow';
import { generateAudioSummary } from '@/ai/flows/generate-audio-summary-flow';
import type { SavedItinerary } from '@/lib/types';
import { z } from 'zod';

const ItinerarySchema = z.custom<SavedItinerary>();

export async function summarizeItineraryAction(itinerary: SavedItinerary): Promise<{ summary?: string; error?: string; }> {
    const validatedInput = ItinerarySchema.safeParse(itinerary);
    if (!validatedInput.success) {
        return { error: "Invalid itinerary data provided." };
    }

    try {
        const result = await summarizeItineraryForSharing({ itinerary: validatedInput.data });
        return { summary: result.summary };
    } catch (error: any) {
        console.error('Summarize itinerary error:', error);
        return { error: error.message || 'Failed to generate summary.' };
    }
}

const AudioSummarySchema = z.string().min(10, { message: "Text is too short to generate audio." });

export async function generateAudioSummaryAction(text: string): Promise<{ audioDataUri?: string; error?:string; }> {
    const validatedInput = AudioSummarySchema.safeParse(text);
    if (!validatedInput.success) {
        return { error: validatedInput.error.errors[0].message };
    }

    try {
        const result = await generateAudioSummary({ text: validatedInput.data });
        return { audioDataUri: result.audioDataUri };
    } catch (error: any) {
        console.error('Generate audio summary error:', error);
        return { error: error.message || 'Failed to generate audio summary.' };
    }
}
