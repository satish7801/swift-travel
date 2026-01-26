/**
 * @fileOverview This flow confirms the user's location choice using an LLM.
 *
 * - confirmLocationChoice - A function that confirms the location choice.
 * - ConfirmLocationChoiceInput - The input type for the confirmLocationChoice function.
 * - ConfirmLocationChoiceOutput - The return type for the confirmLocationChoice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ConfirmLocationChoiceInputSchema = z.object({
  locationName: z
    .string()
    .describe('The location name provided by the user.'),
  possibleLocations: z.array(z.string()).describe('A list of possible matching location names.'),
});
export type ConfirmLocationChoiceInput = z.infer<typeof ConfirmLocationChoiceInputSchema>;

const ConfirmLocationChoiceOutputSchema = z.object({
  isValidLocation: z
    .boolean()
    .describe('Whether the location name provided by the user is a valid location based on the possible locations.'),
  confirmedLocationName: z.string().optional().describe('The confirmed location name if it is valid.'),
});
export type ConfirmLocationChoiceOutput = z.infer<typeof ConfirmLocationChoiceOutputSchema>;

export async function confirmLocationChoice(input: ConfirmLocationChoiceInput): Promise<ConfirmLocationChoiceOutput> {
  return confirmLocationChoiceFlow(input);
}

const confirmLocationChoicePrompt = ai.definePrompt({
  name: 'confirmLocationChoicePrompt',
  input: { schema: ConfirmLocationChoiceInputSchema },
  output: { schema: ConfirmLocationChoiceOutputSchema },
  prompt: `You are a travel assistant. The user has provided a location name, {{{locationName}}}, and a list of possible matching locations, {{{possibleLocations}}}. Determine if the location name is valid, and if so, confirm the location name. Respond in JSON format.

If the location name is not valid, set isValidLocation to false, and do not set confirmedLocationName.

If the location name is valid, set isValidLocation to true and set confirmedLocationName to the confirmed location name from the list of possible locations.`,
});

const confirmLocationChoiceFlow = ai.defineFlow(
  {
    name: 'confirmLocationChoiceFlow',
    inputSchema: ConfirmLocationChoiceInputSchema,
    outputSchema: ConfirmLocationChoiceOutputSchema,
  },
  async input => {
    const { output } = await confirmLocationChoicePrompt(input);
    return output!;
  }
);
