import type { Route } from '@/lib/types';
import RouteCard from './route-card';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { SortKey } from '@/app/page';

interface SearchResultsProps {
  results: Route[] | null;
  isLoading: boolean;
  sortBy: SortKey;
  onSortChange: (sortBy: SortKey) => void;
  initialResultCount: number;
}

const sortOptions: { label: string; value: SortKey }[] = [
    { label: 'Best', value: 'default' },
    { label: 'Cheapest', value: 'price' },
    { label: 'Fastest', value: 'duration' },
    { label: 'Least Transfers', value: 'transfers' },
    { label: 'Eco-Friendly', value: 'carbon' },
];

function SortControls({ sortBy, onSortChange }: { sortBy: SortKey; onSortChange: (sortBy: SortKey) => void; }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
                {sortOptions.map(option => (
                    <Button
                        key={option.value}
                        variant={sortBy === option.value ? 'outline' : 'ghost'}
                        size="sm"
                        onClick={() => onSortChange(option.value)}
                        className={cn(
                            'px-3',
                            sortBy === option.value && 'bg-background shadow-sm'
                        )}
                    >
                        {option.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default function SearchResults({ results, isLoading, sortBy, onSortChange, initialResultCount }: SearchResultsProps) {
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
            <h2 className="text-2xl font-headline font-semibold">
                {initialResultCount > 0 ? 'No routes match your filters' : 'No routes found'}
            </h2>
            <p className="text-muted-foreground mt-2">
                {initialResultCount > 0 ? 'Try adjusting your filter criteria.' : 'Try adjusting your search criteria.'}
            </p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-headline font-semibold">Available Routes</h2>
        <SortControls sortBy={sortBy} onSortChange={onSortChange} />
      </div>
      {results.map(route => (
        <RouteCard key={route.id} route={route} />
      ))}
    </div>
  );
}
