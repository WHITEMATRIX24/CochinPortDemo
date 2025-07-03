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
};

const berthData: Berth[] = [
  { imageSrc: '/images/ship.png', berthId: '00103IANNEHC-IC', cargoType: 'Containerised', berthNumber: 'V2', countryFlag: '/images/india.jpg', country: 'India' },
  { imageSrc: '/images/ship.png', berthId: '00104BAYLINE-JC', cargoType: 'Liquid Bulk', berthNumber: 'V3', countryFlag: '/images/Cook-Islands-Flag.jpg', country: 'Cook Islands' },
  { imageSrc: '/images/ship.png', berthId: '00105CARGOMAX-SC', cargoType: 'Non Cargo', berthNumber: 'Q1', countryFlag: '/images/VIET NAM.jpeg', country: 'Vietnam' },
  { imageSrc: '/images/ship.png', berthId: '00106VIRGINIA-CO', cargoType: 'Dry Bulk Mechanical', berthNumber: 'Q4', countryFlag: '/images/singapore.webp', country: 'Singapore' },
  { imageSrc: '/images/ship.png', berthId: '00107OCEANIC-TX', cargoType: 'Containerised', berthNumber: 'Q5', countryFlag: '/images/nl-flag.jpg', country: 'Netherlands' },
  { imageSrc: '/images/ship.png', berthId: '00108DEEPSEA-MC', cargoType: 'Liquid Bulk', berthNumber: 'Q6', countryFlag: '/images/panamaFlag.png', country: 'Panama' },
  { imageSrc: '/images/ship.png', berthId: '00109EXPORTER-KH', cargoType: 'Dry Bulk Mechanical', berthNumber: 'Q7', countryFlag: '/images/Flag-Comoros.webp', country: 'Comoros' },
  { imageSrc: '/images/ship.png', berthId: '00110FASTFERRY-RJ', cargoType: 'Non Cargo', berthNumber: 'Q8', countryFlag: '/images/Flag-of-The-Bahamas.webp', country: 'Bahamas' },
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

  const countries = ['All', ...new Set(berthData.map(item => item.country))];

  const filteredData = berthData.filter(item => {
    const cargoMatch = filter === 'All' || item.cargoType === filter;
    const countryMatch = selectedCountry === 'All' || item.country === selectedCountry;
    return cargoMatch && countryMatch;
  });



  return (
    <main className="p-4 min-h-screen bg-gray-100">
      {/* Welcome Heading */}
      <div className="mb-4 p-2">
        <h5 className="text-2xl font-bold text-[#003049]">
          Welcome to <span className="text-[#8B0000]">John Doe</span>
        </h5>
      </div>

      {/* Filters + Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 px-3">
        {/* Left: Title */}
        <h6 className="text-xl text-black">Berth Tracker</h6>

        {/* Right: Filters */}
        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          {/* Cargo Filter */}
          <div className="flex flex-col">
            <label
              htmlFor="cargoFilter"
              className="text-sm font-semibold text-gray-700 mb-2"
            >
              Filter by Cargo Type
            </label>
            <select
              id="cargoFilter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {cargoTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Country Filter */}
          <div className="flex flex-col">
            <label
              htmlFor="countryFilter"
              className="text-sm font-semibold text-gray-700 mb-2"
            >
              Filter by Country
            </label>
            <select
              id="countryFilter"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredData.map((berth, index) => (
          <Card
            key={index}
            imageSrc={berth.imageSrc}
            berthId={berth.berthId}
            berthNumber={berth.berthNumber}
            countryFlag={berth.countryFlag}
          />
        ))}
      </div>
            {/* icon Grid */}
        <CargoStats berthData={berthData} />

    </main>
  );
}
