"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface SuggestedRoutesProps {
  onDestinationClick: (destination: string) => void;
}

// Exclude the hero image from suggestions
const destinationImages = PlaceHolderImages.filter(img => img.id.startsWith('destination-'));

export default function SuggestedRoutes({ onDestinationClick }: SuggestedRoutesProps) {
  if (destinationImages.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
        <h2 className="text-2xl font-headline font-semibold mb-4">Popular Destinations</h2>
        <Carousel 
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full"
        >
            <CarouselContent>
                {destinationImages.map((dest) => {
                    const destinationName = dest.id.split('-')[1];
                    const displayName = destinationName.charAt(0).toUpperCase() + destinationName.slice(1);
                    return (
                        <CarouselItem key={dest.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                             <Card 
                                className="overflow-hidden cursor-pointer group"
                                onClick={() => onDestinationClick(displayName)}
                             >
                                <CardContent className="p-0">
                                    <div className="relative h-60">
                                        <Image
                                            src={dest.imageUrl}
                                            alt={dest.description}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                            data-ai-hint={dest.imageHint}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        <div className="absolute bottom-0 left-0 p-4">
                                            <h3 className="text-xl font-bold text-white font-headline">{displayName}</h3>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    );
                })}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex"/>
            <CarouselNext className="hidden sm:flex"/>
        </Carousel>
    </div>
  );
}
