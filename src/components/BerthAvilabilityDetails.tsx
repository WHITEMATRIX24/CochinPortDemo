'use client';

import { useState } from 'react';
import { Berth } from '@/data/MockDashboardData'; // Update path as needed
import { Ship, Droplet, Mountain, Ban } from 'lucide-react';

type Props = {
  data: Berth[];
};

const parseTRT = (time: string = '0h 0m'): number => {
  const hours = parseFloat(time.match(/(\d+)h/)?.[1] || '0');
  const mins = parseFloat(time.match(/(\d+)m/)?.[1] || '0');
  return hours + mins / 60;
};

export default function BerthAvailability({ data }: Props) {
  const [selectedBerth, setSelectedBerth] = useState<Berth | null>(null);
  const [showModal, setShowModal] = useState(false);

  const allBerths = data.flat(); // In case it's a 2D array
  const avgTRT =
    allBerths.reduce((acc, berth) => acc + parseTRT(berth.avgTRT || '0h 0m'), 0) /
    (allBerths.length || 1);

  const totalVessels = allBerths.reduce((acc, b) => acc + (b.vesselsArrived || 0), 0);
  const totalTonnage = allBerths.reduce((acc, b) => acc + (b.tonnage || 0), 0);

  const handleOpenModal = (berth: Berth) => {
    setSelectedBerth(berth);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedBerth(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-900 mb-10">
        Berth Availability Chart
      </h1>

      {/* Berth Grid Section */}
      <div className="bg-white p-6 rounded-2xl shadow-xl mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
          {allBerths.map((berth) => {
            const isOccupied = berth.occupied;
            const currentShip = berth.shipDetails?.find(ship => ship.isCurrent);
            const cargoType = currentShip?.cargoType;
            const flag = berth.countryFlag;
            const country = currentShip?.country;

            const CargoIcon = (() => {
              switch (cargoType) {
                case 'Containerised':
                  return Ship;
                case 'Liquid Bulk':
                  return Droplet;
                case 'Dry Bulk / Mechanical':
                  return Mountain;
                case 'Non Cargo':
                  return Ban;
                default:
                  return null;
              }
            })();

            return (
              <div
               key={`${berth.berthId}-${berth.berthNumber}`}
                onClick={() => isOccupied && handleOpenModal(berth)}
                title={isOccupied ? `Ship: ${currentShip?.name}` : 'Available'}
                className={`relative w-23 h-23 p-1.5 rounded-md flex flex-col items-center justify-center text-xs font-medium cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md
                  ${isOccupied ? 'text-white' : 'bg-gray-300 text-gray-700'}
                  ${selectedBerth?.berthNumber === berth.berthNumber ? 'ring-4 ring-blue-400' : ''}`}
                style={isOccupied ? { backgroundColor: '#006494' } : {}}
              >
                {isOccupied && flag && (
                  <img
                    src={flag}
                    alt={country}
                    className="absolute top-1 left-1 w-6 h-4.5 rounded object-cover shadow"
                  />
                )}
                {isOccupied && CargoIcon && (
                  <div className="absolute top-1 right-1 text-white">
                    <CargoIcon className="w-4.5 h-4.5" />
                  </div>
                )}
                <span className="text-sm font-bold">{berth.berthNumber}</span>
                <span className="text-[10px] mt-0.5">
                  {isOccupied ? 'Occupied' : 'Available'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-blue-200 rounded-2xl shadow-xl p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-extrabold text-blue-900 mb-4">🧭 Port Summary</h2>
        <div className="space-y-4 text-gray-700 text-base">
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
        </div>
      </div>

      {/* Ship Details Modal */}
      {showModal && selectedBerth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-tranparent-100 bg-opacity-70">
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 p-6">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <div className="flex flex-col space-y-3">
              <h2 className="text-xl font-semibold text-blue-800">Ship Details</h2>
              {selectedBerth.shipDetails && selectedBerth.shipDetails.length > 0 ? (
                <ul className="text-sm text-gray-700 space-y-2">
                  {selectedBerth.shipDetails
                    .filter(ship => ship.isCurrent)
                    .map((ship, idx) => (
                      <li key={idx} className="space-y-1">
                        <p><strong>Berth:</strong> {selectedBerth.berthNumber}</p>
                        <p><strong>Name:</strong> {ship.name}</p>
                        <p><strong>Arrival:</strong> {ship.arrivalDate}</p>
                        <p><strong>Departure:</strong> {ship.departureDate}</p>
                        <p><strong>Cargo:</strong> {ship.cargoType}</p>
                        <p><strong>Country:</strong> {ship.country}</p>
                      </li>
                    ))}
                </ul>
              ) : (
                <p>No ship details available.</p>
              )}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
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
