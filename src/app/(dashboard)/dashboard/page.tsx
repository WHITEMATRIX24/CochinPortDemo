'use client';

import Card from '@/components/BerthTrackerCard';
import { useState } from 'react';

type Berth = {
  imageSrc: string;
  berthId: string;
  cargoType: string;
};

const berthData: Berth[] = [
  { imageSrc: '/images/ship1.jpg', berthId: '00103IANNEHC-IC', cargoType: 'Containerised' },
  { imageSrc: '/images/ship2.jpg', berthId: '00104BAYLINE-JC', cargoType: 'Liquid Bulk' },
  { imageSrc: '/images/ship3.jpg', berthId: '00105CARGOMAX-SC', cargoType: 'Non Cargo' },
  { imageSrc: '/images/ship4.jpg', berthId: '00106VIRGINIA-CO', cargoType: 'Dry Bulk Mechanical' },
  { imageSrc: '/images/ship5.jpg', berthId: '00107OCEANIC-TX', cargoType: 'Containerised' },
  { imageSrc: '/images/ship6.jpg', berthId: '00108DEEPSEA-MC', cargoType: 'Liquid Bulk' },
  { imageSrc: '/images/ship7.jpg', berthId: '00109EXPORTER-KH', cargoType: 'Dry Bulk Mechanical' },
  { imageSrc: '/images/ship8.jpg', berthId: '00110FASTFERRY-RJ', cargoType: 'Non Cargo' },
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

  const filteredData = filter === 'All'
    ? berthData
    : berthData.filter(item => item.cargoType === filter);

  return (
    <main className="p-4 min-h-screen bg-gray-100">
      {/* Welcome Heading */}
      <div className="mb-2 p-2">
        <h5 className="text-2xl font-bold text-[#003049]">Welcome to <span className="text-[#8B0000] ">John Doe</span></h5>

      </div>

      {/* Berth Tracker + Filter side by side */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 px-3">
        {/* Left: Berth Tracker */}
        <h6 className="text-xl text-black">Berth Tracker</h6>

        {/* Right: Filter Dropdown */}
        <div>
          <label htmlFor="cargoFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Cargo Type
          </label>
          <select
            id="cargoFilter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white shadow-sm text-black"
          >
            {cargoTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredData.map((berth, index) => (
          <Card key={index} imageSrc={berth.imageSrc} berthId={berth.berthId} />
        ))}
      </div>
    </main>

  );
}
