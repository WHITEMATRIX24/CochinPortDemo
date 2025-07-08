export type ShipDetails = {
  id: string;
  name: string;
  arrivalDate: string;
  departureDate: string;
  cargoType: string;
  country: string;
  flag: string;
  isCurrent: boolean;
};

export type Berth = {
  imageSrc: string;
  berthId: string;
  cargoType: string;
  berthNumber: string;
  countryFlag: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  shipDetails: ShipDetails[];
};

export const berthData: Berth[] = [
  {
    imageSrc: '/images/ship.png',
    berthId: '00103IANNEHC-IC',
    cargoType: 'Containerised',
    berthNumber: 'V1',
    countryFlag: '/images/india.jpg',
    country: 'India',
    arrivalDate: '2025-07-08',
    departureDate: '2025-07-09',
    shipDetails: [
      {
        id: 's1',
        name: 'Kochi Express',
        arrivalDate: '2025-07-08',
        departureDate: '2025-07-09',
        cargoType: 'Containerised',
        country: 'India',
        flag: '/flags/india.jpg',
        isCurrent: true,
      },
      {
        id: 's2',
        name: 'Chennai Star',
        arrivalDate: '2025-07-03',
        departureDate: '2025-07-04',
        cargoType: 'Containerised',
        country: 'India',
        flag: '/flags/india.jpg',
        isCurrent: false,
      },
    ],
  },
  {
    imageSrc: '/images/ship.png',
    berthId: '00104BRNEHC-BU',
    cargoType: ' Liquid Bulk',
    berthNumber: 'V2',
    countryFlag: '/flags/Flag-Comoros.webp',
    country: 'Comoros',
    arrivalDate: '2025-07-01',
    departureDate: '2025-07-03',
    shipDetails: [
      {
        id: 's3',
        name: 'Amazon Glory',
        arrivalDate: '2025-06-29',
        departureDate: '2025-07-01',
        cargoType: 'Liquid Bulk',
        country: 'Comoros',
        flag: '/flags/Flag-Comoros.webp',
        isCurrent: false,
      },
      {
        id: 's4',
        name: 'Rio Titan',
        arrivalDate: '2025-07-01',
        departureDate: '2025-07-03',
        cargoType: ' Liquid Bulk',
        country: 'Comoros',
        flag: '/flags/Flag-Comoros.webp',
        isCurrent: true,
      },
    ],
  },
  {
    imageSrc: '/images/ship.png',
    berthId: '00105JPNCHM-CH',
    cargoType: 'Dry Bulk / Mechanical',
    berthNumber: 'V3',
    countryFlag: '/flags/singapore.webp',
    country: 'Singapore',
    arrivalDate: '2025-07-02',
    departureDate: '2025-07-05',
    shipDetails: [
      {
        id: 's5',
        name: 'Nippon Chem 1',
        arrivalDate: '2025-07-02',
        departureDate: '2025-07-03',
        cargoType: 'Dry Bulk / Mechanical',
        country: 'Singapore',
        flag: '/flags/singapore.webp',
        isCurrent: false,
      },
      {
        id: 's6',
        name: 'Tokyo Maru',
        arrivalDate: '2025-07-04',
        departureDate: '2025-07-05',
        cargoType: 'Dry Bulk / Mechanical',
        country: 'Singapore',
        flag: '/flags/singapore.webp',
        isCurrent: true,
      },
    ],
  },
  {
    imageSrc: '/images/ship.png',
    berthId: '00106SGPCNT-IC',
    cargoType: 'Containerised',
    berthNumber: 'V4',
    countryFlag: '/flags/Flag-of-The-Bahamas.webp',
    country: 'Bahamas',
    arrivalDate: '2025-07-03',
    departureDate: '2025-07-04',
    shipDetails: [
      {
        id: 's7',
        name: 'Lion Sea',
        arrivalDate: '2025-07-03',
        departureDate: '2025-07-04',
        cargoType: 'Containerised',
        country: 'Bahamas',
        flag: '/flags/Flag-of-The-Bahamas.webp',
        isCurrent: true,
      },
    ],
  },
  {
    imageSrc: '/images/ship.png',
    berthId: '00107USACRG-CR',
    cargoType: 'Liquid Bulk',
    berthNumber: 'V5',
    countryFlag: '/flags/panamaFlag.png',
    country: 'Panama',
    arrivalDate: '2025-07-02',
    departureDate: '2025-07-05',
    shipDetails: [
      {
        id: 's8',
        name: 'Texas Crude',
        arrivalDate: '2025-07-02',
        departureDate: '2025-07-04',
        cargoType: 'Liquid Bulk',
        country: 'Panama',
        flag: '/flags/panamaFlag.png',
        isCurrent: true,
      },
    ],
  },
  {
    imageSrc: '/images/ship.png',
    berthId: '00108CNBULK-BU',
    cargoType: 'Liquid Bulk',
    berthNumber: 'V6',
    countryFlag: '/flags/nl-flag.jpg',
    country: 'Nether Lands',
    arrivalDate: '2025-07-01',
    departureDate: '2025-07-02',
    shipDetails: [
      {
        id: 's9',
        name: 'Dragon Ore',
        arrivalDate: '2025-07-01',
        departureDate: '2025-07-02',
        cargoType: 'Bulk',
        country: 'Nether Lands',
        flag: '/flags/nl-flag.jpg',
        isCurrent: true,
      },
    ],
  },
  {
    imageSrc: '/images/ship.png',
    berthId: '00109AUSCHEM-CH',
    cargoType: 'Dry Bulk Mechanical',
    berthNumber: 'V7',
    countryFlag: '/flags/Cook-Islands-Flag.jpg',
    country: 'Cook-Islands',
    arrivalDate: '2025-07-05',
    departureDate: '2025-07-06',
    shipDetails: [
      {
        id: 's10',
        name: 'Sydney Tanker',
        arrivalDate: '2025-07-05',
        departureDate: '2025-07-06',
        cargoType: 'Dry Bulk Mechanical',
        country: 'Cook-Islands',
        flag: '/flags/Cook-Islands-Flag.jpg',
        isCurrent: true,
      },
    ],
  },
  {
    imageSrc: '/images/ship.png',
    berthId: '00110DEUCTR-IC',
    cargoType: 'Non Cargo',
    berthNumber: 'V8',
    countryFlag: '/flags/singapore.webp',
    country: 'Singapore',
    arrivalDate: '2025-07-08',
    departureDate: '2025-07-10',
    shipDetails: [
      {
        id: 's11',
        name: 'Berlin Carrier',
        arrivalDate: '2025-07-08',
        departureDate: '2025-07-10',
        cargoType: 'Non Cargo',
        country: 'Singapore',
        flag:  '/flags/Cook-Islands-Flag.jpg',
        isCurrent: true,
      },
    ],
  },
];