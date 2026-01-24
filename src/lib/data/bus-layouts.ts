// Bus Seat Layout Generation
// Generates realistic bus seat layouts for different bus types

export interface SeatLayout {
    busType: string;
    rows: number;
    columns: number;
    decks: 1 | 2;
    totalSeats: number;
    seats: Seat[];
}

export interface Seat {
    id: string;
    row: number;
    column: number;
    deck: 1 | 2;
    type: 'seater' | 'sleeper' | 'semi-sleeper';
    position: 'window' | 'aisle' | 'middle';
    available: boolean;
    price: number;
    gender?: 'M' | 'F' | 'any';
}

export type BusType =
    | 'AC Sleeper'
    | 'Non-AC Sleeper'
    | 'AC Semi-Sleeper'
    | 'Non-AC Semi-Sleeper'
    | 'Volvo Multi-Axle'
    | 'AC Seater'
    | 'Non-AC Seater';

interface LayoutConfig {
    rows: number;
    columns: number;
    decks: 1 | 2;
    seatType: 'seater' | 'sleeper' | 'semi-sleeper';
    baseFare: number;
}

const LAYOUT_CONFIGS: Record<BusType, LayoutConfig> = {
    'AC Sleeper': { rows: 10, columns: 3, decks: 2, seatType: 'sleeper', baseFare: 1500 },
    'Non-AC Sleeper': { rows: 10, columns: 3, decks: 2, seatType: 'sleeper', baseFare: 800 },
    'AC Semi-Sleeper': { rows: 12, columns: 4, decks: 1, seatType: 'semi-sleeper', baseFare: 1200 },
    'Non-AC Semi-Sleeper': { rows: 12, columns: 4, decks: 1, seatType: 'semi-sleeper', baseFare: 600 },
    'Volvo Multi-Axle': { rows: 11, columns: 4, decks: 1, seatType: 'seater', baseFare: 1800 },
    'AC Seater': { rows: 13, columns: 5, decks: 1, seatType: 'seater', baseFare: 1000 },
    'Non-AC Seater': { rows: 14, columns: 5, decks: 1, seatType: 'seater', baseFare: 400 },
};

/**
 * Generate a realistic bus seat layout
 */
export function generateSeatLayout(
    busType: BusType,
    basePrice: number,
    occupancyRate: number = 0.6
): SeatLayout {
    const config = LAYOUT_CONFIGS[busType];
    const seats: Seat[] = [];

    for (let deck = 1; deck <= config.decks; deck++) {
        for (let row = 1; row <= config.rows; row++) {
            for (let col = 1; col <= config.columns; col++) {
                // Skip aisle column for seaters (column 3 in 2+2 layout)
                if (config.seatType === 'seater' && config.columns === 5 && col === 3) {
                    continue;
                }
                if (config.seatType === 'semi-sleeper' && config.columns === 4 && col === 2) {
                    continue;
                }

                // Determine position
                let position: 'window' | 'aisle' | 'middle';
                if (col === 1 || col === config.columns) {
                    position = 'window';
                } else if (col === 2 || col === config.columns - 1) {
                    position = 'aisle';
                } else {
                    position = 'middle';
                }

                // Price varies by position and deck
                let price = basePrice;
                if (position === 'window') price *= 1.1;
                if (deck === 1 && config.decks === 2) price *= 1.15; // Lower deck premium

                // Random availability based on occupancy
                const available = Math.random() > occupancyRate;

                // Generate seat ID (e.g., "L1", "U15", "A5")
                const deckPrefix = config.decks === 2 ? (deck === 1 ? 'L' : 'U') : '';
                const seatId = `${deckPrefix}${row * config.columns + col}`;

                seats.push({
                    id: seatId,
                    row,
                    column: col,
                    deck: deck as 1 | 2,
                    type: config.seatType,
                    position,
                    available,
                    price: Math.round(price / 10) * 10,
                    gender: 'any',
                });
            }
        }
    }

    return {
        busType,
        rows: config.rows,
        columns: config.columns,
        decks: config.decks,
        totalSeats: seats.length,
        seats,
    };
}

/**
 * Check seat availability
 */
export function getAvailableSeats(layout: SeatLayout): Seat[] {
    return layout.seats.filter(s => s.available);
}

/**
 * Get seat by ID
 */
export function getSeatById(layout: SeatLayout, seatId: string): Seat | undefined {
    return layout.seats.find(s => s.id === seatId);
}

/**
 * Calculate total available seats
 */
export function countAvailableSeats(layout: SeatLayout): number {
    return layout.seats.filter(s => s.available).length;
}

/**
 * Get availability status text
 */
export function getAvailabilityStatus(layout: SeatLayout): string {
    const available = countAvailableSeats(layout);
    const total = layout.totalSeats;
    const percentage = (available / total) * 100;

    if (percentage > 50) return 'Available';
    if (percentage > 20) return 'Filling Fast';
    if (percentage > 0) return 'Few Seats Left';
    return 'Sold Out';
}
