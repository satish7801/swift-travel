import { z } from "zod";

export const searchFormSchema = z.object({
  from: z.string().min(2, { message: "Please enter a departure location." }),
  to: z.string().min(2, { message: "Please enter a destination." }),
  date: z.date().optional(),
});

export type SearchFilters = z.infer<typeof searchFormSchema>;
