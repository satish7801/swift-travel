'use server';

/**
 * @fileOverview A flow to generate a rich, narrative-style travel overview from a structured itinerary.
 *
 * - generateItineraryOverview - A function that creates a travel blog-style overview.
 * - GenerateItineraryOverviewInput - The input type for the function.
 * - GenerateItineraryOverviewOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { GenerateItineraryOutput } from './generate-itinerary-flow';

// We need the city and the previously generated itinerary.
const GenerateItineraryOverviewInputSchema = z.object({
    city: z.string().describe('The main city for the trip.'),
    itinerary: z.custom<GenerateItineraryOutput>().describe('The structured itinerary object generated previously.'),
});
export type GenerateItineraryOverviewInput = z.infer<typeof GenerateItineraryOverviewInputSchema>;


const DailyBreakdownSchema = z.object({
    day: z.number().describe("The day number."),
    dayTitle: z.string().describe("The title for the day's plan."),
    narrative: z.string().describe("A detailed, engaging narrative of the day's activities, written like a travel blogger describing the experience."),
    proTip: z.string().optional().describe("A helpful pro-tip for the day, like a seasoned travel agent would give."),
});

const GenerateItineraryOverviewOutputSchema = z.object({
  title: z.string().describe("A creative and catchy headline for the entire trip, like a blog post title."),
  introduction: z.string().describe("An engaging introduction that sets the scene and excitement for the trip, written in a personal, first-person-like tone."),
  estimatedCost: z.string().describe("A rough budget estimation for the trip, excluding travel to the destination (e.g., '₹15,000 - ₹20,000 per person for 3 days')."),
  bestTimeToVisit: z.string().describe("A short recommendation on the best season or months to visit."),
  gettingAround: z.string().describe("A paragraph with tips on local transportation options within the city (e.g., auto-rickshaws, metro, ride-sharing apps)."),
  whatToPack: z.array(z.string()).describe("A list of 5-7 essential items to pack for the trip, specific to the destination and activities."),
  dailyBreakdown: z.array(DailyBreakdownSchema).describe("A day-by-day narrative breakdown of the trip."),
  conclusion: z.string().describe("A concluding paragraph that summarizes the experience and leaves the reader inspired."),
  suggestedVideos: z.array(z.string()).describe("A list of 2-3 YouTube search queries for relevant travel vlogs to get a visual feel for the trip."),
});
export type GenerateItineraryOverviewOutput = z.infer<typeof GenerateItineraryOverviewOutputSchema>;

export async function generateItineraryOverview(
  input: GenerateItineraryOverviewInput
): Promise<GenerateItineraryOverviewOutput> {
  return generateItineraryOverviewFlow(input);
}


const prompt = ai.definePrompt({
    name: 'generateItineraryOverviewPrompt',
    input: { schema: GenerateItineraryOverviewInputSchema },
    output: { schema: GenerateItineraryOverviewOutputSchema },
    prompt: `You are an expert travel blogger and agent with a knack for storytelling. A user has created a basic itinerary for a trip to {{{city}}}. Your task is to transform this structured plan into a rich, engaging, and personal travel overview, as if you are sharing your own experience or giving expert advice.

Here is the structured itinerary you need to work with:
{{{JSON.stringify itinerary}}}

Based on this, generate a response in the specified JSON format.

**Your narrative MUST:**
- **Be Personal and Engaging:** Write in a friendly, first-person-like tone. Use words that evoke feelings and experiences (e.g., "You'll feel the spiritual energy...", "Prepare to be mesmerized by...").
- **Elaborate on Activities:** Don't just list the activities. Describe them. What makes them special? What should the user look out for? For example, instead of "Visit Har Ki Pauri", write something like "As dusk settles, you'll head to the legendary Har Ki Pauri ghat. Find a spot on the steps and witness the magical Ganga Aarti, a symphony of fire, chants, and devotion that will leave you spellbound."
- **Provide Insider Tips:** For each day, offer a 'pro-tip' that adds real value. This could be about the best time to visit, a local snack to try, a photo spot, or a way to avoid crowds.
- **Create a Cohesive Story:** The introduction should hook the reader, the daily narratives should flow logically, and the conclusion should provide a satisfying summary.
- **Suggest Visual Aids:** Include 2-3 specific YouTube search queries that would help the user find relevant travel vlogs. This helps them visualize the experience you're describing.

**In addition to the narrative, you MUST provide the following practical information:**
- **Estimated Cost:** A realistic budget range for the trip *within the destination*, based on the number of days. Exclude travel to/from the city.
- **Best Time to Visit:** Recommend the ideal months or season for this trip.
- **Getting Around:** Give practical advice on local transport options.
- **What to Pack:** Create a short, essential packing list (5-7 items) relevant to the city and planned activities.

Transform the user's simple plan into an inspiring and practical guide that makes them excited and prepared for their journey.
`,
});


const generateItineraryOverviewFlow = ai.defineFlow(
  {
    name: 'generateItineraryOverviewFlow',
    inputSchema: GenerateItineraryOverviewInputSchema,
    outputSchema: GenerateItineraryOverviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate itinerary overview.');
    }
    return output;
  }
);
