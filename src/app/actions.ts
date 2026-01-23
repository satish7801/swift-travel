'use server';

import { travelChatbotAssistance } from '@/ai/flows/travel-chatbot-assistance';
import { z } from 'zod';

export type ChatState = {
  messages: {
    role: 'user' | 'assistant' | 'system' | 'error';
    content: string;
    id: number;
    suggestedReplies?: string[];
    bookingDetails?: {
        routeId: string;
        confirmationMessage: string;
    }
  }[];
};

const QuerySchema = z.object({
  query: z.string().min(1, 'Please enter a message.'),
});

export async function askChatbot(state: ChatState, formData: FormData): Promise<ChatState> {
  const rawQuery = formData.get('query');
  const validatedFields = QuerySchema.safeParse({ query: rawQuery });
  const searchContext = formData.get('searchContext') as (string | null);

  const currentMessages = state.messages || [];

  if (!validatedFields.success) {
    return {
      messages: [
        ...currentMessages,
        {
          role: 'error' as const,
          content: validatedFields.error.errors[0].message,
          id: Date.now(),
        },
      ],
    };
  }

  const userMessage = {
    role: 'user' as const,
    content: validatedFields.data.query,
    id: Date.now(),
  };

  try {
    const aiResponse = await travelChatbotAssistance({
      query: validatedFields.data.query,
      context: searchContext ?? undefined,
    });
    
    return {
      messages: [
        ...currentMessages,
        userMessage,
        {
          role: 'assistant' as const,
          content: aiResponse.response,
          id: Date.now() + 1,
          suggestedReplies: aiResponse.suggestedReplies,
          bookingDetails: aiResponse.bookingDetails,
        },
      ],
    };
  } catch (error) {
    console.error('Chatbot error:', error);
    return {
      messages: [
        ...currentMessages,
        userMessage,
        {
          role: 'error' as const,
          content: 'An error occurred with the AI assistant. Please try again later.',
          id: Date.now() + 1,
        },
      ],
    };
  }
}
