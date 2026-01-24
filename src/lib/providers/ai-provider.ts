// AI-based Transport Provider
// Uses Genkit/Gemini to generate realistic route data

import type { Route } from '@/lib/types';
import type { TransportProvider, SearchParams } from './transport-provider';
import {
    resolveLocation,
    getDistance,
    estimateTravelTime,
    estimateFare
} from '@/lib/data/entity-resolver';
import { AIRLINES, airlineByCode } from '@/lib/data/airlines';
import { BUS_OPERATORS } from '@/lib/data/bus-operators';
import { stationByCode } from '@/lib/data/stations';

/**
 * Generate a random flight number
 */
function generateFlightNumber(): string {
    const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `${airline.code}-${number}`;
}

/**
 * Generate a random train number and name
 */
function generateTrainDetails(): { number: string; name: string } {
    const trainTypes = [
        { prefix: '12', names: ['Rajdhani Express', 'Shatabdi Express', 'Duronto Express', 'Tejas Express', 'Vande Bharat Express'] },
        { prefix: '11', names: ['Superfast Express', 'Mail Express', 'Garib Rath'] },
        { prefix: '22', names: ['Superfast Express', 'Jan Shatabdi'] },
    ];

    const type = trainTypes[Math.floor(Math.random() * trainTypes.length)];
    const number = type.prefix + String(Math.floor(Math.random() * 900) + 100);
    const name = type.names[Math.floor(Math.random() * type.names.length)];

    return { number, name: `${number} ${name}` };
}

/**
 * Generate a random bus operator
 */
function generateBusDetails(): { operator: string; busType: string } {
    const operator = BUS_OPERATORS[Math.floor(Math.random() * BUS_OPERATORS.length)];
    const busTypes = ['AC Sleeper', 'AC Semi-Sleeper', 'Non-AC Sleeper', 'Volvo Multi-Axle', 'AC Seater'];
    const busType = busTypes[Math.floor(Math.random() * busTypes.length)];

    return { operator: operator.shortName, busType };
}

/**
 * Generate departure times spread throughout the day
 */
function generateDepartureTime(baseDate: Date, index: number): Date {
    const hours = [6, 7, 8, 10, 12, 14, 16, 18, 20, 22];
    const hour = hours[index % hours.length];
    const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45

    const departure = new Date(baseDate);
    departure.setHours(hour, minutes, 0, 0);
    return departure;
}

/**
 * Calculate arrival time based on departure and duration
 */
function calculateArrival(departure: Date, durationMinutes: number): Date {
    return new Date(departure.getTime() + durationMinutes * 60 * 1000);
}

/**
 * Format duration from minutes
 */
function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Generate unique ID
 */
function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

/**
 * AI-based provider that generates realistic routes
 */
export class AITransportProvider implements TransportProvider {
    name = 'ai';

    supportsMode(mode: 'flight' | 'train' | 'bus'): boolean {
        return true; // AI can generate all modes
    }

    async searchRoutes(params: SearchParams): Promise<Route[]> {
        const { from, to, date, modes = ['flight', 'train', 'bus'] } = params;

        // Resolve locations
        const fromResolved = resolveLocation(from);
        const toResolved = resolveLocation(to);

        if (!fromResolved.city || !toResolved.city) {
            return []; // Can't find locations
        }

        // Calculate distance
        const distance = getDistance(from, to);
        if (!distance || distance < 50) {
            return []; // Too close or can't calculate
        }

        const routes: Route[] = [];

        // Generate routes for each mode
        for (const mode of modes) {
            // Skip flight for short distances
            if (mode === 'flight' && distance < 300) continue;

            // Skip train/bus for very long distances (>2500km)
            if (mode !== 'flight' && distance > 2500) continue;

            const numRoutes = Math.min(3, Math.ceil(distance / 500) + 1);

            for (let i = 0; i < numRoutes; i++) {
                const route = this.generateRoute(
                    fromResolved,
                    toResolved,
                    date,
                    mode,
                    distance,
                    i
                );
                routes.push(route);
            }
        }

        // Sort by price
        routes.sort((a, b) => a.price - b.price);

        return routes;
    }

    private generateRoute(
        from: ReturnType<typeof resolveLocation>,
        to: ReturnType<typeof resolveLocation>,
        date: Date,
        mode: 'flight' | 'train' | 'bus',
        distance: number,
        index: number
    ): Route {
        const departure = generateDepartureTime(date, index);

        let durationMinutes: number;
        let operator: string;
        let details: string;
        let price: number;
        let classType: string;

        switch (mode) {
            case 'flight': {
                durationMinutes = Math.round((distance / 600 + 2) * 60); // Include airport time
                const flightNum = generateFlightNumber();
                const airline = airlineByCode.get(flightNum.split('-')[0]);
                operator = airline?.name || 'IndiGo';
                details = flightNum;
                classType = 'Economy';
                price = estimateFare(distance, 'flight');
                // Add some price variation
                price = Math.round(price * (0.8 + Math.random() * 0.4));
                break;
            }
            case 'train': {
                const avgSpeed = 55 + Math.random() * 25; // 55-80 km/h
                durationMinutes = Math.round((distance / avgSpeed) * 60);
                const train = generateTrainDetails();
                operator = train.name;
                details = train.number;
                const classes = ['3AC', '2AC', '1AC', 'SL'];
                classType = classes[index % classes.length];
                price = estimateFare(distance, 'train', classType);
                price = Math.round(price * (0.9 + Math.random() * 0.2));
                break;
            }
            case 'bus': {
                const avgSpeed = 35 + Math.random() * 15; // 35-50 km/h
                durationMinutes = Math.round((distance / avgSpeed) * 60);
                const bus = generateBusDetails();
                operator = bus.operator;
                details = bus.busType;
                classType = bus.busType.includes('AC') ? 'AC' : 'Non-AC';
                price = estimateFare(distance, 'bus', classType);
                price = Math.round(price * (0.85 + Math.random() * 0.3));
                break;
            }
        }

        const arrival = calculateArrival(departure, durationMinutes);

        // Get station/airport names
        const fromLocation = mode === 'flight'
            ? from.airport?.name || `${from.city?.name} Airport`
            : from.stations[0]?.name || from.city?.name || 'Unknown';

        const toLocation = mode === 'flight'
            ? to.airport?.name || `${to.city?.name} Airport`
            : to.stations[0]?.name || to.city?.name || 'Unknown';

        // Carbon footprint (kg CO2 per km per passenger)
        const carbonPerKm = mode === 'flight' ? 0.255 : mode === 'train' ? 0.041 : 0.089;
        const carbonFootprint = Math.round(distance * carbonPerKm * 10) / 10;

        // Availability
        const availabilities: Route['availability'][] = ['Available', 'Available', 'Filling Fast', 'Few Seats Left'];
        const availability = availabilities[Math.floor(Math.random() * availabilities.length)];

        return {
            id: generateId(),
            legs: [
                {
                    id: generateId(),
                    mode,
                    departureLocation: `${fromLocation} (${mode === 'flight' ? from.airport?.code : from.stations[0]?.code || 'N/A'})`,
                    arrivalLocation: `${toLocation} (${mode === 'flight' ? to.airport?.code : to.stations[0]?.code || 'N/A'})`,
                    departureTime: departure.toISOString(),
                    arrivalTime: arrival.toISOString(),
                    duration: formatDuration(durationMinutes),
                    operator,
                    details: `${details} | ${classType}`,
                },
            ],
            totalDuration: formatDuration(durationMinutes),
            price,
            availability,
            carbonFootprint,
        };
    }
}

// Export singleton instance
export const aiProvider = new AITransportProvider();
