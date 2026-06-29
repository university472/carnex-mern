export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Inventory', path: '/inventory' },
  { label: 'Financing', path: '/financing' },
  { label: 'Trade-In', path: '/trade-in' },
  { label: 'Test Drive', path: '/test-drive' },
  { label: 'Sourcing', path: '/sourcing' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' }
]

export const DEALERSHIP = {
  name: 'Carnex Auto Sales LLC',
  tagline: 'Excellence in Every Mile',
  phone: '(916) 534-0971',
  email: 'carnexautosales@gmail.com',
  addressLine1: '8193 Elder Creek Road',
  addressLine2: 'Sacramento, CA 95824'
}

export const BUSINESS_HOURS = [
  { day: 'Monday', hours: '9:00 AM – 5:00 PM' },
  { day: 'Tuesday', hours: '9:00 AM – 5:00 PM' },
  { day: 'Wednesday', hours: '9:00 AM – 5:00 PM' },
  { day: 'Thursday', hours: '9:00 AM – 5:00 PM' },
  { day: 'Friday', hours: '9:00 AM – 5:00 PM' },
  { day: 'Saturday', hours: '9:00 AM – 5:00 PM' },
  { day: 'Sunday', hours: 'Closed' }
]

export const VEHICLE_FILTERS = {
  makes: [
    'Toyota',
    'Honda',
    'Suzuki',
    'Hyundai',
    'Kia',
    'BMW',
    'Mercedes-Benz'
  ],
  bodyTypes: ['Sedan', 'Hatchback', 'SUV', 'Crossover', 'Coupe', 'Truck'],
  fuelTypes: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
  transmissions: ['Automatic', 'Manual', 'CVT'],
  years: [2024, 2023, 2022, 2021, 2020, 2018, 2016, 2014]
}

// All images are from Wikimedia Commons (CC BY-SA) via direct upload.wikimedia.org URLs
export const MOCK_VEHICLES = [
  {
    id: 'civic-2022',
    title: 'Honda Civic Oriel 1.8 i-VTEC 2022',
    make: 'Honda',
    model: 'Civic',
    year: 2022,
    price: 4850000,
    mileage: 28000,
    bodyType: 'Sedan',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Sacramento, CA',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/6/61/2022_Honda_Civic_Sedan_EX_in_Platinum_White_Pearl,_front_left.jpg',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/6/61/2022_Honda_Civic_Sedan_EX_in_Platinum_White_Pearl,_front_left.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/7/72/2022_Honda_Civic_Sedan_EX_in_Platinum_White_Pearl,_front_left_(cropped).jpg',
      'https://upload.wikimedia.org/wikipedia/commons/8/84/2022_Honda_Civic_EX,_front_10.29.21.jpg'
    ],
    highlight: 'Certified pre-owned • One owner',
    specs: {
      engine: '1.8L i-VTEC',
      color: 'Modern Steel Metallic',
      seats: 5,
      drivetrain: 'FWD',
      registration: 'Clean title'
    },
    features: [
      'Push start ignition',
      'LED headlamps',
      'Cruise control',
      'Reverse camera',
      'Dual-zone climate control'
    ]
  },

  {
    id: 'corolla-2021',
    title: 'Toyota Corolla Altis 1.6 2021',
    make: 'Toyota',
    model: 'Corolla',
    year: 2021,
    price: 3950000,
    mileage: 42000,
    bodyType: 'Sedan',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Sacramento, CA',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/3/3c/2021_Toyota_Corolla_Altis_1.8_Sport.jpg',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/3/3c/2021_Toyota_Corolla_Altis_1.8_Sport.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/b3/2021_Toyota_Corolla_LE,_front_right,_07-13-2024.jpg'
    ],
    highlight: 'Full service history available',
    specs: {
      engine: '1.6L Dual VVT-i',
      color: 'Super White',
      seats: 5,
      drivetrain: 'FWD',
      registration: 'Clean title'
    },
    features: [
      'Alloy rims',
      'Parking sensors',
      'ABS with EBD',
      'Touchscreen infotainment',
      'Steering audio controls'
    ]
  },

  {
    id: 'sportage-2020',
    title: 'Kia Sportage AWD 2020',
    make: 'Kia',
    model: 'Sportage',
    year: 2020,
    price: 5450000,
    mileage: 36000,
    bodyType: 'SUV',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Sacramento, CA',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/4/49/2020_Kia_Sportage_LX_AWD_in_Clear_White,_rear_right.jpg',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/4/49/2020_Kia_Sportage_LX_AWD_in_Clear_White,_rear_right.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/b3/2020_Kia_Sportage_LX,_front_right,_11-11-2019.jpg'
    ],
    highlight: 'AWD • Leather interior',
    specs: {
      engine: '2.0L gasoline',
      color: 'Cherry Black',
      seats: 5,
      drivetrain: 'AWD',
      registration: 'Clean title'
    },
    features: [
      'Panoramic sunroof',
      'Leather seats',
      'Electronic stability control',
      'Front and rear parking sensors',
      'Smart key entry'
    ]
  },

  {
    id: 'alto-2023',
    title: 'Suzuki Alto VXL AGS 2023',
    make: 'Suzuki',
    model: 'Alto',
    year: 2023,
    price: 2450000,
    mileage: 12000,
    bodyType: 'Hatchback',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Sacramento, CA',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/a/a9/Maruti_Suzuki_Alto_K10_-_front.jpg',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/a/a9/Maruti_Suzuki_Alto_K10_-_front.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/1/12/Maruti_Suzuki_Alto_K10.jpg'
    ],
    highlight: 'Ideal city car • Great fuel economy',
    specs: {
      engine: '0.66L',
      color: 'Silky Silver',
      seats: 4,
      drivetrain: 'FWD',
      registration: 'Clean title'
    },
    features: [
      'AGS automatic transmission',
      'Air conditioning',
      'Immobilizer',
      'Bluetooth audio',
      'Dual front airbags'
    ]
  },

  {
    id: 'bmw-3-series-2018',
    title: 'BMW 3 Series 320i 2018',
    make: 'BMW',
    model: '3 Series',
    year: 2018,
    price: 6500000,
    mileage: 58000,
    bodyType: 'Sedan',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Sacramento, CA',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/d/d1/BMW_F30_LCI_320i_Luxury_Line_Alpine_White_(1).jpg',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/d/d1/BMW_F30_LCI_320i_Luxury_Line_Alpine_White_(1).jpg',
      'https://upload.wikimedia.org/wikipedia/commons/1/10/BMW_F30_LCI_320i_Luxury_Line_Alpine_White_(2).jpg',
      'https://upload.wikimedia.org/wikipedia/commons/9/9c/BMW_F30_LCI_320i_Luxury_Line_Alpine_White_(12).jpg'
    ],
    highlight: 'European luxury • Sport package',
    specs: {
      engine: '2.0L TwinPower Turbo',
      color: 'Alpine White',
      seats: 5,
      drivetrain: 'RWD',
      registration: 'Clean title'
    },
    features: [
      'M sport package',
      'Leather upholstery',
      'iDrive infotainment',
      'Dual-zone climate control',
      'Parking assistant'
    ]
  },

  {
    id: 'hilux-2016',
    title: 'Toyota Hilux Revo 2016',
    make: 'Toyota',
    model: 'Hilux',
    year: 2016,
    price: 5200000,
    mileage: 92000,
    bodyType: 'Truck',
    fuelType: 'Diesel',
    transmission: 'Manual',
    location: 'Sacramento, CA',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/1/1b/2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/1/1b/2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/ba/2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Rear.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/4/47/2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Side.jpg'
    ],
    highlight: '4x4 • Heavy-duty workhorse',
    specs: {
      engine: '2.8L turbo diesel',
      color: 'Graphite',
      seats: 5,
      drivetrain: '4x4',
      registration: 'Clean title'
    },
    features: [
      '4x4 drive',
      'Tow package',
      'Side steps',
      'Bed liner',
      'Hill descent control'
    ]
  }
]
