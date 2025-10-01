'use client';

import Image from 'next/image';

// types/vessel.d.ts
export interface Vessel {
  _id: string;
  VslID: string;
  Berth: string;
  CargoType: string;
  FlagCountry: string;
  ATA?: string | null;
  ATD?: string | null;
  // ... other fields
}

export interface BerthStatus {
  berthId: string;
  isOccupied: boolean;
  currentVessel: Vessel | null;
}


type Props = {
  berth: BerthStatus;
  onClick: () => void;
};

export default function BerthTrackerCard({ berth, onClick }: Props) {
  const vessel = berth.currentVessel;

  // Format dates safely
  const formattedArrival = vessel?.ATA
    ? new Date(vessel.ATA).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  const formattedDeparture = vessel?.ATD
    ? new Date(vessel.ATD).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:border-blue-400 hover:ring-2 hover:ring-blue-200 mt-3"
      onClick={onClick}
    >
      {/* Top Row: Berth Number */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-12 aspect-[3/2]">
          {/* If you want to re-enable flag display */}
           {vessel?.FlagCountry && (
            
            <p className="font-bold text-black text-[12px]">{vessel.FlagCountry}</p>
          )} 
        </div>
        <p className="font-bold text-black text-sm">BN: {berth.berthId}</p>
      </div>

      {/* Ship Image or Availability */}
      {berth.isOccupied && vessel ? (
        <div className="relative w-full h-28 mb-4">
          <Image
            src={'/images/ship.png'} // Replace with actual vessel image if available
            alt={`Ship at berth ${berth.berthId}`}
            fill
            className="object-contain"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center mb-4">
          <img
            src="/images/no-ship.png"
            alt="Berth is available"
            className="w-32 h-auto mb-2"
          />
        </div>
      )}

      {/* Ship ID or Availability Message */}
      <div className="flex flex-col items-center justify-center mb-3">
        <p
          className={`font-medium truncate text-sm ${
            berth.isOccupied && vessel ? 'text-gray-800' : 'text-green-600'
          }`}
        >
          {berth.isOccupied && vessel
            ? vessel.VslID || 'Unknown Vessel'
            : '✅ Berth is available'}
        </p>
      </div>

      {/* Arrival & Departure Info */}
      {berth.isOccupied && vessel && (
        <div className="px-3 py-2 bg-gray-100 rounded-md flex justify-between items-center text-xs text-gray-700 shadow-sm">
          <div className="flex flex-col items-start">
            <span className="font-semibold text-gray-600">Arrival</span>
            <span className="text-gray-900">{formattedArrival}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-semibold text-gray-600">Departure</span>
            <span className="text-gray-900">{formattedDeparture}</span>
          </div>
        </div>
      )}
    </div>
  );
}
