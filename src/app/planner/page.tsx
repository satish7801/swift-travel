"use client";

import * as React from 'react';
import {
  MapPin, Calendar, Sparkles, Loader2, X, Plus, AlertTriangle,
  Lightbulb, ArrowRight, Check, Navigation, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationAutocomplete } from '@/components/ui/location-autocomplete';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { AuthGuard } from '@/components/auth-guard';
import { getNearbyPlaces, checkFeasibility, getPopularDestinations } from '@/lib/data/trip-planner';
import type { City } from '@/lib/data/cities';

interface SelectedCity {
  name: string;
  addedAt: number;
}

export default function PlannerPage() {
  return (
    <AuthGuard>
      <PlannerContent />
    </AuthGuard>
  );
}

function PlannerContent() {
  const [selectedCities, setSelectedCities] = React.useState<SelectedCity[]>([]);
  const [startDate, setStartDate] = React.useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = React.useState<Date | undefined>();
  const [currentInput, setCurrentInput] = React.useState('');
  const [nearbyPlaces, setNearbyPlaces] = React.useState<any[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [feasibility, setFeasibility] = React.useState<any>(null);

  const popularDestinations = React.useMemo(() => getPopularDestinations(), []);

  // Update nearby places when cities change
  React.useEffect(() => {
    if (selectedCities.length > 0) {
      const lastCity = selectedCities[selectedCities.length - 1];
      const nearby = getNearbyPlaces(lastCity.name, 300);
      // Filter out already selected cities
      const filtered = nearby.filter(n =>
        !selectedCities.some(s => s.name.toLowerCase() === n.city.name.toLowerCase())
      );
      setNearbyPlaces(filtered.slice(0, 5));
    } else {
      setNearbyPlaces([]);
    }
  }, [selectedCities]);

  // Check feasibility when cities or dates change
  React.useEffect(() => {
    if (selectedCities.length >= 2 && startDate && endDate) {
      const result = checkFeasibility(
        selectedCities.map(c => c.name),
        startDate,
        endDate
      );
      setFeasibility(result);
    } else {
      setFeasibility(null);
    }
  }, [selectedCities, startDate, endDate]);

  const addCity = (cityName: string) => {
    if (!cityName.trim()) return;
    if (selectedCities.some(c => c.name.toLowerCase() === cityName.toLowerCase())) return;

    setSelectedCities([...selectedCities, { name: cityName, addedAt: Date.now() }]);
    setCurrentInput('');
  };

  const removeCity = (cityName: string) => {
    setSelectedCities(selectedCities.filter(c => c.name !== cityName));
  };

  const handleGenerate = async () => {
    if (selectedCities.length < 1 || !startDate || !endDate) return;
    setIsGenerating(true);
    // TODO: Call AI to generate itinerary
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  const tripDays = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;

  return (
    <main className="flex-1">
      {/* Header */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 hero-mesh" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-white/80 text-sm mb-4">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>AI-Powered Planning</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold">
              Plan Your Perfect Trip
            </h1>
            <p className="text-lg text-white/70">
              Select destinations, set your dates, and let AI create the perfect itinerary
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 -mt-8 relative z-20">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Step 1: Select Cities */}
          <div className="card-premium p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">1</div>
              <h2 className="text-lg font-semibold">Where do you want to go?</h2>
            </div>

            {/* City Input */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <LocationAutocomplete
                  value={currentInput}
                  onChange={setCurrentInput}
                  placeholder="Search for a city..."
                />
              </div>
              <Button onClick={() => addCity(currentInput)} disabled={!currentInput.trim()}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {/* Selected Cities */}
            {selectedCities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCities.map((city, index) => (
                  <Badge
                    key={city.name}
                    variant="secondary"
                    className="pl-3 pr-1 py-1.5 text-sm flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    {city.name}
                    <button
                      onClick={() => removeCity(city.name)}
                      className="ml-1 p-1 rounded-full hover:bg-destructive/20 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Popular Destinations */}
            {selectedCities.length === 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-3">Popular destinations:</p>
                <div className="flex flex-wrap gap-2">
                  {popularDestinations.map(city => (
                    <button
                      key={city.name}
                      onClick={() => addCity(city.name)}
                      className="px-3 py-1.5 rounded-full border border-border hover:border-primary hover:text-primary text-sm transition-colors"
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Suggestions */}
            {nearbyPlaces.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Navigation className="h-4 w-4" />
                  <span>Nearby places you might like:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {nearbyPlaces.map(place => (
                    <button
                      key={place.city.name}
                      onClick={() => addCity(place.city.name)}
                      className="px-3 py-1.5 rounded-lg border border-dashed border-accent/50 hover:border-accent hover:bg-accent/5 text-sm transition-colors flex items-center gap-2"
                    >
                      <MapPin className="h-3 w-3 text-accent" />
                      {place.city.name}
                      <span className="text-xs text-muted-foreground">{place.distance}km</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Select Dates */}
          <div className="card-premium p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">2</div>
              <h2 className="text-lg font-semibold">When are you traveling?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start h-12">
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start h-12">
                      <Calendar className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date < (startDate || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {tripDays > 0 && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Trip duration:</span>
                <span className="font-semibold">{tripDays} days</span>
              </div>
            )}
          </div>

          {/* Feasibility Warnings & Suggestions */}
          {feasibility && (
            <div className="space-y-3">
              {/* Warnings */}
              {feasibility.warnings.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-700 dark:text-amber-400">Things to consider</h3>
                      <ul className="mt-2 space-y-1 text-sm text-amber-600 dark:text-amber-300">
                        {feasibility.warnings.map((w: string, i: number) => (
                          <li key={i}>• {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {feasibility.suggestions.length > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-primary">Suggestions</h3>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {feasibility.suggestions.map((s: string, i: number) => (
                          <li key={i}>• {s}</li>
                        ))}
                      </ul>
                      {feasibility.optimizedOrder && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-sm font-medium">Suggested route order:</p>
                          <p className="text-sm text-primary mt-1">
                            {feasibility.optimizedOrder.join(' → ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{selectedCities.length}</div>
                  <div className="text-sm text-muted-foreground">Cities</div>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-accent">{feasibility.totalDistance}</div>
                  <div className="text-sm text-muted-foreground">km total</div>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{feasibility.estimatedDays}</div>
                  <div className="text-sm text-muted-foreground">Recommended days</div>
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={selectedCities.length < 1 || !startDate || !endDate || isGenerating}
            className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold text-lg shadow-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generating Your Itinerary...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate AI Itinerary
              </>
            )}
          </Button>

        </div>
      </section>
    </main>
  );
}
