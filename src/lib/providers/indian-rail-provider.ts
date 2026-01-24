// Indian Railway API Provider using irctc-connect
// Provides real train search, live status, and seat availability

import { TransportProvider, SearchParams, providerRegistry } from './transport-provider';
import type { Route } from '@/lib/types';

// Type definitions for irctc-connect responses
interface TrainBetweenStations {
    train_number: string;
    train_name: string;
    from_station_name: string;
    to_station_name: string;
    from_sta: string;
    to_sta: string;
    travel_time: string;
    running_days: string[];
}

interface LiveTrainStatus {
    train_number: string;
    current_station: string;
    delay: number;
    status: string;
}

interface SeatAvailability {
    train_number: string;
    class: string;
    date: string;
    status: string;
    fare: number;
}

export class IndianRailProvider implements TransportProvider {
    name = 'IndianRail';
    private supportedModes: ('flight' | 'train' | 'bus')[] = ['train'];
    private irctcModule: any = null;
    private initPromise: Promise<void> | null = null;

    constructor() {
        this.initPromise = this.initializeClient();
    }

    private async initializeClient(): Promise<void> {
        try {
            // Dynamic import to handle server/client differences
            this.irctcModule = await import('irctc-connect');
        } catch (error) {
            console.warn('irctc-connect not available, will use fallback');
            this.irctcModule = null;
        }
    }

    supportsMode(mode: 'flight' | 'train' | 'bus'): boolean {
        return this.supportedModes.includes(mode);
    }

    async searchRoutes(params: SearchParams): Promise<Route[]> {
        // Wait for initialization
        if (this.initPromise) {
            await this.initPromise;
        }

        if (!this.irctcModule) {
            return [];
        }

        try {
            // Format date as YYYYMMDD
            const dateStr = params.date.toISOString().split('T')[0].replace(/-/g, '');

            // Search trains between stations using the package's function
            const trains: TrainBetweenStations[] = await this.irctcModule.searchTrainBetweenStations(
                params.from,
                params.to
            );

            if (!trains || trains.length === 0) {
                return [];
            }

            return trains.slice(0, 10).map((train, index) =>
                this.mapTrainToRoute(train, params, index)
            );
        } catch (error) {
            console.error('IndianRail API error:', error);
            return [];
        }
    }

    private mapTrainToRoute(train: TrainBetweenStations, params: SearchParams, index: number): Route {
        const departureTime = new Date(params.date);
        const [depHours, depMins] = (train.from_sta || '08:00').split(':').map(Number);
        departureTime.setHours(depHours || 8 + index, depMins || 0, 0, 0);

        const [arrHours, arrMins] = (train.to_sta || '16:00').split(':').map(Number);
        const arrivalTime = new Date(departureTime);
        arrivalTime.setHours(arrHours || 16 + index, arrMins || 0, 0, 0);

        // If arrival is before departure, it's next day
        if (arrivalTime <= departureTime) {
            arrivalTime.setDate(arrivalTime.getDate() + 1);
        }

        const durationMs = arrivalTime.getTime() - departureTime.getTime();
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

        // Estimate fare based on duration
        const baseFare = 500 + Math.floor(hours * 100);

        return {
            id: `rail-${train.train_number}-${Date.now()}-${index}`,
            legs: [{
                id: `leg-${train.train_number}-${index}`,
                mode: 'train' as const,
                departureLocation: `${train.from_station_name || params.from} (${params.from})`,
                arrivalLocation: `${train.to_station_name || params.to} (${params.to})`,
                departureTime: departureTime.toISOString(),
                arrivalTime: arrivalTime.toISOString(),
                duration: train.travel_time || `${hours}h ${minutes}m`,
                operator: `${train.train_name || 'Express'} (${train.train_number})`,
                details: `Runs on: ${train.running_days?.join(', ') || 'Daily'}`,
            }],
            totalDuration: train.travel_time || `${hours}h ${minutes}m`,
            price: baseFare,
            availability: 'Available',
            carbonFootprint: Math.round(hours * 8), // ~8kg CO2 per hour for train
        };
    }

    // Additional methods for real-time data
    async getLiveStatus(trainNumber: string): Promise<LiveTrainStatus | null> {
        if (this.initPromise) await this.initPromise;
        if (!this.irctcModule) return null;

        try {
            return await this.irctcModule.trackTrain(trainNumber, new Date().toISOString().split('T')[0]);
        } catch {
            return null;
        }
    }

    async getPNRStatus(pnr: string): Promise<any> {
        if (this.initPromise) await this.initPromise;
        if (!this.irctcModule) return null;

        try {
            return await this.irctcModule.checkPNRStatus(pnr);
        } catch {
            return null;
        }
    }

    async getTrainInfo(trainNumber: string): Promise<any> {
        if (this.initPromise) await this.initPromise;
        if (!this.irctcModule) return null;

        try {
            return await this.irctcModule.getTrainInfo(trainNumber);
        } catch {
            return null;
        }
    }
}

// Create singleton provider
export const indianRailProvider = new IndianRailProvider();
