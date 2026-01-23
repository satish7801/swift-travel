"use client";

import * as React from 'react';
import Image from 'next/image';
import SearchForm, { SearchFilters } from '@/components/search-form';
import SearchResults from '@/components/search-results';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Route } from '@/lib/types';
import { mockRoutes } from '@/lib/data';

export default function Home() {
  const [searchResults, setSearchResults] = React.useState<Route[] | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-plane');

  const handleSearch = (filters: SearchFilters) => {
    setIsSearching(true);
    setSearchResults(null);

    // Simulate API call delay
    setTimeout(() => {
      const results = mockRoutes.filter(route => {
        const fromMatch = filters.from ? route.legs[0].departureLocation.toLowerCase().includes(filters.from.toLowerCase()) : true;
        const toMatch = filters.to ? route.legs[route.legs.length - 1].arrivalLocation.toLowerCase().includes(filters.to.toLowerCase()) : true;
        // Basic date matching, in a real app this would be more complex
        const dateMatch = filters.date ? route.legs[0].departureTime.startsWith(filters.date.toISOString().split('T')[0]) : true;
        return fromMatch && toMatch && dateMatch;
      });
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

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
        <SearchResults results={searchResults} isLoading={isSearching} />
      </div>
    </main>
  );
}
