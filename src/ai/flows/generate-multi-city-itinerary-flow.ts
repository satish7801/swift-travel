
/**
 * @fileOverview A flow to generate a multi-city travel itinerary.
 *
 * - generateMultiCityItinerary - A function that matches the multi-stop structure.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const StopSchema = z.object({
    id: z.string(),
    location: z.string().describe('The name of the city or location.'),
    date: z.string().optional().describe('Approximate date of arrival/stay.'),
    period: z.string().optional().describe('Time of day: Morning, Afternoon, Evening, Night'),
    duration: z.number().optional().describe('Number of days to stay including travel.'),
    selectedAttractions: z.array(z.string()).optional().describe('Specific attractions the user wants to visit.'),
    travelToNext: z.object({
        distanceKm: z.number(),
        duration: z.string(),
        mode: z.string()
    }).optional().describe('Estimated travel details to the next stop.'),
});

const GenerateMultiCityItineraryInputSchema = z.object({
    stops: z.array(StopSchema).describe('List of stops, where the first is the origin.'),
});
export type GenerateMultiCityItineraryInput = z.infer<typeof GenerateMultiCityItineraryInputSchema>;

const DayPlanSchema = z.object({
    day: z.number().describe('The day number in the itinerary (e.g., 1, 2).'),
    title: z
        .string()
        .describe('A catchy title for the day (e.g., "Journey to Haridwar", "Spiritual Morning & Bustling Bazaars").'),
    activities: z
        .array(z.string())
        .describe('A list of activities and places to visit for that day.'),
});

const GenerateMultiCityItineraryOutputSchema = z.object({
    totalDays: z.number().describe('The total number of days estimated for the trip.'),
    itinerary: z.array(DayPlanSchema).describe('The day-by-day plan.'),
    summary: z.string().describe('A brief, engaging summary of the overall trip plan.'),
});
export type GenerateMultiCityItineraryOutput = z.infer<typeof GenerateMultiCityItineraryOutputSchema>;

export async function generateMultiCityItinerary(
    input: GenerateMultiCityItineraryInput
): Promise<GenerateMultiCityItineraryOutput> {
    return generateMultiCityItineraryFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateMultiCityItineraryPrompt',
    input: { schema: GenerateMultiCityItineraryInputSchema },
    output: { schema: GenerateMultiCityItineraryOutputSchema },
    prompt: `You are an expert travel planner. A user is planning a multi-city trip.
  
  **Stops:**
  {{{json stops}}}
  
  Your task is to create a detailed day-by-day itinerary that logically follows this route.
  
  **CRITICAL INSTRUCTIONS:**
  1.  **Day 1 MUST start with travel.** The user starts at the first stop (Origin) and travels to the second stop.
      -   Activity 1 should be: "Travel from [Origin] to [Second Stop] via [appropriate mode]".
      -   **Time of Day Logic:**
          -   If \`period\` is "Night", Day 1 is "Overnight Journey". The user arrives on Day 2 Morning.
          -   If \`period\` is "Morning", user travels during the day and arrives same day (if short distance) or late evening.
      -   Include check-in and evening relaxation/light exploration for Day 1 only if arriving early.
  
  2.  **Destinations & Attractions:**
      -   **Prioritize User Selections:** If \`selectedAttractions\` are provided for a stop, you MUST include them in that day's itinerary.
      -   When the user is in a destination (e.g., Haridwar), do NOT just say "Local sightseeing".
      -   List SPECIFIC famous places. For Haridwar, mention "Har Ki Pauri", "Ganga Aarti", "Mansa Devi Temple", etc.
      -   For Ahmedabad, mention "Sabarmati Ashram", "Adalaj Stepwell", etc.
  
  3.  **Transit Days (STRICT):**
      -   **Use provided travel details:** If the stop data has \`travelToNext\`, YOU MUST use its \`duration\` and \`mode\`.
      -   Example: If \`duration\` is "22h 30m" and mode is "Train", Day X MUST be dedicated to "Train Journey to [Next Stop] (approx 22.5 hours)".
      -   **Do not hallucinate faster travel:** If the duration is long (e.g. > 12h), the entire day (or two) should be for travel.
      -   For short travel (e.g. < 4h), you can combine travel and evening sightseeing.
  
  4.  **Structure:**
      -   Provide a day number, a creative title (e.g., "Arrival in the Holy City"), and a list of concrete activities.
  
  5.  **Summary:**
      -   Write a short, exciting summary of the whole journey.
  `,
});

const generateMultiCityItineraryFlow = ai.defineFlow(
    {
        name: 'generateMultiCityItineraryFlow',
        inputSchema: GenerateMultiCityItineraryInputSchema,
        outputSchema: GenerateMultiCityItineraryOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        if (!output) {
            throw new Error('Failed to generate multi-city itinerary.');
        }
        return output;
    }
);
