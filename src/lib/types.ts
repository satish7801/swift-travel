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
