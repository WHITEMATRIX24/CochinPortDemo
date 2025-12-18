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
import { useRef, useState, useEffect, useMemo } from 'react'
import { serverUrl } from '@/services/serverUrl'
interface ShipEvents {
  ATA: Date
  ATB: Date
  ATU: Date
  ATD: Date
}

interface Vessel {
  shipId: string
  berth: string
  events: ShipEvents
}


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
// import { shipMovements } from '@/data/dummayShipData';


const colorMap = {
  ATA: '#8ecae6',
  ATB: '#219ebc',
  ATU: '#ffb703',
  ATD: '#fb8500',
}

export default function SwimlaneChart() {
  const [vessels, setVessels] = useState<Vessel[]>([])
  const [selectedBerth, setSelectedBerth] = useState('All')
  const [startDate, setStartDate] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })
  const [endDate, setEndDate] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setHours(0, 0, 0, 0)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
  })

  useEffect(() => {
    const fetchVessels = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/vessel/all-vessels`);
        const rawData = await res.json();

        const normalized = rawData
          .map((v: any) => {
            if (!v.ATA || !v.ATABerth || !v.ATDUnberth || !v.ATD) return null;

            return {
              shipId: v.VslID,
              berth: v.Berth,
              events: {
                ATA: new Date(v.ATA),
                ATB: new Date(v.ATABerth),
                ATU: new Date(v.ATDUnberth),
                ATD: new Date(v.ATD),
              },
            };
          })
          .filter(Boolean);

        setVessels(normalized);
      } catch (err) {
        console.error("Failed to fetch vessels", err);
      }
    };

    fetchVessels();
  }, []);

  console.log(vessels);
  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (!value) {
      // Reset to default values
      if (type === 'start') {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        setStartDate(today)
      } else if (type === 'end') {
        const tomorrow = new Date()
        tomorrow.setHours(0, 0, 0, 0)
        tomorrow.setDate(tomorrow.getDate() + 1)
        setEndDate(tomorrow)
      }
      return
    }

    const parsedDate = new Date(value)
    parsedDate.setHours(0, 0, 0, 0)

    if (type === 'start') setStartDate(parsedDate)
    if (type === 'end') setEndDate(parsedDate)
  }


  const chartRef = useRef<ChartJS<'line', { x: number; y: string }[], unknown>>(null)

  const allBerths = [...new Set(vessels.map(ship => ship.berth))]
  const isWithinSelectedRange = (date: Date) => {
    return date >= startDate && date <= endDate
  }

  const filteredByDate = vessels.filter(ship =>
    (Object.values(ship.events) as Date[]).some(d =>
      isWithinSelectedRange(d)
    )
  )

  const filteredShips =
    selectedBerth === 'All'
      ? filteredByDate
      : filteredByDate.filter(ship => ship.berth === selectedBerth)

  /* 👇 PLACE THIS HERE */
  const allTimestamps: number[] = filteredShips.flatMap(ship => [
    ship.events.ATA.getTime(),
    ship.events.ATB.getTime(),
    ship.events.ATU.getTime(),
    ship.events.ATD.getTime(),
  ])

  /* 👇 THEN THIS */
  const datasets: any[] = []

  for (const ship of filteredShips) {
    const { ATA, ATB, ATU, ATD } = ship.events
    const y = `🛳️ ${ship.shipId} (${ship.berth})`

    if (![ATA, ATB, ATU, ATD].every(d => d instanceof Date && !isNaN(d.getTime()))) continue

    const shipLabel = `🛳️ ${ship.shipId} (${ship.berth})`

    datasets.push(
      {
        label: 'ARRIVAL to BERTHING',
        data: [
          { x: ATA.getTime(), y },
          { x: ATB.getTime(), y },
        ],
        shipLabel,
        borderColor: colorMap.ATA,
        backgroundColor: colorMap.ATA,
        borderWidth: 4,
        pointRadius: 5,
      },
      {
        label: 'BERTHING TO UNBERTHING',
        data: [
          { x: ATB.getTime(), y },
          { x: ATU.getTime(), y },
        ],
        shipLabel,
        borderColor: colorMap.ATB,
        backgroundColor: colorMap.ATB,
        borderWidth: 4,
        pointRadius: 5,
      },
      {
        label: 'UNBERTHING to DEPAR',
        data: [
          { x: ATU.getTime(), y },
          { x: ATD.getTime(), y },
        ],
        shipLabel,
        borderColor: colorMap.ATU,
        backgroundColor: colorMap.ATU,
        borderWidth: 4,
        pointRadius: 5,
      }
    )
  }

  /* 👇 FINALLY limits */
  const padding = 12 * 60 * 60 * 1000

  const chartMinLimit =
    allTimestamps.length > 0
      ? Math.min(...allTimestamps) - padding
      : startDate.getTime()

  const chartMaxLimit =
    allTimestamps.length > 0
      ? Math.max(...allTimestamps) + padding
      : endDate.getTime()


  const defaultCenterDate = new Date()
  defaultCenterDate.setHours(0, 0, 0, 0)
  const defaultStart = defaultCenterDate.getTime()
  const defaultEnd = new Date(defaultStart + 24 * 60 * 60 * 1000).getTime()

  const options = useMemo((): ChartOptions<'line'> => ({
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
        min: startDate.getTime(),
        max: endDate.getTime(),
        title: {
          display: true,
          text: 'Time',
        },
        ticks: {
          source: 'auto',
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          callback: function (value, index, ticks) {
            const current = new Date(value as number);
            const prev = index > 0 ? new Date(ticks[index - 1].value) : null;

            const currentDateKey = `${current.getFullYear()}-${current.getMonth()}-${current.getDate()}`;
            const prevDateKey = prev ? `${prev.getFullYear()}-${prev.getMonth()}-${prev.getDate()}` : null;

            const isNewDay = !prev || currentDateKey !== prevDateKey;

            if (isNewDay) {
              return current.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              });
            }

            return current.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });
          },
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
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          boxHeight: 10,
          font: {
            size: 12,
          },
          padding: 15,
          filter: (legendItem, data) => {
            return data.datasets.findIndex(
              (d) => d.label === legendItem.text
            ) === legendItem.datasetIndex;
          },
        },
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#111827',
        bodyColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        titleFont: { weight: 'bold', size: 16 },
        bodyFont: { size: 13 },
        bodySpacing: 8,
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            const dataset = tooltipItems[0].dataset as any;
            const shipLabel = dataset.shipLabel || tooltipItems[0].label || 'Unknown Ship';
            return shipLabel;
          },
          label: (context) => {
            const label = context.dataset.label || '';
            const rawData = context.dataset.data as unknown;
            if (!Array.isArray(rawData)) return label;
            const data = rawData as { x: number; y: string }[];
            if (data.length < 2) return label;
            const startTime = new Date(data[0].x);
            const endTime = new Date(data[1].x);
            const durationMs = endTime.getTime() - startTime.getTime();
            const hours = Math.floor(durationMs / (1000 * 60 * 60));
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
            const durationStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
            return `${label} duration: ${durationStr}`;
          },
          afterBody: (tooltipItems) => {
            const hoveredTime = new Date(tooltipItems[0].parsed.x);
            const hoveredTimeStr = hoveredTime.toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
              hour12: false,
            });
            return `Time: ${hoveredTimeStr}`;
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
        limits: {
          x: {
            min: chartMinLimit,
            max: chartMaxLimit,
          },
        },
      },
    },
  }), [startDate, endDate, chartMinLimit, chartMaxLimit]);


  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resetZoom()
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ChartJS.register(zoomPlugin)
    }
  }, [])

  const data: ChartData<'line', { x: number; y: string }[]> = { datasets }

  return (
    <div className="w-full h-auto rounded bg-white space-y-6">
      <div className="flex items-center justify-between p-3 px-5 flex-wrap gap-4">
        <div className='flex gap-5'>
          <div className="flex items-center space-x-4">
            <label htmlFor="berth" className="text-sm  text-gray-700">
              Select Berth:
            </label>
            <select
              id="berth"
              value={selectedBerth}
              onChange={e => setSelectedBerth(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white text-gray-900"
            >
              <option value="All">All</option>
              {allBerths.map(berth => (
                <option key={berth} value={berth}>
                  {berth}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-5">
            <label className="text-sm text-gray-700">Start Date:</label>
            <input
              type="date"
              value={startDate.toISOString().split('T')[0]}
              onChange={e => handleDateChange('start', e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm  text-gray-700  appearance-none"
            />
            <label className="text-sm text-gray-700">End Date:</label>
            <input
              type="date"
              value={endDate.toISOString().split('T')[0]}
              onChange={e => handleDateChange('end', e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700  appearance-none"

            />
            <button
              onClick={() => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const tomorrow = new Date(today)
                tomorrow.setDate(today.getDate() + 1)
                setStartDate(today)
                setEndDate(tomorrow)
              }}
              className="px-4 py-1 border border-gray-300 text-black text-sm rounded hover:bg-[#014F86] hover:text-white transition"
            >
              Reset to Today
            </button>

          </div>
        </div>

        <button
          onClick={() => chartRef.current?.resetZoom()}
          className="px-4 py-2 border border-gray-300 text-black rounded hover:bg-[#014F86] hover:text-white transition"
        >
          Reset Zoom
        </button>
      </div>


      {/* Chart with vertical scroll */}
      <div className="w-full shadow " style={{ height: 'calc(100vh - 300px)' }}>
        <div className="w-full p-3 h-full overflow-y-auto overflow-x-hidden pr-2">
          <Chart ref={chartRef} type="line" data={data} options={options} />
        </div>
      </div>

    </div>
  )
}
