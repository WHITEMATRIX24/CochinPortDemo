'use client';

import Image from 'next/image';

type Props = {
  imageSrc: string;
  berthNumber: string;
  countryFlag: string;
  arrivalDate: string;
  departureDate: string;
  currentShipId?: string;
};


export default function BerthTrackerCard({
  imageSrc,
  berthNumber,
  arrivalDate,
  departureDate,
  currentShipId,
}: Props) {
  const formattedArrival = arrivalDate
    ? new Date(arrivalDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  const formattedDeparture = departureDate
    ? new Date(departureDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <div className="relative group">
      {/* Card */}
      <div
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center
        transition-all duration-300 ease-in-out
        hover:scale-105 hover:shadow-lg hover:border-blue-400 hover:ring-2 hover:ring-blue-200 mt-3"
      >
        {/* Top Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-10 aspect-[3/2]" />
          <p className="font-bold text-black text-sm"> {berthNumber}</p>
        </div>

        {/* Ship Image */}
        {currentShipId && (
          <div className="relative w-full h-28 mb-4">
            <Image
              src={imageSrc}
              alt={`Ship at berth ${berthNumber}`}
              fill
              className="object-contain"
            />
          </div>
        )}

        {/* Ship ID / Available */}
        <div className="flex flex-col items-center justify-center mb-3">
          <p
            className={`font-medium truncate text-sm ${
              currentShipId ? 'text-gray-800' : 'text-red-600'
            }`}
          >
            {currentShipId || 'Berth is available'}
          </p>

          {!currentShipId && (
            <img
              src="/images/no-ship.png"
              alt="Berth available"
              className="w-32 h-auto mt-2"
            />
          )}
        </div>

        {/* Arrival / Departure */}
        {currentShipId && (
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

      {/* 🔹 Hover Tooltip */}
      <div
        className="absolute z-30 hidden group-hover:block
        top-full left-1/2 -translate-x-1/2 mt-2
        w-64 rounded-lg bg-gray-900 text-white text-xs
        p-3 shadow-xl"
      >
        {currentShipId ? (
          <>
            <p><span className="font-semibold">Berth:</span> {berthNumber}</p>
            <p><span className="font-semibold">Ship ID:</span> {currentShipId}</p>
            <p><span className="font-semibold">Arrival:</span> {formattedArrival}</p>
            <p><span className="font-semibold">Departure:</span> {formattedDeparture}</p>
          </>
        ) : (
          <p className="text-center text-gray-300">
            Berth {berthNumber} is currently available
          </p>
        )}
      </div>
    </div>
  );
}
