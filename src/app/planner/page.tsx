'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, MapPin, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { findAttractionsAction, generateItineraryAction } from './actions';
import type { GenerateItineraryOutput } from '@/ai/flows/generate-itinerary-flow';

const cityFormSchema = z.object({
  city: z.string().min(2, { message: 'Please enter a city name.' }),
});

type CityFormValues = z.infer<typeof cityFormSchema>;

export default function PlannerPage() {
  const { toast } = useToast();
  
  const [attractions, setAttractions] = React.useState<string[]>([]);
  const [selectedAttractions, setSelectedAttractions] = React.useState<Set<string>>(new Set());
  const [itinerary, setItinerary] = React.useState<GenerateItineraryOutput | null>(null);
  
  const [isLoadingAttractions, setIsLoadingAttractions] = React.useState(false);
  const [isGeneratingItinerary, setIsGeneratingItinerary] = React.useState(false);
  const [currentCity, setCurrentCity] = React.useState('');

  const cityForm = useForm<CityFormValues>({
    resolver: zodResolver(cityFormSchema),
    defaultValues: { city: '' },
  });

  const handleFindAttractions = async ({ city }: CityFormValues) => {
    setIsLoadingAttractions(true);
    setAttractions([]);
    setSelectedAttractions(new Set());
    setItinerary(null);
    setCurrentCity(city);

    const result = await findAttractionsAction(city);

    if (result.error) {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else if (result.attractions) {
      setAttractions(result.attractions);
    }
    setIsLoadingAttractions(false);
  };

  const handleAttractionToggle = (attraction: string) => {
    setSelectedAttractions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(attraction)) {
        newSet.delete(attraction);
      } else {
        newSet.add(attraction);
      }
      return newSet;
    });
  };

  const handleGenerateItinerary = async () => {
    if (selectedAttractions.size === 0) {
      toast({ variant: 'destructive', title: 'No attractions selected', description: 'Please select at least one attraction to generate a plan.' });
      return;
    }
    
    setIsGeneratingItinerary(true);
    setItinerary(null);
    
    const result = await generateItineraryAction(currentCity, Array.from(selectedAttractions));

    if (result.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else if (result.itinerary) {
        setItinerary(result.itinerary);
    }
    setIsGeneratingItinerary(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-headline font-bold">Itinerary Planner</h1>
          <p className="text-muted-foreground mt-2">
            Let our AI craft the perfect trip for you. Just enter a city to get started.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Choose Your Destination</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...cityForm}>
              <form onSubmit={cityForm.handleSubmit(handleFindAttractions)} className="flex items-start gap-2">
                <FormField
                  control={cityForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input placeholder="e.g., Haridwar" className="pl-10 h-11 text-base" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="h-11" disabled={isLoadingAttractions}>
                  {isLoadingAttractions ? <Loader2 className="animate-spin" /> : <Sparkles />}
                  <span className="ml-2">Find Places</span>
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoadingAttractions && (
            <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-2 text-muted-foreground">Searching for popular attractions in {currentCity}...</p>
            </div>
        )}

        {attractions.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>2. Select Attractions</CardTitle>
              <CardDescription>
                Choose the places you want to visit in {currentCity}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {attractions.map(attraction => (
                  <div key={attraction} className="flex items-center space-x-2">
                    <Checkbox
                      id={attraction}
                      checked={selectedAttractions.has(attraction)}
                      onCheckedChange={() => handleAttractionToggle(attraction)}
                    />
                    <Label htmlFor={attraction} className="cursor-pointer text-sm font-medium leading-none">
                      {attraction}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                  <Button size="lg" onClick={handleGenerateItinerary} disabled={isGeneratingItinerary || selectedAttractions.size === 0}>
                      {isGeneratingItinerary ? <Loader2 className="animate-spin" /> : <Wand2 />}
                      <span className="ml-2">Generate My Itinerary</span>
                  </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isGeneratingItinerary && (
            <div className="text-center py-8 mt-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-2 text-muted-foreground">Crafting your personalized itinerary...</p>
            </div>
        )}

        {itinerary && (
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline text-center">Your {itinerary.totalDays}-Day Trip to {currentCity}</CardTitle>
                    <CardDescription className="text-center">{itinerary.summary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {itinerary.itinerary.map(dayPlan => (
                        <div key={dayPlan.day} className="border-l-2 border-primary pl-6 relative">
                            <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-primary border-4 border-background" />
                            <h3 className="text-xl font-bold font-headline">Day {dayPlan.day}: {dayPlan.title}</h3>
                            <ul className="mt-2 list-disc list-inside space-y-1 text-muted-foreground">
                                {dayPlan.activities.map((activity, index) => (
                                    <li key={index}>{activity}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </CardContent>
            </Card>
        )}

      </div>
    </div>
  );
}
