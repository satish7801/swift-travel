"use client";

import * as React from "react";
import { MapPin, Train, Plane, Bus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { CITIES, type City } from "@/lib/data/cities";

interface LocationAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function LocationAutocomplete({
    value,
    onChange,
    placeholder = "Enter city or station",
    className,
}: LocationAutocompleteProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [query, setQuery] = React.useState(value);
    const [suggestions, setSuggestions] = React.useState<City[]>([]);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Update query when external value changes
    React.useEffect(() => {
        setQuery(value);
    }, [value]);

    // Filter cities based on query
    React.useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        const normalizedQuery = query.toLowerCase();
        const matches = CITIES.filter((city) => {
            // Match by city name
            if (city.name.toLowerCase().includes(normalizedQuery)) return true;
            // Match by alias
            if (city.aliases.some((alias) => alias.toLowerCase().includes(normalizedQuery))) return true;
            // Match by station codes
            if (city.stationCodes.some((code) => code.toLowerCase().includes(normalizedQuery))) return true;
            // Match by airport code
            if (city.airportCode?.toLowerCase().includes(normalizedQuery)) return true;
            return false;
        }).slice(0, 8); // Limit to 8 suggestions

        setSuggestions(matches);
    }, [query]);

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
                                    <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-foreground">{city.name}</div>
                                        <div className="text-sm text-muted-foreground truncate">
                                            {city.state}
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

            {/* No results message */}
            {isOpen && query.length >= 2 && suggestions.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg p-3">
                    <p className="text-sm text-muted-foreground text-center">No locations found</p>
                </div>
            )}
        </div>
    );
}
