"use client";

import * as React from 'react';
import Image from 'next/image';
import SearchForm, { SearchFilters } from '@/components/search-form';
import SearchResults from '@/components/search-results';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Route } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { searchRoutesAction } from './search-actions';
import { parseDuration } from '@/lib/utils';
import ChatWidget from '@/components/chat-widget';

export type SortKey = 'default' | 'price' | 'duration' | 'transfers';

export default function Home() {
  const [searchResults, setSearchResults] = React.useState<Route[] | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<SortKey>('default');
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-plane');
  const { toast } = useToast();

  const handleSearch = async (filters: SearchFilters) => {
    setIsSearching(true);
    setSearchResults(null);
    setSortBy('default'); // Reset sort on new search

    try {
      const results = await searchRoutesAction(filters);
      setSearchResults(results);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: error.message || "Could not fetch routes.",
      });
      setSearchResults([]); // show 'No results' message
    } finally {
      setIsSearching(false);
    }
  };
  
  const sortedResults = React.useMemo(() => {
    if (!searchResults) return null;
    if (sortBy === 'default') return searchResults;

    return [...searchResults].sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price;
      }
      if (sortBy === 'duration') {
        return parseDuration(a.totalDuration) - parseDuration(b.totalDuration);
      }
      if (sortBy === 'transfers') {
        return a.legs.length - b.legs.length;
      }
      return 0;
    });
  }, [searchResults, sortBy]);


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
        <SearchForm onSearch={handleSearch} isSearching={isSearching} />
      </div>
      
      <div className="container mx-auto px-4 mt-8 pb-8">
        <SearchResults
          results={sortedResults}
          isLoading={isSearching}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>
      <ChatWidget results={sortedResults} />
    </main>
  );
}
