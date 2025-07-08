'use client';

import { useState } from 'react';
import { berthData, Berth } from '@/data/MockBerthData';
import { Ship, Droplet, Mountain, Ban } from 'lucide-react';

const parseTRT = (time: string): number => {
  const hours = parseFloat(time.match(/(\d+)h/)?.[1] || '0');
  const mins = parseFloat(time.match(/(\d+)m/)?.[1] || '0');
  return hours + mins / 60;
};

export default function BerthAvailability() {
  const [selectedBerth, setSelectedBerth] = useState<Berth | null>(null);
  const [showModal, setShowModal] = useState(false);

  const allBerths = berthData.flat();
  const avgTRT =
    allBerths.reduce((acc, berth) => acc + parseTRT(berth.avgTRT), 0) /
    allBerths.length;
  const totalVessels = allBerths.reduce((acc, b) => acc + b.vesselsArrived, 0);
  const totalTonnage = allBerths.reduce((acc, b) => acc + (b.tonnage || 0), 0);

  const handleOpenModal = (berth: Berth) => {
    setSelectedBerth(berth);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBerth(null);
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-900 mb-10 ">
        Berth Availability Chart
      </h1>

      {/* Berth Grid Section */}
      <div className="bg-white-300 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 mb-10">
       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 justify-items-center">
  {allBerths.map((berth) => {
    const isOccupied = berth.occupied;
    const cargoType = berth.shipDetails?.cargoType;
    const flag = berth.shipDetails?.flag;
    const country = berth.shipDetails?.country;

    const CargoIcon = (() => {
      switch (cargoType) {
        case 'Containerised':
          return Ship;
        case 'Liquid Bulk':
          return Droplet;
        case 'Dry Bulk / Mechanical':
          return Mountain;
        case 'Non-Cargo':
          return Ban;
        default:
          return null;
      }
    })();

    return (
      <div
        key={berth.id}
        onClick={() => isOccupied && handleOpenModal(berth)}
        title={isOccupied ? `Ship: ${berth.shipDetails?.name}` : 'Available'}
        className={`relative w-23 h-23 p-1.5 rounded-md flex flex-col items-center justify-center text-xs font-medium cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md
        ${isOccupied ? 'text-white' : 'bg-gray-300 text-gray-700'}
        ${selectedBerth?.id === berth.id ? 'ring-4 ring-blue-400' : ''}`}
        style={isOccupied ? { backgroundColor: '#006494' } : {}}
      >
        {/* Top-left: Flag */}
        {isOccupied && flag && (
          <img
            src={flag}
            alt={country}
            className="absolute top-1 left-1 w-6 h-4.5 rounded shadow-sm object-cover"
          />
        )}

        {/* Top-right: Cargo Icon */}
        {isOccupied && CargoIcon && (
          <div
            className="absolute top-1 right-1 text-white"
            title={cargoType}
          >
            <CargoIcon className="w-4.5 h-4.5" />
          </div>
        )}

        {/* Berth ID */}
        <span className="text-sm font-bold">{berth.id}</span>

        {/* Status */}
        <span className="text-[10px] mt-0.5">
          {isOccupied ? 'Occupied' : 'Available'}
        </span>
      </div>
    );
  })}
</div>

      </div>

      {/* Port Summary Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl shadow-xl p-6 space-y-6 transition-transform duration-300 hover:shadow-2xl hover:scale-[1.02] max-w-xl mx-auto">
        <h2 className="text-2xl font-extrabold text-blue-900 mb-4 flex items-center gap-2">
          🧭 Port Summary
        </h2>

        <div className="text-base text-gray-700 space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Average TRT</span>
            <span className="font-semibold text-blue-900">
              {avgTRT.toFixed(2)} hrs
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Total Vessels Arrived</span>
            <span className="font-semibold text-blue-900">{totalVessels}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Total Tonnage (GRT)</span>
            <span className="font-semibold text-blue-900">
              {totalTonnage.toLocaleString()} T
            </span>
          </div>

          <hr className="my-2 border-blue-300" />
          <p className="text-sm text-blue-700 italic">
            Click on a{' '}
            <span className="font-semibold" style={{ color: '#006494' }}>
              colored berth
            </span>{' '}
            to view ship details.
          </p>
        </div>
      </div>

      {/* Modal for Berth Details */}
      {showModal && selectedBerth?.shipDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-100 bg-opacity-70">
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              onClick={handleCloseModal}
            >
              &times;
            </button>

            <div className="flex flex-col space-y-3">
              <h2 className="text-xl font-semibold text-blue-800">
                Ship Details
              </h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Berth:</strong> {selectedBerth.id}
                </li>
                <li>
                  <strong>Name:</strong> {selectedBerth.shipDetails.name}
                </li>
                <li>
                  <strong>Arrival:</strong> {selectedBerth.shipDetails.arrivalDate}
                </li>
                <li>
                  <strong>Departure:</strong> {selectedBerth.shipDetails.departureDate}
                </li>
                <li>
                  <strong>Cargo:</strong> {selectedBerth.shipDetails.cargoType}
                </li>
                <li>
                  <strong>Country:</strong> {selectedBerth.shipDetails.country}
                </li>
              </ul>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
