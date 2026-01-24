"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, MapPin } from 'lucide-react';

interface SuggestedRoutesProps {
    onDestinationClick: (destination: string) => void;
}

const destinationImages = PlaceHolderImages.filter(img => img.id.startsWith('destination-'));

export default function SuggestedRoutes({ onDestinationClick }: SuggestedRoutesProps) {
    const popularDestinations = [
        { name: 'Goa', subtitle: 'Beaches & Nightlife', image: destinationImages.find(i => i.id === 'destination-goa') },
        { name: 'Jaipur', subtitle: 'Royal Heritage', image: destinationImages.find(i => i.id === 'destination-jaipur') },
        { name: 'Mumbai', subtitle: 'City of Dreams', image: destinationImages.find(i => i.id === 'destination-mumbai') },
        { name: 'Delhi', subtitle: 'Capital Culture', image: destinationImages.find(i => i.id === 'destination-delhi') },
        { name: 'Kerala', subtitle: 'God\'s Own Country', image: destinationImages.find(i => i.id === 'destination-kerala') },
        { name: 'Agra', subtitle: 'Wonder of World', image: destinationImages.find(i => i.id === 'destination-agra') },
    ];

    return (
        <section className="py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold">Popular Destinations</h2>
                    <p className="text-muted-foreground mt-1">Explore trending travel spots across India</p>
                </div>
                <button className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
                    View all <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {popularDestinations.map((dest) => (
                    <button
                        key={dest.name}
                        onClick={() => onDestinationClick(dest.name)}
                        className="group relative aspect-[4/5] rounded-2xl overflow-hidden hover-lift focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        {/* Image */}
                        {dest.image ? (
                            <Image
                                src={dest.image.imageUrl}
                                alt={dest.image.description}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                        )}

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Content */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                            <div className="flex items-center gap-1 text-white/70 text-xs mb-1">
                                <MapPin className="w-3 h-3" />
                                <span>India</span>
                            </div>
                            <h3 className="text-white font-semibold text-lg">{dest.name}</h3>
                            <p className="text-white/60 text-xs">{dest.subtitle}</p>
                        </div>

                        {/* Hover Arrow */}
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">
                            <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
}
