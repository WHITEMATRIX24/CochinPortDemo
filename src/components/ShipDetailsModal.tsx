import { ShipDetails, Berth, berthData } from '@/data/MockDashboardData';

type Props = {
    ship: ShipDetails | null;
    isOpen: boolean;
    onClose: () => void;
};

export default function ShipDetailsModal({ ship, isOpen, onClose }: Props) {
    if (!isOpen || !ship) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl max-w-2xl h-[400px] w-full shadow-lg relative text-black">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold"
                >
                    &times;
                </button>

                {/* Title */}
                <h2 className="text-2xl font-semibold mb-6 border-b pb-2 text-center">
                    {ship.name} <span className="text-sm font-normal text-gray-500">Details</span>
                </h2>

                {/* Details List */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <div>
                        <span className="font-medium text-gray-700">Arrival Date:</span>
                        <p className="text-gray-900">{ship.arrivalDate}</p>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">Departure Date:</span>
                        <p className="text-gray-900">{ship.departureDate}</p>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">Cargo Type:</span>
                        <p className="text-gray-900">{ship.cargoType}</p>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">Country:</span>
                        <p className="text-gray-900">{ship.country}</p>
                    </div>
                    {/* <div className="col-span-2 flex items-center gap-2 mt-2">
                        <span className="font-medium text-gray-700">Flag:</span>
                        <img
                            src={ship.flag}
                            alt={`${ship.country} flag`}
                            className="w-14 h-10 object-cover rounded border"
                        />
                    </div> */}
                </div>
            </div>
        </div>

    );
}
