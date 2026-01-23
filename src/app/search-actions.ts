'use server';

import { generateRoutes } from '@/ai/flows/generate-routes-flow';
import type { SearchFilters } from '@/components/search-form';
import type { Route } from '@/lib/types';
import { z } from 'zod';

// This schema should match the one in search-form.tsx
const SearchFormSchema = z.object({
  from: z.string().min(2, { message: "Please enter a departure location." }),
  to: z.string().min(2, { message: "Please enter a destination." }),
  date: z.date().optional(),
});


export async function searchRoutesAction(filters: SearchFilters): Promise<Route[]> {
    const validatedFields = SearchFormSchema.safeParse(filters);
    
    if (!validatedFields.success) {
        // This will be caught by the try-catch block in the component
        throw new Error(validatedFields.error.errors[0].message);
    }
    
    const input = {
      from: validatedFields.data.from,
      to: validatedFields.data.to,
      // Format date for the AI flow
      date: validatedFields.data.date ? validatedFields.data.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    }

    try {
        const aiResponse = await generateRoutes(input);
        return aiResponse.routes;
    } catch (error) {
        console.error('Search action error:', error);
        // Re-throw a more user-friendly error
        throw new Error('An error occurred with the AI assistant while searching for routes. Please try again.');
    }
}
