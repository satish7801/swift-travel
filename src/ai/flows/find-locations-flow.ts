'use server';

/**
 * @fileOverview A flow to find location suggestions using an LLM.
 *
 * - findLocations - A function that finds locations based on user input.
 * - FindLocationsInput - The input type for the findLocations function.
 * - FindLocationsOutput - The return type for the findLocations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindLocationsInputSchema = z.object({
  query: z.string().describe("The user's location search query."),
});
export type FindLocationsInput = z.infer<typeof FindLocationsInputSchema>;

const FindLocationsOutputSchema = z.object({
  locations: z.array(z.string()).describe('A list of up to 5 possible location names.'),
});
export type FindLocationsOutput = z.infer<typeof FindLocationsOutputSchema>;

export async function findLocations(input: FindLocationsInput): Promise<FindLocationsOutput> {
  return findLocationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findLocationsPrompt',
  input: {schema: FindLocationsInputSchema},
  output: {schema: FindLocationsOutputSchema},
  prompt: `You are a location search assistant for a travel app that primarily operates within India.
A user has provided the search query: {{{query}}}.

Your task is to return a list of up to 5 of the most likely matching location names.
- The locations must be real cities or major travel hubs in India.
- Be specific. Include the state and country (e.g., "Jaipur, Rajasthan, India").
- If the query is ambiguous (e.g., "Aurangabad"), provide the most common options (e.g., ["Aurangabad, Maharashtra, India", "Aurangabad, Bihar, India"]).
- If there are no reasonable matches for the query, return an empty array.
- Return only the list of locations in the specified JSON format.
`,
});

const findLocationsFlow = ai.defineFlow(
  {
    name: 'findLocationsFlow',
    inputSchema: FindLocationsInputSchema,
    outputSchema: FindLocationsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      return { locations: [] };
    }
    return output;
  }
);
