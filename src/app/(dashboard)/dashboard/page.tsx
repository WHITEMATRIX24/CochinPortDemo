'use client';

import Card from '@/components/BerthTrackerCard';
import { useState } from 'react';
import CargoStats from '@/components/CargoStats';

type Berth = {
  imageSrc: string;
  berthId: string;
  cargoType: string;
  berthNumber: string;
  countryFlag: string;
  country: string;
  arrivalDate: string;    // format: 'YYYY-MM-DD'
  departureDate: string;  // format: 'YYYY-MM-DD'
};

const berthData: Berth[] = [
  {
    imageSrc: '/images/ship.png',
    berthId: '00103IANNEHC-IC',
    cargoType: 'Containerised',
    berthNumber: 'V2',
    countryFlag: '/images/india.jpg',
    country: 'India',
    arrivalDate: '2025-07-01',
    departureDate: '2025-07-02'
  },
  {
    imageSrc: '/images/ship.png',
    berthId: '00104BAYLINE-JC',
    cargoType: 'Liquid Bulk',
    berthNumber: 'V3',
    countryFlag: '/images/Cook-Islands-Flag.jpg',
    country: 'Cook Islands',
    arrivalDate: '2025-07-02',
    departureDate: '2025-07-03'
  },
  {
    imageSrc: '/images/ship.png',
    berthId: '00105CARGOMAX-SC',
    cargoType: 'Non Cargo',
    berthNumber: 'Q1',
    countryFlag: '/images/VIET NAM.jpeg',
    country: 'Vietnam',
    arrivalDate: '2025-07-03',
    departureDate: '2025-07-04'
  },
  {
    imageSrc: '/images/ship.png',
    berthId: '00106VIRGINIA-CO',
    cargoType: 'Dry Bulk Mechanical',
    berthNumber: 'Q4',
    countryFlag: '/images/singapore.webp',
    country: 'Singapore',
    arrivalDate: '2025-07-04',
    departureDate: '2025-07-05'
  },
  {
    imageSrc: '/images/ship.png',
    berthId: '00107OCEANIC-TX',
    cargoType: 'Containerised',
    berthNumber: 'Q5',
    countryFlag: '/images/nl-flag.jpg',
    country: 'Netherlands',
    arrivalDate: '2025-07-05',
    departureDate: '2025-07-06'
  },
  {
    imageSrc: '/images/ship.png',
    berthId: '00108DEEPSEA-MC',
    cargoType: 'Liquid Bulk',
    berthNumber: 'Q6',
    countryFlag: '/images/panamaFlag.png',
    country: 'Panama',
    arrivalDate: '2025-07-06',
    departureDate: '2025-07-07'
  },
  {
    imageSrc: '/images/ship.png',
    berthId: '00109EXPORTER-KH',
    cargoType: 'Dry Bulk Mechanical',
    berthNumber: 'Q7',
    countryFlag: '/images/Flag-Comoros.webp',
    country: 'Comoros',
    arrivalDate: '2025-07-07',
    departureDate: '2025-07-08'
  },
  {
    imageSrc: '/images/ship.png',
    berthId: '00110FASTFERRY-RJ',
    cargoType: 'Non Cargo',
    berthNumber: 'Q8',
    countryFlag: '/images/Flag-of-The-Bahamas.webp',
    country: 'Bahamas',
    arrivalDate: '2025-07-08',
    departureDate: '2025-07-09'
  }
];

const cargoTypes = [
  'All',
  'Containerised',
  'Liquid Bulk',
  'Non Cargo',
  'Dry Bulk Mechanical',
];

export default function HomePage() {
  const [filter, setFilter] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const countries = ['All', ...new Set(berthData.map(item => item.country))];

  const filteredData = berthData.filter(item => {
    const cargoMatch = filter === 'All' || item.cargoType === filter;
    const countryMatch = selectedCountry === 'All' || item.country === selectedCountry;

    const arrival = item.arrivalDate;
    const departure = item.departureDate;

    const dateMatch =
      (!startDate || arrival >= startDate) &&
      (!endDate || departure <= endDate);

    return cargoMatch && countryMatch && dateMatch;
  });

  return (
    <div className="relative h-screen bg-gray-100">
      <main className="flex flex-col h-full">
        {/* Header and Filters */}
        <div className="flex-shrink-0 p-4">
          {/* Heading */}
          <div className="mb-4 p-2">
            <h5 className="text-2xl font-bold text-[#003049]">
              Welcome to, <span className="text-[#8B0000]">John Doe</span>
            </h5>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-3">
            <h6 className="text-l text-black">DashBoard / Berth Tracker</h6>

            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              {/* Cargo Type Filter */}
              <div className="flex flex-col" suppressHydrationWarning>
                <label className="text-sm font-semibold text-gray-700 mb-2">Cargo Type</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white text-gray-900"
                >
                  {cargoTypes.map((type, i) => (
                    <option key={i} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Country Filter */}
              <div className="flex flex-col" suppressHydrationWarning>
                <label className="text-sm font-semibold text-gray-700 mb-2">Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white text-gray-900"
                >
                  {countries.map((country, i) => (
                    <option key={i} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white text-gray-900"
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card Container */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredData.map((berth, index) => (
              <Card
                key={index}
                imageSrc={berth.imageSrc}
                berthId={berth.berthId}
                berthNumber={berth.berthNumber}
                countryFlag={berth.countryFlag}
                arrivalDate={berth.arrivalDate}
                departureDate={berth.departureDate}
              />
            ))}
          </div>

          <div className="mt-8">
            <CargoStats berthData={berthData} />
          </div>
        </div>
      </main>
    </div>
  );
}
