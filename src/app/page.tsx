"use client";

import * as React from 'react';
import Image from 'next/image';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import SearchForm, { SearchFilters, searchFormSchema } from '@/components/search-form';
import SearchResults from '@/components/search-results';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Route, TransportMode } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { searchRoutesAction } from './search-actions';
import { parseDuration } from '@/lib/utils';
import ChatWidget from '@/components/chat-widget';
import SuggestedRoutes from '@/components/suggested-routes';
import FilterControls from '@/components/filter-controls';
import ResultsChart from '@/components/results-chart';

export type SortKey = 'default' | 'price' | 'duration' | 'transfers' | 'carbon';

export default function Home() {
  const [searchResults, setSearchResults] = React.useState<Route[] | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<SortKey>('default');
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-plane');
  const { toast } = useToast();

  const [transportModes, setTransportModes] = React.useState<Set<TransportMode>>(new Set(['flight', 'train', 'bus']));
  const [maxPrice, setMaxPrice] = React.useState<number | undefined>(undefined);
  const [numStops, setNumStops] = React.useState<number>(-1); // -1 for any

  const form = useForm<SearchFilters>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      from: "",
      to: "",
      date: new Date(),
    },
  });
  
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
    // Reset filters on new search
    setTransportModes(new Set(['flight', 'train', 'bus']));
    setNumStops(-1);

    try {
      const results = await searchRoutesAction(filters);
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
    document.querySelector('.relative.z-10')?.scrollIntoView({ behavior: 'smooth' });
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
      // Filter by transport mode
      const hasValidMode = route.legs.every(leg => transportModes.has(leg.mode));
      if (!hasValidMode) return false;

      // Filter by price
      if (maxPrice !== undefined && route.price > maxPrice) {
        return false;
      }

      // Filter by stops
      if (numStops !== -1) {
        const stops = route.legs.length - 1;
        if (numStops === 2) { // 2+ stops
            if (stops < 2) return false;
        } else { // Direct or 1 stop
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
      if (sortBy === 'price') {
        return a.price - b.price;
      }
      if (sortBy === 'duration') {
        return parseDuration(a.totalDuration) - parseDuration(b.totalDuration);
      }
      if (sortBy === 'transfers') {
        return a.legs.length - b.legs.length;
      }
      if (sortBy === 'carbon') {
        return a.carbonFootprint - b.carbonFootprint;
      }
      return 0;
    });
  }, [filteredResults, sortBy]);


  return (
    <main className="flex-1">
      <div className="relative h-[400px] md:h-[500px] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-lg">
            Plan Your Next Adventure
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl drop-shadow">
            Unify your travel plans. Search and book trains, buses, and flights all in one place.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-24 relative z-10">
        <SearchForm form={form} onSearch={handleSearch} isSearching={isSearching} />
      </div>
      
      <div className="container mx-auto px-4 mt-8 pb-8">
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
      </div>
      <ChatWidget results={sortedResults} />
    </main>
  );
}
