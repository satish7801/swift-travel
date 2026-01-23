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
  context: z.string().optional().describe('A JSON string representing the current travel routes the user is viewing.'),
});
export type TravelChatbotAssistanceInput = z.infer<typeof TravelChatbotAssistanceInputSchema>;

const TravelChatbotAssistanceOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user query.'),
  suggestedReplies: z.array(z.string()).optional().describe('A list of 2-3 short, relevant follow-up questions the user might ask.'),
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

Based on the conversation so far, also provide a few short, relevant suggested follow-up questions in the 'suggestedReplies' field that the user might have. For example: "Which is the cheapest option?", "How long is the train journey?", "Are there any morning flights?".

{{#if context}}
The user is currently viewing a list of travel routes. If their query seems to be about these routes, use the following JSON data to form your answer. For example, if they ask "which is the cheapest?", you should find the route with the lowest price from the JSON. If the query is unrelated to the routes, you can ignore this context.

Route context:
{{{context}}}
{{/if}}

User Query: {{{query}}}
`,
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
