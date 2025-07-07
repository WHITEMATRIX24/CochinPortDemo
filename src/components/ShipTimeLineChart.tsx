'use client';

import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  ChartOptions,
  ChartData,
  Chart
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Bar } from 'react-chartjs-2';
import { useState, useRef } from 'react';

ChartJS.register(CategoryScale, TimeScale, LinearScale, BarElement, Tooltip, Legend);

type ShipData = {
  id: string;
  berth: string;
  ata: Date;
  berthTime: Date;
  unberthTime: Date;
  atd: Date;
};

const rawData: ShipData[] = [
  {
    id: '00103IANNEHC-IC',
    berth: 'V3',
    ata: new Date('2025-04-02T05:25:00'),
    berthTime: new Date('2025-04-02T07:18:00'),
    unberthTime: new Date('2025-04-03T00:00:00'),
    atd: new Date('2025-04-03T02:26:00'),
  },
  {
    id: '40103515-IAH-NA',
    berth: 'V3',
    ata: new Date('2025-04-05T13:25:00'),
    berthTime: new Date('2025-04-05T15:18:00'),
    unberthTime: new Date('2025-04-06T05:18:00'),
    atd: new Date('2025-04-06T07:34:00'),
  },
  {
    id: '50103ANHSIRK-LS',
    berth: 'V2',
    ata: new Date('2025-04-03T16:00:00'),
    berthTime: new Date('2025-04-03T19:06:00'),
    unberthTime: new Date('2025-04-04T03:48:00'),
    atd: new Date('2025-04-04T06:04:00'),
  },
];

export default function ShipTimelineChart() {
  const [selectedBerth, setSelectedBerth] = useState<string>('All');
  const chartRef = useRef<Chart<'bar', any[], unknown> | null>(null);

  const ships = selectedBerth === 'All'
    ? rawData
    : rawData.filter((ship) => ship.berth === selectedBerth);

  const allTimes = ships.flatMap((ship) => [
    ship.ata,
    ship.berthTime,
    ship.unberthTime,
    ship.atd,
  ]);
  const minTime = Math.min(...allTimes.map((d) => d.getTime()));
  const maxTime = Math.max(...allTimes.map((d) => d.getTime()));

  const data: ChartData<'bar', any[], unknown> = {
    labels: ships.map((ship) => `${ship.id}`),
    datasets: [
      {
        label: 'ATA → Berth',
        backgroundColor: '#4c9aff',
        data: ships.map((ship) => ({
          x: [ship.ata.getTime(), ship.berthTime.getTime()],
          y: ship.id,
        })),
      },
      {
        label: 'Berth → Unberth',
        backgroundColor: '#36cfc9',
        data: ships.map((ship) => ({
          x: [ship.berthTime.getTime(), ship.unberthTime.getTime()],
          y: ship.id,
        })),
      },
      {
        label: 'Unberth → ATD',
        backgroundColor: '#ff7875',
        data: ships.map((ship) => ({
          x: [ship.unberthTime.getTime(), ship.atd.getTime()],
          y: ship.id,
        })),
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y',
    scales: {
      x: {
        type: 'time',
        min: minTime,
        max: maxTime,
        time: {
          unit: 'hour',
          tooltipFormat: 'dd MMM yyyy, HH:mm',
          displayFormats: {
            hour: 'HH:mm',
          },
        },
        title: {
          display: true,
          text: 'Timeline',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Vessel ID',
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="p-6 bg-white shadow rounded-md">
      <div className="mb-4 flex items-center gap-4">
        <label className="text-gray-700 font-medium">Select Berth:</label>
        <select
          value={selectedBerth}
          onChange={(e) => setSelectedBerth(e.target.value)}
          className="border border-gray-300 px-3 py-1 rounded"
        >
          <option value="All">All</option>
          {[...new Set(rawData.map((s) => s.berth))].map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <Bar ref={chartRef} data={data} options={options} />
    </div>
  );
}
