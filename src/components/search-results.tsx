import type { Route } from '@/lib/types';
import RouteCard from './route-card';
import { Skeleton } from './ui/skeleton';

interface SearchResultsProps {
  results: Route[] | null;
  isLoading: boolean;
}

export default function SearchResults({ results, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-headline font-semibold">Searching for routes...</h2>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (results === null) {
    return null; // Don't show anything before the first search
  }
  
  if (results.length === 0) {
    return (
        <div className="text-center py-16">
            <h2 className="text-2xl font-headline font-semibold">No routes found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your search criteria.</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-headline font-semibold">Available Routes</h2>
      {results.map(route => (
        <RouteCard key={route.id} route={route} />
      ))}
    </div>
  );
}
