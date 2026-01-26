
import { CITIES } from './data/cities';

interface TravelDetails {
    distanceKm: number;
    duration: string; // "2h 30m"
    mode: 'Flight' | 'Train' | 'Bus' | 'Car';
}

function toRad(value: number) {
    return (value * Math.PI) / 180;
}

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function formatDuration(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
}

export function estimateTravelDetails(fromCityName: string, toCityName: string): TravelDetails {
    const fromCity = CITIES.find(c => c.name.toLowerCase() === fromCityName.toLowerCase() || c.aliases.includes(fromCityName.toLowerCase()));
    const toCity = CITIES.find(c => c.name.toLowerCase() === toCityName.toLowerCase() || c.aliases.includes(toCityName.toLowerCase()));

    if (!fromCity || !toCity) {
        // Fallback if city not found in database
        return {
            distanceKm: 0,
            duration: "Travel time varies",
            mode: 'Train'
        };
    }

    const dist = calculateDistance(fromCity.lat, fromCity.lng, toCity.lat, toCity.lng);

    // Logic to select best mode and estimated time
    // Speeds are conservative averages including stops/traffic
    const SPEED_FLIGHT = 500; // km/h effective
    const SPEED_TRAIN = 50;   // km/h avg Indian railway speed
    const SPEED_ROAD = 45;    // km/h avg highway speed in India

    // Overhead times
    const OVERHEAD_FLIGHT = 2.5; // check-in, security, bag claim
    const OVERHEAD_TRAIN_BUS = 0.5; // buffer

    let mode: 'Flight' | 'Train' | 'Bus' | 'Car' = 'Train';
    let durationHours = 0;

    if (dist > 600) {
        // Prefer flight for long distances if airports exist is assumed for major cities
        // But for cost realism in typical Indian context, let's say > 800 is flight territory usually
        // Let's stick to a mixed logic:
        if (dist > 800) {
            mode = 'Flight';
            durationHours = (dist / SPEED_FLIGHT) + OVERHEAD_FLIGHT;
        } else {
            mode = 'Train';
            durationHours = (dist / SPEED_TRAIN) + OVERHEAD_TRAIN_BUS;
        }
    } else if (dist < 300) {
        mode = 'Car';
        durationHours = (dist / SPEED_ROAD) + OVERHEAD_TRAIN_BUS;
    } else {
        mode = 'Train';
        durationHours = (dist / SPEED_TRAIN) + OVERHEAD_TRAIN_BUS;
    }

    // Special case handling (e.g. Ahmedabad to Haridwar is ~1000km, usually train/flight)
    // The calculation logic handles it automatically.

    return {
        distanceKm: Math.round(dist),
        duration: formatDuration(durationHours),
        mode: mode
    };
}
