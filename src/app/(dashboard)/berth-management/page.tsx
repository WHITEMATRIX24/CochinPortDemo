// app/ship-movement-summary/page.tsx

import BerthAvailability from "@/components/BerthAvilabilityDetails";
import { berthData } from '@/data/MockDashboardData';
export default function BerthManagementPage() {
  return (
    <>
      {/* <h2 className="text-2xl font-bold mb-4">Berth Avilability Details</h2> */}
      <BerthAvailability data={berthData} />
    </>
  )
}
