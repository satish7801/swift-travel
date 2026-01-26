/**
 * @fileOverview A flow to generate a shareable summary of a travel itinerary.
 *
 * - summarizeItineraryForSharing - A function that creates a short summary.
 * - SummarizeItineraryInput - The input type for the function.
 * - SummarizeItineraryOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { SavedItinerary } from '@/lib/types';


const SummarizeItineraryInputSchema = z.object({
  itinerary: z.custom<SavedItinerary>().describe('The saved itinerary object.'),
});
export type SummarizeItineraryInput = z.infer<typeof SummarizeItineraryInputSchema>;

const SummarizeItineraryOutputSchema = z.object({
  summary: z.string().describe("A short, friendly, and shareable summary of the trip, suitable for a text message."),
});
export type SummarizeItineraryOutput = z.infer<typeof SummarizeItineraryOutputSchema>;


export async function summarizeItineraryForSharing(
  input: SummarizeItineraryInput
): Promise<SummarizeItineraryOutput> {
  return summarizeItineraryFlow(input);
}


const prompt = ai.definePrompt({
  name: 'summarizeItineraryPrompt',
  input: { schema: SummarizeItineraryInputSchema },
  output: { schema: SummarizeItineraryOutputSchema },
  prompt: `You are a travel assistant. A user wants to share their trip plan with a friend.
Based on the following itinerary data, create a short, exciting, and friendly summary.

Itinerary Data:
{{{json itinerary}}}

**Instructions:**
- Keep it concise and enthusiastic, perfect for sharing in a text message or social media post.
- Start with something catchy like "Guess what! I'm planning a trip to...".
- Mention the main city and the total duration of the trip.
- Highlight 2-3 of the most exciting activities or places from the itinerary.
- Do not use markdown or complex formatting. Just a single block of text.
- End with an exciting closing, like "Can't wait!" or "It's going to be amazing!".
`,
});


const summarizeItineraryFlow = ai.defineFlow(
  {
    name: 'summarizeItineraryFlow',
    inputSchema: SummarizeItineraryInputSchema,
    outputSchema: SummarizeItineraryOutputSchema,
  },
  async ({ itinerary }) => {
    // The prompt works with the whole itinerary object.
    const { output } = await prompt({ itinerary });
    if (!output) {
      throw new Error('Failed to generate summary.');
    }
    return output;
  }
);
