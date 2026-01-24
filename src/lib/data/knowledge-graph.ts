// Knowledge Graph for Location Relationships
// Maps connections between cities, stations, and points of interest

import { CITIES, type City } from './cities';
import { STATIONS, type Station } from './stations';

export interface LocationNode {
    id: string;
    type: 'city' | 'station' | 'airport' | 'poi' | 'region';
    name: string;
    data: City | Station | { name: string };
}

export interface LocationEdge {
    from: string;
    to: string;
    relationship: 'SERVED_BY' | 'IS_NEAR' | 'HAS_ROUTE_TO' | 'IN_REGION' | 'NEAREST_STATION';
    weight?: number; // Distance in km or relevance score
}

// Build knowledge graph edges
const edges: LocationEdge[] = [];

// Build city-to-station relationships
CITIES.forEach(city => {
    city.stationCodes.forEach((code, index) => {
        edges.push({
            from: `city:${city.name.toLowerCase()}`,
            to: `station:${code}`,
            relationship: index === 0 ? 'SERVED_BY' : 'IS_NEAR',
            weight: index === 0 ? 0 : 10, // Primary station has 0 distance
        });
    });

    // Add airport relationship
    if (city.airportCode) {
        edges.push({
            from: `city:${city.name.toLowerCase()}`,
            to: `airport:${city.airportCode}`,
            relationship: 'SERVED_BY',
            weight: 0,
        });
    }
});

// Popular route relationships (direct connections)
const POPULAR_ROUTES: [string, string, number][] = [
    ['Delhi', 'Mumbai', 1400],
    ['Delhi', 'Jaipur', 280],
    ['Delhi', 'Agra', 230],
    ['Delhi', 'Chandigarh', 250],
    ['Delhi', 'Lucknow', 525],
    ['Delhi', 'Varanasi', 820],
    ['Delhi', 'Dehradun', 250],
    ['Delhi', 'Haridwar', 215],
    ['Mumbai', 'Pune', 150],
    ['Mumbai', 'Goa', 580],
    ['Mumbai', 'Ahmedabad', 530],
    ['Mumbai', 'Bengaluru', 985],
    ['Bengaluru', 'Chennai', 350],
    ['Bengaluru', 'Mysuru', 145],
    ['Bengaluru', 'Hyderabad', 570],
    ['Chennai', 'Coimbatore', 505],
    ['Chennai', 'Madurai', 460],
    ['Kolkata', 'Patna', 530],
    ['Kolkata', 'Guwahati', 990],
    ['Hyderabad', 'Vijayawada', 275],
    ['Kochi', 'Thiruvananthapuram', 220],
    ['Jaipur', 'Udaipur', 395],
    ['Jaipur', 'Jodhpur', 340],
];

POPULAR_ROUTES.forEach(([from, to, distance]) => {
    edges.push({
        from: `city:${from.toLowerCase()}`,
        to: `city:${to.toLowerCase()}`,
        relationship: 'HAS_ROUTE_TO',
        weight: distance,
    });
    // Bidirectional
    edges.push({
        from: `city:${to.toLowerCase()}`,
        to: `city:${from.toLowerCase()}`,
        relationship: 'HAS_ROUTE_TO',
        weight: distance,
    });
});

// Tourist destinations with nearest stations
const TOURIST_NEAREST_STATIONS: [string, string][] = [
    ['Coorg', 'Mysuru'],
    ['Munnar', 'Kochi'],
    ['Ooty', 'Coimbatore'],
    ['Manali', 'Chandigarh'],
    ['Leh', 'Jammu'], // Or fly directly
    ['Srinagar', 'Jammu'],
    ['Darjeeling', 'Kolkata'], // Via NJP
];

TOURIST_NEAREST_STATIONS.forEach(([tourist, nearest]) => {
    edges.push({
        from: `city:${tourist.toLowerCase()}`,
        to: `city:${nearest.toLowerCase()}`,
        relationship: 'NEAREST_STATION',
        weight: 100, // Approximate distance
    });
});

// Regional groupings
const REGIONS: Record<string, string[]> = {
    'north_india': ['Delhi', 'Jaipur', 'Agra', 'Lucknow', 'Varanasi', 'Chandigarh', 'Amritsar'],
    'south_india': ['Chennai', 'Bengaluru', 'Hyderabad', 'Kochi', 'Thiruvananthapuram', 'Coimbatore', 'Mysuru'],
    'west_india': ['Mumbai', 'Pune', 'Ahmedabad', 'Goa', 'Surat', 'Vadodara'],
    'east_india': ['Kolkata', 'Bhubaneswar', 'Patna', 'Ranchi', 'Guwahati'],
    'hill_stations': ['Shimla', 'Manali', 'Darjeeling', 'Ooty', 'Munnar'],
    'pilgrimage': ['Varanasi', 'Haridwar', 'Rishikesh', 'Tirupati', 'Puri', 'Amritsar'],
    'beach': ['Goa', 'Kochi', 'Visakhapatnam', 'Puri'],
};

Object.entries(REGIONS).forEach(([region, cities]) => {
    cities.forEach(city => {
        edges.push({
            from: `city:${city.toLowerCase()}`,
            to: `region:${region}`,
            relationship: 'IN_REGION',
        });
    });
});

export const knowledgeGraph = {
    edges,

    /**
     * Find all nodes connected to a given node
     */
    getConnections(nodeId: string): LocationEdge[] {
        return edges.filter(e => e.from === nodeId || e.to === nodeId);
    },

    /**
     * Find shortest path between two cities (for multi-modal routing)
     */
    findRoute(fromCity: string, toCity: string): string[] | null {
        const from = `city:${fromCity.toLowerCase()}`;
        const to = `city:${toCity.toLowerCase()}`;

        // Simple BFS for now
        const visited = new Set<string>();
        const queue: { node: string; path: string[] }[] = [{ node: from, path: [from] }];

        while (queue.length > 0) {
            const { node, path } = queue.shift()!;

            if (node === to) {
                return path;
            }

            if (visited.has(node)) continue;
            visited.add(node);

            const connections = edges.filter(e => e.from === node && e.relationship === 'HAS_ROUTE_TO');
            for (const conn of connections) {
                if (!visited.has(conn.to)) {
                    queue.push({ node: conn.to, path: [...path, conn.to] });
                }
            }
        }

        return null;
    },

    /**
     * Get cities in a region
     */
    getCitiesInRegion(region: string): string[] {
        return REGIONS[region] || [];
    },

    /**
     * Get regions for a city
     */
    getRegionsForCity(city: string): string[] {
        return edges
            .filter(e => e.from === `city:${city.toLowerCase()}` && e.relationship === 'IN_REGION')
            .map(e => e.to.replace('region:', ''));
    },

    /**
     * Find nearest major station for a tourist destination
     */
    getNearestStation(city: string): string | null {
        const edge = edges.find(
            e => e.from === `city:${city.toLowerCase()}` && e.relationship === 'NEAREST_STATION'
        );
        return edge ? edge.to.replace('city:', '') : null;
    },
};
