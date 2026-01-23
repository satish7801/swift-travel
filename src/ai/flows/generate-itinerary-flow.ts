'use server';

/**
 * @fileOverview A flow to generate a multi-day travel itinerary.
 *
 * - generateItinerary - A function that generates an itinerary.
 * - GenerateItineraryInput - The input type for the generateItinerary function.
 * - GenerateItineraryOutput - The return type for the generateItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateItineraryInputSchema = z.object({
  city: z.string().describe('The main city for the trip.'),
  attractions: z
    .array(z.string())
    .describe('A list of attractions selected by the user.'),
});
export type GenerateItineraryInput = z.infer<
  typeof GenerateItineraryInputSchema
>;

const DayPlanSchema = z.object({
  day: z.number().describe('The day number in the itinerary (e.g., 1, 2).'),
  title: z
    .string()
    .describe('A catchy title for the day (e.g., "Spiritual Morning & Bustling Bazaars").'),
  activities: z
    .array(z.string())
    .describe('A list of activities and places to visit for that day.'),
});

const GenerateItineraryOutputSchema = z.object({
  totalDays: z.number().describe('The total number of days estimated for the trip.'),
  itinerary: z.array(DayPlanSchema).describe('The day-by-day plan.'),
  summary: z.string().describe('A brief, engaging summary of the overall trip plan.'),
});
export type GenerateItineraryOutput = z.infer<
  typeof GenerateItineraryOutputSchema
>;

export async function generateItinerary(
  input: GenerateItineraryInput
): Promise<GenerateItineraryOutput> {
  return generateItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateItineraryPrompt',
  input: {schema: GenerateItineraryInputSchema},
  output: {schema: GenerateItineraryOutputSchema},
  prompt: `You are an expert travel planner. A user wants a multi-day itinerary for a trip to {{{city}}}.
They have selected the following attractions to visit: {{{attractions}}}.

Your task is to create a logical and efficient day-by-day itinerary that includes all the selected attractions.
- Group attractions that are geographically close to each other on the same day.
- Create a realistic plan. Don't cram too many activities into a single day.
- Estimate the total number of days required to comfortably visit all selected attractions. This should be the value for 'totalDays'.
- For each day, provide a day number, a creative title, and a list of activities.
- Provide a short, engaging summary of the entire trip plan.
- Respond in the specified JSON format.
`,
});

const generateItineraryFlow = ai.defineFlow(
  {
    name: 'generateItineraryFlow',
    inputSchema: GenerateItineraryInputSchema,
    outputSchema: GenerateItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate itinerary.');
    }
    return output;
  }
);
