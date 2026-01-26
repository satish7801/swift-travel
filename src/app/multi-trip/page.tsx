"use client";

import * as React from 'react';
import { Plus, Trash2, GripVertical, MapPin, Calendar, Search, Loader2, ArrowDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationAutocomplete } from '@/components/ui/location-autocomplete';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { createMultiCityItinerary } from './actions';
import { estimateDistance } from '@/lib/data/trip-planner';
import { CITIES } from '@/lib/data/cities';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface Stop {
    id: string;
    location: string;
    date: Date | undefined;
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

                const nextDate = new Date(current.date);
                // Add stay duration + travel time to previous date
                nextDate.setDate(nextDate.getDate() + stayDays + Math.max(1, travelDays));
                next.date = nextDate;
            }
        }
        return filledStops;
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
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
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
                                                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                                        {index === 0 ? 'Departure' : 'Arrival'} Date
                                                    </label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-full justify-start text-left font-normal h-12",
                                                                    !stop.date && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <Calendar className="mr-2 h-4 w-4" />
                                                                {stop.date ? format(stop.date, "PPP") : "Select date"}
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
                                                </div>
                                            </div>
                                        </div>

                                        {/* Remove button */}
                                        {index > 0 && index < stops.length - 1 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-destructive shrink-0"
                                                onClick={() => removeStop(stop.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
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
        </main>
    );
}
