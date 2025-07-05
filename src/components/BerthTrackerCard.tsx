'use client';

import Image from 'next/image';

type Props = {
  imageSrc: string;
  berthId: string;
  berthNumber: string;
  countryFlag: string;
  arrivalDate: string;
  departureDate: string;
};

export default function BerthTrackerCard({
  imageSrc,
  berthId,
  berthNumber,
  countryFlag,
  arrivalDate,
  departureDate,
}: Props) {
  // Format the dates to: 04 Jul 2025
  const formattedArrival = new Date(arrivalDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const formattedDeparture = new Date(departureDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center transition-transform duration-300 transform hover:scale-100 hover:shadow-lg hover:border-blue-400 hover:ring-2 hover:ring-blue-200">
      {/* Top: Flag + Berth Number */}
      <div className="flex items-center justify-between mt-2 mb-3">
        {/* Flag on Left */}
        <div className="relative w-10 aspect-[3/2]">
          <Image
            src={countryFlag}
            alt={`Flag for ${berthId}`}
            fill
            className="rounded object-cover"
          />
        </div>

        {/* Berth Number on Right */}
        <p className="font-bold text-black text-sm m-0">BN: {berthNumber}</p>
      </div>

      {/* Ship Image */}
      <div className="relative w-full h-28 mb-3">
        <Image
          src={imageSrc}
          alt={berthId}
          fill
          className="object-contain"
        />
      </div>

      {/* Berth ID */}
      <p className="font-medium text-gray-800 truncate mb-2">{berthId}</p>

      {/* Arrival & Departure Dates */}
      <div className="mt-3 px-3 py-1.5 bg-gray-100 rounded-md flex justify-between items-center text-xs text-gray-700 shadow-sm">
        <div className="flex flex-col items-start">
          <span className="font-semibold text-gray-600">Arrival</span>
          <span className="text-gray-900">{formattedArrival}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-semibold text-gray-600">Departure</span>
          <span className="text-gray-900">{formattedDeparture}</span>
        </div>
      </div>
    </div>
  );
}
