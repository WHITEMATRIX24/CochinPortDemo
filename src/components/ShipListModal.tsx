'use client';

import { useEffect, useState } from 'react';
import { ShipDetails, Berth, berthData } from '@/data/MockDashboardData';

type Props = {
    berth: Berth | null;
    isOpen: boolean;
    onSelectShip: (ship: ShipDetails) => void;
    onClose: () => void;
};

export default function ShipListModal({ berth, isOpen, onSelectShip, onClose }: Props) {
    const [today, setToday] = useState<string>('');

    useEffect(() => {
        // Safe client-side today date
        setToday(new Date().toISOString().split('T')[0]);
    }, []);

    if (!isOpen || !berth) return null;

    const ships = berth.shipDetails.map(ship => ({
        ...ship,
        isCurrent: today && ship.arrivalDate <= today && ship.departureDate >= today,
    }));

    const currentShips = berth.shipDetails.filter(ship =>
        today ? ship.arrivalDate <= today && ship.departureDate >= today : false
    );

    const previousShips = berth.shipDetails.filter(ship =>
        today ? ship.departureDate < today : false
    );

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-lg w-full relative h-[400px] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-2xl font-bold text-gray-600 hover:text-black"
                >
                    &times;
                </button>

                <h2 className="text-xl font-bold mb-4 text-black">Ships in {berth.berthId}</h2>

                {currentShips.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-base font-semibold text-green-700 mb-2">Current Ship</h3>
                        <ul className="space-y-3">
                            {currentShips.map(ship => (
                                <li
                                    key={ship.id}
                                    className="border border-green-400 bg-green-50 p-4 rounded-md shadow hover:shadow-md cursor-pointer"
                                    onClick={() => onSelectShip(ship)}
                                >
                                    <div className="font-bold text-green-800">{ship.name}</div>
                                    <div className="text-sm text-gray-600">
                                        {ship.arrivalDate} → {ship.departureDate}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {previousShips.length > 0 && (
                    <div>
                        <h3 className="text-base font-semibold text-gray-700 mb-2">Previous Ships</h3>
                        <ul className="space-y-3">
                            {previousShips.map(ship => (
                                <li
                                    key={ship.id}
                                    className="border p-4 rounded-md hover:bg-gray-50 cursor-pointer"
                                    onClick={() => onSelectShip(ship)}
                                >
                                    <div className="font-semibold text-black">{ship.name}</div>
                                    <div className="text-sm text-gray-600">
                                        {ship.arrivalDate} → {ship.departureDate}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {ships.length === 0 && (
                    <p className="text-sm text-gray-500">No ships available in this berth.</p>
                )}
            </div>
        </div>
    );
}
