'use client';

import Image from 'next/image';

// types
export interface Vessel {
  _id: string;
  VslID: string;
  Berth: string;
  CargoType: string;
  FlagCountry: string;
  ATA?: string | null;
  ATD?: string | null;
}

export interface BerthStatus {
  berthId: string;
  isOccupied: boolean;
  currentVessel: Vessel | null;
}

type Props = {
  berth: BerthStatus;
  onClick?: (berth: BerthStatus) => void;
};

export default function BerthTrackerCard({ berth, onClick }: Props) {
  const vessel = berth.currentVessel;

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
    <div className="relative group">
      {/* CARD */}
      <div
  className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center
  transition-all duration-300 ease-in-out
  hover:scale-105 hover:shadow-lg hover:border-blue-400 hover:ring-2 hover:ring-blue-200 mt-3
  cursor-pointer"
  onClick={() => onClick?.(berth)}
>

        {/* Top Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-[12px] font-bold text-black">
            {vessel?.FlagCountry || ''}
          </div>
          <p className="font-bold text-black text-sm">
            BN: {berth.berthId}
          </p>
        </div>

        {/* Ship Image / No Ship */}
        {berth.isOccupied && vessel ? (
          <div className="relative w-full h-28 mb-4">
            <Image
              src="/images/ship.png"
              alt={`Ship at berth ${berth.berthId}`}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center mb-4">
            <img
              src="/images/no-ship.png"
              alt="Berth available"
              className="w-32 h-auto mb-2"
            />
          </div>
        )}

        {/* Ship ID / Status */}
        <div className="mb-3">
          <p
            className={`font-medium truncate text-sm ${
              berth.isOccupied && vessel
                ? 'text-gray-800'
                : 'text-green-600'
            }`}
          >
            {berth.isOccupied && vessel
              ? vessel.VslID
              : '✅ Berth is available'}
          </p>
        </div>

        {/* Arrival / Departure */}
        {berth.isOccupied && vessel && (
          <div className="px-3 py-2 bg-gray-100 rounded-md flex justify-between items-center text-xs text-gray-700 shadow-sm">
            <div className="flex flex-col items-start">
              <span className="font-semibold">Arrival</span>
              <span>{formattedArrival}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-semibold">Departure</span>
              <span>{formattedDeparture}</span>
            </div>
          </div>
        )}
      </div>

      {/* 🔹 HOVER TOOLTIP */}
      <div
        className="absolute z-30 hidden group-hover:block
        top-full left-1/2 -translate-x-1/2 mt-2
        w-64 rounded-lg bg-gray-900 text-white text-xs
        p-3 shadow-xl"
      >
        {berth.isOccupied && vessel ? (
          <>
            <p><span className="font-semibold">Berth:</span> {berth.berthId}</p>
            <p><span className="font-semibold">Vessel:</span> {vessel.VslID}</p>
            <p><span className="font-semibold">Cargo:</span> {vessel.CargoType}</p>
            <p><span className="font-semibold">Country:</span> {vessel.FlagCountry}</p>
            <p><span className="font-semibold">Arrival:</span> {formattedArrival}</p>
            <p><span className="font-semibold">Departure:</span> {formattedDeparture}</p>
          </>
        ) : (
          <p className="text-center text-gray-300">
            Berth {berth.berthId} is currently available
          </p>
        )}
      </div>
    </div>
  );
}
