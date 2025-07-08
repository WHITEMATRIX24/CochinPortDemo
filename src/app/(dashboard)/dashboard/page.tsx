'use client';

import Card from '@/components/BerthTrackerCard';
import { useState } from 'react';
import CargoStats from '@/components/CargoStats';
import ShipListModal from '@/components/ShipListModal';
import ShipDetailsModal from '@/components/ShipDetailsModal';
import { ShipDetails, Berth,berthData } from '@/data/MockDashboardData';
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
  const [selectedBerth, setSelectedBerth] = useState<Berth | null>(null);
  const [selectedShip, setSelectedShip] = useState<ShipDetails | null>(null);
  const [showShipListModal, setShowShipListModal] = useState(false);
  const [showShipDetailModal, setShowShipDetailModal] = useState(false);

  const countries = ['All', ...new Set(berthData.map(item => item.country))];

  const filteredData = berthData.filter(item => {
    const cargoMatch = filter === 'All' || item.cargoType === filter;
    const countryMatch = selectedCountry === 'All' || item.country === selectedCountry;
    const arrival = item.arrivalDate;
    const departure = item.departureDate;
    const dateMatch = (!startDate || arrival >= startDate) && (!endDate || departure <= endDate);
    return cargoMatch && countryMatch && dateMatch;
  });

  const handleBerthClick = (berth: Berth) => {
    setSelectedBerth(berth);
    setShowShipListModal(true);
  };

  const closeModals = () => {
    setShowShipListModal(false);
    setShowShipDetailModal(false);
    setSelectedShip(null);
    setSelectedBerth(null);
  };

  return (
    <div className="relative h-screen bg-gray-100">
      <main className="flex flex-col h-full">
        <div className="flex-shrink-0 p-4">
          <div className="mb-4 p-2">
            <h5 className="text-2xl font-bold text-[#003049]">
              Welcome, <span className="text-[#8B0000]">John Doe</span>
            </h5>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-3">
            <div className="text-sm text-gray-500">
              <span>Dashboard</span> <span className="mx-2">/</span> <span className="text-blue-600">Berth Tracker</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              <div className="flex flex-col">
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

              <div className="flex flex-col">
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

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white text-gray-900"
                />
              </div>

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
                onClick={() => handleBerthClick(berth)}
              />
            ))}
          </div>

          <div className="mt-8">
            <CargoStats berthData={berthData} />
          </div>

          <ShipListModal
            berth={selectedBerth}
            isOpen={showShipListModal}
            onSelectShip={(ship) => {
              setSelectedShip(ship);
              setShowShipDetailModal(true);
            }}
            onClose={closeModals}
          />

          <ShipDetailsModal
            ship={selectedShip}
            isOpen={showShipDetailModal}
            onClose={() => setShowShipDetailModal(false)}
          />
        </div>
      </main>
    </div>
  );
}