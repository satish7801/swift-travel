
export interface NominatimResult {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    icon?: string;
    address?: {
        city?: string;
        town?: string;
        village?: string;
        state?: string;
        country?: string;
    };
}

export async function searchCities(query: string): Promise<NominatimResult[]> {
    if (!query || query.length < 2) return [];

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=10&featuretype=city`,
            {
                headers: {
                    'User-Agent': 'SwiftTravel/1.0' // Required by Nominatim policy
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch from Nominatim');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Nominatim search error:", error);
        return [];
    }
}
