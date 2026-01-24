// Bus Operators in India - Major private and SRTC operators

export interface BusOperator {
    id: string;
    name: string;
    shortName: string;
    type: 'private' | 'srtc';
    routes: string[]; // Major operating regions
    amenities?: string[];
}

export const BUS_OPERATORS: BusOperator[] = [
    // Private Operators
    {
        id: 'vrl',
        name: 'VRL Travels',
        shortName: 'VRL',
        type: 'private',
        routes: ['Karnataka', 'Maharashtra', 'Goa', 'Andhra Pradesh'],
        amenities: ['AC', 'Sleeper', 'Semi-Sleeper', 'WiFi'],
    },
    {
        id: 'srs',
        name: 'SRS Travels',
        shortName: 'SRS',
        type: 'private',
        routes: ['Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Karnataka'],
        amenities: ['AC', 'Sleeper', 'Semi-Sleeper'],
    },
    {
        id: 'neeta',
        name: 'Neeta Travels',
        shortName: 'Neeta',
        type: 'private',
        routes: ['Gujarat', 'Maharashtra', 'Rajasthan', 'Madhya Pradesh'],
        amenities: ['AC', 'Sleeper', 'Multi-Axle Volvo'],
    },
    {
        id: 'srsm',
        name: 'SRSM Travels',
        shortName: 'SRSM',
        type: 'private',
        routes: ['Andhra Pradesh', 'Karnataka', 'Tamil Nadu'],
    },
    {
        id: 'orange',
        name: 'Orange Travels',
        shortName: 'Orange',
        type: 'private',
        routes: ['Andhra Pradesh', 'Telangana', 'Karnataka'],
        amenities: ['AC', 'Sleeper'],
    },
    {
        id: 'kallada',
        name: 'Kallada Travels',
        shortName: 'Kallada',
        type: 'private',
        routes: ['Kerala', 'Tamil Nadu', 'Karnataka'],
        amenities: ['AC', 'Sleeper', 'Scania'],
    },
    {
        id: 'ksrtc_kerala',
        name: 'Kerala State RTC',
        shortName: 'KSRTC (Kerala)',
        type: 'srtc',
        routes: ['Kerala', 'Tamil Nadu', 'Karnataka'],
    },
    {
        id: 'ksrtc_karnataka',
        name: 'Karnataka State RTC',
        shortName: 'KSRTC (Karnataka)',
        type: 'srtc',
        routes: ['Karnataka', 'Maharashtra', 'Goa', 'Tamil Nadu', 'Kerala'],
        amenities: ['AC', 'Sleeper', 'Volvo', 'Airavat'],
    },
    {
        id: 'apsrtc',
        name: 'Andhra Pradesh State RTC',
        shortName: 'APSRTC',
        type: 'srtc',
        routes: ['Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Karnataka'],
    },
    {
        id: 'tsrtc',
        name: 'Telangana State RTC',
        shortName: 'TSRTC',
        type: 'srtc',
        routes: ['Telangana', 'Andhra Pradesh', 'Maharashtra', 'Karnataka'],
    },
    {
        id: 'msrtc',
        name: 'Maharashtra State RTC',
        shortName: 'MSRTC',
        type: 'srtc',
        routes: ['Maharashtra', 'Gujarat', 'Goa', 'Karnataka'],
        amenities: ['Shivneri', 'Ashwamedh'],
    },
    {
        id: 'gsrtc',
        name: 'Gujarat State RTC',
        shortName: 'GSRTC',
        type: 'srtc',
        routes: ['Gujarat', 'Rajasthan', 'Maharashtra', 'Madhya Pradesh'],
    },
    {
        id: 'rsrtc',
        name: 'Rajasthan State RTC',
        shortName: 'RSRTC',
        type: 'srtc',
        routes: ['Rajasthan', 'Gujarat', 'Delhi', 'Madhya Pradesh'],
    },
    {
        id: 'upsrtc',
        name: 'Uttar Pradesh State RTC',
        shortName: 'UPSRTC',
        type: 'srtc',
        routes: ['Uttar Pradesh', 'Delhi', 'Uttarakhand', 'Madhya Pradesh', 'Bihar'],
    },
    {
        id: 'hrtc',
        name: 'Himachal Road Transport Corporation',
        shortName: 'HRTC',
        type: 'srtc',
        routes: ['Himachal Pradesh', 'Delhi', 'Punjab', 'Chandigarh'],
    },
    {
        id: 'punjab_roadways',
        name: 'Punjab Roadways',
        shortName: 'PRTC',
        type: 'srtc',
        routes: ['Punjab', 'Delhi', 'Haryana', 'Himachal Pradesh'],
    },
    {
        id: 'wbtc',
        name: 'West Bengal Transport Corporation',
        shortName: 'WBTC',
        type: 'srtc',
        routes: ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand'],
    },
    {
        id: 'osrtc',
        name: 'Odisha State RTC',
        shortName: 'OSRTC',
        type: 'srtc',
        routes: ['Odisha', 'West Bengal', 'Chhattisgarh', 'Jharkhand'],
    },
    {
        id: 'setc',
        name: 'State Express Transport Corporation (TN)',
        shortName: 'SETC',
        type: 'srtc',
        routes: ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh'],
    },
    {
        id: 'tnstc',
        name: 'Tamil Nadu State Transport',
        shortName: 'TNSTC',
        type: 'srtc',
        routes: ['Tamil Nadu'],
    },
    {
        id: 'parveen',
        name: 'Parveen Travels',
        shortName: 'Parveen',
        type: 'private',
        routes: ['Tamil Nadu', 'Karnataka', 'Kerala'],
        amenities: ['AC', 'Multi-Axle', 'Sleeper'],
    },
    {
        id: 'paulo',
        name: 'Paulo Travels',
        shortName: 'Paulo',
        type: 'private',
        routes: ['Maharashtra', 'Gujarat', 'Goa', 'Karnataka'],
        amenities: ['AC', 'Sleeper', 'Multi-Axle'],
    },
    {
        id: 'hans',
        name: 'Hans Travels',
        shortName: 'Hans',
        type: 'private',
        routes: ['Maharashtra', 'Gujarat'],
    },
    {
        id: 'shrinath',
        name: 'Shrinath Travels',
        shortName: 'Shrinath',
        type: 'private',
        routes: ['Gujarat', 'Rajasthan', 'Maharashtra'],
    },
];

export const busOperatorById = new Map<string, BusOperator>(
    BUS_OPERATORS.map(op => [op.id, op])
);
