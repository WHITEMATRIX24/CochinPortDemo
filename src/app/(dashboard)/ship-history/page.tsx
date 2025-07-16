'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { berthData } from '@/data/MockDashboardData';
import { notFound } from 'next/navigation';

export default function BerthHistoryPage() {
  const searchParams = useSearchParams();
  const berthNumber = searchParams.get('berthNumber');
  const router = useRouter();

  if (!berthNumber) {
    console.error('❌ Missing berthNumber in URL query');
    return notFound();
  }

  const berth = berthData.find(
    (b) =>
      typeof b.berthNumber === 'string' &&
      b.berthNumber.toLowerCase() === berthNumber.toLowerCase()
  );

  if (!berth || !Array.isArray(berth.shipDetails)) return notFound();

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 max-w-7xl mx-auto text-blue-800 bg-gray-100 min-h-screen">
      <h1 className="text-lg sm:text-xl font-bold mb-2 mt-4">
        Ship History for Berth {berth.berthNumber} ({berth.berthId})
      </h1>

      <p className="text-sm text-gray-600 mb-4">
        Total Ships: {berth.shipDetails.length}
      </p>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 bg-green-100 rounded-full border border-green-400" /> Current
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 bg-yellow-100 rounded-full border border-yellow-400" /> Upcoming
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 bg-gray-100 rounded-full border border-gray-400" /> Previous
        </span>
      </div>

      {berth.shipDetails.length === 0 ? (
        <p className="text-gray-500">No ship history available for this berth.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-[#014F86] text-white uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 sm:px-6 py-3">Ship Name</th>
                <th className="px-4 sm:px-6 py-3">Vessel ID</th>
                <th className="px-4 sm:px-6 py-3">Arrival Date</th>
                <th className="px-4 sm:px-6 py-3">Departure Date</th>
                <th className="px-4 sm:px-6 py-3">Cargo Type</th>
                <th className="px-4 sm:px-6 py-3">Country</th>
                <th className="px-4 sm:px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {berth.shipDetails.map((ship) => {
                const today = new Date();
                const arrival = new Date(ship.arrivalDate);
                const isUpcoming = arrival > today;

                return (
                  <tr
                    key={ship.id}
                    className={`hover:bg-blue-50 transition-colors ${
                      ship.isCurrent
                        ? 'bg-green-50'
                        : isUpcoming
                        ? 'bg-yellow-50'
                        : 'bg-white'
                    }`}
                  >
                    <td className="px-4 sm:px-6 py-4 font-medium">{ship.name}</td>
                    <td className="px-4 sm:px-6 py-4">{ship.id}</td>
                    <td className="px-4 sm:px-6 py-4">{ship.arrivalDate}</td>
                    <td className="px-4 sm:px-6 py-4">{ship.departureDate}</td>
                    <td className="px-4 sm:px-6 py-4">{ship.cargoType}</td>
                    <td className="px-4 sm:px-6 py-4">{ship.country}</td>
                    <td className="px-4 sm:px-6 py-4">
                      {ship.isCurrent ? (
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                          Current
                        </span>
                      ) : isUpcoming ? (
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                          Upcoming
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                          Previous
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔙 Back Button */}
      <button
        onClick={() => router.back()}
        className="mt-8 mb-6 inline-flex items-center gap-2 px-4 py-2 border border-[#014F86] text-[#014F86] rounded-md text-sm font-medium bg-white hover:bg-[#014F86] hover:text-white transition duration-200 shadow-sm"
      >
        ← Back
      </button>
    </div>
  );
}
