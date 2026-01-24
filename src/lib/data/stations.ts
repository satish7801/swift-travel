// Indian Railway Station Codes - Major stations and hubs
// Source: Public domain railway data

export interface Station {
    code: string;
    name: string;
    city: string;
    state: string;
    zone: string;
    lat?: number;
    lng?: number;
}

// Major Indian Railway stations (top ~200 stations covering most traffic)
export const STATIONS: Station[] = [
    // Delhi NCR
    { code: 'NDLS', name: 'New Delhi', city: 'Delhi', state: 'Delhi', zone: 'NR', lat: 28.6420, lng: 77.2194 },
    { code: 'DLI', name: 'Old Delhi Junction', city: 'Delhi', state: 'Delhi', zone: 'NR', lat: 28.6618, lng: 77.2282 },
    { code: 'NZM', name: 'Hazrat Nizamuddin', city: 'Delhi', state: 'Delhi', zone: 'NR', lat: 28.5898, lng: 77.2519 },
    { code: 'ANVT', name: 'Anand Vihar Terminal', city: 'Delhi', state: 'Delhi', zone: 'NR', lat: 28.6469, lng: 77.3164 },
    { code: 'DEE', name: 'Delhi Sarai Rohilla', city: 'Delhi', state: 'Delhi', zone: 'NR', lat: 28.6645, lng: 77.1791 },
    { code: 'GZB', name: 'Ghaziabad Junction', city: 'Ghaziabad', state: 'Uttar Pradesh', zone: 'NR', lat: 28.6588, lng: 77.4381 },

    // Mumbai
    { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', state: 'Maharashtra', zone: 'CR', lat: 18.9402, lng: 72.8356 },
    { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', zone: 'WR', lat: 18.9696, lng: 72.8194 },
    { code: 'LTT', name: 'Lokmanya Tilak Terminus', city: 'Mumbai', state: 'Maharashtra', zone: 'CR', lat: 19.0683, lng: 72.8889 },
    { code: 'BDTS', name: 'Bandra Terminus', city: 'Mumbai', state: 'Maharashtra', zone: 'WR', lat: 19.0544, lng: 72.8403 },
    { code: 'DR', name: 'Dadar', city: 'Mumbai', state: 'Maharashtra', zone: 'CR', lat: 19.0186, lng: 72.8430 },
    { code: 'TNA', name: 'Thane', city: 'Thane', state: 'Maharashtra', zone: 'CR', lat: 19.1860, lng: 72.9750 },

    // Kolkata
    { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', zone: 'ER', lat: 22.5839, lng: 88.3428 },
    { code: 'KOAA', name: 'Kolkata', city: 'Kolkata', state: 'West Bengal', zone: 'ER', lat: 22.5658, lng: 88.3656 },
    { code: 'SDAH', name: 'Sealdah', city: 'Kolkata', state: 'West Bengal', zone: 'ER', lat: 22.5653, lng: 88.3697 },

    // Chennai
    { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu', zone: 'SR', lat: 13.0827, lng: 80.2707 },
    { code: 'MS', name: 'Chennai Egmore', city: 'Chennai', state: 'Tamil Nadu', zone: 'SR', lat: 13.0740, lng: 80.2609 },
    { code: 'MMCT', name: 'Chennai Beach', city: 'Chennai', state: 'Tamil Nadu', zone: 'SR', lat: 13.0925, lng: 80.2876 },

    // Bengaluru
    { code: 'SBC', name: 'KSR Bengaluru City Junction', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR', lat: 12.9784, lng: 77.5668 },
    { code: 'YPR', name: 'Yesvantpur Junction', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR', lat: 13.0285, lng: 77.5541 },
    { code: 'BNCE', name: 'Bengaluru Cantonment', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR', lat: 12.9986, lng: 77.5956 },

    // Hyderabad
    { code: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad', state: 'Telangana', zone: 'SCR', lat: 17.4337, lng: 78.5016 },
    { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana', zone: 'SCR', lat: 17.3850, lng: 78.4867 },
    { code: 'KCG', name: 'Kacheguda', city: 'Hyderabad', state: 'Telangana', zone: 'SCR', lat: 17.3769, lng: 78.4933 },

    // Ahmedabad
    { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat', zone: 'WR', lat: 23.0258, lng: 72.5873 },
    { code: 'SBIS', name: 'Sabarmati Junction', city: 'Ahmedabad', state: 'Gujarat', zone: 'WR', lat: 23.0667, lng: 72.5833 },

    // Pune
    { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra', zone: 'CR', lat: 18.5285, lng: 73.8742 },
    { code: 'SVJR', name: 'Shivajinagar', city: 'Pune', state: 'Maharashtra', zone: 'CR', lat: 18.5314, lng: 73.8446 },

    // Jaipur
    { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan', zone: 'NWR', lat: 26.9196, lng: 75.7878 },
    { code: 'DPA', name: 'Durgapura', city: 'Jaipur', state: 'Rajasthan', zone: 'NWR', lat: 26.8833, lng: 75.8167 },

    // Lucknow
    { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow', state: 'Uttar Pradesh', zone: 'NR', lat: 26.8310, lng: 80.9158 },
    { code: 'LJN', name: 'Lucknow Junction', city: 'Lucknow', state: 'Uttar Pradesh', zone: 'NER', lat: 26.8567, lng: 80.9462 },

    // Kanpur
    { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh', zone: 'NCR', lat: 26.4499, lng: 80.3319 },

    // Varanasi
    { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', state: 'Uttar Pradesh', zone: 'NER', lat: 25.3211, lng: 83.0097 },
    { code: 'BCY', name: 'Varanasi City', city: 'Varanasi', state: 'Uttar Pradesh', zone: 'NER', lat: 25.3167, lng: 83.0167 },

    // Patna
    { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar', zone: 'ECR', lat: 25.6083, lng: 85.0882 },
    { code: 'RJPB', name: 'Rajendra Nagar Terminal', city: 'Patna', state: 'Bihar', zone: 'ECR', lat: 25.5833, lng: 85.0833 },

    // Guwahati
    { code: 'GHY', name: 'Guwahati', city: 'Guwahati', state: 'Assam', zone: 'NFR', lat: 26.1775, lng: 91.7485 },
    { code: 'KYQ', name: 'Kamakhya Junction', city: 'Guwahati', state: 'Assam', zone: 'NFR', lat: 26.1650, lng: 91.7283 },

    // Bhopal
    { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh', zone: 'WCR', lat: 23.2694, lng: 77.4115 },
    { code: 'HBJ', name: 'Habibganj', city: 'Bhopal', state: 'Madhya Pradesh', zone: 'WCR', lat: 23.2299, lng: 77.4395 },

    // Indore
    { code: 'INDB', name: 'Indore Junction', city: 'Indore', state: 'Madhya Pradesh', zone: 'WR', lat: 22.7186, lng: 75.8013 },

    // Nagpur
    { code: 'NGP', name: 'Nagpur Junction', city: 'Nagpur', state: 'Maharashtra', zone: 'CR', lat: 21.1500, lng: 79.0833 },

    // Surat
    { code: 'ST', name: 'Surat', city: 'Surat', state: 'Gujarat', zone: 'WR', lat: 21.2060, lng: 72.8385 },

    // Vadodara
    { code: 'BRC', name: 'Vadodara Junction', city: 'Vadodara', state: 'Gujarat', zone: 'WR', lat: 22.3100, lng: 73.1812 },

    // Kochi
    { code: 'ERS', name: 'Ernakulam Junction', city: 'Kochi', state: 'Kerala', zone: 'SR', lat: 9.9816, lng: 76.2999 },
    { code: 'ERN', name: 'Ernakulam Town', city: 'Kochi', state: 'Kerala', zone: 'SR', lat: 9.9723, lng: 76.2883 },

    // Thiruvananthapuram
    { code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', state: 'Kerala', zone: 'SR', lat: 8.4915, lng: 76.9531 },

    // Coimbatore
    { code: 'CBE', name: 'Coimbatore Junction', city: 'Coimbatore', state: 'Tamil Nadu', zone: 'SR', lat: 11.0014, lng: 76.9670 },

    // Madurai
    { code: 'MDU', name: 'Madurai Junction', city: 'Madurai', state: 'Tamil Nadu', zone: 'SR', lat: 9.9272, lng: 78.1194 },

    // Visakhapatnam
    { code: 'VSKP', name: 'Visakhapatnam Junction', city: 'Visakhapatnam', state: 'Andhra Pradesh', zone: 'ECoR', lat: 17.7167, lng: 83.2333 },

    // Vijayawada
    { code: 'BZA', name: 'Vijayawada Junction', city: 'Vijayawada', state: 'Andhra Pradesh', zone: 'SCR', lat: 16.5175, lng: 80.6186 },

    // Mysore
    { code: 'MYS', name: 'Mysuru Junction', city: 'Mysuru', state: 'Karnataka', zone: 'SWR', lat: 12.2958, lng: 76.6394 },

    // Mangalore
    { code: 'MAQ', name: 'Mangaluru Central', city: 'Mangaluru', state: 'Karnataka', zone: 'SR', lat: 12.8623, lng: 74.8369 },
    { code: 'MAJN', name: 'Mangaluru Junction', city: 'Mangaluru', state: 'Karnataka', zone: 'SWR', lat: 12.8984, lng: 74.8526 },

    // Goa
    { code: 'MAO', name: 'Madgaon Junction', city: 'Margao', state: 'Goa', zone: 'SWR', lat: 15.2750, lng: 73.9583 },
    { code: 'KRMI', name: 'Karmali', city: 'Karmali', state: 'Goa', zone: 'SWR', lat: 15.4867, lng: 73.9017 },
    { code: 'THVM', name: 'Thivim', city: 'Thivim', state: 'Goa', zone: 'SWR', lat: 15.6069, lng: 73.9592 },

    // Agra
    { code: 'AGC', name: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh', zone: 'NCR', lat: 27.1553, lng: 78.0092 },
    { code: 'AF', name: 'Agra Fort', city: 'Agra', state: 'Uttar Pradesh', zone: 'NCR', lat: 27.1750, lng: 78.0167 },

    // Amritsar
    { code: 'ASR', name: 'Amritsar Junction', city: 'Amritsar', state: 'Punjab', zone: 'NR', lat: 31.6389, lng: 74.8689 },

    // Chandigarh
    { code: 'CDG', name: 'Chandigarh Junction', city: 'Chandigarh', state: 'Chandigarh', zone: 'NR', lat: 30.6860, lng: 76.8093 },

    // Dehradun
    { code: 'DDN', name: 'Dehradun', city: 'Dehradun', state: 'Uttarakhand', zone: 'NR', lat: 30.3206, lng: 78.0436 },

    // Haridwar
    { code: 'HW', name: 'Haridwar Junction', city: 'Haridwar', state: 'Uttarakhand', zone: 'NR', lat: 29.9228, lng: 78.1256 },

    // Rishikesh
    { code: 'RKSH', name: 'Rishikesh', city: 'Rishikesh', state: 'Uttarakhand', zone: 'NR', lat: 30.1089, lng: 78.2961 },

    // Jammu
    { code: 'JAT', name: 'Jammu Tawi', city: 'Jammu', state: 'Jammu & Kashmir', zone: 'NR', lat: 32.7127, lng: 74.8739 },

    // Katra
    { code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra', city: 'Katra', state: 'Jammu & Kashmir', zone: 'NR', lat: 32.9915, lng: 74.9318 },

    // Ranchi
    { code: 'RNC', name: 'Ranchi Junction', city: 'Ranchi', state: 'Jharkhand', zone: 'SER', lat: 23.3505, lng: 85.3093 },

    // Bhubaneswar
    { code: 'BBS', name: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', zone: 'ECoR', lat: 20.2596, lng: 85.8304 },

    // Puri
    { code: 'PURI', name: 'Puri', city: 'Puri', state: 'Odisha', zone: 'ECoR', lat: 19.8014, lng: 85.8315 },

    // Raipur
    { code: 'R', name: 'Raipur Junction', city: 'Raipur', state: 'Chhattisgarh', zone: 'SECR', lat: 21.2253, lng: 81.6233 },

    // Bilaspur
    { code: 'BSP', name: 'Bilaspur Junction', city: 'Bilaspur', state: 'Chhattisgarh', zone: 'SECR', lat: 22.0810, lng: 82.1388 },

    // Jodhpur
    { code: 'JU', name: 'Jodhpur Junction', city: 'Jodhpur', state: 'Rajasthan', zone: 'NWR', lat: 26.2893, lng: 73.0231 },

    // Udaipur
    { code: 'UDZ', name: 'Udaipur City', city: 'Udaipur', state: 'Rajasthan', zone: 'NWR', lat: 24.5840, lng: 73.6900 },

    // Ajmer
    { code: 'AII', name: 'Ajmer Junction', city: 'Ajmer', state: 'Rajasthan', zone: 'NWR', lat: 26.4545, lng: 74.6337 },

    // Jaisalmer
    { code: 'JSM', name: 'Jaisalmer', city: 'Jaisalmer', state: 'Rajasthan', zone: 'NWR', lat: 26.9098, lng: 70.9036 },

    // Gwalior
    { code: 'GWL', name: 'Gwalior Junction', city: 'Gwalior', state: 'Madhya Pradesh', zone: 'NCR', lat: 26.2211, lng: 78.1756 },

    // Jabalpur
    { code: 'JBP', name: 'Jabalpur Junction', city: 'Jabalpur', state: 'Madhya Pradesh', zone: 'WCR', lat: 23.1671, lng: 79.9350 },

    // Allahabad/Prayagraj
    { code: 'PRYJ', name: 'Prayagraj Junction', city: 'Prayagraj', state: 'Uttar Pradesh', zone: 'NCR', lat: 25.4317, lng: 81.8428 },

    // Gorakhpur
    { code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur', state: 'Uttar Pradesh', zone: 'NER', lat: 26.7568, lng: 83.3747 },

    // Tirupati
    { code: 'TPTY', name: 'Tirupati', city: 'Tirupati', state: 'Andhra Pradesh', zone: 'SCR', lat: 13.6288, lng: 79.4192 },

    // Thiruchirapalli
    { code: 'TPJ', name: 'Tiruchchirapalli Junction', city: 'Tiruchchirapalli', state: 'Tamil Nadu', zone: 'SR', lat: 10.8193, lng: 78.6851 },

    // Salem
    { code: 'SA', name: 'Salem Junction', city: 'Salem', state: 'Tamil Nadu', zone: 'SR', lat: 11.6642, lng: 78.1400 },

    // Kozhikode
    { code: 'CLT', name: 'Kozhikode', city: 'Kozhikode', state: 'Kerala', zone: 'SR', lat: 11.2467, lng: 75.7800 },

    // Thrissur
    { code: 'TCR', name: 'Thrissur', city: 'Thrissur', state: 'Kerala', zone: 'SR', lat: 10.5237, lng: 76.2133 },

    // Kannur
    { code: 'CAN', name: 'Kannur', city: 'Kannur', state: 'Kerala', zone: 'SR', lat: 11.8681, lng: 75.3663 },

    // Hubli
    { code: 'UBL', name: 'Hubli Junction', city: 'Hubli', state: 'Karnataka', zone: 'SWR', lat: 15.3647, lng: 75.1240 },

    // Belgaum
    { code: 'BGM', name: 'Belgaum', city: 'Belgaum', state: 'Karnataka', zone: 'SWR', lat: 15.8585, lng: 74.4917 },

    // Additional major stations - North India
    { code: 'MTJ', name: 'Mathura Junction', city: 'Mathura', state: 'Uttar Pradesh', zone: 'NCR', lat: 27.4924, lng: 77.6737 },
    { code: 'MBD', name: 'Moradabad Junction', city: 'Moradabad', state: 'Uttar Pradesh', zone: 'NR', lat: 28.8389, lng: 78.7769 },
    { code: 'BE', name: 'Bareilly Junction', city: 'Bareilly', state: 'Uttar Pradesh', zone: 'NR', lat: 28.3670, lng: 79.4304 },
    { code: 'ALD', name: 'Aligarh Junction', city: 'Aligarh', state: 'Uttar Pradesh', zone: 'NCR', lat: 27.8942, lng: 78.0780 },
    { code: 'MZP', name: 'Mirzapur', city: 'Mirzapur', state: 'Uttar Pradesh', zone: 'NCR', lat: 25.1337, lng: 82.5644 },
    { code: 'JHS', name: 'Jhansi Junction', city: 'Jhansi', state: 'Uttar Pradesh', zone: 'NCR', lat: 25.4484, lng: 78.5685 },
    { code: 'RBL', name: 'Rae Bareli Junction', city: 'Rae Bareli', state: 'Uttar Pradesh', zone: 'NR', lat: 26.2345, lng: 81.2489 },
    { code: 'AY', name: 'Ayodhya Junction', city: 'Ayodhya', state: 'Uttar Pradesh', zone: 'NR', lat: 26.7990, lng: 82.2047 },
    { code: 'FZD', name: 'Faizabad Junction', city: 'Faizabad', state: 'Uttar Pradesh', zone: 'NR', lat: 26.7746, lng: 82.1469 },
    { code: 'LDH', name: 'Ludhiana Junction', city: 'Ludhiana', state: 'Punjab', zone: 'NR', lat: 30.8990, lng: 75.8573 },
    { code: 'JRC', name: 'Jalandhar City', city: 'Jalandhar', state: 'Punjab', zone: 'NR', lat: 31.3260, lng: 75.5762 },
    { code: 'PTA', name: 'Patiala', city: 'Patiala', state: 'Punjab', zone: 'NR', lat: 30.3398, lng: 76.3869 },
    { code: 'BTI', name: 'Bhatinda Junction', city: 'Bathinda', state: 'Punjab', zone: 'NR', lat: 30.2110, lng: 74.9455 },
    { code: 'FKA', name: 'Firozpur Cantt', city: 'Firozpur', state: 'Punjab', zone: 'NR', lat: 30.9331, lng: 74.6225 },
    { code: 'PGW', name: 'Pathankot', city: 'Pathankot', state: 'Punjab', zone: 'NR', lat: 32.2643, lng: 75.6421 },
    { code: 'UMB', name: 'Ambala Cantt', city: 'Ambala', state: 'Haryana', zone: 'NR', lat: 30.3573, lng: 76.8414 },
    { code: 'ROK', name: 'Rohtak Junction', city: 'Rohtak', state: 'Haryana', zone: 'NR', lat: 28.8955, lng: 76.6066 },
    { code: 'HSR', name: 'Hisar', city: 'Hisar', state: 'Haryana', zone: 'NWR', lat: 29.1492, lng: 75.7217 },
    { code: 'KUN', name: 'Kurukshetra Junction', city: 'Kurukshetra', state: 'Haryana', zone: 'NR', lat: 29.9695, lng: 76.8783 },
    { code: 'KLK', name: 'Kalka', city: 'Kalka', state: 'Haryana', zone: 'NR', lat: 30.8449, lng: 76.9418 },
    { code: 'RE', name: 'Rewari Junction', city: 'Rewari', state: 'Haryana', zone: 'NWR', lat: 28.1920, lng: 76.6194 },

    // Rajasthan
    { code: 'BKN', name: 'Bikaner Junction', city: 'Bikaner', state: 'Rajasthan', zone: 'NWR', lat: 28.0229, lng: 73.3119 },
    { code: 'KOTA', name: 'Kota Junction', city: 'Kota', state: 'Rajasthan', zone: 'WCR', lat: 25.1794, lng: 75.8648 },
    { code: 'AWR', name: 'Abu Road', city: 'Abu Road', state: 'Rajasthan', zone: 'NWR', lat: 24.4811, lng: 72.7745 },
    { code: 'COR', name: 'Chittorgarh Junction', city: 'Chittorgarh', state: 'Rajasthan', zone: 'NWR', lat: 24.8887, lng: 74.6269 },
    { code: 'SGNR', name: 'Sri Ganganagar', city: 'Sri Ganganagar', state: 'Rajasthan', zone: 'NWR', lat: 29.9094, lng: 73.8767 },
    { code: 'SOG', name: 'Sawai Madhopur Junction', city: 'Sawai Madhopur', state: 'Rajasthan', zone: 'WCR', lat: 26.0173, lng: 76.3466 },

    // Gujarat
    { code: 'RJT', name: 'Rajkot Junction', city: 'Rajkot', state: 'Gujarat', zone: 'WR', lat: 22.3039, lng: 70.8022 },
    { code: 'BHUJ', name: 'Bhuj', city: 'Bhuj', state: 'Gujarat', zone: 'WR', lat: 23.2420, lng: 69.6669 },
    { code: 'BVP', name: 'Bhavnagar Terminus', city: 'Bhavnagar', state: 'Gujarat', zone: 'WR', lat: 21.7645, lng: 72.1519 },
    { code: 'JND', name: 'Jamnagar', city: 'Jamnagar', state: 'Gujarat', zone: 'WR', lat: 22.4707, lng: 70.0577 },
    { code: 'PBR', name: 'Porbandar', city: 'Porbandar', state: 'Gujarat', zone: 'WR', lat: 21.6417, lng: 69.6293 },
    { code: 'GIMB', name: 'Gandhinagar Capital', city: 'Gandhinagar', state: 'Gujarat', zone: 'WR', lat: 23.2156, lng: 72.6369 },
    { code: 'VAPI', name: 'Vapi', city: 'Vapi', state: 'Gujarat', zone: 'WR', lat: 20.3713, lng: 72.9043 },
    { code: 'BL', name: 'Valsad', city: 'Valsad', state: 'Gujarat', zone: 'WR', lat: 20.5992, lng: 72.9342 },

    // Maharashtra
    { code: 'KOP', name: 'Kolhapur', city: 'Kolhapur', state: 'Maharashtra', zone: 'CR', lat: 16.6913, lng: 74.2356 },
    { code: 'SUR', name: 'Solapur Junction', city: 'Solapur', state: 'Maharashtra', zone: 'CR', lat: 17.6599, lng: 75.9064 },
    { code: 'NED', name: 'Nanded', city: 'Nanded', state: 'Maharashtra', zone: 'SCR', lat: 19.1383, lng: 77.3210 },
    { code: 'APR', name: 'Ahmednagar', city: 'Ahmednagar', state: 'Maharashtra', zone: 'CR', lat: 19.0948, lng: 74.7480 },
    { code: 'AWB', name: 'Aurangabad', city: 'Aurangabad', state: 'Maharashtra', zone: 'SCR', lat: 19.8762, lng: 75.3433 },
    { code: 'GR', name: 'Goa (Vasco da Gama)', city: 'Vasco', state: 'Goa', zone: 'SWR', lat: 15.3982, lng: 73.8113 },
    { code: 'NGD', name: 'Nashik Road', city: 'Nashik', state: 'Maharashtra', zone: 'CR', lat: 20.0063, lng: 73.7940 },
    { code: 'MMR', name: 'Manmad Junction', city: 'Manmad', state: 'Maharashtra', zone: 'CR', lat: 20.2509, lng: 74.4386 },
    { code: 'SNSI', name: 'Sainagar Shirdi', city: 'Shirdi', state: 'Maharashtra', zone: 'CR', lat: 19.7645, lng: 74.4771 },

    // Madhya Pradesh
    { code: 'KNW', name: 'Khandwa Junction', city: 'Khandwa', state: 'Madhya Pradesh', zone: 'CR', lat: 21.8243, lng: 76.3528 },
    { code: 'UJN', name: 'Ujjain Junction', city: 'Ujjain', state: 'Madhya Pradesh', zone: 'WR', lat: 23.1828, lng: 75.7772 },
    { code: 'RTM', name: 'Ratlam Junction', city: 'Ratlam', state: 'Madhya Pradesh', zone: 'WR', lat: 23.3347, lng: 75.0428 },
    { code: 'SGRL', name: 'Sagar', city: 'Sagar', state: 'Madhya Pradesh', zone: 'WCR', lat: 23.8388, lng: 78.7378 },
    { code: 'DMO', name: 'Damoh', city: 'Damoh', state: 'Madhya Pradesh', zone: 'WCR', lat: 23.8393, lng: 79.4419 },
    { code: 'ET', name: 'Itarsi Junction', city: 'Itarsi', state: 'Madhya Pradesh', zone: 'WCR', lat: 22.6173, lng: 77.7628 },

    // South India - Tamil Nadu
    { code: 'ED', name: 'Erode Junction', city: 'Erode', state: 'Tamil Nadu', zone: 'SR', lat: 11.3410, lng: 77.7172 },
    { code: 'TJ', name: 'Thanjavur Junction', city: 'Thanjavur', state: 'Tamil Nadu', zone: 'SR', lat: 10.7905, lng: 79.1378 },
    { code: 'NCJ', name: 'Nagercoil Junction', city: 'Nagercoil', state: 'Tamil Nadu', zone: 'SR', lat: 8.1833, lng: 77.4119 },
    { code: 'TEN', name: 'Tirunelveli Junction', city: 'Tirunelveli', state: 'Tamil Nadu', zone: 'SR', lat: 8.7261, lng: 77.7087 },
    { code: 'ALLP', name: 'Alappuzha', city: 'Alappuzha', state: 'Kerala', zone: 'SR', lat: 9.4981, lng: 76.3388 },
    { code: 'KGQ', name: 'Kasaragod', city: 'Kasaragod', state: 'Kerala', zone: 'SR', lat: 12.4996, lng: 74.9869 },
    { code: 'PGT', name: 'Palakkad Junction', city: 'Palakkad', state: 'Kerala', zone: 'SR', lat: 10.7867, lng: 76.6548 },
    { code: 'QLN', name: 'Kollam Junction', city: 'Kollam', state: 'Kerala', zone: 'SR', lat: 8.8932, lng: 76.6141 },

    // Karnataka
    { code: 'DWR', name: 'Dharwad', city: 'Dharwad', state: 'Karnataka', zone: 'SWR', lat: 15.4589, lng: 75.0078 },
    { code: 'GDG', name: 'Gadag Junction', city: 'Gadag', state: 'Karnataka', zone: 'SWR', lat: 15.4166, lng: 75.6294 },
    { code: 'BJP', name: 'Bijapur', city: 'Bijapur', state: 'Karnataka', zone: 'SWR', lat: 16.8302, lng: 75.7100 },
    { code: 'RIG', name: 'Raichur Junction', city: 'Raichur', state: 'Karnataka', zone: 'SCR', lat: 16.2160, lng: 77.3566 },
    { code: 'GTL', name: 'Guntakal Junction', city: 'Guntakal', state: 'Andhra Pradesh', zone: 'SCR', lat: 15.1710, lng: 77.3784 },
    { code: 'GNT', name: 'Guntur Junction', city: 'Guntur', state: 'Andhra Pradesh', zone: 'SCR', lat: 16.3067, lng: 80.4365 },
    { code: 'NDL', name: 'Nandyal', city: 'Nandyal', state: 'Andhra Pradesh', zone: 'SCR', lat: 15.4786, lng: 78.4836 },
    { code: 'RJY', name: 'Rajahmundry', city: 'Rajahmundry', state: 'Andhra Pradesh', zone: 'SCR', lat: 17.0005, lng: 81.7799 },
    { code: 'NLDA', name: 'Nellore', city: 'Nellore', state: 'Andhra Pradesh', zone: 'SCR', lat: 14.4426, lng: 79.9865 },
    { code: 'KZJ', name: 'Kazipet Junction', city: 'Kazipet', state: 'Telangana', zone: 'SCR', lat: 17.9689, lng: 79.5941 },
    { code: 'WL', name: 'Warangal', city: 'Warangal', state: 'Telangana', zone: 'SCR', lat: 17.9784, lng: 79.5941 },
    { code: 'KMT', name: 'Khammam', city: 'Khammam', state: 'Telangana', zone: 'SCR', lat: 17.2473, lng: 80.1514 },

    // East India
    { code: 'GAYA', name: 'Gaya Junction', city: 'Gaya', state: 'Bihar', zone: 'ECR', lat: 24.7914, lng: 85.0002 },
    { code: 'MKA', name: 'Mughalsarai Junction', city: 'Mughalsarai', state: 'Uttar Pradesh', zone: 'ECR', lat: 25.2834, lng: 83.1198 },
    { code: 'BJU', name: 'Barauni Junction', city: 'Barauni', state: 'Bihar', zone: 'ECR', lat: 25.4628, lng: 86.0714 },
    { code: 'MFP', name: 'Muzaffarpur Junction', city: 'Muzaffarpur', state: 'Bihar', zone: 'ECR', lat: 26.1225, lng: 85.3906 },
    { code: 'SPJ', name: 'Samastipur Junction', city: 'Samastipur', state: 'Bihar', zone: 'ECR', lat: 25.8629, lng: 85.7837 },
    { code: 'DBG', name: 'Darbhanga Junction', city: 'Darbhanga', state: 'Bihar', zone: 'ECR', lat: 26.1542, lng: 85.8918 },
    { code: 'JMP', name: 'Jamalpur Junction', city: 'Jamalpur', state: 'Bihar', zone: 'ER', lat: 25.3114, lng: 86.4877 },
    { code: 'DNR', name: 'Danapur', city: 'Danapur', state: 'Bihar', zone: 'ECR', lat: 25.6190, lng: 85.0545 },
    { code: 'BRKA', name: 'Bhagalpur', city: 'Bhagalpur', state: 'Bihar', zone: 'ER', lat: 25.2425, lng: 86.9842 },
    { code: 'KIR', name: 'Katihar Junction', city: 'Katihar', state: 'Bihar', zone: 'NFR', lat: 25.5394, lng: 87.5719 },
    { code: 'NJP', name: 'New Jalpaiguri', city: 'Siliguri', state: 'West Bengal', zone: 'NFR', lat: 26.7271, lng: 88.4295 },
    { code: 'MLDT', name: 'Malda Town', city: 'Malda', state: 'West Bengal', zone: 'ER', lat: 25.0108, lng: 88.1453 },
    { code: 'BWN', name: 'Barddhaman Junction', city: 'Bardhaman', state: 'West Bengal', zone: 'ER', lat: 23.2324, lng: 87.8615 },
    { code: 'ASN', name: 'Asansol Junction', city: 'Asansol', state: 'West Bengal', zone: 'ER', lat: 23.6858, lng: 86.9525 },
    { code: 'DHN', name: 'Dhanbad Junction', city: 'Dhanbad', state: 'Jharkhand', zone: 'ECR', lat: 23.7957, lng: 86.4304 },
    { code: 'GMO', name: 'Gomoh Junction', city: 'Gomoh', state: 'Jharkhand', zone: 'ECR', lat: 23.8688, lng: 86.1499 },
    { code: 'JSME', name: 'Jamshedpur', city: 'Jamshedpur', state: 'Jharkhand', zone: 'SER', lat: 22.8046, lng: 86.2029 },
    { code: 'CKP', name: 'Chakradharpur', city: 'Chakradharpur', state: 'Jharkhand', zone: 'SER', lat: 22.7004, lng: 85.6319 },
    { code: 'HTE', name: 'Hatia', city: 'Ranchi', state: 'Jharkhand', zone: 'SER', lat: 23.3458, lng: 85.3172 },
    { code: 'ROU', name: 'Rourkela', city: 'Rourkela', state: 'Odisha', zone: 'SER', lat: 22.2604, lng: 84.8536 },
    { code: 'SBP', name: 'Sambalpur', city: 'Sambalpur', state: 'Odisha', zone: 'ECoR', lat: 21.4669, lng: 83.9812 },
    { code: 'BAM', name: 'Brahmapur', city: 'Brahmapur', state: 'Odisha', zone: 'ECoR', lat: 19.3150, lng: 84.7941 },
    { code: 'CTC', name: 'Cuttack Junction', city: 'Cuttack', state: 'Odisha', zone: 'ECoR', lat: 20.4625, lng: 85.8830 },

    // Northeast India
    { code: 'DGG', name: 'Dibrugarh', city: 'Dibrugarh', state: 'Assam', zone: 'NFR', lat: 27.4728, lng: 94.9120 },
    { code: 'JRH', name: 'Jorhat Town', city: 'Jorhat', state: 'Assam', zone: 'NFR', lat: 26.7509, lng: 94.2037 },
    { code: 'TSK', name: 'Tinsukia Junction', city: 'Tinsukia', state: 'Assam', zone: 'NFR', lat: 27.4891, lng: 95.3535 },
    { code: 'RNY', name: 'Rangiya Junction', city: 'Rangiya', state: 'Assam', zone: 'NFR', lat: 26.4546, lng: 91.6133 },
    { code: 'BPB', name: 'Barpeta Road', city: 'Barpeta', state: 'Assam', zone: 'NFR', lat: 26.5118, lng: 90.9665 },
    { code: 'AGTL', name: 'Agartala', city: 'Agartala', state: 'Tripura', zone: 'NFR', lat: 23.8315, lng: 91.2868 },
    { code: 'SCL', name: 'Silchar', city: 'Silchar', state: 'Assam', zone: 'NFR', lat: 24.8333, lng: 92.7789 },
    { code: 'LMG', name: 'Lumding Junction', city: 'Lumding', state: 'Assam', zone: 'NFR', lat: 25.7490, lng: 93.1670 },
];

// Create lookup maps for fast access
export const stationByCode = new Map<string, Station>(
    STATIONS.map(s => [s.code, s])
);

export const stationsByCity = new Map<string, Station[]>();
STATIONS.forEach(station => {
    const cityLower = station.city.toLowerCase();
    if (!stationsByCity.has(cityLower)) {
        stationsByCity.set(cityLower, []);
    }
    stationsByCity.get(cityLower)!.push(station);
});
