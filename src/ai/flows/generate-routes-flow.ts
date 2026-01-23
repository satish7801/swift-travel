'use server';

/**
 * @fileOverview A flow to generate travel route suggestions using an LLM.
 *
 * - generateRoutes - A function that generates travel routes based on user input.
 * - GenerateRoutesInput - The input type for the generateRoutes function.
 * - GenerateRoutesOutput - The return type for the generateRoutes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRoutesInputSchema = z.object({
  from: z.string().describe('The departure location.'),
  to: z.string().describe('The arrival location.'),
  date: z.string().optional().describe('The desired travel date in YYYY-MM-DD format.'),
});
export type GenerateRoutesInput = z.infer<typeof GenerateRoutesInputSchema>;

const LegSchema = z.object({
    id: z.string().describe('Unique identifier for the leg.'),
    mode: z.enum(['bus', 'train', 'flight']).describe('The mode of transport.'),
    departureLocation: z.string().describe('The departure location for this leg.'),
    arrivalLocation: z.string().describe('The arrival location for this leg.'),
    departureTime: z.string().describe("The departure time in ISO 8601 format (e.g., 2024-08-15T08:30:00Z)."),
    arrivalTime: z.string().describe("The arrival time in ISO 8601 format (e.g., 2024-08-15T10:45:00Z)."),
    duration: z.string().describe('The duration of this leg (e.g., "2h 15m").'),
    operator: z.string().describe('The company operating this leg (e.g., "IndiGo", "Indian Railways").'),
    details: z.string().describe('Additional details like flight number or train name.'),
});

const RouteSchema = z.object({
    id: z.string().describe('Unique identifier for the route.'),
    legs: z.array(LegSchema).describe('An array of travel legs that make up the route.'),
    totalDuration: z.string().describe('The total duration of the route, including layovers.'),
    price: z.number().describe('The total price of the route in INR.'),
    availability: z.enum(['Available', 'Filling Fast', 'Few Seats Left', 'Sold Out']).describe('The seat availability status.'),
    carbonFootprint: z.number().describe('The estimated carbon footprint for the route in kg CO2e.'),
});

const GenerateRoutesOutputSchema = z.object({
    routes: z.array(RouteSchema).describe('A list of generated travel routes.'),
});
export type GenerateRoutesOutput = z.infer<typeof GenerateRoutesOutputSchema>;


export async function generateRoutes(input: GenerateRoutesInput): Promise<GenerateRoutesOutput> {
  return generateRoutesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRoutesPrompt',
  input: {schema: GenerateRoutesInputSchema},
  output: {schema: GenerateRoutesOutputSchema},
  prompt: `You are a travel planning assistant. Generate a list of 3 to 5 sample travel routes based on the user's request.

  From: {{{from}}}
  To: {{{to}}}
  Date: {{{date}}}

  - Create a mix of transport modes (flight, train, bus).
  - For multi-leg journeys, ensure the locations and times are logical.
  - Provide realistic durations, prices (in INR), and operators for travel in India.
  - Provide a realistic carbon footprint estimate in kg CO2e for each route, considering the mode of transport.
  - Ensure the IDs are unique for each route and leg (e.g., route-1, leg-1-1).
  - The departure and arrival locations for legs should be specific (e.g., 'New Delhi (NDLS)', 'Mumbai (BOM)').
  - The total duration should account for layover times if there are multiple legs.
  - Return a valid JSON object that adheres to the provided output schema.
  `,
});


const generateRoutesFlow = ai.defineFlow(
  {
    name: 'generateRoutesFlow',
    inputSchema: GenerateRoutesInputSchema,
    outputSchema: GenerateRoutesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate routes.');
    }
    return output;
  }
);
