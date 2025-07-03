'use client';

import { Ship, Droplet, Mountain, Ban } from 'lucide-react';

type Props = {
  berthData: {
    cargoType: string;
  }[];
};
const statsMeta = [
  {
    label: 'Containerised',
color: 'bg-[#006494] text-white border border-[#012A4A]'
,    Icon: Ship,
  },
  {
    label: 'Liquid Bulk',
color: 'bg-[#006494] text-white border border-[#012A4A]'
,    Icon: Droplet,
  },
  {
    label: 'Dry Bulk Mechanical',
color: 'bg-[#006494] text-white border border-[#012A4A]'
,    Icon: Mountain,
  },
  {
    label: 'Non Cargo',
color: 'bg-[#006494] text-white border border-[#012A4A]'
,    Icon: Ban,
  },
];


export default function CargoStats({ berthData }: Props) {
  return (
    <div className="mt-15">
{/*       <h6 className="text-lg font-semibold mb-4 text-gray-800">Cargo Type Statistics</h6>
 */}      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {statsMeta.map(({ label, color, Icon }) => {
          const count = berthData.filter(b => b.cargoType === label).length;
          return (
            <div
  key={label}
  className={`rounded-lg p-5 flex items-center justify-between shadow-inner backdrop-blur-sm border border-white/10 ${color}`}
>

              <div>
                <div className="text-md font-medium drop-shadow-sm">{label}</div>
                <div className="text-2xl font-bold">{count}</div>
              </div>
              <Icon className="w-10 h-15 opacity-80" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
