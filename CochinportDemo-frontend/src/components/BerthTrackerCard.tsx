'use client';

import Image from 'next/image';

type Props = {
  imageSrc: string;
  berthNumber: string;
  countryFlag: string;
  arrivalDate: string;
  departureDate: string;
  currentShipId?: string;
  onClick: () => void;
};

export default function BerthTrackerCard({
  imageSrc,
  berthNumber,
  countryFlag,
  arrivalDate,
  departureDate,
  currentShipId,
  onClick,
}: Props) {
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
  <div
  className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:border-blue-400 hover:ring-2 hover:ring-blue-200 mt-3"
  onClick={onClick}
>
  {/* Top Row: Flag + Berth Number */}
  <div className="flex items-center justify-between mb-4">
    <div className="relative w-10 aspect-[3/2]">
      {/* {currentShipId && (
        <Image
          src={countryFlag}
          alt={`Flag for ${berthNumber}`}
          fill
          className="rounded object-cover"
        />
      )} */}
    </div>
    <p className="font-bold text-black text-sm">BN: {berthNumber}</p>
  </div>

  {/* Ship Image */}
  {currentShipId && (
    <div className="relative w-full h-28 mb-4">
      <Image
        src={imageSrc}
        alt={`Ship image for berth ${berthNumber}`}
        fill
        className="object-contain"
      />
    </div>
  )}

  {/* Ship ID or Availability Message */}
  <div className="flex flex-col items-center justify-center mb-3">


      <p
    className={`font-medium truncate text-sm ${
      currentShipId ? "text-gray-800" : "text-red-600"
    }`}
  >
    {currentShipId || "Berth is available"}
  </p>
  {!currentShipId && (
    <img
      src="/images/no-ship.png" // Make sure this exists in your public/images folder
      alt="Berth is available"
      className="w-32 h-auto mb-2"
    />
  )}


</div>


  {/* Arrival & Departure Info */}
  {currentShipId && (
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
