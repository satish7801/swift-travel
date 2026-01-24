// Train Classes and Schedule Templates
// Represents Indian Railway class types and typical schedules

export interface TrainClass {
    code: string;
    name: string;
    description: string;
    fareMultiplier: number; // Relative to base SL fare
    amenities: string[];
}

export const TRAIN_CLASSES: TrainClass[] = [
    {
        code: '1A',
        name: 'First Class AC',
        description: 'Fully air-conditioned with lockable cabins',
        fareMultiplier: 5.0,
        amenities: ['AC', 'Bedding', 'Lockable Cabin', 'Reading Light', 'Charging Point'],
    },
    {
        code: '2A',
        name: 'AC 2 Tier',
        description: 'Air-conditioned with 2-tier berths',
        fareMultiplier: 3.0,
        amenities: ['AC', 'Bedding', 'Curtains', 'Charging Point'],
    },
    {
        code: '3A',
        name: 'AC 3 Tier',
        description: 'Air-conditioned with 3-tier berths',
        fareMultiplier: 2.0,
        amenities: ['AC', 'Bedding', 'Charging Point'],
    },
    {
        code: '3E',
        name: 'AC 3 Tier Economy',
        description: 'Economy AC with extra berths',
        fareMultiplier: 1.75,
        amenities: ['AC', 'Bedding'],
    },
    {
        code: 'SL',
        name: 'Sleeper',
        description: 'Non-AC 3-tier sleeper coach',
        fareMultiplier: 1.0,
        amenities: ['Bedding', 'Charging Point'],
    },
    {
        code: 'CC',
        name: 'AC Chair Car',
        description: 'Air-conditioned seating for day travel',
        fareMultiplier: 1.5,
        amenities: ['AC', 'Reclining Seats', 'Charging Point'],
    },
    {
        code: 'EC',
        name: 'Executive Class',
        description: 'Premium AC seating with extra space',
        fareMultiplier: 4.0,
        amenities: ['AC', 'Wide Seats', 'Meal Included', 'WiFi'],
    },
    {
        code: '2S',
        name: 'Second Sitting',
        description: 'Reserved seating for short distance',
        fareMultiplier: 0.5,
        amenities: ['Reserved Seat'],
    },
];

export const trainClassByCode = new Map<string, TrainClass>(
    TRAIN_CLASSES.map(tc => [tc.code, tc])
);

// Popular train types
export interface TrainType {
    prefix: string;
    name: string;
    description: string;
    classes: string[];
    avgSpeed: number; // km/h
}

export const TRAIN_TYPES: TrainType[] = [
    {
        prefix: '12',
        name: 'Rajdhani Express',
        description: 'Premium fully AC train connecting capitals',
        classes: ['1A', '2A', '3A'],
        avgSpeed: 80,
    },
    {
        prefix: '12',
        name: 'Shatabdi Express',
        description: 'Fast day train with chair car',
        classes: ['EC', 'CC'],
        avgSpeed: 85,
    },
    {
        prefix: '22',
        name: 'Vande Bharat Express',
        description: 'Semi-high speed train with premium amenities',
        classes: ['EC', 'CC'],
        avgSpeed: 100,
    },
    {
        prefix: '12',
        name: 'Duronto Express',
        description: 'Non-stop long distance train',
        classes: ['1A', '2A', '3A', 'SL'],
        avgSpeed: 75,
    },
    {
        prefix: '22',
        name: 'Tejas Express',
        description: 'Premium train with onboard entertainment',
        classes: ['EC', 'CC'],
        avgSpeed: 90,
    },
    {
        prefix: '12',
        name: 'Garib Rath',
        description: 'Budget AC train',
        classes: ['3A', '3E'],
        avgSpeed: 60,
    },
    {
        prefix: '11',
        name: 'Superfast Express',
        description: 'Standard express train',
        classes: ['2A', '3A', 'SL'],
        avgSpeed: 55,
    },
    {
        prefix: '15',
        name: 'Express',
        description: 'Regular mail/express train',
        classes: ['2A', '3A', 'SL', '2S'],
        avgSpeed: 45,
    },
];

// Berth types
export type BerthType = 'LB' | 'MB' | 'UB' | 'SL' | 'SU' | 'CABIN';

export const BERTH_NAMES: Record<BerthType, string> = {
    LB: 'Lower Berth',
    MB: 'Middle Berth',
    UB: 'Upper Berth',
    SL: 'Side Lower',
    SU: 'Side Upper',
    CABIN: 'Cabin',
};

// PNR Status types
export type PNRStatus = 'CNF' | 'RAC' | 'WL' | 'GNWL' | 'RLWL' | 'PQWL' | 'REGRET';

export interface PNRInfo {
    pnr: string;
    trainNumber: string;
    trainName: string;
    from: string;
    to: string;
    boardingPoint: string;
    destinationPoint: string;
    journeyDate: string;
    bookingDate: string;
    classType: string;
    passengers: PNRPassenger[];
    chartStatus: 'NOT PREPARED' | 'PREPARED';
}

export interface PNRPassenger {
    name: string;
    age: number;
    gender: 'M' | 'F' | 'O';
    bookingStatus: string; // e.g., "S5,31,LB" or "WL/52"
    currentStatus: string; // e.g., "CNF/S5/31/LB" or "RAC/5"
}

/**
 * Generate a random PNR number (10 digits)
 */
export function generatePNR(): string {
    const digits = '0123456789';
    let pnr = '';
    for (let i = 0; i < 10; i++) {
        pnr += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return pnr;
}

/**
 * Generate a booking status string
 */
export function generateBookingStatus(
    classCode: string,
    isConfirmed: boolean,
    berthType?: BerthType
): string {
    if (!isConfirmed) {
        const wlNumber = Math.floor(Math.random() * 100) + 1;
        return `WL/${wlNumber}`;
    }

    const coach = classCode.charAt(0) + Math.floor(Math.random() * 10 + 1);
    const seat = Math.floor(Math.random() * 72) + 1;
    const berth = berthType || (['LB', 'MB', 'UB', 'SL', 'SU'][Math.floor(Math.random() * 5)] as BerthType);

    return `${coach},${seat},${berth}`;
}
