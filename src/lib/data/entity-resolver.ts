// Entity Resolver Service
// Resolves user queries (natural language) to structured station/city codes

import { STATIONS, stationByCode, stationsByCity, type Station } from './stations';
import { CITIES, cityByName, type City } from './cities';
import { AIRPORTS, airportByCode, type Airport } from './airlines';

export interface ResolvedLocation {
    query: string;
    city?: City;
    stations: Station[];
    airport?: Airport;
    confidence: number;
    suggestions?: string[];
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

/**
 * Calculate similarity score (0-1) between two strings
 */
function similarity(a: string, b: string): number {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();

    if (aLower === bLower) return 1;
    if (aLower.includes(bLower) || bLower.includes(aLower)) return 0.9;

    const maxLen = Math.max(aLower.length, bLower.length);
    if (maxLen === 0) return 1;

    const distance = levenshteinDistance(aLower, bLower);
    return 1 - distance / maxLen;
}

/**
 * Resolve a user query to a structured location
 */
export function resolveLocation(query: string): ResolvedLocation {
    const normalizedQuery = query.toLowerCase().trim();

    // 1. Exact match on station code
    const stationCode = normalizedQuery.toUpperCase();
    if (stationByCode.has(stationCode)) {
        const station = stationByCode.get(stationCode)!;
        const city = cityByName.get(station.city.toLowerCase());
        return {
            query,
            city,
            stations: [station],
            airport: city?.airportCode ? airportByCode.get(city.airportCode) : undefined,
            confidence: 1.0,
        };
    }

    // 2. Exact match on city name or alias
    if (cityByName.has(normalizedQuery)) {
        const city = cityByName.get(normalizedQuery)!;
        const stations = city.stationCodes
            .map(code => stationByCode.get(code))
            .filter((s): s is Station => s !== undefined);

        return {
            query,
            city,
            stations,
            airport: city.airportCode ? airportByCode.get(city.airportCode) : undefined,
            confidence: 1.0,
        };
    }

    // 3. Fuzzy match on city names and aliases
    let bestMatch: { city: City; score: number } | null = null;

    for (const city of CITIES) {
        // Check city name
        let score = similarity(normalizedQuery, city.name.toLowerCase());
        if (score > (bestMatch?.score || 0.5)) {
            bestMatch = { city, score };
        }

        // Check aliases
        for (const alias of city.aliases) {
            score = similarity(normalizedQuery, alias);
            if (score > (bestMatch?.score || 0.5)) {
                bestMatch = { city, score };
            }
        }
    }

    // 4. Fuzzy match on station names
    let bestStationMatch: { station: Station; score: number } | null = null;

    for (const station of STATIONS) {
        const score = similarity(normalizedQuery, station.name.toLowerCase());
        if (score > (bestStationMatch?.score || 0.5)) {
            bestStationMatch = { station, score };
        }
    }

    // Determine best result
    if (bestMatch && (!bestStationMatch || bestMatch.score >= bestStationMatch.score)) {
        const city = bestMatch.city;
        const stations = city.stationCodes
            .map(code => stationByCode.get(code))
            .filter((s): s is Station => s !== undefined);

        return {
            query,
            city,
            stations,
            airport: city.airportCode ? airportByCode.get(city.airportCode) : undefined,
            confidence: bestMatch.score,
            suggestions: bestMatch.score < 0.8
                ? getSuggestions(normalizedQuery)
                : undefined,
        };
    }

    if (bestStationMatch) {
        const station = bestStationMatch.station;
        const city = cityByName.get(station.city.toLowerCase());

        return {
            query,
            city,
            stations: [station],
            airport: city?.airportCode ? airportByCode.get(city.airportCode) : undefined,
            confidence: bestStationMatch.score,
            suggestions: bestStationMatch.score < 0.8
                ? getSuggestions(normalizedQuery)
                : undefined,
        };
    }

    // No match found
    return {
        query,
        stations: [],
        confidence: 0,
        suggestions: getSuggestions(normalizedQuery),
    };
}

/**
 * Get suggestions for a query that didn't match well
 */
function getSuggestions(query: string): string[] {
    const suggestions: { name: string; score: number }[] = [];

    for (const city of CITIES) {
        const score = similarity(query, city.name.toLowerCase());
        if (score > 0.3) {
            suggestions.push({ name: city.name, score });
        }
    }

    suggestions.sort((a, b) => b.score - a.score);
    return suggestions.slice(0, 5).map(s => s.name);
}

/**
 * Get the primary station code for a location query
 */
export function getPrimaryStationCode(query: string): string | null {
    const resolved = resolveLocation(query);
    if (resolved.stations.length > 0) {
        return resolved.stations[0].code;
    }
    return null;
}

/**
 * Get the airport code for a location query
 */
export function getAirportCode(query: string): string | null {
    const resolved = resolveLocation(query);
    return resolved.airport?.code || null;
}

/**
 * Get distance between two locations (in km, straight-line)
 */
export function getDistance(from: string, to: string): number | null {
    const fromResolved = resolveLocation(from);
    const toResolved = resolveLocation(to);

    const fromStation = fromResolved.stations[0];
    const toStation = toResolved.stations[0];

    if (!fromStation?.lat || !fromStation?.lng || !toStation?.lat || !toStation?.lng) {
        return null;
    }

    // Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (toStation.lat - fromStation.lat) * Math.PI / 180;
    const dLng = (toStation.lng - fromStation.lng) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(fromStation.lat * Math.PI / 180) * Math.cos(toStation.lat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
}

/**
 * Estimate travel time based on distance and mode
 */
export function estimateTravelTime(distanceKm: number, mode: 'flight' | 'train' | 'bus'): string {
    let hours: number;

    switch (mode) {
        case 'flight':
            // ~500-700 km/h cruising + 2h for airport procedures
            hours = distanceKm / 600 + 2;
            break;
        case 'train':
            // ~50-80 km/h average for Indian trains
            hours = distanceKm / 60;
            break;
        case 'bus':
            // ~35-50 km/h average
            hours = distanceKm / 40;
            break;
    }

    if (hours < 1) {
        return `${Math.round(hours * 60)}m`;
    } else if (hours < 24) {
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    } else {
        const days = Math.floor(hours / 24);
        const remainingHours = Math.round(hours % 24);
        return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
    }
}

/**
 * Estimate fare based on distance and mode
 */
export function estimateFare(distanceKm: number, mode: 'flight' | 'train' | 'bus', classType?: string): number {
    let baseRate: number;

    switch (mode) {
        case 'flight':
            // Base ₹2000-3000 + ₹3-5 per km
            baseRate = 2500 + distanceKm * 4;
            break;
        case 'train':
            // ₹0.5-2 per km depending on class
            if (classType === '1AC' || classType === '1A') {
                baseRate = distanceKm * 2.5;
            } else if (classType === '2AC' || classType === '2A') {
                baseRate = distanceKm * 1.5;
            } else if (classType === '3AC' || classType === '3A') {
                baseRate = distanceKm * 1;
            } else if (classType === 'SL') {
                baseRate = distanceKm * 0.5;
            } else {
                baseRate = distanceKm * 1; // Default to 3AC
            }
            baseRate = Math.max(baseRate, 150); // Minimum fare
            break;
        case 'bus':
            // ₹1-2 per km
            if (classType === 'AC' || classType === 'Volvo') {
                baseRate = distanceKm * 2;
            } else if (classType === 'Sleeper') {
                baseRate = distanceKm * 1.5;
            } else {
                baseRate = distanceKm * 1;
            }
            baseRate = Math.max(baseRate, 100); // Minimum fare
            break;
    }

    // Round to nearest 10
    return Math.round(baseRate / 10) * 10;
}
