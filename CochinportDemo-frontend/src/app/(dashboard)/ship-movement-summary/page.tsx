'use client'

/* import ShipTimelineChart from '@/components/ShipTimeLineChart'
 */

import dynamic from 'next/dynamic'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";

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
          <div className="flex">
            <div className="p-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Ship Movement Summary
              </h1>
              <Breadcrumb className="h-[18px] ml-[1px] mt-[5px]">
                <BreadcrumbList className="text-[12px] leading-[1.2]">
                  <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/statistical-dashboard"
                    className="text-blue-600 hover:text-blue-800 focus:text-blue-800 active:text-blue-800 visited:text-blue-600"
                  >
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-[#C1292E]" />
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis className="text-blue-600" />
                  </BreadcrumbItem>
                  <>
                    <BreadcrumbSeparator className="text-[#C1292E]" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-blue-600">
                        Ship Movement Summary
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
               
        </div>
        </div>
        <div className="flex-1 overflow-y-auto">
                          <SwimlaneChart />

               </div>
      </main>
    </div>
  )
}
