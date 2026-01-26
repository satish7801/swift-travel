
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Stop } from '@/app/multi-trip/page'; // We'll export Stop from page.tsx
import { GripVertical, Trash2, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationAutocomplete } from '@/components/ui/location-autocomplete';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CITIES } from '@/lib/data/cities';
import { findCitiesOnRoute } from '@/lib/route-utils';
import { Plus, Map } from 'lucide-react';

interface SortableStopCardProps {
    stop: Stop;
    index: number;
    isFirst: boolean;
    isLast: boolean;
    updateStop: (id: string, field: keyof Stop, value: any) => void;
    removeStop: (id: string) => void;
    toggleAttraction: (stopId: string, attraction: string) => void;
    stopsLength: number;
    previousLocation?: string;
    onAddStopAt?: (index: number, location: string) => void;
}

export function SortableStopCard({
    stop,
    index,
    isFirst,
    isLast,
    updateStop,
    removeStop,
    toggleAttraction,
    stopsLength,
    previousLocation,
    onAddStopAt
}: SortableStopCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: stop.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={cn("relative group", isDragging && "shadow-xl ring-2 ring-primary/20 rounded-xl bg-card")}>
            {/* Smart Route Suggestions - Render BEFORE the current card */}
            {index > 0 && previousLocation && stop.location && (
                <div className="mb-6 ml-14 relative z-10">
                    {/* Bridge Line for Suggestions */}
                    <div className="absolute -left-[37px] -top-8 -bottom-8 w-0.5 border-l-2 border-dashed border-primary/30" />

                    {(() => {
                        const suggestions = findCitiesOnRoute(previousLocation, stop.location);
                        // Filter isn't trivial since we don't have full list here. 
                        // But we can filter by current stops if we passed full list, or just show all relevant.
                        // For dragged item, simplicity is key.

                        // We'll trust findCitiesOnRoute returns good candidates.
                        if (suggestions.length === 0) return null;

                        return (
                            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-3 relative">
                                <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
                                    <Map className="h-3 w-3" />
                                    Places to visit from {previousLocation} to {stop.location}:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {suggestions.slice(0, 5).map(city => (
                                        <Badge
                                            key={city.name}
                                            variant="secondary"
                                            className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                            onClick={() => onAddStopAt?.(index, city.name)}
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

            {/* Connection line inside component? No, keep it clean or handle via parent passed prop? 
                Actually, the line needs to be rendered here if we want it to move with the card logic.
                Refactoring: Use the same line logic as we had in page.tsx
            */}
            {index < stopsLength - 1 && (
                <div className="absolute left-5 top-16 -bottom-6 w-0.5 border-l-2 border-dashed border-primary/30" />
            )}

            <div className="flex items-start gap-4">
                {/* Drag Handle & Step indicator */}
                <div className="flex flex-col items-center shrink-0">
                    {/* Drag Handle */}
                    {!isFirst && !isLast && (
                        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 -mt-2 mb-1 text-muted-foreground/30 hover:text-muted-foreground transition-colors">
                            <GripVertical className="h-4 w-4" />
                        </div>
                    )}

                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-lg text-sm z-10 relative", // z-10 for line overlap
                        isFirst ? "bg-emerald-500" :
                            isLast ? "bg-rose-500" :
                                "bg-gradient-to-br from-primary to-accent"
                    )}>
                        {index + 1}
                    </div>
                </div>

                {/* Stop details */}
                <div className="flex-1 bg-muted/30 rounded-xl p-4 border border-border/50">
                    <div className="text-xs font-medium text-muted-foreground mb-3 flex items-center justify-between">
                        <span>
                            {isFirst ? '🚀 Starting Point' :
                                isLast ? '🏁 Final Destination' :
                                    `📍 Stop ${index}`}
                        </span>
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
                                {isFirst ? 'Departure' : 'Arrival'} Time
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

                        // We show the section if there are known attractions OR if the user has already selected some (custom ones)
                        const hasKnownAttractions = cityData?.attractions && cityData.attractions.length > 0;
                        const hasSelectedAttractions = stop.selectedAttractions && stop.selectedAttractions.length > 0;

                        if (hasKnownAttractions || hasSelectedAttractions) {
                            return (
                                <div className="mt-3 pt-3 border-t border-border/50">
                                    <div className="flex items-start gap-2">
                                        <Sparkles className="h-3 w-3 text-amber-500 mt-1 shrink-0" />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Places to Visit</p>
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.location)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[10px] flex items-center gap-1 text-blue-500 hover:underline"
                                                >
                                                    View on Map <MapPin className="h-3 w-3" />
                                                </a>
                                            </div>

                                            {/* Pre-defined Attractions */}
                                            <div className="flex flex-wrap gap-1.5 mb-2">
                                                {cityData?.attractions?.slice(0, 10).map(attr => {
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
                                                {/* Show selected custom attractions that aren't in the city list */}
                                                {stop.selectedAttractions?.filter(attr => !cityData?.attractions?.includes(attr)).map(attr => (
                                                    <Badge
                                                        key={attr}
                                                        variant="default"
                                                        className="cursor-pointer transition-all text-[10px] bg-amber-500 hover:bg-amber-600 text-white border-transparent"
                                                        onClick={() => toggleAttraction(stop.id, attr)}
                                                    >
                                                        {attr} (Custom) ✓
                                                    </Badge>
                                                ))}
                                            </div>

                                            {/* Custom Place Input */}
                                            <div className="flex items-center gap-2 mt-2">
                                                <input
                                                    type="text"
                                                    placeholder="Add custom place..."
                                                    className="flex-1 h-7 text-xs bg-muted/50 border border-border rounded px-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            const value = (e.target as HTMLInputElement).value.trim();
                                                            if (value) {
                                                                toggleAttraction(stop.id, value);
                                                                (e.target as HTMLInputElement).value = '';
                                                            }
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 w-7 p-0"
                                                    onClick={(e) => {
                                                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                                        const value = input.value.trim();
                                                        if (value) {
                                                            toggleAttraction(stop.id, value);
                                                            input.value = '';
                                                        }
                                                    }}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
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
                            (isFirst || stopsLength <= 2) && "opacity-20 pointer-events-none" // 2 stops minimum
                        )}
                        onClick={() => removeStop(stop.id)}
                        disabled={isFirst || stopsLength <= 2}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
