'use server';

/**
 * @fileOverview A flow to find popular attractions in a given city.
 *
 * - findAttractions - A function that finds attractions based on a city.
 * - FindAttractionsInput - The input type for the findAttractions function.
 * - FindAttractionsOutput - The return type for the findAttractions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindAttractionsInputSchema = z.object({
  city: z.string().describe('The city to find attractions for.'),
});
export type FindAttractionsInput = z.infer<typeof FindAttractionsInputSchema>;

const FindAttractionsOutputSchema = z.object({
  attractions: z
    .array(z.string())
    .describe(
      'A list of 10-15 popular and most-visited tourist attractions in the specified city.'
    ),
});
export type FindAttractionsOutput = z.infer<typeof FindAttractionsOutputSchema>;

export async function findAttractions(
  input: FindAttractionsInput
): Promise<FindAttractionsOutput> {
  return findAttractionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findAttractionsPrompt',
  input: {schema: FindAttractionsInputSchema},
  output: {schema: FindAttractionsOutputSchema},
  prompt: `You are a travel expert. A user wants to find the most popular attractions in {{{city}}}.

Your task is to return a list of 10 to 15 of the most popular and most-visited tourist attractions in that city.
- The attractions should be real places.
- Be specific with names (e.g., "Har Ki Pauri Ghat" instead of "Ghat").
- If the city is known for a specific type of attraction (e.g., temples in Haridwar), ensure they are well-represented.
- Return only the list of attractions in the specified JSON format.
`,
});

const findAttractionsFlow = ai.defineFlow(
  {
    name: 'findAttractionsFlow',
    inputSchema: FindAttractionsInputSchema,
    outputSchema: FindAttractionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      return {attractions: []};
    }
    return output;
  }
);
