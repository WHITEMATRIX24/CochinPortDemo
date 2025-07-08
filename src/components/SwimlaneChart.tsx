'use client'

import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  ChartOptions,
  ChartData,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import zoomPlugin from 'chartjs-plugin-zoom'
import 'chartjs-adapter-date-fns'
import { useRef, useState, useEffect } from 'react'

ChartJS.register(
  TimeScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  zoomPlugin
)

const shipMovements = [
  {
    shipId: '00103IANNEHC-IC',
    berth: 'V3',
    events: {
      ETA: new Date('2025-07-07T01:00:00'),
      ATA: new Date('2025-07-07T04:00:00'),
      ETD: new Date('2025-07-08T06:00:00'),
      ATD: new Date('2025-07-08T07:00:00'),
    },
  },
  {
    shipId: '60103TARAJUG-LS',
    berth: 'Q1',
    events: {
      ETA: new Date('2025-07-07T11:00:00'),
      ATA: new Date('2025-07-07T12:30:00'),
      ETD: new Date('2025-07-07T22:30:00'),
      ATD: new Date('2025-07-07T22:30:00'),
    },
  },
  {
    shipId: '63103NASIK-LAJ',
    berth: 'v2',
    events: {
      ETA: new Date('2025-07-06T22:00:00'),
      ATA: new Date('2025-07-07T02:30:00'),
      ETD: new Date('2025-07-08T07:30:00'),
      ATD: new Date('2025-07-08T08:00:00'),
    },
  },
  {
    shipId: '25103REENOIP-NA',
    berth: 'Q10',
    events: {
      ETA: new Date('2025-07-04T22:00:00'),
      ATA: new Date('2025-07-04T02:30:00'),
      ETD: new Date('2025-07-05T07:30:00'),
      ATD: new Date('2025-07-05T08:00:00'),
    },
  },
  {
    shipId: '65103II-REVLIS',
    berth: 'Q10',
    events: {
      ETA: new Date('2025-07-06T22:00:00'),
      ATA: new Date('2025-07-06T02:30:00'),
      ETD: new Date('2025-07-07T07:30:00'),
      ATD: new Date('2025-07-07T08:00:00'),
    },
  },
  {
    shipId: '65103II-REVLIS',
    berth: 'Q10',
    events: {
      ETA: new Date('2025-07-06T22:00:00'),
      ATA: new Date('2025-07-06T02:30:00'),
      ETD: new Date('2025-07-07T07:30:00'),
      ATD: new Date('2025-07-07T08:00:00'),
    },
  },{
    shipId: '65103II-REVLIS',
    berth: 'Q9',
    events: {
      ETA: new Date('2025-07-06T22:00:00'),
      ATA: new Date('2025-07-06T02:30:00'),
      ETD: new Date('2025-07-07T07:30:00'),
      ATD: new Date('2025-07-07T08:00:00'),
    },
  },
]

const colorMap = {
  ETA: '#8ecae6',
  ATA: '#219ebc',
  ETD: '#ffb703',
  ATD: '#fb8500',
}

export default function SwimlaneChart() {
  const [selectedBerth, setSelectedBerth] = useState('All')
  // Explicitly type the ref for a ChartJS "line" chart.
  const chartRef = useRef<ChartJS<'line', { x: number; y: string }[], unknown>>(null)

  const allBerths = [...new Set(shipMovements.map(ship => ship.berth))]
  const isToday = (date: Date) => {
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

const todayShips = shipMovements.filter(ship =>
  Object.values(ship.events).some(d => isToday(d))
)

const filteredShips =
  selectedBerth === 'All'
    ? todayShips
    : todayShips.filter(ship => ship.berth === selectedBerth)


  const datasets: any[] = []

  for (const ship of filteredShips) {
    const { ETA, ATA, ETD, ATD } = ship.events
const y = `🛳️ ${ship.shipId} (${ship.berth})`

    if (![ETA, ATA, ETD, ATD].every(d => d instanceof Date && !isNaN(d.getTime()))) continue

    datasets.push(
      {
        label: 'ETA to ATA',
        data: [
          { x: ETA.getTime(), y },
          { x: ATA.getTime(), y },
        ],
        borderColor: colorMap.ETA,
        backgroundColor: colorMap.ETA,
        borderWidth: 4,
        pointRadius: 5,
      },
      {
        label: 'ATA to ETD',
        data: [
          { x: ATA.getTime(), y },
          { x: ETD.getTime(), y },
        ],
        borderColor: colorMap.ATA,
        backgroundColor: colorMap.ATA,
        borderWidth: 4,
        pointRadius: 5,
      },
      {
        label: 'ETD to ATD',
        data: [
          { x: ETD.getTime(), y },
          { x: ATD.getTime(), y },
        ],
        borderColor: colorMap.ETD,
        backgroundColor: colorMap.ETD,
        borderWidth: 4,
        pointRadius: 5,
      }
    )
  }

  // Calculate time limits (with 12-hour padding)
  const allTimestamps = shipMovements.flatMap(ship =>
    Object.values(ship.events).map(d => new Date(d).getTime())
  )
  const padding = 12 * 60 * 60 * 1000 // 12 hours
  const chartMinLimit = Math.min(...allTimestamps) - padding
  const chartMaxLimit = Math.max(...allTimestamps) + padding

  const defaultCenterDate = new Date('2025-07-07T00:00:00')
  const defaultStart = defaultCenterDate.getTime()
  const defaultEnd = new Date(defaultCenterDate.getTime() + 24 * 60 * 60 * 1000).getTime()

  // Explicitly type your options as ChartOptions for a "line" chart.
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'MMM d, HH:mm',
          },
        },
        min: defaultStart,
        max: defaultEnd,
        suggestedMin: defaultStart,
        suggestedMax: defaultEnd,
        title: {
          display: true,
          text: 'Time',
        },
        ticks: {
          source: 'auto',
        },
        grid: {
          display: true,
          color: '#e0e0e0',
        },
      },
      y: {
        type: 'category',
        offset: true,
        title: {
          display: true,
          text: 'Ship (Berth)',
        },
        ticks: {
          padding: 10,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
  callbacks: {
    label: (context: any) => {
      const label = context.dataset.label || ''
      const index = context.dataIndex

      const data = context.dataset.data as { x: number; y: string }[]
      if (!data || data.length < 2 || index > 1) return `${label}`

      const startTime = new Date(data[0].x)
      const endTime = new Date(data[1].x)

      const durationMs = endTime.getTime() - startTime.getTime()
      const hours = Math.floor(durationMs / (1000 * 60 * 60))
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

      const durationStr =
        hours > 0
          ? `${hours}h ${minutes}m`
          : `${minutes}m`

return `${label} duration: ${durationStr}`
    },
  },
},

      zoom: {
        pan: {
          enabled: true,
          mode: 'x' as const, // explicitly set mode
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x' as const, // explicitly set mode
        },
        limits: {
          x: {
            min: chartMinLimit,
            max: chartMaxLimit,
          },
        },
      },
    },
  }

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resetZoom()
    }
  }, [])
  useEffect(() => {
  if (typeof window !== 'undefined') {
    // Safe to use ChartJS plugins that rely on window
    ChartJS.register(zoomPlugin)
  }
}, [])


  // Build our data object with an explicit type.
  const data: ChartData<'line', { x: number; y: string }[]> = { datasets }

  return (
    <div className="w-full bg-white space-y-6">
            {/* Filter + Reset on same line */}
<div className="flex items-center justify-between p-3 px-5">
  {/* Label + Select */}
  <div className="flex space-x-4 items-center">
    <label htmlFor="berth" className="font-semibold text-gray-800">
      Select Berth:
    </label>
    <select
      id="berth"
      value={selectedBerth}
      onChange={e => setSelectedBerth(e.target.value)}
      className="border px-2 py-1 rounded text-gray-900 font-medium bg-white"
    >
      <option value="All">All</option>
      {allBerths.map(berth => (
        <option key={berth} value={berth}>
          {berth}
        </option>
      ))}
    </select>
  </div>

  {/* Reset Zoom Button */}
  <button
    onClick={() => chartRef.current?.resetZoom()}
    className="px-4 py-2 border border-gray-300 text-gray-800 rounded hover:bg-[#014F86] hover:text-white transition"
  >
    Reset Zoom
  </button>
</div>


      {/* Chart */}
      <div className="w-full h-[600px] overflow-x-auto">
        <Chart ref={chartRef} type="line" data={data} options={options} />
      </div>

    </div>
  )
}
