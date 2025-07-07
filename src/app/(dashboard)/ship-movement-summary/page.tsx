// app/ship-movement-summary/page.tsx
import ShipTimelineChart from '@/components/ShipTimeLineChart'

export default function ShipMovementSummaryPage() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Ship Movement Summary</h2>
      <ShipTimelineChart />
    </>
  )
}
