'use client';

import * as React from 'react';
import { Bus, Plane, TrainFront } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { TransportMode } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

const transportOptions: { mode: TransportMode; label: string; icon: React.ReactNode }[] = [
  { mode: 'flight', label: 'Flights', icon: <Plane className="h-5 w-5" /> },
  { mode: 'train', label: 'Trains', icon: <TrainFront className="h-5 w-5" /> },
  { mode: 'bus', label: 'Buses', icon: <Bus className="h-5 w-5" /> },
];

const stopOptions = [
    { value: '-1', label: 'Any' },
    { value: '0', label: 'Direct' },
    { value: '1', label: '1 Stop' },
    { value: '2', label: '2+ Stops' },
];

interface FilterControlsProps {
  transportModes: Set<TransportMode>;
  onTransportModeChange: (mode: TransportMode, checked: boolean) => void;
  priceBounds: [number, number];
  maxPrice: number;
  onMaxPriceChange: (value: number) => void;
  numStops: number;
  onNumStopsChange: (value: number) => void;
}

export default function FilterControls({
  transportModes,
  onTransportModeChange,
  priceBounds,
  maxPrice,
  onMaxPriceChange,
  numStops,
  onNumStopsChange
}: FilterControlsProps) {
  return (
    <Card className="mb-4">
        <CardContent className="p-0">
            <Accordion type="multiple" defaultValue={['transport', 'price', 'stops']} className="w-full">
                <AccordionItem value="transport">
                    <AccordionTrigger className="px-6 py-4 text-base font-semibold">Transport Mode</AccordionTrigger>
                    <AccordionContent className="px-6">
                        <div className="space-y-3">
                            {transportOptions.map(option => (
                                <div key={option.mode} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`mode-${option.mode}`}
                                        checked={transportModes.has(option.mode)}
                                        onCheckedChange={(checked) => onTransportModeChange(option.mode, !!checked)}
                                    />
                                    <Label htmlFor={`mode-${option.mode}`} className="flex items-center gap-2 cursor-pointer">
                                        {option.icon}
                                        <span>{option.label}</span>
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="price">
                    <AccordionTrigger className="px-6 py-4 text-base font-semibold">Max Price</AccordionTrigger>
                    <AccordionContent className="px-6">
                        <div className="py-2">
                            <div className="flex justify-between items-center mb-2">
                                <Label>Price Limit</Label>
                                <span className="font-semibold text-primary">₹{maxPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <Slider
                                min={priceBounds[0]}
                                max={priceBounds[1]}
                                step={100}
                                value={[maxPrice]}
                                onValueChange={(value) => onMaxPriceChange(value[0])}
                            />
                             <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>₹{priceBounds[0].toLocaleString('en-IN')}</span>
                                <span>₹{priceBounds[1].toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="stops" className="border-b-0">
                    <AccordionTrigger className="px-6 py-4 text-base font-semibold">Stops</AccordionTrigger>
                    <AccordionContent className="px-6">
                        <RadioGroup
                            value={String(numStops)}
                            onValueChange={(value) => onNumStopsChange(Number(value))}
                        >
                            <div className="space-y-2">
                                {stopOptions.map(option => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                        <RadioGroupItem value={option.value} id={`stops-${option.value}`} />
                                        <Label htmlFor={`stops-${option.value}`} className="cursor-pointer">{option.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
    </Card>
  );
}
