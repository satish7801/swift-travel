export const indianCities: string[] = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai",
    "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur",
    "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad",
    "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik",
    "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivali", "Vasai-Virar",
    "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar",
    "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore",
    "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur",
    "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli-Dharwad",
    "Bareilly", "Moradabad", "Mysore", "Gurgaon", "Aligarh", "Jalandhar",
    "Tiruchirappalli", "Bhubaneswar", "Salem", "Mira-Bhayandar",
    "Thiruvananthapuram", "Bhiwandi", "Saharanpur", "Gorakhpur", "Guntur",
    "Bikaner", "Amravati", "Noida", "Jamshedpur", "Bhilai", "Warangal",
    "Cuttack", "Firozabad", "Kochi", "Goa"
];

/**
 * Searches for locations in a mock database.
 * In a real app, this would call a geolocation API.
 * @param query The search query.
 * @returns An array of matching location names.
 */
export function searchLocations(query: string): string[] {
    if (!query) return [];

    const lowerCaseQuery = query.toLowerCase();
    
    // Prioritize exact matches
    const exactMatches = indianCities.filter(city => city.toLowerCase() === lowerCaseQuery);
    if (exactMatches.length > 0) {
        return exactMatches;
    }

    // Find partial matches
    const partialMatches = indianCities.filter(city => city.toLowerCase().includes(lowerCaseQuery));

    // Return up to 5 matches
    return partialMatches.slice(0, 5);
}
