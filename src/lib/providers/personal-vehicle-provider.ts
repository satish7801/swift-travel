// Personal Vehicle (Car) Transport Provider
// Calculates driving routes based on distance and average speed

import type { Route } from '@/lib/types';
import type { TransportProvider, SearchParams } from './transport-provider';
import { resolveLocation, getDistance } from '@/lib/data/entity-resolver';

function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export class PersonalVehicleProvider implements TransportProvider {
    name = 'personal-vehicle';

    supportsMode(mode: 'flight' | 'train' | 'bus' | 'car'): boolean {
        return mode === 'car';
    }

    async searchRoutes(params: SearchParams): Promise<Route[]> {
        const { from, to, date, modes } = params;

        // Reset if 'car' is not requested
        if (modes && !modes.includes('car')) return [];

        // Resolve locations
        const fromResolved = resolveLocation(from);
        const toResolved = resolveLocation(to);

        if (!fromResolved.city || !toResolved.city) return [];

        // Calculate distance
        const distance = getDistance(from, to);
        if (!distance) return [];

        // 1. Fast Route (Highways)
        // Avg speed 70 km/h, Cost ₹6/km (Fuel + Tolls)
        const fastSpeed = 70;
        const fastDuration = Math.round((distance / fastSpeed) * 60);
        const fastCost = Math.round(distance * 6);
        const fastCarbon = Math.round(distance * 0.12 * 10) / 10; // ~120g/km

        const fastRoute: Route = {
            id: generateId(),
            legs: [{
                id: generateId(),
                mode: 'car',
                departureLocation: fromResolved.city.name,
                arrivalLocation: toResolved.city.name,
                departureTime: new Date(date.setHours(8, 0, 0, 0)).toISOString(), // Assume 8 AM start
                arrivalTime: new Date(date.getTime() + fastDuration * 60 * 1000).toISOString(),
                duration: formatDuration(fastDuration),
                operator: 'Personal Vehicle',
                details: 'Fastest Route via Highways',
            }],
            totalDuration: formatDuration(fastDuration),
            price: fastCost,
            availability: 'Available',
            carbonFootprint: fastCarbon
        };

        // 2. Scenic/Alt Route (only for longer trips)
        if (distance > 200) {
            // Avg speed 50 km/h, Cost ₹5/km
            const altSpeed = 50;
            const altDuration = Math.round((distance * 1.1 / altSpeed) * 60); // 10% longer distance
            const altCost = Math.round(distance * 1.1 * 5);
            const altCarbon = Math.round(distance * 1.1 * 0.12 * 10) / 10;

            const altRoute: Route = {
                id: generateId(),
                legs: [{
                    id: generateId(),
                    mode: 'car',
                    departureLocation: fromResolved.city.name,
                    arrivalLocation: toResolved.city.name,
                    departureTime: new Date(date.setHours(9, 0, 0, 0)).toISOString(),
                    arrivalTime: new Date(date.getTime() + altDuration * 60 * 1000).toISOString(),
                    duration: formatDuration(altDuration),
                    operator: 'Personal Vehicle',
                    details: 'Alternative/Scenic Route',
                }],
                totalDuration: formatDuration(altDuration),
                price: altCost,
                availability: 'Available',
                carbonFootprint: altCarbon
            };
            return [fastRoute, altRoute];
        }

        return [fastRoute];
    }
}

export const personalVehicleProvider = new PersonalVehicleProvider();
