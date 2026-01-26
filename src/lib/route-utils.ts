
import { CITIES, City } from '@/lib/data/cities';

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Find cities that fall roughly along the path between start and end
export function findCitiesOnRoute(startCityName: string, endCityName: string): City[] {
    const start = CITIES.find(c => c.name.toLowerCase() === startCityName.toLowerCase() || c.aliases.includes(startCityName.toLowerCase()));
    const end = CITIES.find(c => c.name.toLowerCase() === endCityName.toLowerCase() || c.aliases.includes(endCityName.toLowerCase()));

    if (!start || !end) return [];

    const totalDistance = calculateDistance(start.lat, start.lng, end.lat, end.lng);

    // Define a buffer distance (km) from the direct line
    const maxDetourKm = Math.min(totalDistance * 0.2, 150); // 20% of total distance or max 150km corridor

    return CITIES.filter(city => {
        // Exclude start and end cities
        if (city.name === start.name || city.name === end.name) return false;

        const distToStart = calculateDistance(start.lat, start.lng, city.lat, city.lng);
        const distToEnd = calculateDistance(city.lat, city.lng, end.lat, end.lng);

        // Check if city is "between" start and end (triangle inequality with buffer)
        // If distToStart + distToEnd approx equals totalDistance, it's on the path
        const detour = (distToStart + distToEnd) - totalDistance;

        return detour >= 0 && detour <= maxDetourKm;
    }).sort((a, b) => {
        // Sort by distance from start
        const distA = calculateDistance(start.lat, start.lng, a.lat, a.lng);
        const distB = calculateDistance(start.lat, start.lng, b.lat, b.lng);
        return distA - distB;
    }).slice(0, 5); // Return top 5 suggestions
}
