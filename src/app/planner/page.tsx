'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, MapPin, Sparkles, Wand2, BookOpen, Lightbulb, Youtube, Wallet, CalendarDays, Car, ShoppingBag, Save, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { findAttractionsAction, generateItineraryAction } from './actions';
import type { GenerateItineraryOutput as ItineraryData } from '@/ai/flows/generate-itinerary-flow';
import type { GenerateItineraryOverviewOutput } from '@/ai/flows/generate-itinerary-overview-flow';
import { Separator } from '@/components/ui/separator';
import { useUser, useFirestore } from '@/firebase';
import { saveItinerary } from '@/firebase/firestore/itineraries';


const cityFormSchema = z.object({
  city: z.string().min(2, { message: 'Please enter a city name.' }),
});

type CityFormValues = z.infer<typeof cityFormSchema>;

export default function PlannerPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [attractions, setAttractions] = React.useState<string[]>([]);
  const [selectedAttractions, setSelectedAttractions] = React.useState<Set<string>>(new Set());
  const [itinerary, setItinerary] = React.useState<ItineraryData | null>(null);
  const [itineraryOverview, setItineraryOverview] = React.useState<GenerateItineraryOverviewOutput | null>(null);
  const [savedPlanId, setSavedPlanId] = React.useState<string | null>(null);
  const [planJustSaved, setPlanJustSaved] = React.useState(false);

  const [isLoadingAttractions, setIsLoadingAttractions] = React.useState(false);
  const [isGeneratingItinerary, setIsGeneratingItinerary] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
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
    setItineraryOverview(null);
    setSavedPlanId(null);
    setPlanJustSaved(false);
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
    setItineraryOverview(null);
    setSavedPlanId(null);
    setPlanJustSaved(false);
    
    const result = await generateItineraryAction(currentCity, Array.from(selectedAttractions));

    if (result.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else if (result.itinerary && result.overview) {
        setItinerary(result.itinerary);
        setItineraryOverview(result.overview);
    }
    setIsGeneratingItinerary(false);
  };
  
  const handleSavePlan = () => {
    if (!user || !firestore || !itinerary || !currentCity) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in and have an itinerary to save it.' });
      return;
    }
    
    setIsSaving(true);
    saveItinerary(firestore, user.uid, currentCity, itinerary, itineraryOverview);
    setPlanJustSaved(true);
    toast({ title: 'Plan Saved!', description: 'Your itinerary has been saved to "My Plans".' });
    setIsSaving(false);
  }


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
                      <span className="ml-2">Generate My Travel Guide</span>
                  </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isGeneratingItinerary && (
            <div className="text-center py-8 mt-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-2 text-muted-foreground">Crafting your travel guide...</p>
            </div>
        )}
        
        {itineraryOverview && (
            <Card className="mt-8">
                <CardHeader className="text-center p-6">
                    <h2 className="text-4xl font-bold font-headline text-primary">{itineraryOverview.title}</h2>
                    <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">{itineraryOverview.introduction}</p>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                    {/* Quick Facts Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border rounded-lg p-4">
                        <div className="flex items-start gap-4">
                            <Wallet className="h-7 w-7 text-primary mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold">Estimated Cost</h4>
                                <p className="text-muted-foreground text-sm">{itineraryOverview.estimatedCost}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <CalendarDays className="h-7 w-7 text-primary mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold">Best Time to Visit</h4>
                                <p className="text-muted-foreground text-sm">{itineraryOverview.bestTimeToVisit}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />
                    
                    {/* Daily Breakdown */}
                    <h3 className="text-3xl font-bold font-headline text-center">Your Day-by-Day Itinerary</h3>
                    <div className="space-y-8">
                      {itineraryOverview.dailyBreakdown.map(day => (
                          <div key={day.day} className="border-l-2 border-primary pl-6 relative">
                              <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-primary border-4 border-background" />
                              <h4 className="text-2xl font-bold font-headline">Day {day.day}: {day.dayTitle}</h4>
                              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed mt-2">{day.narrative}</p>
                              {day.proTip && (
                                  <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                      <Lightbulb className="h-5 w-5 mt-0.5 shrink-0" />
                                      <div>
                                          <h5 className="font-semibold">Pro Tip</h5>
                                          <p className="text-sm">{day.proTip}</p>
                                      </div>
                                  </div>
                              )}
                          </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Additional Info Section */}
                    <h3 className="text-3xl font-bold font-headline text-center">Practical Information</h3>
                    <div className="grid md:grid-cols-2 gap-8 pt-4">
                        <div>
                            <h4 className="text-xl font-bold font-headline mb-3 flex items-center gap-3"><Car className="h-6 w-6 text-primary" /> Getting Around</h4>
                            <p className="text-muted-foreground leading-relaxed">{itineraryOverview.gettingAround}</p>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold font-headline mb-3 flex items-center gap-3"><ShoppingBag className="h-6 w-6 text-primary" /> What to Pack</h4>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                {itineraryOverview.whatToPack.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Conclusion & Videos */}
                    <div className="text-center">
                        <h3 className="text-2xl font-bold font-headline mb-2">An Unforgettable Journey</h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">{itineraryOverview.conclusion}</p>
                    </div>
                    {itineraryOverview.suggestedVideos && itineraryOverview.suggestedVideos.length > 0 && (
                        <div className="text-center pt-4">
                            <h3 className="text-2xl font-bold font-headline mb-4">Visualize Your Trip</h3>
                            <p className="text-muted-foreground mb-4">Watch travel vlogs to get a feel for your destination:</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                {itineraryOverview.suggestedVideos.map((videoQuery, index) => (
                                    <Button key={index} asChild variant="outline">
                                        <a href={`https://www.youtube.com/results?search_query=${\'\'\'${encodeURIComponent(videoQuery)}\'\'\'}`} target="_blank" rel="noopener noreferrer">
                                            <Youtube className="mr-2 h-4 w-4" />
                                            {videoQuery}
                                        </a>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex-col gap-4 items-center justify-center pt-6">
                  {savedPlanId || planJustSaved ? (
                      <Button size="lg" variant="outline" asChild>
                        <Link href="/plans">
                          <CheckCircle />
                          <span className="ml-2">View Saved Plans</span>
                        </Link>
                      </Button>
                    ) : (
                      <Button size="lg" onClick={handleSavePlan} disabled={!user || isSaving}>
                        {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                        <span className="ml-2">Save Plan</span>
                      </Button>
                    )}
                </CardFooter>
            </Card>
        )}

      </div>
    </div>
  );
}
