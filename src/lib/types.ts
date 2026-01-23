import type { GenerateItineraryOutput } from "@/ai/flows/generate-itinerary-flow";
import type { GenerateItineraryOverviewOutput } from "@/ai/flows/generate-itinerary-overview-flow";

export type TransportMode = 'bus' | 'train' | 'flight';

export interface Leg {
  id: string;
  mode: TransportMode;
  departureLocation: string;
  arrivalLocation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string; // e.g., "2h 30m"
  operator: string;
  details: string; // e.g., "Indigo 6E-2048" or "VRL Travels"
}

export interface Route {
  id: string;
  legs: Leg[];
  totalDuration: string;
  price: number;
  availability: 'Available' | 'Filling Fast' | 'Few Seats Left' | 'Sold Out';
  carbonFootprint: number;
}

export interface UserProfile {
  displayName: string;
  email: string;
  photoURL: string;
  travelPreferences?: {
    preferredMode?: 'flight' | 'train' | 'bus' | 'any';
    budgetLevel?: 'budget' | 'mid-range' | 'luxury' | 'any';
  };
}

export interface SavedItinerary {
  id: string;
  city: string;
  title: string;
  summary: string;
  totalDays: number;
  itinerary: GenerateItineraryOutput;
  overview?: GenerateItineraryOverviewOutput;
  savedAt: {
    seconds: number;
    nanoseconds: number;
  } | Date;
}
