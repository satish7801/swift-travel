'use server';

/**
 * @fileOverview A travel chatbot assistance AI agent.
 *
 * - travelChatbotAssistance - A function that handles travel-related queries, booking, and support.
 * - TravelChatbotAssistanceInput - The input type for the travelChatbotAssistance function.
 * - TravelChatbotAssistanceOutput - The return type for the travelChatbotAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TravelChatbotAssistanceInputSchema = z.object({
  query: z.string().describe('The user query related to travel planning, booking, or support.'),
});
export type TravelChatbotAssistanceInput = z.infer<typeof TravelChatbotAssistanceInputSchema>;

const TravelChatbotAssistanceOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user query.'),
});
export type TravelChatbotAssistanceOutput = z.infer<typeof TravelChatbotAssistanceOutputSchema>;

export async function travelChatbotAssistance(input: TravelChatbotAssistanceInput): Promise<TravelChatbotAssistanceOutput> {
  return travelChatbotAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'travelChatbotAssistancePrompt',
  input: {schema: TravelChatbotAssistanceInputSchema},
  output: {schema: TravelChatbotAssistanceOutputSchema},
  prompt: `You are a travel assistant chatbot that helps users with planning, booking, and support.
  Your goal is to provide helpful and informative responses to the user's query.

  User Query: {{{query}}}
  `, // removed example to follow the instructions
});

const travelChatbotAssistanceFlow = ai.defineFlow(
  {
    name: 'travelChatbotAssistanceFlow',
    inputSchema: TravelChatbotAssistanceInputSchema,
    outputSchema: TravelChatbotAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
