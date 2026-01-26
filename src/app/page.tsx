"use client";

import * as React from 'react';
import Image from 'next/image';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import SearchForm from '@/components/search-form';
import { searchFormSchema, type SearchFilters } from '@/lib/schemas';
import SearchResults from '@/components/search-results';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Route, TransportMode, UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { searchRoutesAction } from './search-actions';
import { parseDuration } from '@/lib/utils';
import ChatWidget from '@/components/chat-widget';
import SuggestedRoutes from '@/components/suggested-routes';
import FilterControls from '@/components/filter-controls';
import ResultsChart from '@/components/results-chart';
import { useUser } from '@/hooks/use-session';
import { Plane, Train, Bus, Sparkles, MapPin, Calendar, ArrowRight } from 'lucide-react';

export type SortKey = 'default' | 'price' | 'duration' | 'transfers' | 'carbon';

export default function Home() {
  const [searchResults, setSearchResults] = React.useState<Route[] | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<SortKey>('default');
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-plane');
  const { toast } = useToast();

  const { user } = useUser();
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);

  React.useEffect(() => {
    if (user) {
      fetch('/api/user/profile')
        .then(res => res.ok ? res.json() : null)
        .then(data => setUserProfile(data))
        .catch(() => setUserProfile(null));
    } else {
      setUserProfile(null);
    }
  }, [user]);

  const [selectedCity, setSelectedCity] = React.useState<City | null>(null);

  const [transportModes, setTransportModes] = React.useState<Set<TransportMode>>(new Set(['flight', 'train', 'bus']));
  const [maxPrice, setMaxPrice] = React.useState<number | undefined>(undefined);
  const [numStops, setNumStops] = React.useState<number>(-1);

  const form = useForm<SearchFilters>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      from: "",
      to: "",
      date: undefined,
    },
  });

  React.useEffect(() => {
    form.setValue('date', new Date());
  }, [form]);

  const priceBounds = React.useMemo((): [number, number] => {
    if (!searchResults) return [0, 100000];
    const prices = searchResults.map(r => r.price);
    if (prices.length === 0) return [0, 100000];
    return [Math.min(...prices), Math.max(...prices)];
  }, [searchResults]);

  React.useEffect(() => {
    if (priceBounds) {
      setMaxPrice(priceBounds[1]);
    }
  }, [priceBounds]);

  const handleSearch = async (filters: SearchFilters) => {
    setIsSearching(true);
    setSearchResults(null);
    setSortBy('default');
    setTransportModes(new Set(['flight', 'train', 'bus']));
    setNumStops(-1);

    try {
      const results = await searchRoutesAction(filters, userProfile?.travelPreferences);
      setSearchResults(results);
      if (results.length > 0) {
        const newMaxPrice = Math.max(...results.map(r => r.price));
        setMaxPrice(newMaxPrice);
      } else {
        setMaxPrice(undefined);
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: error.message || "Could not fetch routes.",
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDestinationClick = (destination: string) => {
    form.setValue('to', destination);
    document.querySelector('.search-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTransportModeChange = (mode: TransportMode, checked: boolean) => {
    setTransportModes(prev => {
      const newModes = new Set(prev);
      if (checked) {
        newModes.add(mode);
      } else {
        newModes.delete(mode);
      }
      return newModes;
    });
  };

  const filteredResults = React.useMemo(() => {
    if (!searchResults) return null;
    return searchResults.filter(route => {
      const hasValidMode = route.legs.every(leg => transportModes.has(leg.mode));
      if (!hasValidMode) return false;
      if (maxPrice !== undefined && route.price > maxPrice) return false;
      if (numStops !== -1) {
        const stops = route.legs.length - 1;
        if (numStops === 2) {
          if (stops < 2) return false;
        } else {
          if (stops !== numStops) return false;
        }
      }
      return true;
    });
  }, [searchResults, transportModes, maxPrice, numStops]);

  const sortedResults = React.useMemo(() => {
    if (!filteredResults) return null;
    if (sortBy === 'default') return filteredResults;
    return [...filteredResults].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'duration') return parseDuration(a.totalDuration) - parseDuration(b.totalDuration);
      if (sortBy === 'transfers') return a.legs.length - b.legs.length;
      if (sortBy === 'carbon') return a.carbonFootprint - b.carbonFootprint;
      return 0;
    });
  }, [filteredResults, sortBy]);

  return (
    <main className="flex-1 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Dynamic Background Image */}
        <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
          {selectedCity?.imageUrl ? (
            <div className="absolute inset-0">
              <img
                src={selectedCity.imageUrl}
                alt={selectedCity.name}
                className="w-full h-full object-cover animate-in fade-in zoom-in-110 duration-1000"
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            </div>
          ) : (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl float" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl float" style={{ animationDelay: '-3s' }} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-foreground text-sm font-medium">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>AI-Powered Travel Planning</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-edvast text-white leading-tight">
              Your Journey,{' '}
              <span className="gradient-text-light">Reimagined</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Compare trains, buses, and flights across India in seconds.
              Smart routing, real-time availability, and the best prices.
            </p>

            {/* Transport Icons */}
            <div className="flex items-center justify-center gap-6 md:gap-8">
              {[
                { icon: Train, label: 'Trains', color: 'text-orange-500' },
                { icon: Bus, label: 'Buses', color: 'text-emerald-500' },
                { icon: Plane, label: 'Flights', color: 'text-blue-500' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className={`p-4 rounded-2xl glass group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ${color}`}>
                    <Icon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <span className="text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">{label}</span>
                </div>
              ))}
            </div>

            {/* Search Form */}
            <div className="search-section pt-8">
              <SearchForm
                form={form}
                onSearch={handleSearch}
                isSearching={isSearching}
                onCitySelect={(city) => setSelectedCity(city)}
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-8 max-w-lg mx-auto">
              {[
                { value: '200+', label: 'Stations' },
                { value: '50+', label: 'Routes' },
                { value: '24/7', label: 'Support' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{value}</div>
                  <div className="text-sm text-white/50">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-white/50" />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          <SuggestedRoutes onDestinationClick={handleDestinationClick} />

          {searchResults && searchResults.length > 0 && maxPrice !== undefined && (
            <FilterControls
              transportModes={transportModes}
              onTransportModeChange={handleTransportModeChange}
              priceBounds={priceBounds}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              numStops={numStops}
              onNumStopsChange={setNumStops}
            />
          )}

          {filteredResults && filteredResults.length > 0 && (
            <ResultsChart results={filteredResults} />
          )}

          <SearchResults
            results={sortedResults}
            isLoading={isSearching}
            sortBy={sortBy}
            onSortChange={setSortBy}
            initialResultCount={searchResults?.length ?? 0}
          />
        </div>
      </section>

      <ChatWidget results={sortedResults} />
    </main>
  );
}
