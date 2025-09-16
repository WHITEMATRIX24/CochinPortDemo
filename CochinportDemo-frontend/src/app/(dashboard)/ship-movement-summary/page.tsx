'use client'

/* import ShipTimelineChart from '@/components/ShipTimeLineChart'
 */

import dynamic from 'next/dynamic'

// 👇 Dynamically import SwimlaneChart, disable SSR
const SwimlaneChart = dynamic(() => import('@/components/SwimlaneChart'), {
  ssr: false,
})

export default function ShipMovementSummaryPage() {
  return (
    <div className='h-screen bg-gray-100 p-5'>
      <main  className="flex flex-col h-full">
         <div className="flex-shrink-0 p-4">
          {/* Heading */}
          <div className="mb-6">
            <h5 className="text-2xl font-bold text-[#003049]">
             Ship Movement Summary
            </h5>
          </div>
          <div className="text-sm text-gray-500">
              <span>Dashboard</span> <span className="mx-2">/</span> <span className="text-blue-600">Ship Movement Summary</span>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
                          <SwimlaneChart />

               </div>
      </main>
    </div>
  )
}
