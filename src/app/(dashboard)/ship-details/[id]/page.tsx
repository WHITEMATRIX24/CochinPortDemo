'use client';

import { useParams, useRouter } from 'next/navigation';
import { berthData, ShipDetails } from '@/data/MockDashboardData';

export default function ShipDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  // Flatten all shipDetails from berthData
  const allShips: ShipDetails[] = berthData
    .flatMap((berth) => berth.shipDetails ?? []);

  const ship = allShips.find((s) => s.id === id);

  if (!ship) {
    return <div className="p-6 text-red-500 font-semibold">❌ Ship not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium transition"
      >
        ← Back
      </button>

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span>Dashboard</span> <span className="mx-2">/</span>
        <span className="text-blue-600 font-semibold">Ship Details</span>
      </div>

      {/* Ship Name and ID */}
      <h1 className="text-3xl font-bold mb-6 text-blue-900">{ship.id}</h1>

      {/* Ship Information Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          ['Vessel ID', ship.id],
          ['Arrival Date', ship.arrivalDate],
          ['Departure Date', ship.departureDate],
          ['Cargo Type', ship.cargoType],
          ['Country', ship.country],
          ['Deadweight', ship.deadweight],
          ['ATA - Outer Roads', ship.ata],
          ['ATD - Outer Roads', ship.atd],
          ['Actual Arrival', ship.actual_time_of_arrival],
          ['Berthing Time', ship.actual_time_of_berth],
          ['Unberthing Time', ship.actual_time_of_unberthing],
          ['Actual Departure', ship.actual_time_of_Depar],
        ].map(([label, value]) => (
          <div key={label} className="bg-gray-100 border rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 font-medium mb-1">{label}</p>
            <p className="text-gray-800 font-semibold">{value || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
