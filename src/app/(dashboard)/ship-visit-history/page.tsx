'use client';

import React, { useState } from 'react';
import { FaShip } from 'react-icons/fa';
import { MdHistory } from 'react-icons/md';

type ShipVisit = {
  vesselId: string;
  name: string;
  berthNumber: string;
  arrivalDate: string;
  departureDate: string;
  cargoType: string;
  country: string;
  agent: string;
  flag: string;
  grossTonnage: number;
  terminal: string;
};

const shipVisits: ShipVisit[] = [
  {
    vesselId: '5004ANHSIRK-LS',
    name: 'Kochi Express',
    berthNumber: 'V1',
    arrivalDate: '2025-07-15',
    departureDate: '2025-07-18',
    cargoType: 'Container',
    country: 'India',
    agent: 'SeaLogix Ltd.',
    flag: '🇮🇳',
    grossTonnage: 28000,
    terminal: 'ICTT Vallarpadam',
  },
  {
    vesselId: '5004ANHSIRK-LS',
    name: 'Kochi Express',
    berthNumber: 'V3',
    arrivalDate: '2025-03-10',
    departureDate: '2025-03-11',
    cargoType: 'Bulk',
    country: 'India',
    agent: 'Cochin Shipping Co.',
    flag: '🇮🇳',
    grossTonnage: 25000,
    terminal: 'South Coal Berth',
  },
  {
    vesselId: '00103IANNEHC-IC',
    name: 'Ocean Pearl',
    berthNumber: 'V2',
    arrivalDate: '2025-04-05',
    departureDate: '2025-04-07',
    cargoType: 'Oil',
    country: 'UAE',
    agent: 'Ocean Traders',
    flag: '🇦🇪',
    grossTonnage: 31000,
    terminal: 'Oil Terminal West',
  },
  {
    vesselId: '00103IANNEHC-IC',
    name: 'Kochi Express',
    berthNumber: 'LNG',
    arrivalDate: '2024-12-22',
    departureDate: '2024-12-25',
    cargoType: 'Bulk',
    country: 'India',
    agent: 'Cochin Shipping Co.',
    flag: '🇮🇳',
    grossTonnage: 25000,
    terminal: 'General Cargo Berth',
  },
];

function getVisitsForShipInYear(vesselId: string, year: number | '', data: ShipVisit[]) {
  if (!vesselId || !year) return [];
  return data.filter(
    (visit) =>
      visit.vesselId === vesselId &&
      new Date(visit.arrivalDate).getFullYear() === year
  );
}

export default function ShipVisitTracker() {
  const [selectedVesselId, setSelectedVesselId] = useState<string>('');
  const [year, setYear] = useState<number | ''>('');

  const visits = getVisitsForShipInYear(selectedVesselId, year, shipVisits);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="text-sm text-gray-500 mt-1 mb-4">
        <span>Ship Management</span> <span className="mx-2">/</span>
        <span className="text-blue-600">Ship Tracker</span>
      </div>

      <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg  h-[80vh] ">
        <div className="flex items-center gap-3 mb-6">
          <FaShip className="text-[#003049] text-3xl" />
          <h2 className="text-2xl font-bold text-[#003049]">Ship Visit History</h2>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Vessel ID</label>
            <input
              type="text"
              value={selectedVesselId}
              onChange={(e) => setSelectedVesselId(e.target.value)}
              className="w-full border border-gray-300 text-black rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. 75004ANHSIRK-LS"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => {
                const val = e.target.value;
                setYear(val === '' ? '' : parseInt(val));
              }}
              className="w-full border border-gray-300 text-black rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. 2025"
            />
          </div>
        </div>

        {/* Visit Summary & Table */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-inner">
          <div className="flex items-center gap-2 text-blue-800 mb-4">
            <MdHistory className="text-xl" />
            {selectedVesselId && year ? (
              <h3 className="text-lg font-semibold">
                {selectedVesselId} visited {visits.length} time(s) in {year}
              </h3>
            ) : (
              <h3 className="text-lg font-semibold text-gray-500">
                Enter vessel ID and year to see visit history
              </h3>
            )}
          </div>

          {visits.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-300 bg-white rounded-md text-black">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-4 py-2">Berth</th>
                    <th className="px-4 py-2">Arrival</th>
                    <th className="px-4 py-2">Departure</th>
                    <th className="px-4 py-2">Cargo</th>
                    <th className="px-4 py-2">Agent</th>
                    <th className="px-4 py-2">Country</th>
                    <th className="px-4 py-2">Tonnage</th>
                    <th className="px-4 py-2">Terminal</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((v, i) => (
                    <tr key={i} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-2">{v.berthNumber}</td>
                      <td className="px-4 py-2">{v.arrivalDate}</td>
                      <td className="px-4 py-2">{v.departureDate}</td>
                      <td className="px-4 py-2">{v.cargoType}</td>
                      <td className="px-4 py-2">{v.agent}</td>
                      <td className="px-4 py-2">
                        {v.country} <span className="ml-1">{v.flag}</span>
                      </td>
                      <td className="px-4 py-2">{v.grossTonnage.toLocaleString()} T</td>
                      <td className="px-4 py-2">{v.terminal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            selectedVesselId &&
            year && (
              <p className="text-red-600 text-sm mt-2">
                No visits found for selected vessel/year.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
