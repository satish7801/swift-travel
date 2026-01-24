// Multi-Modal Route Generator
// Generates combined travel routes using multiple transport modes

import type { Route, Leg, TransportMode } from '@/lib/types';
import { resolveLocation, getDistance, estimateTravelTime, estimateFare } from './entity-resolver';
import { knowledgeGraph } from './knowledge-graph';
import { TRAIN_TYPES, TRAIN_CLASSES, generatePNR } from './train-classes';
import { AIRLINES } from './airlines';
import { BUS_OPERATORS } from './bus-operators';

/**
 * Generate a unique ID
 */
function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

/**
 * Format duration from minutes
 */
function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours >= 24) {
        const days = Math.floor(hours / 24);
        const remHours = hours % 24;
        return remHours > 0 ? `${days}d ${remHours}h` : `${days}d`;
    }
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Generate a single-mode route
 */
export function generateSingleModeRoute(
    from: string,
    to: string,
    date: Date,
    mode: TransportMode,
    classType?: string
): Route | null {
    const fromResolved = resolveLocation(from);
    const toResolved = resolveLocation(to);

    if (!fromResolved.city || !toResolved.city) return null;

    const distance = getDistance(from, to);
    if (!distance || distance < 20) return null;

    // Calculate realistic timing
    let durationMinutes: number;
    let operator: string;
    let details: string;
    let price: number;

    const hour = 6 + Math.floor(Math.random() * 16);
    const departure = new Date(date);
    departure.setHours(hour, Math.floor(Math.random() * 4) * 15, 0, 0);

    switch (mode) {
        case 'flight': {
            if (distance < 250 || !fromResolved.airport || !toResolved.airport) return null;
            durationMinutes = Math.round((distance / 700) * 60 + 90); // Flight time + airport procedures
            const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
            operator = airline.name;
            const flightNum = Math.floor(Math.random() * 9000) + 1000;
            details = `${airline.code}-${flightNum} | Economy`;
            price = estimateFare(distance, 'flight');
            break;
        }
        case 'train': {
            if (distance > 2500) return null;
            const trainType = TRAIN_TYPES[Math.floor(Math.random() * TRAIN_TYPES.length)];
            durationMinutes = Math.round((distance / trainType.avgSpeed) * 60);
            const trainNum = trainType.prefix + String(Math.floor(Math.random() * 900) + 100);
            operator = `${trainNum} ${trainType.name}`;
            const trainClass = classType || trainType.classes[Math.floor(Math.random() * trainType.classes.length)];
            const classInfo = TRAIN_CLASSES.find(c => c.code === trainClass);
            details = `${trainNum} | ${classInfo?.name || trainClass}`;
            price = estimateFare(distance, 'train', trainClass);
            break;
        }
        case 'bus': {
            if (distance > 1500) return null;
            const avgSpeed = 40 + Math.random() * 10;
            durationMinutes = Math.round((distance / avgSpeed) * 60);
            const busOp = BUS_OPERATORS[Math.floor(Math.random() * BUS_OPERATORS.length)];
            operator = busOp.shortName;
            const busTypes = ['AC Sleeper', 'AC Semi-Sleeper', 'Volvo Multi-Axle', 'Non-AC Sleeper'];
            const busType = classType || busTypes[Math.floor(Math.random() * busTypes.length)];
            details = busType;
            price = estimateFare(distance, 'bus', busType.includes('AC') ? 'AC' : 'Non-AC');
            break;
        }
    }

    const arrival = new Date(departure.getTime() + durationMinutes * 60 * 1000);

    // Location names
    const fromLoc = mode === 'flight'
        ? `${fromResolved.airport?.name || fromResolved.city.name + ' Airport'} (${fromResolved.airport?.code || 'N/A'})`
        : `${fromResolved.stations[0]?.name || fromResolved.city.name} (${fromResolved.stations[0]?.code || 'N/A'})`;

    const toLoc = mode === 'flight'
        ? `${toResolved.airport?.name || toResolved.city.name + ' Airport'} (${toResolved.airport?.code || 'N/A'})`
        : `${toResolved.stations[0]?.name || toResolved.city.name} (${toResolved.stations[0]?.code || 'N/A'})`;

    // Carbon footprint
    const carbonPerKm = mode === 'flight' ? 0.255 : mode === 'train' ? 0.041 : 0.089;

    return {
        id: generateId(),
        legs: [{
            id: generateId(),
            mode,
            departureLocation: fromLoc,
            arrivalLocation: toLoc,
            departureTime: departure.toISOString(),
            arrivalTime: arrival.toISOString(),
            duration: formatDuration(durationMinutes),
            operator,
            details,
        }],
        totalDuration: formatDuration(durationMinutes),
        price: Math.round(price / 10) * 10,
        availability: ['Available', 'Filling Fast', 'Few Seats Left'][Math.floor(Math.random() * 3)] as Route['availability'],
        carbonFootprint: Math.round(distance * carbonPerKm * 10) / 10,
    };
}

/**
 * Generate multi-modal route (e.g., train + bus for destinations without direct train)
 */
export function generateMultiModalRoute(
    from: string,
    to: string,
    date: Date
): Route | null {
    const fromResolved = resolveLocation(from);
    const toResolved = resolveLocation(to);

    if (!fromResolved.city || !toResolved.city) return null;

    // Check if destination needs multi-modal (no railway station)
    const needsMultiModal = toResolved.stations.length === 0;

    if (!needsMultiModal) {
        // Direct route is possible
        return null;
    }

    // Find nearest major station
    const nearestCity = knowledgeGraph.getNearestStation(toResolved.city.name);
    if (!nearestCity) return null;

    // Generate first leg (train/flight to nearest major station)
    const firstLeg = generateLegToCity(from, nearestCity, date, 'train');
    if (!firstLeg) return null;

    // Generate second leg (bus/taxi from station to destination)
    const secondLegDate = new Date(firstLeg.arrivalTime);
    secondLegDate.setHours(secondLegDate.getHours() + 2); // 2 hour layover

    const secondLeg = generateLegToCity(nearestCity, to, secondLegDate, 'bus');
    if (!secondLeg) return null;

    // Combine legs
    const arrivalTime = new Date(secondLeg.arrivalTime);
    const departureTime = new Date(firstLeg.departureTime);
    const totalMinutes = (arrivalTime.getTime() - departureTime.getTime()) / (1000 * 60);

    return {
        id: generateId(),
        legs: [firstLeg, secondLeg],
        totalDuration: formatDuration(totalMinutes),
        price: 0, // Will be calculated by summing leg prices
        availability: 'Available',
        carbonFootprint: 0, // Will be calculated
    };
}

/**
 * Helper to generate a single leg
 */
function generateLegToCity(from: string, to: string, date: Date, mode: TransportMode): Leg | null {
    const route = generateSingleModeRoute(from, to, date, mode);
    return route?.legs[0] || null;
}

/**
 * Generate multiple route options for a journey
 */
export function generateRouteOptions(
    from: string,
    to: string,
    date: Date,
    modes: TransportMode[] = ['flight', 'train', 'bus']
): Route[] {
    const routes: Route[] = [];

    // Generate direct routes for each mode
    for (const mode of modes) {
        const route = generateSingleModeRoute(from, to, date, mode);
        if (route) {
            routes.push(route);
        }
    }

    // Try multi-modal if no direct train/bus available
    const multiModal = generateMultiModalRoute(from, to, date);
    if (multiModal) {
        routes.push(multiModal);
    }

    // Sort by price
    routes.sort((a, b) => a.price - b.price);

    return routes;
}
