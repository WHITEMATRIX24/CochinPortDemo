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
    return notFound(); // or show fallback UI
  }

  const berth = berthData.find(
    (b) =>
      typeof b.berthNumber === 'string' &&
      b.berthNumber.toLowerCase() === berthNumber.toLowerCase()
  );

  if (!berth || !Array.isArray(berth.shipDetails)) return notFound();

  return (
    <div className="p-6 max-w-6xl mx-auto text-black">
      {/* 🔙 Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 text-sm text-[#014F86] hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-2">
        Ship History for Berth {berth.berthNumber} ({berth.berthId})
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        Total Ships: {berth.shipDetails.length}
      </p>

      {berth.shipDetails.length === 0 ? (
        <p className="text-gray-500">No ship history available for this berth.</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="overflow-x-auto rounded-xl shadow-md">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left bg-white rounded-xl">
              <thead className="bg-[#014F86] text-white uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-3">Ship Name</th>
                  <th className="px-6 py-3">Arrival Date</th>
                  <th className="px-6 py-3">Departure Date</th>
                  <th className="px-6 py-3">Cargo Type</th>
                  <th className="px-6 py-3">Country</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {berth.shipDetails.map((ship) => (
                  <tr
                    key={ship.id}
                    className={`hover:bg-blue-50 transition-colors ${
                      ship.isCurrent ? 'bg-green-50' : 'bg-white'
                    }`}
                  >
                    <td className="px-6 py-4 font-medium">{ship.name}</td>
                    <td className="px-6 py-4">{ship.arrivalDate}</td>
                    <td className="px-6 py-4">{ship.departureDate}</td>
                    <td className="px-6 py-4">{ship.cargoType}</td>
                    <td className="px-6 py-4">{ship.country}</td>
                    <td className="px-6 py-4">
                      {ship.isCurrent ? (
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                          Current
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                          Previous
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
