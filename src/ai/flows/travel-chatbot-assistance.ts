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
import { getLocationDetails } from '../tools/get-location-details-tool';

const TravelChatbotAssistanceInputSchema = z.object({
  query: z.string().describe('The user query related to travel planning, booking, or support.'),
  context: z.string().optional().describe('A JSON string representing the current travel routes the user is viewing.'),
});
export type TravelChatbotAssistanceInput = z.infer<typeof TravelChatbotAssistanceInputSchema>;

const TravelChatbotAssistanceOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user query.'),
  suggestedReplies: z.array(z.string()).optional().describe('A list of 2-3 short, relevant follow-up questions the user might ask.'),
  bookingDetails: z.object({ 
    routeId: z.string().describe("The ID of the route to be saved."),
    confirmationMessage: z.string().describe("A friendly confirmation message for the user, e.g., 'I've saved your trip to Goa to your My Trips page!'")
  }).optional().describe("Details for saving a trip if the user confirms a booking/saving request."),
  displayData: z.object({
    image: z.string().optional().describe("A data URI for an image to display.")
  }).optional().describe("Optional structured data to be displayed in the UI along with the text response.")
});
export type TravelChatbotAssistanceOutput = z.infer<typeof TravelChatbotAssistanceOutputSchema>;

export async function travelChatbotAssistance(input: TravelChatbotAssistanceInput): Promise<TravelChatbotAssistanceOutput> {
  return travelChatbotAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'travelChatbotAssistancePrompt',
  input: {schema: TravelChatbotAssistanceInputSchema},
  output: {schema: TravelChatbotAssistanceOutputSchema},
  tools: [getLocationDetails],
  prompt: `You are a helpful and friendly travel assistant chatbot. Your primary goals are to help users plan trips, find travel options, and provide information about destinations.

- **Saving Trips**: If the user is viewing routes and asks to book or save one, identify the route 'id' from the context and populate the 'bookingDetails' field in your response. This action saves the trip for the user, it does not perform a real booking.
- **Destination Info**: If the user asks for things to do, see, or eat in a location (e.g., "tell me about Jaipur", "what's good to eat in Goa?"), use the \`getLocationDetails\` tool to get information. If the tool returns an image data URI in the 'imageDataUri' field, you must pass it through in the 'displayData.image' field of your final JSON response. Present the text information from the tool to the user in a friendly, conversational way.
- **Route Questions**: If the user asks about the routes they are currently viewing (provided in the context), use that data to answer their questions (e.g., "which is the fastest?", "compare the first two options").
- **General Conversation**: For any other questions, be a helpful travel assistant.
- **Suggestions**: Always provide 2-3 relevant follow-up questions in the 'suggestedReplies' field.

{{#if context}}
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
