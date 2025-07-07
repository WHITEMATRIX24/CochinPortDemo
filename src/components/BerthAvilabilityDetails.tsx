'use client';
import { useState } from 'react';
import { berthData, Berth } from '@/data/MockBerthData';

const parseTRT = (time: string): number => {
  const hours = parseFloat(time.match(/(\d+)h/)?.[1] || '0');
  const mins = parseFloat(time.match(/(\d+)m/)?.[1] || '0');
  return hours + mins / 60;
};

export default function BerthAvailability() {
  const [selectedBerth, setSelectedBerth] = useState<Berth | null>(null);
  const [showModal, setShowModal] = useState(false);

  const allBerths = berthData.flat();
  const avgTRT = allBerths.reduce((acc, berth) => acc + parseTRT(berth.avgTRT), 0) / allBerths.length;
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
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-2xl font-bold text-blue-900 mb-10">Berth Availability Chart</h1>

      {/* Berth Grid */}
      <div className="space-y-6 mb-10">
        {Array.from({ length: 2 }).map((_, rowIndex) => {
          const start = rowIndex * 11;
          const end = start + 11;
          const rowBerths = allBerths.slice(start, end); // Slice 11 items per row

          return (
            <div key={rowIndex} className="flex justify-center gap-4">
              {rowBerths.map((berth) => (
                <div
                  key={berth.id}
                  onClick={() => berth.occupied && handleOpenModal(berth)}
                  title={berth.occupied ? `Ship: ${berth.shipDetails?.name}` : 'Available'}
                  className={`w-20 h-20 rounded-lg flex flex-col items-center justify-center text-sm font-medium cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${berth.occupied ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'} ${selectedBerth?.id === berth.id ? 'ring-4 ring-blue-400' : ''}`}
                >
                  <span className="text-base font-bold">{berth.id}</span>
                  <span className="text-xs">{berth.occupied ? 'Occupied' : 'Available'}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {/* Port Summary - moved below */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl shadow-xl p-6 space-y-6 transition-transform duration-300 hover:shadow-2xl hover:scale-[1.02] max-w-xl mx-auto">
        <h2 className="text-2xl font-extrabold text-blue-900 mb-4 flex items-center gap-2">
          🧭 Port Summary
        </h2>

        <div className="text-base text-gray-700 space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Average TRT</span>
            <span className="font-semibold text-blue-900">{avgTRT.toFixed(2)} hrs</span>
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
            Click on a <span className="font-semibold text-green-700">green berth</span> to view ship details.
          </p>
        </div>
      </div>

      {/* Modal remains the same */}
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
              <h2 className="text-xl font-semibold text-blue-800">Ship Details</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Berth:</strong> {selectedBerth.id}</li>
                <li><strong>Name:</strong> {selectedBerth.shipDetails.name}</li>
                <li><strong>Arrival:</strong> {selectedBerth.shipDetails.arrivalDate}</li>
                <li><strong>Departure:</strong> {selectedBerth.shipDetails.departureDate}</li>
                <li><strong>Cargo:</strong> {selectedBerth.shipDetails.cargoType}</li>
                <li><strong>Country:</strong> {selectedBerth.shipDetails.country}</li>
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
