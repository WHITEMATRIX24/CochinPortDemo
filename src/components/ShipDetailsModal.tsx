import { ShipDetails } from '@/data/MockDashboardData';

type Props = {
    ship: ShipDetails | null;
    isOpen: boolean;
    onClose: () => void;
};

export default function ShipDetailsModal({ ship, isOpen, onClose }: Props) {
    if (!isOpen || !ship) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
            <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden transition-all animate-fadeIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl transition"
                    aria-label="Close modal"
                >
                    &times;
                </button>

                {/* Modal Content */}
                <div className="p-8 sm:p-10 max-h-[80vh] overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {/* Header */}
                    <h2 className="text-2xl font-extrabold text-center text-blue-900 mb-6">{ship.id}</h2>

                    {/* Detail Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[15px]">
                        {[
                            ['Arrival Date', ship.arrivalDate],
                            ['Departure Date', ship.departureDate],
                            ['Cargo Type', ship.cargoType],
                            ['Country', ship.country],
                            ['Dead Weight', ship.deadweight],
                            ['Actual Time of Arrival', ship.actual_time_of_arrival],
                            ['Actual Time of Departure', ship.actual_time_of_Depar],
                            ['Actual Time of Berth', ship.actual_time_of_berth],
                            ['Actual Time of Unberthing', ship.actual_time_of_unberthing],
                            ['ATA - Outer Roads', ship.ata],
                            ['ATD - Outer Roads', ship.atd],
                        ].map(([label, value]) => (
                            <div key={label} className="bg-gray-100 rounded-xl p-4 shadow-sm">
                                <p className="text-gray-500 font-medium mb-1">{label}</p>
                                <p className="text-gray-800 font-semibold">{value || '—'}</p>
                            </div>
                        ))}
                    </div>

                    {/* Optional Flag */}
                    {/*
  <div className="mt-6 flex items-center gap-3 justify-center">
    <p className="text-gray-500 font-medium">Flag</p>
    <img
      src={ship.flag}
      alt={`${ship.country} flag`}
      className="w-16 h-10 object-cover rounded border shadow"
    />
  </div>
  */}
                </div>

            </div>
        </div>
    );
}
