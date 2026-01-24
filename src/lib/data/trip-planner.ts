// Nearby places and feasibility checker utilities
import { CITIES, type City } from './cities';

export interface NearbyPlace {
    city: City;
    distance: number;
    travelTime: string;
}

export interface FeasibilityResult {
    feasible: boolean;
    warnings: string[];
    suggestions: string[];
    optimizedOrder?: string[];
    totalDistance: number;
    estimatedDays: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function estimateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Get nearby cities within a radius
 */
export function getNearbyPlaces(cityName: string, radiusKm: number = 300): NearbyPlace[] {
    const sourceCity = CITIES.find(c =>
        c.name.toLowerCase() === cityName.toLowerCase() ||
        c.aliases.some(a => a.toLowerCase() === cityName.toLowerCase())
    );

    if (!sourceCity) return [];

    const nearby: NearbyPlace[] = [];

    for (const city of CITIES) {
        if (city.name === sourceCity.name) continue;

        const distance = estimateDistance(
            sourceCity.lat,
            sourceCity.lng,
            city.lat,
            city.lng
        );

        if (distance <= radiusKm) {
            const hours = Math.ceil(distance / 60); // ~60km/h average
            nearby.push({
                city,
                distance: Math.round(distance),
                travelTime: hours >= 24 ? `${Math.ceil(hours / 24)}d` : `${hours}h`,
            });
        }
    }

    return nearby.sort((a, b) => a.distance - b.distance).slice(0, 10);
}

/**
 * Check if a multi-city trip is feasible
 */
export function checkFeasibility(
    cities: string[],
    startDate: Date,
    endDate: Date
): FeasibilityResult {
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let totalDistance = 0;

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (totalDays < 1) {
        warnings.push('End date must be after start date');
        return { feasible: false, warnings, suggestions, totalDistance: 0, estimatedDays: 0 };
    }

    // Calculate distances between consecutive cities
    const cityObjects = cities.map(name =>
        CITIES.find(c =>
            c.name.toLowerCase() === name.toLowerCase() ||
            c.aliases.some(a => a.toLowerCase() === name.toLowerCase())
        )
    ).filter(Boolean) as City[];

    if (cityObjects.length < cities.length) {
        warnings.push('Some cities could not be found in our database');
    }

    for (let i = 0; i < cityObjects.length - 1; i++) {
        const from = cityObjects[i];
        const to = cityObjects[i + 1];

        const distance = estimateDistance(from.lat, from.lng, to.lat, to.lng);
        totalDistance += distance;

        // Check if distance is very far (>1000km)
        if (distance > 1000) {
            suggestions.push(`${from.name} to ${to.name} is ${Math.round(distance)}km - consider flying`);
        }
    }

    // Estimate minimum days needed (1 day per city + travel time)
    const travelDays = Math.ceil(totalDistance / 500); // ~500km per travel day
    const minDays = cities.length + travelDays;
    const estimatedDays = Math.max(minDays, cities.length * 2);

    if (totalDays < minDays) {
        warnings.push(`Trip may be too rushed. Recommended: at least ${minDays} days for ${cities.length} cities`);
    }

    if (cities.length > 5 && totalDays < 10) {
        warnings.push('Too many cities for the available time. Consider removing some stops.');
    }

    // Suggest optimal order based on geography
    const optimizedOrder = optimizeRouteOrder(cityObjects);
    if (optimizedOrder.join(',') !== cities.join(',')) {
        suggestions.push('We found a better route order to minimize travel time');
    }

    return {
        feasible: warnings.length === 0,
        warnings,
        suggestions,
        optimizedOrder,
        totalDistance: Math.round(totalDistance),
        estimatedDays,
    };
}

/**
 * Simple greedy algorithm to optimize route order
 */
function optimizeRouteOrder(cities: City[]): string[] {
    if (cities.length <= 2) return cities.map(c => c.name);

    const result: City[] = [cities[0]]; // Start with first city
    const remaining = cities.slice(1);

    while (remaining.length > 0) {
        const current = result[result.length - 1];
        let nearestIdx = 0;
        let nearestDist = Infinity;

        for (let i = 0; i < remaining.length; i++) {
            const dist = estimateDistance(
                current.lat,
                current.lng,
                remaining[i].lat,
                remaining[i].lng
            );
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestIdx = i;
            }
        }

        result.push(remaining[nearestIdx]);
        remaining.splice(nearestIdx, 1);
    }

    return result.map(c => c.name);
}

/**
 * Get popular destinations for a region
 */
export function getPopularDestinations(region?: string): City[] {
    const popular = ['Mumbai', 'Delhi', 'Goa', 'Jaipur', 'Kerala', 'Agra', 'Varanasi', 'Bangalore'];
    return popular
        .map(name => CITIES.find(c => c.name === name))
        .filter(Boolean) as City[];
}
