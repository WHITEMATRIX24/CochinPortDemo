'use client'

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
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import 'chartjs-adapter-date-fns'
import { format } from 'date-fns'
import { Bar } from 'react-chartjs-2'
import { useState, useRef } from 'react'

ChartJS.register(CategoryScale, TimeScale, LinearScale, BarElement, Tooltip, Legend, annotationPlugin)

type Ship = {
  id: string
  berth: string
  eta: string
  ata: string
  atBerth: string
  unberth: string
  etd: string
  atd: string
}

const shipData: Ship[] = [
  {
    id: '00103IANNEHC-IC',
    berth: 'V3',
    eta: '2025-07-07T04:55:00',
    ata: '2025-07-07T05:25:00',
    atBerth: '2025-07-07T07:18:00',
    unberth: '2025-07-08T00:00:00',
    etd: '2025-07-08T01:00:00',
    atd: '2025-07-08T02:26:00'
  },
  {
    id: '40103515-IAH-NA',
    berth: 'V3',
    eta: '2025-07-05T12:45:00',
    ata: '2025-07-05T13:25:00',
    atBerth: '2025-07-05T15:18:00',
    unberth: '2025-07-06T05:18:00',
    etd: '2025-07-06T06:30:00',
    atd: '2025-07-06T07:34:00'
  },
  {
    id: '50103ANHSIRK-LS',
    berth: 'V2',
    eta: '2025-07-03T15:00:00',
    ata: '2025-07-03T16:00:00',
    atBerth: '2025-07-03T19:06:00',
    unberth: '2025-07-04T03:48:00',
    etd: '2025-07-04T05:00:00',
    atd: '2025-07-04T06:04:00'
  },
  {
    id: '50103ANHSIRK-new2',
    berth: 'Q1',
    eta: '2025-06-30T15:00:00',
    ata: '2025-06-30T16:00:00',
    atBerth: '2025-06-30T19:06:00',
    unberth: '2025-07-01T03:48:00',
    etd: '2025-07-01T05:00:00',
    atd: '2025-07-01T06:04:00'
  },
  {
    id: '50103ANHSIRK-new1',
    berth: 'Q2',
    eta: '2025-07-06T15:00:00',
    ata: '2025-07-06T16:00:00',
    atBerth: '2025-07-06T19:06:00',
    unberth: '2025-07-08T03:48:00',
    etd: '2025-07-08T05:00:00',
    atd: '2025-07-08T05:00:00'
  }
]

type BarDataPoint = { x: [number, number]; y: string }

export default function ShipTimelineChart() {
  const [selectedBerth, setSelectedBerth] = useState<string>('All')
  const chartRef = useRef<Chart<'bar', BarDataPoint[], unknown> | null>(null)

  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

  const isShipActiveToday = (ship: Ship) => {
    const eta = new Date(ship.eta).getTime()
    const atd = new Date(ship.atd).getTime()
    return !(atd < startOfToday.getTime() || eta > endOfToday.getTime())
  }

  const filteredShips = shipData.filter((ship) => {
    const berthMatch = selectedBerth === 'All' || ship.berth === selectedBerth
    return berthMatch && isShipActiveToday(ship)
  })

  const allTimes = filteredShips.flatMap((s) => [
    new Date(s.eta),
    new Date(s.ata),
    new Date(s.atBerth),
    new Date(s.unberth),
    new Date(s.etd),
    new Date(s.atd)
  ])
  const minTime = Math.min(...allTimes.map((d) => d.getTime()))
  const maxTime = Math.max(...allTimes.map((d) => d.getTime()))

  const data: ChartData<'bar', BarDataPoint[], unknown> = {
    labels: filteredShips.map((ship) => ship.id),
    datasets: [
      {
        label: 'ETA → ATA',
        backgroundColor: '#ffe066',
        data: filteredShips.map((ship) => ({
          x: [new Date(ship.eta).getTime(), new Date(ship.ata).getTime()],
          y: ship.id
        }))
      },
      {
        label: 'ATA → At Berth',
        backgroundColor: '#4c9aff',
        data: filteredShips.map((ship) => ({
          x: [new Date(ship.ata).getTime(), new Date(ship.atBerth).getTime()],
          y: ship.id
        }))
      },
      {
        label: 'At Berth → Unberth',
        backgroundColor: '#36cfc9',
        data: filteredShips.map((ship) => ({
          x: [new Date(ship.atBerth).getTime(), new Date(ship.unberth).getTime()],
          y: ship.id
        }))
      },
      {
        label: 'Unberth → ETD',
        backgroundColor: '#ffa94d',
        data: filteredShips.map((ship) => ({
          x: [new Date(ship.unberth).getTime(), new Date(ship.etd).getTime()],
          y: ship.id
        }))
      },
      {
        label: 'ETD → ATD',
        backgroundColor: '#ff6b6b',
        data: filteredShips.map((ship) => ({
          x: [new Date(ship.etd).getTime(), new Date(ship.atd).getTime()],
          y: ship.id
        }))
      }
    ]
  }

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
          tooltipFormat: 'dd.MM.yyyy HH:mm',
          displayFormats: {
            hour: 'dd.MM.yyyy HH:mm',
            minute: 'dd.MM.yyyy HH:mm'
          }
        },
        title: {
          display: true,
          text: 'Time (Date & Hour)',
          color: '#000000'
        },
        ticks: {
          color: '#000000'
        },
        grid: {
          color: '#00000022'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Ship ID',
          color: '#000000'
        },
        ticks: {
          color: '#000000'
        },
        grid: {
          color: '#00000022'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#000000'
        }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const raw = ctx.raw as { x: [number, number]; y: string }
            const [start, end] = raw.x
            const duration = Math.round((end - start) / 60000)
            return `${ctx.dataset.label}: ${format(start, 'dd.MM HH:mm')} - ${format(
              end,
              'HH:mm'
            )} (${duration} mins)`
          }
        }
      },
      annotation: {
        annotations: {
          todayHighlight: {
            type: 'box',
            xMin: startOfToday.getTime(),
            xMax: endOfToday.getTime(),
            backgroundColor: 'rgba(255, 214, 102, 0.2)',
            borderColor: 'rgba(255, 214, 102, 0.6)',
            borderWidth: 1,
            label: {
              display: true,
              content: 'Today',
              position: 'start',
              //backgroundColor: 'rgba(255, 214, 102, 0.8)',
              color: '#000'
            }
          }
        }
      }
    }
  }

  const berths = ['All', ...new Set(shipData.map((ship) => ship.berth))]

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Filter by Berth</label>
        <select
          value={selectedBerth}
          onChange={(e) => setSelectedBerth(e.target.value)}
          className="text-black rounded px-3 py-2"
        >
          {berths.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  )
}
