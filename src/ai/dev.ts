import { config } from 'dotenv';
config();

import '@/ai/flows/travel-chatbot-assistance.ts';
import '@/ai/flows/confirm-location-choice.ts';
import '@/ai/flows/generate-routes-flow.ts';
import '@/ai/flows/find-locations-flow.ts';
import '@/ai/flows/generate-trip-video-flow.ts';
import '@/ai/tools/get-location-details-tool.ts';
import '@/ai/flows/find-attractions-flow.ts';
import '@/ai/flows/generate-itinerary-flow.ts';
