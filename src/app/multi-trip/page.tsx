"use client";

import * as React from 'react';
import { Plus, GripVertical, MapPin, Calendar, Search, Loader2, ArrowDown, Sparkles, Clock, Map, Sun } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableStopCard } from '@/components/trip-planner/sortable-stop-card';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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

export interface Stop {
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
    const [avoidNightTravel, setAvoidNightTravel] = React.useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setStops((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }


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
            const result = await createMultiCityItinerary(filledStops, { avoidNightTravel });

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

    const addIntermediaryStop = (index: number, location: string) => {
        const newStop: Stop = {
            id: Date.now().toString(),
            location: location,
            date: undefined
        };
        const newStops = [...stops];
        newStops.splice(index, 0, newStop);
        setStops(newStops);
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
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={stops}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {stops.map((stop, index) => (
                                        <div key={stop.id} className="mb-6">
                                            <SortableStopCard
                                                stop={stop}
                                                index={index}
                                                isFirst={index === 0}
                                                isLast={index === stops.length - 1}
                                                updateStop={updateStop}
                                                removeStop={removeStop}
                                                toggleAttraction={toggleAttraction}
                                                stopsLength={stops.length}
                                                previousLocation={index > 0 ? stops[index - 1].location : undefined}
                                                onAddStopAt={addIntermediaryStop}
                                            />
                                        </div>
                                    ))}
                                </SortableContext>
                            </DndContext>

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

                            {/* Preferences */}
                            <div className="flex items-center justify-between bg-muted/30 p-4 rounded-xl border border-border/50 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                        <Sun className="h-4 w-4 text-orange-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <Label htmlFor="day-travel" className="font-medium cursor-pointer">Day Travel Only</Label>
                                        <p className="text-xs text-muted-foreground">Avoid overnight journeys</p>
                                    </div>
                                </div>
                                <Switch
                                    id="day-travel"
                                    checked={avoidNightTravel}
                                    onCheckedChange={setAvoidNightTravel}
                                />
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
