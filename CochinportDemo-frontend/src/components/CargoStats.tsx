'use client';

import { Ship, Droplet, Mountain, Ban, Boxes } from 'lucide-react';

type Props = {
  berthData: {
    cargoType: string;
    shipDetails?: { cargoType: string; isCurrent?: boolean }[];
  }[];
};

const statsMeta = [
  { label: 'Containerised', Icon: Ship },
  { label: 'Liquid Bulk', Icon: Droplet },
  { label: 'Dry Bulk Mechanical', Icon: Mountain },
  { label: 'Break Bulk', Icon: Boxes },
  { label: 'Non Cargo', Icon: Ban },
];

export default function CargoStats({ berthData }: Props) {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-50 bg-white border-x border-t border-gray-300 shadow-md rounded-t-xl px-10 py-3 flex gap-12 items-center">
      {statsMeta.map(({ label, Icon }) => {
        const count = berthData.reduce((acc, b) => {
          const isDocked = b.shipDetails?.some(
            ship => ship.isCurrent && ship.cargoType === label
          );
          return acc + (isDocked ? 1 : 0);
        }, 0);

        return (
          <div
            key={label}
            className="relative flex group items-center gap-2 text-[#014F86] font-semibold"
          >
            <Icon className="w-6 h-6" />
            <span>{count}</span>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
