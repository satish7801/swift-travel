"use client";

import * as React from 'react';
import { Plus, Trash2, GripVertical, MapPin, Calendar, Search, Loader2, ArrowDown, Sparkles, Clock, Map } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { LocationAutocomplete } from '@/components/ui/location-autocomplete';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { createMultiCityItinerary } from './actions';
import { estimateDistance } from '@/lib/data/trip-planner';
import { CITIES } from '@/lib/data/cities';
import { findCitiesOnRoute } from '@/lib/route-utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface Stop {
    id: string;
    location: string;
    date: Date | undefined;
    period?: string; // 'Morning' | 'Afternoon' | 'Evening' | 'Night'
    selectedAttractions?: string[];
}

export default function MultiStopTripPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [stops, setStops] = React.useState<Stop[]>([
        { id: '1', location: '', date: new Date() },
        { id: '2', location: '', date: undefined },
    ]);
    const [isSearching, setIsSearching] = React.useState(false);

    const addStop = () => {
        const newStop: Stop = {
            id: Date.now().toString(),
            location: '',
            date: undefined,
        };
        // Append new stop at the end
        setStops([...stops, newStop]);
    };

    const removeStop = (id: string) => {
        if (stops.length <= 2) {
            toast({ variant: 'destructive', title: 'Minimum 2 stops required.' });
            return;
        }
        setStops(stops.filter(stop => stop.id !== id));
    };

    const updateStop = (id: string, field: keyof Stop, value: any) => {
        setStops(stops.map(stop =>
            stop.id === id ? { ...stop, [field]: value } : stop
        ));
    };

    const autoFillDates = (currentStops: Stop[]) => {
        const filledStops = currentStops.map(s => ({ ...s })); // Deep copy safe enough for this structure except date object

        // Ensure start date exists
        if (!filledStops[0].date) {
            filledStops[0].date = new Date();
        }

        for (let i = 0; i < filledStops.length - 1; i++) {
            const current = filledStops[i];
            const next = filledStops[i + 1];

            // If next date is missing, calculate it
            if (current.date && !next.date && current.location && next.location) {
                // Find cities to calculate distance
                const city1 = CITIES.find(c => c.name.toLowerCase() === current.location.toLowerCase() || c.aliases.includes(current.location.toLowerCase()));
                const city2 = CITIES.find(c => c.name.toLowerCase() === next.location.toLowerCase() || c.aliases.includes(next.location.toLowerCase()));

                let travelDays = 0;
                let stayDays = 2; // Default stay assumption

                if (city1 && city2) {
                    const dist = estimateDistance(city1.lat, city1.lng, city2.lat, city2.lng);
                    // Approx 800km/day reasonable for mixed transport
                    travelDays = Math.ceil(dist / 800);
                }

                // Smart Duration Logic: If user selected many attractions, increase stay
                if (current.selectedAttractions && current.selectedAttractions.length > 2) {
                    stayDays += 1; // Add extra day for detailed exploration
                }

                const nextDate = new Date(current.date);
                // Add stay duration + travel time to previous date
                nextDate.setDate(nextDate.getDate() + stayDays + Math.max(1, travelDays));
                next.date = nextDate;
            }
        }
        return filledStops;
    };

    const toggleAttraction = (stopId: string, attraction: string) => {
        setStops(stops.map(stop => {
            if (stop.id === stopId) {
                const current = stop.selectedAttractions || [];
                const isSelected = current.includes(attraction);
                const newSelection = isSelected
                    ? current.filter(a => a !== attraction)
                    : [...current, attraction];

                return { ...stop, selectedAttractions: newSelection };
            }
            return stop;
        }));
    };

    const handleSearch = async () => {
        const emptyStops = stops.filter(s => !s.location.trim());
        if (emptyStops.length > 0) {
            toast({ variant: 'destructive', title: 'Please fill in all locations.' });
            return;
        }

        setIsSearching(true);

        try {
            // 1. Auto-fill dates
            const filledStops = autoFillDates(stops);
            setStops(filledStops); // Show user the calculated dates

            // 2. Simulate processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 3. Create Itinerary
            const result = await createMultiCityItinerary(filledStops);

            if (result.success && result.id) {
                toast({ title: 'Trip Planned!', description: 'Redirecting to your itinerary...' });
                // Redirect to plans page instead of planner
                router.push(`/plans/${result.id}`);
            } else {
                toast({ variant: 'destructive', title: 'Failed to create itinerary', description: result.error || 'Please try again.' });
            }
        } catch (error: any) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to plan trip. Please try again.' });
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <main className="flex-1">
            {/* Header */}
            <section className="relative py-12 md:py-16 overflow-hidden">
                <div className="container mx-auto px-4 relative">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">Multi-City Trip</h1>
                            <p className="text-muted-foreground">Plan a trip with multiple stops</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="container mx-auto px-4 pb-12">
                <div className="max-w-3xl mx-auto">
                    {/* Trip Builder Card */}
                    <div className="card-premium p-6 md:p-8 mb-8">
                        <div className="space-y-6">
                            {stops.map((stop, index) => (
                                <div key={stop.id} className="relative">
                                    {/* Smart Route Suggestions - Render BEFORE the current card so it appears "on the way" */}
                                    {index > 0 && stops[index - 1].location && stop.location && (
                                        <div className="mb-6 ml-14 relative z-10">
                                            {(() => {
                                                const suggestions = findCitiesOnRoute(stops[index - 1].location, stop.location);
                                                const filteredSuggestions = suggestions.filter(s => !stops.some(existing => existing.location.toLowerCase() === s.name.toLowerCase()));

                                                if (filteredSuggestions.length === 0) return null;

                                                return (
                                                    <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-3">
                                                        <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
                                                            <Map className="h-3 w-3" />
                                                            Places to visit from {stops[index - 1].location} to {stop.location}:
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {filteredSuggestions.map(city => (
                                                                <Badge
                                                                    key={city.name}
                                                                    variant="secondary"
                                                                    className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                                                    onClick={() => {
                                                                        const newStop: Stop = {
                                                                            id: Date.now().toString(),
                                                                            location: city.name,
                                                                            date: undefined
                                                                        };
                                                                        const newStops = [...stops];
                                                                        newStops.splice(index, 0, newStop);
                                                                        setStops(newStops);
                                                                    }}
                                                                >
                                                                    <Plus className="h-3 w-3 mr-1" />
                                                                    {city.name}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}

                                    {/* Connection line */}
                                    {index < stops.length - 1 && (
                                        <div className="absolute left-5 top-16 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent" />
                                    )}

                                    <div className="flex items-start gap-4">
                                        {/* Step indicator */}
                                        <div className="flex flex-col items-center shrink-0">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-lg text-sm",
                                                index === 0 ? "bg-emerald-500" :
                                                    index === stops.length - 1 ? "bg-rose-500" :
                                                        "bg-gradient-to-br from-primary to-accent"
                                            )}>
                                                {index + 1}
                                            </div>
                                            {index < stops.length - 1 && (
                                                <ArrowDown className="h-4 w-4 text-muted-foreground mt-2" />
                                            )}
                                        </div>

                                        {/* Stop details */}
                                        <div className="flex-1 bg-muted/30 rounded-xl p-4 border border-border/50">
                                            <div className="text-xs font-medium text-muted-foreground mb-3">
                                                {index === 0 ? '🚀 Starting Point' :
                                                    index === stops.length - 1 ? '🏁 Final Destination' :
                                                        `📍 Stop ${index}`}
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                                        Location
                                                    </label>
                                                    <LocationAutocomplete
                                                        value={stop.location}
                                                        onChange={(value) => updateStop(stop.id, 'location', value)}
                                                        placeholder="Enter city"
                                                    />
                                                </div>

                                                <div>
                                                </div>

                                                <div>
                                                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                                        {index === 0 ? 'Departure' : 'Arrival'} Time
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "flex-1 justify-start text-left font-normal h-12",
                                                                        !stop.date && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    <Calendar className="mr-2 h-4 w-4" />
                                                                    {stop.date ? format(stop.date, "MMM d") : "Date"}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0">
                                                                <CalendarComponent
                                                                    mode="single"
                                                                    selected={stop.date}
                                                                    onSelect={(date) => updateStop(stop.id, 'date', date)}
                                                                    disabled={(date) => date < new Date()}
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>

                                                        <Select
                                                            value={stop.period}
                                                            onValueChange={(value) => updateStop(stop.id, 'period', value)}
                                                        >
                                                            <SelectTrigger className="w-[110px] h-12">
                                                                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                                                                <SelectValue placeholder="Time" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Morning">Morning</SelectItem>
                                                                <SelectItem value="Afternoon">Afternoon</SelectItem>
                                                                <SelectItem value="Evening">Evening</SelectItem>
                                                                <SelectItem value="Night">Night</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* City Attractions Preview */}
                                            {stop.location && (() => {
                                                const cityData = CITIES.find(c => c.name.toLowerCase() === stop.location.toLowerCase() || c.aliases.includes(stop.location.toLowerCase()));
                                                if (cityData?.attractions && cityData.attractions.length > 0) {
                                                    return (
                                                        <div className="mt-3 pt-3 border-t border-border/50">
                                                            <div className="flex items-start gap-2">
                                                                <Sparkles className="h-3 w-3 text-amber-500 mt-1 shrink-0" />
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between mb-1.5">
                                                                        <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Famous Spots</p>
                                                                        <a
                                                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.location)}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-[10px] flex items-center gap-1 text-blue-500 hover:underline"
                                                                        >
                                                                            View on Map <MapPin className="h-3 w-3" />
                                                                        </a>
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {cityData.attractions.slice(0, 6).map(attr => {
                                                                            const isSelected = stop.selectedAttractions?.includes(attr);
                                                                            return (
                                                                                <Badge
                                                                                    key={attr}
                                                                                    variant={isSelected ? "default" : "outline"}
                                                                                    className={cn(
                                                                                        "cursor-pointer transition-all text-[10px]",
                                                                                        isSelected
                                                                                            ? "bg-amber-500 hover:bg-amber-600 text-white border-transparent"
                                                                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground border-dashed"
                                                                                    )}
                                                                                    onClick={() => toggleAttraction(stop.id, attr)}
                                                                                >
                                                                                    {attr} {isSelected && "✓"}
                                                                                </Badge>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                    {stop.selectedAttractions && stop.selectedAttractions.length > 2 && (
                                                                        <p className="text-[10px] text-amber-600 mt-1.5 italic">
                                                                            * Enhanced stay duration added for detailed visit.
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </div>

                                        {/* Remove button - Consistent layout */}
                                        <div className="flex flex-col justify-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={cn(
                                                    "text-muted-foreground hover:text-destructive shrink-0",
                                                    (index === 0 || stops.length <= 2) && "opacity-20 pointer-events-none" // 2 stops minimum
                                                )}
                                                onClick={() => removeStop(stop.id)}
                                                disabled={index === 0 || stops.length <= 2}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>


                                </div>
                            ))}

                            {/* Add Stop Button */}
                            <div className="flex justify-center py-4">
                                <Button
                                    variant="outline"
                                    onClick={addStop}
                                    className="border-dashed border-2 hover:border-primary hover:text-primary"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Stop
                                </Button>
                            </div>

                            {/* Search Button */}
                            <Button
                                size="lg"
                                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold shadow-lg"
                                onClick={handleSearch}
                                disabled={isSearching}
                            >
                                {isSearching ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Searching Routes...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5 mr-2" />
                                        Find Best Routes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Trip Summary */}
                    <div className="card-premium p-6">
                        <h2 className="font-semibold mb-4">Trip Summary</h2>
                        <div className="text-center py-8">
                            {stops.filter(s => s.location).length >= 2 ? (
                                <div className="space-y-3">
                                    <p className="text-lg font-medium">
                                        {stops.filter(s => s.location).map((s, i) => (
                                            <span key={s.id}>
                                                {i > 0 && <span className="text-primary mx-2">→</span>}
                                                <span className="text-foreground">{s.location}</span>
                                            </span>
                                        ))}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {stops.length - 1} segment{stops.length > 2 ? 's' : ''} • {stops.length} cities
                                    </p>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">Add your stops to see route summary</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main >
    );
}
