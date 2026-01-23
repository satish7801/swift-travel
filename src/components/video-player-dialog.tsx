"use client";

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Loader2, Video } from 'lucide-react';
import type { Route } from '@/lib/types';
import { generateVideoAction } from '@/app/trips/actions';

interface VideoPlayerDialogProps {
  route: Route | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoPlayerDialog({ route, isOpen, onClose }: VideoPlayerDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [videoDataUri, setVideoDataUri] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && route && !videoDataUri && !isLoading && !error) {
      setIsLoading(true);
      setError(null);
      setVideoDataUri(null);

      generateVideoAction(route)
        .then(result => {
          if (result.videoDataUri) {
            setVideoDataUri(result.videoDataUri);
          } else if (result.error) {
            setError(result.error);
          }
        })
        .catch(err => {
          setError(err.message || 'An unexpected error occurred during video generation.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (!isOpen) {
        // Reset state when dialog is closed to be ready for next open
        setTimeout(() => {
            setIsLoading(false);
            setError(null);
            setVideoDataUri(null);
        }, 300); // Delay to allow for closing animation
    }
  }, [isOpen, route, videoDataUri, isLoading, error]);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Your Trip Video Itinerary</AlertDialogTitle>
          {route && (
            <AlertDialogDescription>
              A cinematic preview of your journey from {route.legs[0].departureLocation.split(',')[0]} to {route.legs[route.legs.length - 1].arrivalLocation.split(',')[0]}.
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        
        <div className="aspect-[9/16] bg-muted rounded-md flex items-center justify-center my-4 relative overflow-hidden">
          {isLoading && (
            <div className="text-center text-muted-foreground p-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="font-semibold">Generating video...</p>
              <p className="text-sm">This can take up to a minute. Please wait.</p>
            </div>
          )}
          {error && (
            <div className="text-center text-destructive p-4">
              <p className="font-semibold">Video Generation Failed</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {videoDataUri && (
            <video
              src={videoDataUri}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain rounded-md"
            />
          )}
          {!isLoading && !error && !videoDataUri && (
              <div className="text-center text-muted-foreground">
                  <Video className="h-10 w-10 mx-auto" />
                  <p>Video will appear here.</p>
              </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
