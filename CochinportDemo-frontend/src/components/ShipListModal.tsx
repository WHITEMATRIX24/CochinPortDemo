'use client';
import { Berth } from '@/data/MockDashboardData';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Props = {
  berth: Berth | null;
  isOpen: boolean;
/*   onSelectShip: (ship: ShipDetails) => void;
 */  onClose: () => void;
};

export default function ShipListModal({ berth, isOpen, onClose }: Props) {
  if (!isOpen || !berth || !Array.isArray(berth.shipDetails)) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize

  const currentShip = berth.shipDetails.find((ship) => ship.isCurrent);



  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-xl w-full relative text-black">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl font-bold text-gray-600 hover:text-black"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">Current Ship at {berth.berthNumber}</h2>

        {/* Inside your component */}
        {!currentShip ? (
          <p className="text-red-500 text-sm">No ship is currently docked at this berth.</p>
        ) : (
          <Link

            href={`/ship-details/${currentShip.id}`}
            className="block border border-green-400 bg-green-50 p-4 rounded-md shadow hover:shadow-md transition"
          >
            <div className="text-lg font-bold text-green-800">{currentShip.id}</div>
            <div className="text-sm text-gray-600 mb-2">
              {currentShip.arrivalDate} → {currentShip.departureDate}
            </div>
            <p><strong>Cargo:</strong> {currentShip.cargoType}</p>
            <p><strong>Country:</strong> {currentShip.country}</p>
          </Link>

        )}


        {/* Navigation Button to Full History */}


        <div className="mt-8 flex justify-end">
          <Link
            href={`/ship-history?berthNumber=${berth.berthNumber}`}
            className="inline-flex items-center gap-2 text-white font-medium text-sm px-4 py-2 rounded-md transition duration-300 shadow-sm hover:opacity-90"
            style={{ backgroundColor: '#014f86' }}
          >
            View All Ship History
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>



      </div>
    </div>
  );
}
