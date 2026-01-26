"use client";

import * as React from "react";
import { MapPin, Train, Plane, Bus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { CITIES, type City } from "@/lib/data/cities";
import { searchCities, type NominatimResult } from "@/lib/services/nominatim";
import { useDebounce } from "@/hooks/use-debounce"; // We might need to implement this or use a simple timeout


interface LocationAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onCitySelect?: (city: City) => void;
    placeholder?: string;
    className?: string;
}

export function LocationAutocomplete({
    value,
    onChange,
    onCitySelect,
    placeholder = "Enter city or station",
    className,
}: LocationAutocompleteProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [query, setQuery] = React.useState(value);
    const [suggestions, setSuggestions] = React.useState<City[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Simple debounce implementation inside component to avoid extra file dependency if not present
    const [debouncedQuery, setDebouncedQuery] = React.useState(query);

    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 500);
        return () => clearTimeout(timer);
    }, [query]);

    // Update query when external value changes
    React.useEffect(() => {
        setQuery(value);
    }, [value]);

    // Fetch cities based on query
    React.useEffect(() => {
        if (debouncedQuery.length < 2) {
            setSuggestions([]);
            return;
        }

        const fetchCities = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch from Nominatim (Restricted to India)
                const apiResults = await searchCities(debouncedQuery, "in");

                // 2. Map to City interface and enrich with static data if matched
                const mappedResults: City[] = apiResults.map((result) => {
                    const resultName = result.display_name.toLowerCase();
                    const stateName = result.address?.state || result.address?.country || '';

                    // Improved matching logic: Check if static city name is contained in the result name OR aliases are contained
                    const staticMatch = CITIES.find(c => {
                        const cName = c.name.toLowerCase();
                        return resultName.includes(cName) || c.aliases.some(alias => resultName.includes(alias.toLowerCase()));
                    });

                    const cityName = result.address?.city || result.address?.town || result.address?.village || result.display_name.split(',')[0];

                    if (staticMatch) {
                        return {
                            ...staticMatch,
                            lat: parseFloat(result.lat), // Prefer API coords
                            lng: parseFloat(result.lon)
                        };
                    }

                    return {
                        name: cityName || result.display_name,
                        aliases: [],
                        state: stateName,
                        stationCodes: [],
                        lat: parseFloat(result.lat),
                        lng: parseFloat(result.lon),
                        // Fallback generic image for unknown cities to maintain UI consistency
                        imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=400&auto=format&fit=crop"
                    };
                });

                // Remove duplicates based on name/state
                const uniqueResults = mappedResults.filter((v, i, a) => a.findIndex(t => (t.name === v.name && t.state === v.state)) === i);

                setSuggestions(uniqueResults);
            } catch (error) {
                console.error("Failed to fetch suggestions", error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCities();
    }, [debouncedQuery]);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (city: City) => {
        const displayValue = city.name;
        setQuery(displayValue);
        onChange(displayValue);
        onCitySelect?.(city);
        setIsOpen(false);
        inputRef.current?.blur();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setQuery(newValue);
        onChange(newValue);
        setIsOpen(true);
    };

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <Input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className={cn("pl-10 h-12 text-base", className)}
                    autoComplete="off"
                />
            </div>

            {/* Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                    <ul className="max-h-[300px] overflow-y-auto py-1">
                        {suggestions.map((city) => (
                            <li key={city.name}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(city)}
                                    className="w-full px-3 py-2.5 text-left hover:bg-accent/10 transition-colors flex items-start gap-3"
                                >
                                    {city.imageUrl ? (
                                        <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                            <img
                                                src={city.imageUrl}
                                                alt={city.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-16 w-16 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                                            <MapPin className="h-6 w-6 text-primary/40" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0 py-1">
                                        <div className="font-bold text-lg text-foreground flex items-center gap-2 leading-none mb-1">
                                            {city.name}
                                        </div>
                                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            {city.state}
                                        </div>
                                        <div className="text-sm text-muted-foreground truncate">
                                            {city.stationCodes.length > 0 && (
                                                <span className="ml-2">
                                                    <Train className="inline h-3 w-3 mr-0.5" />
                                                    {city.stationCodes[0]}
                                                </span>
                                            )}
                                            {city.airportCode && (
                                                <span className="ml-2">
                                                    <Plane className="inline h-3 w-3 mr-0.5" />
                                                    {city.airportCode}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Loading state */}
            {isOpen && isLoading && suggestions.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg p-3">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Searching places...</span>
                    </div>
                </div>
            )}

            {/* No results message */}
            {isOpen && !isLoading && debouncedQuery.length >= 2 && suggestions.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg p-3">
                    <p className="text-sm text-muted-foreground text-center">No locations found</p>
                </div>
            )}
        </div>
    );
}
