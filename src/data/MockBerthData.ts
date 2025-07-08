export type ShipDetails = {
  name: string;
  arrivalDate: string;
  departureDate: string;
  cargoType: string;
  country: string;
  flag:string;
};

export type Berth = {
  id: string;
  occupied: boolean;
  avgTRT: string;
  vesselsArrived: number;
  tonnage?: number;
  shipDetails?: ShipDetails;
};

export const berthData: Berth[][] = [
  [
    {
      id: 'B1',
      occupied: true,
      avgTRT: '4h 30m',
      vesselsArrived: 3,
      tonnage: 12000,
      shipDetails: {
        name: 'MV Kochi Express',
        arrivalDate: '2025-07-06',
        departureDate: '2025-07-07',
        cargoType: 'Containerised',
        country: 'VIET NAM',
        flag: '/flags/VIET NAM.jpeg',
      },
    },
    {
      id: 'B2',
      occupied: false,
      avgTRT: '3h 45m',
      vesselsArrived: 5,
      tonnage: 0,
    },
    {
      id: 'B3',
      occupied: true,
      avgTRT: '5h 10m',
      vesselsArrived: 2,
      tonnage: 9500,
      shipDetails: {
        name: 'Sea Voyager',
        arrivalDate: '2025-07-05',
        departureDate: '2025-07-06',
        cargoType: 'Liquid Bulk',
        country: 'Singapore',
        flag: '/flags/singapore.webp',
      },
    },
    {
      id: 'B4',
      occupied: false,
      avgTRT: '4h 10m',
      vesselsArrived: 6,
      tonnage: 0,
    },
    {
      id: 'B5',
      occupied: true,
      avgTRT: '3h 20m',
      vesselsArrived: 4,
      tonnage: 8000,
      shipDetails: {
        name: 'Cargo Star',
        arrivalDate: '2025-07-04',
        departureDate: '2025-07-05',
        cargoType: 'Dry Bulk / Mechanical',
        country: 'Panama',
        flag: '/flags/panamaFlag.png',
      },
    },
  ],
  [
    {
      id: 'B6',
      occupied: false,
      avgTRT: '2h 50m',
      vesselsArrived: 3,
      tonnage: 0,
    },
    {
      id: 'B7',
      occupied: true,
      avgTRT: '4h 05m',
      vesselsArrived: 2,
      tonnage: 10000,
      shipDetails: {
        name: 'Blue Horizon',
        arrivalDate: '2025-07-06',
        departureDate: '2025-07-07',
        cargoType: 'Dry Bulk / Mechanical',
        country: 'Nether Lands',
        flag: '/flags/nl-flag.jpg',
      },
    },
    {
      id: 'B8',
      occupied: false,
      avgTRT: '3h 30m',
      vesselsArrived: 4,
      tonnage: 0,
    },
    {
      id: 'B9',
      occupied: true,
      avgTRT: '4h 40m',
      vesselsArrived: 5,
      tonnage: 11000,
      shipDetails: {
        name: 'Eastern Wind',
        arrivalDate: '2025-07-05',
        departureDate: '2025-07-06',
        cargoType: 'Dry Bulk / Mechanical',
        country: 'India',
        flag: '/flags/india.jpg',
      },
    },
    {
      id: 'B10',
      occupied: false,
      avgTRT: '3h 00m',
      vesselsArrived: 2,
      tonnage: 0,
    },
  ],
  [
    {
      id: 'B11',
      occupied: true,
      avgTRT: '3h 50m',
      vesselsArrived: 3,
      tonnage: 8700,
      shipDetails: {
        name: 'Mariner One',
        arrivalDate: '2025-07-02',
        departureDate: '2025-07-03',
        cargoType: 'Dry Bulk / Mechanical',
        country: 'Singapore',
        flag: '/flags/singapore.webp',
      },
    },
    {
      id: 'B12',
      occupied: false,
      avgTRT: '2h 45m',
      vesselsArrived: 4,
      tonnage: 0,
    },
    {
      id: 'B13',
      occupied: true,
      avgTRT: '4h 20m',
      vesselsArrived: 3,
      tonnage: 9200,
      shipDetails: {
        name: 'Ocean Trader',
        arrivalDate: '2025-07-05',
        departureDate: '2025-07-06',
        cargoType: 'Dry Bulk / Mechanical',
        country: 'Bahamas',
        flag: '/flags/Flag-of-The-Bahamas.webp',
      },
    },
    {
      id: 'B14',
      occupied: false,
      avgTRT: '3h 15m',
      vesselsArrived: 2,
      tonnage: 0,
    },
    {
      id: 'B15',
      occupied: true,
      avgTRT: '5h 00m',
      vesselsArrived: 1,
      tonnage: 15000,
      shipDetails: {
        name: 'Atlantic Rose',
        arrivalDate: '2025-07-03',
        departureDate: '2025-07-04',
        cargoType: 'Liquid Bulk',
        country: 'Comoros',
        flag: '/flags/Flag-Comoros.webp',
      },
    },
  ],
  [
    {
      id: 'B16',
      occupied: false,
      avgTRT: '3h 25m',
      vesselsArrived: 2,
      tonnage: 0,
    },
    {
      id: 'B17',
      occupied: true,
      avgTRT: '4h 10m',
      vesselsArrived: 3,
      tonnage: 10700,
      shipDetails: {
        name: 'Nordic Breeze',
        arrivalDate: '2025-07-01',
        departureDate: '2025-07-02',
        cargoType: 'Dry Bulk / Mechanical',
        country: 'Bahamas',
        flag: '/flags/Flag-of-The-Bahamas.webp',
      },
    },
    {
      id: 'B18',
      occupied: false,
      avgTRT: '3h 00m',
      vesselsArrived: 3,
      tonnage: 0,
    },
    {
      id: 'B19',
      occupied: true,
      avgTRT: '4h 50m',
      vesselsArrived: 4,
      tonnage: 8800,
      shipDetails: {
        name: 'Red Falcon',
        arrivalDate: '2025-07-02',
        departureDate: '2025-07-03',
        cargoType: 'Dry Bulk / Mechanical',
        country: 'Cook-Islands',
        flag: '/flags/Cook-Islands-Flag.jpg',
      },
    },
    {
      id: 'B20',
      occupied: false,
      avgTRT: '3h 40m',
      vesselsArrived: 5,
      tonnage: 0,
    },
    {
      id: 'B21',
      occupied: false,
      avgTRT: '3h 20m',
      vesselsArrived: 2,
      tonnage: 0,
    },
    {
      id: 'B22',
      occupied: true,
      avgTRT: '4h 15m',
      vesselsArrived: 3,
      tonnage: 9100,
      shipDetails: {
        name: 'Silver Wave',
        arrivalDate: '2025-07-06',
        departureDate: '2025-07-07',
        cargoType: 'Non-Cargo',
        country: 'Singapore.webp',
        flag: '/flags/singapore.webp',
      },
    },
  ],
];
