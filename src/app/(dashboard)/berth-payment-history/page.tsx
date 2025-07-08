'use client'

import PaymentHistoryTable from "@/components/PaymentHistoryTable"


export default function ShipMovementSummaryPage() {
  return (
    <div className='h-screen bg-gray-100 p-5'>
      <main  className="flex flex-col h-full">
         <div className="flex-shrink-0 p-4">
          {/* Heading */}
          <div className="mb-6">
            <h5 className="text-2xl font-bold text-[#003049]">
             Payment History
            </h5>
          </div>
          <div className="text-sm text-gray-500">
              <span>Payment Mangement</span> <span className="mx-2">/</span> <span className="text-blue-600">Payment History</span>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
    <PaymentHistoryTable/>
               </div>
      </main>
    </div>
  )
}
