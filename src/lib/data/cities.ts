export interface City {
    name: string;
    aliases: string[];
    state: string;
    imageUrl?: string;
    bestPlaceName?: string;
    stationCodes: string[];
    airportCode?: string;
    description?: string;
    lat: number;
    lng: number;
    attractions?: string[];
}

// Major Indian cities and tourist destinations for "Smart Suggestions" and Autocomplete Metadata
export const CITIES: City[] = [
    // North India
    {
        name: "New Delhi",
        aliases: ["delhi", "ndls", "dli"],
        state: "Delhi",
        imageUrl: "https://images.unsplash.com/photo-1587474260584-18d45140e698?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "India Gate",
        stationCodes: ["NDLS", "DLI", "NZM"],
        airportCode: "DEL",
        lat: 28.6139,
        lng: 77.2090,
        attractions: ["India Gate", "Red Fort", "Qutub Minar", "Humayun's Tomb", "Lotus Temple", "Akshardham Temple"]
    },
    {
        name: "Agra",
        aliases: ["agc"],
        state: "Uttar Pradesh",
        imageUrl: "https://images.unsplash.com/photo-1564659130741-9a4d8d7d8b8b?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Taj Mahal",
        stationCodes: ["AGC", "AF"],
        lat: 27.1767,
        lng: 78.0081,
        attractions: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Mehtab Bagh"]
    },
    {
        name: "Jaipur",
        aliases: ["pink city", "jp"],
        state: "Rajasthan",
        imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Hawa Mahal",
        stationCodes: ["JP"],
        airportCode: "JAI",
        lat: 26.9124,
        lng: 75.7873,
        attractions: ["Hawa Mahal", "Amber Fort", "City Palace", "Jantar Mantar", "Nahargarh Fort"]
    },
    {
        name: "Jodhpur",
        aliases: ["jdh", "blue city"],
        state: "Rajasthan",
        imageUrl: "https://images.unsplash.com/photo-1599471012581-8b9b0a6f2469?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Mehrangarh Fort",
        stationCodes: ["JU"],
        airportCode: "JDH",
        lat: 26.2389,
        lng: 73.0243,
        attractions: ["Mehrangarh Fort", "Jaswant Thada", "Umaid Bhawan Palace", "Clock Tower Market"]
    },
    {
        name: "Udaipur",
        aliases: ["lake city", "udz"],
        state: "Rajasthan",
        imageUrl: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Lake Pichola",
        stationCodes: ["UDZ"],
        airportCode: "UDR",
        lat: 24.5854,
        lng: 73.7125,
        attractions: ["City Palace", "Lake Pichola", "Jag Mandir", "Fateh Sagar Lake", "Saheliyon Ki Bari"]
    },
    {
        name: "Ajmer",
        aliases: ["ajm"],
        state: "Rajasthan",
        imageUrl: "https://images.unsplash.com/photo-1614090785053-3b8f1a0d7f8b?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Ajmer Sharif Dargah",
        stationCodes: ["AII"],
        lat: 26.4499,
        lng: 74.6399,
        attractions: ["Ajmer Sharif Dargah", "Ana Sagar Lake", "Taragarh Fort", "Adhai Din Ka Jhonpra"]
    },
    {
        name: "Pushkar",
        aliases: ["psk"],
        state: "Rajasthan",
        imageUrl: "https://images.unsplash.com/photo-1600788913701-2c8b4a0f8c53?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Pushkar Lake",
        stationCodes: [],
        lat: 26.4897,
        lng: 74.5511,
        attractions: ["Pushkar Lake", "Brahma Temple", "Savitri Temple", "Pushkar Camel Fair"]
    },
    {
        name: "Bikaner",
        aliases: ["bkn"],
        state: "Rajasthan",
        imageUrl: "https://images.unsplash.com/photo-1603102324984-4d5a9c7c8a2b?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Junagarh Fort",
        stationCodes: ["BKN"],
        lat: 28.0229,
        lng: 73.3119,
        attractions: ["Junagarh Fort", "Karni Mata Temple", "Lalgarh Palace", "Camel Research Centre"]
    },
    {
        name: "Mount Abu",
        aliases: ["abu"],
        state: "Rajasthan",
        imageUrl: "https://images.unsplash.com/photo-1593950372426-0d71aefb6f34?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Dilwara Temples",
        stationCodes: [],
        lat: 24.5925,
        lng: 72.7156,
        attractions: ["Dilwara Temples", "Nakki Lake", "Guru Shikhar", "Sunset Point"]
    },
    {
        name: "Chittorgarh",
        aliases: ["cor"],
        state: "Rajasthan",
        imageUrl: "https://images.unsplash.com/photo-1615208762592-3c3f91b8f2c4?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Chittorgarh Fort",
        stationCodes: ["COR"],
        lat: 24.8887,
        lng: 74.6269,
        attractions: ["Chittorgarh Fort", "Vijay Stambh", "Kirti Stambh", "Rani Padmini Palace"]
    },
    {
        name: "Haridwar",
        aliases: ["hw"],
        state: "Uttarakhand",
        imageUrl: "https://images.unsplash.com/photo-1596022066366-26511b068261?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Har Ki Pauri",
        stationCodes: ["HW"],
        lat: 29.9457,
        lng: 78.1642,
        attractions: [
            "Har Ki Pauri", "Mansa Devi Temple", "Chandi Devi Temple", "Ganga Aarti",
            "Shantikunj Gayatri Parivar", "Bharat Mata Mandir", "Patanjali Yogpeeth",
            "Rajaji National Park", "Daksh Mahadev Temple", "Maya Devi Temple",
            "Sapt Rishi Ashram", "Pawan Dham", "Parad Shivling"
        ]
    },
    {
        name: "Rishikesh",
        aliases: ["yoga capital"],
        state: "Uttarakhand",
        imageUrl: "https://images.unsplash.com/photo-1583252985789-9a674534882c?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Laxman Jhula",
        stationCodes: ["RKSH"],
        lat: 30.0869,
        lng: 78.2676,
        attractions: [
            "Laxman Jhula", "Ram Jhula", "Parmarth Niketan", "Triveni Ghat", "Beatles Ashram",
            "Neer Garh Waterfall", "Shivpuri (Rafting)", "Tera Manzil Temple", "Vashishta Gufa",
            "Kunjapuri Devi Temple"
        ]
    },
    {
        name: "Manali",
        aliases: ["kullu"],
        state: "Himachal Pradesh",
        imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Solang Valley",
        stationCodes: [],
        lat: 32.2432,
        lng: 77.1892,
        attractions: ["Solang Valley", "Rohtang Pass", "Hadimba Temple", "Old Manali", "Vashisht Baths"]
    },
    {
        name: "Shimla",
        aliases: ["simla"],
        state: "Himachal Pradesh",
        imageUrl: "https://images.unsplash.com/photo-1562649846-ab413ca01712?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "The Ridge",
        stationCodes: ["SML"],
        lat: 31.1048,
        lng: 77.1734,
        attractions: ["The Ridge", "Mall Road", "Jakhu Temple", "Christ Church", "Kufri"]
    },
    {
        name: "Varanasi",
        aliases: ["benaras", "kashi", "bsb"],
        state: "Uttar Pradesh",
        imageUrl: "https://images.unsplash.com/photo-1561361513-35e679c5a755?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Ganga Ghats",
        stationCodes: ["BSB", "DDU"],
        airportCode: "VNS",
        lat: 25.3176,
        lng: 82.9739,
        attractions: ["Kashi Vishwanath Temple", "Dashashwamedh Ghat", "Assi Ghat", "Sarnath", "Ganga Aarti"]
    },
    {
        name: "Amritsar",
        aliases: ["asr"],
        state: "Punjab",
        imageUrl: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Golden Temple",
        stationCodes: ["ASR"],
        airportCode: "ATQ",
        lat: 31.6340,
        lng: 74.8723,
        attractions: ["Golden Temple", "Jallianwala Bagh", "Wagah Border", "Partition Museum"]
    },

    // North East India
    {
        name: "Guwahati",
        aliases: ["ghy"],
        state: "Assam",
        imageUrl: "https://images.unsplash.com/photo-1603521696434-6c6c7d5a8c2a?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Kamakhya Temple",
        stationCodes: ["GHY"],
        airportCode: "GAU",
        lat: 26.1445,
        lng: 91.7362,
        attractions: ["Kamakhya Temple", "Umananda Island", "Assam State Museum", "Brahmaputra River Cruise"]
    },
    {
        name: "Dibrugarh",
        aliases: ["dib"],
        state: "Assam",
        imageUrl: "https://images.unsplash.com/photo-1610621782649-8a84f1a5a2e5?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Tea Gardens",
        stationCodes: ["DBRG"],
        airportCode: "DIB",
        lat: 27.4728,
        lng: 94.9110,
        attractions: ["Tea Gardens", "Dehing Patkai Wildlife Sanctuary", "Brahmaputra River", "Radha Krishna Mandir"]
    },
    {
        name: "Jorhat",
        aliases: ["jtt"],
        state: "Assam",
        imageUrl: "https://images.unsplash.com/photo-1617196035304-9c3d6c6c4f47?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Majuli Island",
        stationCodes: ["JTTN"],
        airportCode: "JRH",
        lat: 26.7509,
        lng: 94.2037,
        attractions: ["Majuli Island", "Tocklai Tea Research Centre", "Raja Maidam", "Gibbon Wildlife Sanctuary"]
    },
    {
        name: "Silchar",
        aliases: ["sil"],
        state: "Assam",
        imageUrl: "https://images.unsplash.com/photo-1611061787121-12c7b4e2d1f2?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Maniharan Tunnel",
        stationCodes: ["SCL"],
        airportCode: "IXS",
        lat: 24.8333,
        lng: 92.7789,
        attractions: ["Maniharan Tunnel", "Kachakanti Temple", "Gandhibagh Park", "Barak River"]
    },
    {
        name: "Tezpur",
        aliases: ["tzp"],
        state: "Assam",
        imageUrl: "https://images.unsplash.com/photo-1607603751385-3a9d71c1e1b3?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Agnigarh Hill",
        stationCodes: ["TZTB"],
        airportCode: "TEZ",
        lat: 26.6528,
        lng: 92.7926,
        attractions: ["Agnigarh Hill", "Cole Park", "Mahabhairab Temple", "Bamuni Hills"]
    },
    {
        name: "Kaziranga",
        aliases: ["kz"],
        state: "Assam",
        imageUrl: "https://images.unsplash.com/photo-1594561180581-5b8c5b1a2a2a?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Kaziranga National Park",
        stationCodes: [],
        lat: 26.5775,
        lng: 93.1711,
        attractions: ["Kaziranga National Park", "Jeep Safari", "Elephant Safari", "Brahmaputra Floodplains"]
    },
    {
        name: "Ayodhya",
        aliases: ["ay", "faizabad"],
        state: "Uttar Pradesh",
        imageUrl: "https://images.unsplash.com/photo-1705915464168-52b82e057303?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Ram Janmabhoomi",
        stationCodes: ["AY", "AYC"],
        airportCode: "AYJ",
        lat: 26.7994,
        lng: 82.2018,
        attractions: [
            "Ram Janmabhoomi", "Hanuman Garhi", "Kanak Bhawan", "Nageshwarnath Temple",
            "Saryu Ghat", "Guptar Ghat", "Treta Ke Thakur", "Ram Ki Paidi", "Tulsi Smarak Bhawan"
        ]
    },

    // West India
    {
        name: "Mumbai",
        aliases: ["bombay", "bom"],
        state: "Maharashtra",
        imageUrl: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Gateway of India",
        stationCodes: ["CSTM", "BCT", "LTT"],
        airportCode: "BOM",
        lat: 19.0760,
        lng: 72.8777,
        attractions: ["Gateway of India", "Marine Drive", "Elephanta Caves", "Colaba Causeway", "Juhu Beach"]
    },
    {
        name: "Ahmedabad",
        aliases: ["amd", "adi"],
        state: "Gujarat",
        imageUrl: "https://images.unsplash.com/photo-1585060592931-4876b3cb9137?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Sabarmati Ashram",
        stationCodes: ["ADI"],
        airportCode: "AMD",
        lat: 23.0225,
        lng: 72.5714,
        attractions: ["Sabarmati Ashram", "Adalaj Stepwell", "Kankaria Lake", "Sidi Saiyyed Mosque"]
    },
    {
        name: "Surat",
        aliases: ["st"],
        state: "Gujarat",
        imageUrl: "https://images.unsplash.com/photo-1623661088751-3c3c1a2c1b2a?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Dumas Beach",
        stationCodes: ["ST"],
        airportCode: "STV",
        lat: 21.1702,
        lng: 72.8311,
        attractions: ["Dumas Beach", "Dutch Garden", "Sarthana Nature Park", "Gopi Talav"]
    },
    {
        name: "Vadodara",
        aliases: ["baroda", "brc"],
        state: "Gujarat",
        imageUrl: "https://images.unsplash.com/photo-1610641818069-71cfc1b2dd2b?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Laxmi Vilas Palace",
        stationCodes: ["BRC"],
        airportCode: "BDQ",
        lat: 22.3072,
        lng: 73.1812,
        attractions: ["Laxmi Vilas Palace", "Sayaji Garden", "EME Temple", "Champaner-Pavagadh"]
    },
    {
        name: "Rajkot",
        aliases: ["rjt"],
        state: "Gujarat",
        imageUrl: "https://images.unsplash.com/photo-1604382355076-bc6c7a9d3a92?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Kaba Gandhi No Delo",
        stationCodes: ["RJT"],
        airportCode: "RAJ",
        lat: 22.3039,
        lng: 70.8022,
        attractions: ["Kaba Gandhi No Delo", "Rotary Dolls Museum", "Watson Museum", "Fun World"]
    },
    {
        name: "Bhuj",
        aliases: ["bhj"],
        state: "Gujarat",
        imageUrl: "https://images.unsplash.com/photo-1615059123218-98d3c5f4e8a2?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Kutch Museum",
        stationCodes: ["BHUJ"],
        airportCode: "BHJ",
        lat: 23.2410,
        lng: 69.6669,
        attractions: ["Kutch Museum", "Aina Mahal", "White Rann of Kutch", "Prag Mahal"]
    },
    {
        name: "Dwarka",
        aliases: ["dwk"],
        state: "Gujarat",
        imageUrl: "https://images.unsplash.com/photo-1604609390464-4a0d5b9c2c9d?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Dwarkadhish Temple",
        stationCodes: ["DWK"],
        lat: 22.2442,
        lng: 68.9685,
        attractions: ["Dwarkadhish Temple", "Bet Dwarka", "Rukmini Devi Temple", "Dwarka Beach"]
    },
    {
        name: "Somnath",
        aliases: ["som"],
        state: "Gujarat",
        imageUrl: "https://images.unsplash.com/photo-1606934391160-9b9a38c2c5d4?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Somnath Temple",
        stationCodes: ["SMNH"],
        lat: 20.8880,
        lng: 70.4012,
        attractions: ["Somnath Temple", "Triveni Sangam", "Somnath Beach", "Bhalka Tirth"]
    },
    {
        name: "Junagadh",
        aliases: ["jnd"],
        state: "Gujarat",
        imageUrl: "https://images.unsplash.com/photo-1602754872563-9d3d9b7f8a12?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Girnar Hill",
        stationCodes: ["JND"],
        lat: 21.5222,
        lng: 70.4579,
        attractions: ["Girnar Hill", "Uparkot Fort", "Mahabat Maqbara", "Sakkarbaug Zoo"]
    },
    {
        name: "Porbandar",
        aliases: ["pbr"],
        state: "Gujarat",
        imageUrl: "https://images.unsplash.com/photo-1603107311554-ecdfbde3f2a8?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Kirti Mandir",
        stationCodes: ["PBR"],
        airportCode: "PBD",
        lat: 21.6417,
        lng: 69.6293,
        attractions: ["Kirti Mandir", "Sudama Mandir", "Porbandar Beach", "Huzoor Palace"]
    },
    {
        name: "Pune",
        aliases: ["pun"],
        state: "Maharashtra",
        imageUrl: "https://images.unsplash.com/photo-1572883454114-1cf0031a10ab?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Shaniwar Wada",
        stationCodes: ["PUNE"],
        airportCode: "PNQ",
        lat: 18.5204,
        lng: 73.8567,
        attractions: ["Shaniwar Wada", "Aga Khan Palace", "Sinhagad Fort", "Dagdusheth Ganpati"]
    },
    {
        name: "Goa",
        aliases: ["panaji", "mao"],
        state: "Goa",
        imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Baga Beach",
        stationCodes: ["MAO", "THVM"],
        airportCode: "GOI",
        lat: 15.2993,
        lng: 74.1240,
        attractions: ["Baga Beach", "Calangute Beach", "Fort Aguada", "Basilica of Bom Jesus", "Dudhsagar Falls"]
    },
    {
        name: "Lonavala",
        aliases: ["lona"],
        state: "Maharashtra",
        imageUrl: "https://images.unsplash.com/photo-1594916801965-0a3bc7631336?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Tiger Point",
        stationCodes: ["LNL"],
        lat: 18.7515,
        lng: 73.4000,
        attractions: ["Tiger Point", "Bhushi Dam", "Karla Caves", "Lohagad Fort"]
    },
    {
        name: "Mahabaleshwar",
        aliases: [],
        state: "Maharashtra",
        imageUrl: "https://images.unsplash.com/photo-1626082929543-5bab5f274756?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Venna Lake",
        stationCodes: [],
        lat: 17.9237,
        lng: 73.6586,
        attractions: ["Venna Lake", "Mapro Garden", "Pratapgad Fort", "Elephant's Head Point"]
    },
    {
        name: "Nagpur",
        aliases: ["ngp"],
        state: "Maharashtra",
        imageUrl: "https://images.unsplash.com/photo-1600760091067-6c7b5f3b8a91?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Deekshabhoomi",
        stationCodes: ["NGP"],
        airportCode: "NAG",
        lat: 21.1458,
        lng: 79.0882,
        attractions: ["Deekshabhoomi", "Futala Lake", "Seminary Hill", "Ramtek Fort"]
    },
    {
        name: "Nashik",
        aliases: ["nas"],
        state: "Maharashtra",
        imageUrl: "https://images.unsplash.com/photo-1600691725116-2c13a5c7bfa3?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Trimbakeshwar Temple",
        stationCodes: ["NK"],
        airportCode: "ISK",
        lat: 19.9975,
        lng: 73.7898,
        attractions: ["Trimbakeshwar Temple", "Sula Vineyards", "Pandavleni Caves", "Ramkund"]
    },
    {
        name: "Aurangabad",
        aliases: ["abd"],
        state: "Maharashtra",
        imageUrl: "https://images.unsplash.com/photo-1614850715649-1f1b9f0c9a2b?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Ajanta Caves",
        stationCodes: ["AWB"],
        airportCode: "IXU",
        lat: 19.8762,
        lng: 75.3433,
        attractions: ["Ajanta Caves", "Ellora Caves", "Bibi Ka Maqbara", "Daulatabad Fort"]
    },
    {
        name: "Kolhapur",
        aliases: ["klp"],
        state: "Maharashtra",
        imageUrl: "https://images.unsplash.com/photo-1617453189337-3c1c6b8f2e9a?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Mahalaxmi Temple",
        stationCodes: ["KOP"],
        lat: 16.7050,
        lng: 74.2433,
        attractions: ["Mahalaxmi Temple", "Rankala Lake", "New Palace", "Panhala Fort"]
    },
    {
        name: "Ratnagiri",
        aliases: ["rtg"],
        state: "Maharashtra",
        imageUrl: "https://images.unsplash.com/photo-1616393949825-7c8a9b1d2f3a?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Ganpatipule Beach",
        stationCodes: ["RN"],
        lat: 16.9902,
        lng: 73.3120,
        attractions: ["Ganpatipule Beach", "Jaigad Fort", "Thibaw Palace", "Ratnadurga Fort"]
    },

    // South India
    {
        name: "Bengaluru",
        aliases: ["bangalore", "sbc", "ncj"],
        state: "Karnataka",
        imageUrl: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Bangalore Palace",
        stationCodes: ["SBC", "YPR"],
        airportCode: "BLR",
        lat: 12.9716,
        lng: 77.5946,
        attractions: ["Bangalore Palace", "Lalbagh Botanical Garden", "Cubbon Park", "Tipu Sultan's Palace"]
    },
    {
        name: "Mysuru",
        aliases: ["mysore", "mys"],
        state: "Karnataka",
        imageUrl: "https://images.unsplash.com/photo-1600100598800-4b36059d0449?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Mysore Palace",
        stationCodes: ["MYS"],
        lat: 12.2958,
        lng: 76.6394,
        attractions: ["Mysore Palace", "Chamundi Hill", "Brindavan Gardens", "St. Philomena's Church"]
    },
    {
        name: "Coorg",
        aliases: ["madikeri"],
        state: "Karnataka",
        imageUrl: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Abbey Falls",
        stationCodes: [],
        lat: 12.4244,
        lng: 75.7382,
        attractions: ["Abbey Falls", "Raja's Seat", "Dubare Elephant Camp", "Talakaveri"]
    },
    {
        name: "Ooty",
        aliases: ["udhagamandalam"],
        state: "Tamil Nadu",
        imageUrl: "https://images.unsplash.com/photo-1548325965-4203a11a8c62?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Ooty Lake",
        stationCodes: ["UAM"],
        lat: 11.4100,
        lng: 76.6950,
        attractions: ["Ooty Lake", "Botanical Garden", "Doddabetta Peak", "Nilgiri Mountain Railway"]
    },
    {
        name: "Chennai",
        aliases: ["madras", "mas"],
        state: "Tamil Nadu",
        imageUrl: "https://images.unsplash.com/photo-1582510003544-bea4dbccf3bf?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Marina Beach",
        stationCodes: ["MAS", "MS"],
        airportCode: "MAA",
        lat: 13.0827,
        lng: 80.2707,
        attractions: ["Marina Beach", "Kapaleeshwarar Temple", "Fort St. George", "San Thome Basilica"]
    },
    {
        name: "Munnar",
        aliases: [],
        state: "Kerala",
        imageUrl: "https://images.unsplash.com/photo-1593693411515-c20d63875284?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Tea Gardens",
        stationCodes: [],
        lat: 10.0889,
        lng: 77.0595,
        attractions: ["Tea Gardens", "Mattupetty Dam", "Eravikulam National Park", "Top Station"]
    },
    {
        name: "Kochi",
        aliases: ["cochin", "ers"],
        state: "Kerala",
        imageUrl: "https://images.unsplash.com/photo-1599661046289-e318d6d4deed?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Chinese Fishing Nets",
        stationCodes: ["ERS", "ERN"],
        airportCode: "COK",
        lat: 9.9312,
        lng: 76.2673,
        attractions: ["Fort Kochi", "Chinese Fishing Nets", "Mattancherry Palace", "Jew Town"]
    },

    // East & North East
    {
        name: "Kolkata",
        aliases: ["calcutta", "hwh", "ccu"],
        state: "West Bengal",
        imageUrl: "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Victoria Memorial",
        stationCodes: ["HWH", "SDAH"],
        airportCode: "CCU",
        lat: 22.5726,
        lng: 88.3639,
        attractions: ["Victoria Memorial", "Howrah Bridge", "Dakshineswar Kali Temple", "Indian Museum"]
    },
    {
        name: "Darjeeling",
        aliases: ["dj"],
        state: "West Bengal",
        imageUrl: "https://images.unsplash.com/photo-1626621339890-50346061384e?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Tiger Hill",
        stationCodes: ["DJ"],
        airportCode: "IXB",
        lat: 27.0410,
        lng: 88.2663,
        attractions: ["Tiger Hill", "Batasia Loop", "Ghoom Monastery", "Happy Valley Tea Estate"]
    },
    {
        name: "Gangtok",
        aliases: [],
        state: "Sikkim",
        imageUrl: "https://images.unsplash.com/photo-1622308644420-a94b067a9a1d?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "MG Marg",
        stationCodes: [],
        lat: 27.3314,
        lng: 88.6138,
        attractions: ["MG Marg", "Nathula Pass", "Tsomgo Lake", "Rumtek Monastery"]
    },
    {
        name: "Shillong",
        aliases: ["scotland of east"],
        state: "Meghalaya",
        imageUrl: "https://images.unsplash.com/photo-1589204047814-c11816999a38?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Umiam Lake",
        stationCodes: [],
        lat: 25.5788,
        lng: 91.8933,
        attractions: ["Umiam Lake", "Elephant Falls", "Shillong Peak", "Police Bazar"]
    },

    // Central India
    {
        name: "Hyderabad",
        aliases: ["hyd", "secunderabad"],
        state: "Telangana",
        imageUrl: "https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=1000&auto=format&fit=crop",
        bestPlaceName: "Charminar",
        stationCodes: ["HYB", "SC"],
        airportCode: "HYD",
        lat: 17.3850,
        lng: 78.4867,
        attractions: ["Charminar", "Golconda Fort", "Ramoji Film City", "Hussain Sagar Lake"]
    }
];

// Map for quick lookup by lowercased name or alias
export const cityByName = new Map<string, City>();

CITIES.forEach(city => {
    cityByName.set(city.name.toLowerCase(), city);
    city.aliases.forEach(alias => {
        cityByName.set(alias.toLowerCase(), city);
    });
});

