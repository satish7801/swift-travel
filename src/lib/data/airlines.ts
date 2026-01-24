// Indian Airlines - Domestic carriers

export interface Airline {
    code: string; // IATA code
    name: string;
    shortName: string;
    type: 'fsc' | 'lcc'; // Full Service Carrier or Low Cost Carrier
    prefixes: string[]; // Flight number prefixes
}

export const AIRLINES: Airline[] = [
    // LCC - Low Cost Carriers
    {
        code: '6E',
        name: 'IndiGo',
        shortName: 'IndiGo',
        type: 'lcc',
        prefixes: ['6E'],
    },
    {
        code: 'SG',
        name: 'SpiceJet',
        shortName: 'SpiceJet',
        type: 'lcc',
        prefixes: ['SG'],
    },
    {
        code: 'G8',
        name: 'Go First',
        shortName: 'Go First',
        type: 'lcc',
        prefixes: ['G8'],
    },
    {
        code: 'I5',
        name: 'AirAsia India',
        shortName: 'AirAsia',
        type: 'lcc',
        prefixes: ['I5'],
    },
    {
        code: 'IX',
        name: 'Air India Express',
        shortName: 'AI Express',
        type: 'lcc',
        prefixes: ['IX'],
    },
    {
        code: 'QP',
        name: 'Akasa Air',
        shortName: 'Akasa',
        type: 'lcc',
        prefixes: ['QP'],
    },

    // FSC - Full Service Carriers
    {
        code: 'AI',
        name: 'Air India',
        shortName: 'Air India',
        type: 'fsc',
        prefixes: ['AI'],
    },
    {
        code: 'UK',
        name: 'Vistara',
        shortName: 'Vistara',
        type: 'fsc',
        prefixes: ['UK'],
    },
];

export const airlineByCode = new Map<string, Airline>(
    AIRLINES.map(a => [a.code, a])
);

// Major Indian Airports
export interface Airport {
    code: string; // IATA code
    name: string;
    city: string;
    state: string;
}

export const AIRPORTS: Airport[] = [
    { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', state: 'Delhi' },
    { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', state: 'Maharashtra' },
    { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru', state: 'Karnataka' },
    { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', state: 'Tamil Nadu' },
    { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', state: 'West Bengal' },
    { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', state: 'Telangana' },
    { code: 'COK', name: 'Cochin International Airport', city: 'Kochi', state: 'Kerala' },
    { code: 'PNQ', name: 'Pune Airport', city: 'Pune', state: 'Maharashtra' },
    { code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', state: 'Gujarat' },
    { code: 'GOI', name: 'Goa International Airport (Dabolim)', city: 'Goa', state: 'Goa' },
    { code: 'GOX', name: 'Manohar International Airport', city: 'Goa', state: 'Goa' },
    { code: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', state: 'Rajasthan' },
    { code: 'LKO', name: 'Chaudhary Charan Singh International Airport', city: 'Lucknow', state: 'Uttar Pradesh' },
    { code: 'TRV', name: 'Trivandrum International Airport', city: 'Thiruvananthapuram', state: 'Kerala' },
    { code: 'IXC', name: 'Chandigarh International Airport', city: 'Chandigarh', state: 'Chandigarh' },
    { code: 'GAU', name: 'Lokpriya Gopinath Bordoloi International Airport', city: 'Guwahati', state: 'Assam' },
    { code: 'VNS', name: 'Lal Bahadur Shastri International Airport', city: 'Varanasi', state: 'Uttar Pradesh' },
    { code: 'ATQ', name: 'Sri Guru Ram Dass Jee International Airport', city: 'Amritsar', state: 'Punjab' },
    { code: 'CJB', name: 'Coimbatore International Airport', city: 'Coimbatore', state: 'Tamil Nadu' },
    { code: 'PAT', name: 'Jay Prakash Narayan International Airport', city: 'Patna', state: 'Bihar' },
    { code: 'IXR', name: 'Birsa Munda Airport', city: 'Ranchi', state: 'Jharkhand' },
    { code: 'BBI', name: 'Biju Patnaik International Airport', city: 'Bhubaneswar', state: 'Odisha' },
    { code: 'JDH', name: 'Jodhpur Airport', city: 'Jodhpur', state: 'Rajasthan' },
    { code: 'UDR', name: 'Maharana Pratap Airport', city: 'Udaipur', state: 'Rajasthan' },
    { code: 'IXL', name: 'Kushok Bakula Rimpochee Airport', city: 'Leh', state: 'Ladakh' },
    { code: 'SXR', name: 'Sheikh ul-Alam International Airport', city: 'Srinagar', state: 'Jammu & Kashmir' },
    { code: 'IXJ', name: 'Jammu Airport', city: 'Jammu', state: 'Jammu & Kashmir' },
    { code: 'DED', name: 'Jolly Grant Airport', city: 'Dehradun', state: 'Uttarakhand' },
    { code: 'IXB', name: 'Bagdogra Airport', city: 'Siliguri', state: 'West Bengal' },
    { code: 'NAG', name: 'Dr. Babasaheb Ambedkar International Airport', city: 'Nagpur', state: 'Maharashtra' },
    { code: 'VTZ', name: 'Visakhapatnam International Airport', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
    { code: 'TIR', name: 'Tirupati Airport', city: 'Tirupati', state: 'Andhra Pradesh' },
    { code: 'IXM', name: 'Madurai Airport', city: 'Madurai', state: 'Tamil Nadu' },
    { code: 'CCJ', name: 'Calicut International Airport', city: 'Kozhikode', state: 'Kerala' },
    { code: 'MYQ', name: 'Mysore Airport', city: 'Mysuru', state: 'Karnataka' },
    { code: 'HBX', name: 'Hubballi Airport', city: 'Hubli', state: 'Karnataka' },
    { code: 'IXE', name: 'Mangalore International Airport', city: 'Mangaluru', state: 'Karnataka' },
    { code: 'IDR', name: 'Devi Ahilyabai Holkar Airport', city: 'Indore', state: 'Madhya Pradesh' },
    { code: 'BHO', name: 'Raja Bhoj Airport', city: 'Bhopal', state: 'Madhya Pradesh' },
    { code: 'RPR', name: 'Swami Vivekananda Airport', city: 'Raipur', state: 'Chhattisgarh' },
];

export const airportByCode = new Map<string, Airport>(
    AIRPORTS.map(a => [a.code, a])
);
