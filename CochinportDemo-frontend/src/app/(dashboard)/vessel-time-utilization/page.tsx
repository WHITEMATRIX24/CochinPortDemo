"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import { KPICards } from "@/components/KPIcards"
import BerthOccupancyChart from "@/components/statisticalDashboard/BerthOccupancyChart"
import CargoMixPieChart from "@/components/statisticalDashboard/CargoMixPieChart"
import CommodityCargoBarChart from "@/components/statisticalDashboard/CommodityCodeWiseBarChart"
import ThroughputTrendChart from "@/components/statisticalDashboard/ThroughputTrendChart"
import { FiTrendingUp, FiBox, FiTruck, FiClock, FiActivity, FiDroplet, FiMoreVertical,FiImage,FiFileText} from "react-icons/fi"

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { serverUrl } from "@/services/serverUrl"

import { KPICardsRowYoY } from "@/components/KPICardsTwoRow"
import Loading from "../../../components/Loadind"
import TimeUtilizationBreakdownChart from "@/components/vesselTimeUtilization/TimeUtilizationBreakdownChart"
import ProductiveVsNonProductiveChart from "@/components/vesselTimeUtilization/notusing/ProductiveVsNonProductiveChart"
import AvgWaitingBeforeBerthChart from "@/components/vesselTimeUtilization/AvgWaitingBeforeBerthChart"
import IdleVsCargoChart from "@/components/vesselTimeUtilization/notusing/IdleVsCargoChart"
import PortVsNonPortTimeChart from "@/components/vesselTimeUtilization/PortVsNonPortTimeChart"
import BerthCongestionHeatmap from "@/components/vesselTimeUtilization/notusing/BerthCongestionHeatmap"

const getSameDayFromPastSixMonth = () => {
  const today = new Date();
  const lastMonth = new Date(today);

  lastMonth.setMonth(today.getMonth() - 6);

  if (
    lastMonth.getMonth() === today.getMonth() - 6 + (12 % 12) &&
    lastMonth.getDate() !== today.getDate()
  ) {
    lastMonth.setDate(0);
  }
  const year = lastMonth.getFullYear();
  const month = String(lastMonth.getMonth() + 1).padStart(2, "0");
  const day = String(lastMonth.getDate()).padStart(2, "0");

  console.log(year, month, day);
  
  return `${year}-${month}-${day}`;
};

export default function YearOnYear() {
  const [kpiData, setKpiData] = useState<any>(null)
   const [selectedKPI, setSelectedKPI] = useState<any>(null);
   const [commodityCodes, setCommodityCodes] = useState<any[]>([]);
  const [loadingCommodity, setLoadingCommodity] = useState(false);
  const [loading, setLoading] = useState(true)
/*   const [startDate, setStartDate] = useState<string>(getSameDayFromPastSixMonth());
 */ 
    const [startDate, setStartDate] = useState<string>("2025-04-01");
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [dropdownOpen, setDropdownOpen] = useState(false);


      const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          `${serverUrl}/api/y-o-y/kpi?startDate=${startDate}&endDate=${endDate}`
        )
        const data = await res.json()
        console.log(data);
        
        setKpiData(data)
      } catch (error) {
        console.error("Error fetching KPI data:", error)
      } finally {
        setLoading(false)
      }
    }

  const handleSeacrh = ()=>{
    fetchData() 
  }
  const handleClearFilter=()=>{
    setStartDate(getSameDayFromPastSixMonth())
    setEndDate(new Date().toISOString().split("T")[0])
  }
  
  // Fetch KPI data whenever date changes
  useEffect(() => {

    fetchData()
  }, []) 

  if (loading) return <div className="h-screen flex items-center justify-center"><Loading/></div>
  if (!kpiData) return <p className="p-4 text-red-500">No data available</p>
const cards = [
  {
    title: "Avg IM Time",
    current: kpiData.year1.avgIMTime.toFixed(2),
    variance: (kpiData.variation.avgIMTime ?? 0).toFixed(2) + "%",
    icon: <FiTrendingUp size={30} className="text-[#4e5166]" />,
    borderColor: "#4e5166",
  },
  {
    title: "Avg OM Time",
    current: kpiData.year1.avgOMTime.toFixed(2),
    variance: (kpiData.variation.avgOMTime ?? 0).toFixed(2) + "%",
    icon: <FiBox size={30} className="text-green-700" />,
    borderColor: "green",
  },
  
  {
    title: "Avg. Pilotage Time",
    current: kpiData.year1.avgPilotageTime.toFixed(2),
    variance: (kpiData.variation.avgPilotageTime ?? 0).toFixed(2) + "%",
    icon: <FiClock size={30} className="text-blue-600" />,
    borderColor: "#0077b6",
  },
  {
    title: "Avg Working Time",
    current: kpiData.year1.avgWorkingTime.toFixed(2),
    variance: (kpiData.variation.avgWorkingTime ?? 0).toFixed(2) + "%",
    icon: <FiActivity size={30} className="text-orange-600" />,
    borderColor: "#ff8800",
  },
  {
    title: "Avg Shifting Time(Hrs)",
    current: kpiData.year1.avgShiftingTime.toFixed(2),
    variance: (kpiData.variation.avgShiftingTime ?? 0).toFixed(2) + "%",
    icon: <FiActivity size={30} className="text-orange-600" />,
    borderColor: "#ff8800",
  },
  
];


  return (
    <div className="@container/main h-screen flex flex-col overflow-hidden font-sans">
      {/* header and kpi cards */}
      <div className="flex flex-col gap-4 py-4 md:gap-2 md:py-4 stickey">
        <div className="flex">
            <div className="p-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Vessel Time Utilization 
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
                        Vessel Time Utilization 
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
               {/* Three-dot button */}
                        <div className="relative ms-auto">
                                    {/* Toggle Button */}
                                    <button
                                      className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                      onClick={() => setDropdownOpen(!dropdownOpen)}
                                    >
                                      <FiMoreVertical size={22} className="text-gray-600" />
                                    </button>
                        
                                    {/* Dropdown */}
                                    {dropdownOpen && (
                                      <div
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 me-3 z-50 animate-fadeIn"
                                      >
                                        <button
                                          className="flex items-center gap-2 w-full px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200 rounded-t-xl"
                                        /* onClick={() => handleExport("image")} */
                                        >
                                          <FiImage size={18} />
                                          Export as Image
                                        </button>
                                        <button
                                          className="flex items-center gap-2 w-full px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200 rounded-b-xl"
                                        /* onClick={() => handleExport("pdf")} */
                                        >
                                          <FiFileText size={18} />
                                          Export as PDF
                                        </button>
                                      </div>
                                    )}
                                  </div>
        </div>

        {/* Date filters */}
         <div className="flex flex-wrap gap-4 items-center ms-auto bg-white p-3 rounded-xl ">
          {/* From Date */}
          <div className="flex gap-2 items-center">
            <label className="text-[#003049] font-semibold">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-50 rounded-lg h-9 px-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#003049] transition"
            />
          </div>

          {/* To Date */}
          <div className="flex gap-2 items-center">
            <label className="text-[#003049] font-semibold">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-50 rounded-lg h-9 px-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#003049] transition"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 ms-auto">
            <button
              onClick={handleSeacrh}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[#003049] text-white hover:bg-[#01497c] active:scale-95 transition"
            >
              Search
            </button>
            <button
              onClick={handleClearFilter}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-[#003049] hover:bg-[#669bbc] hover:text-white active:scale-95 transition"
            >
              Clear
            </button>
          </div>
        </div>

<KPICardsRowYoY data={cards}  />
      </div>

      {/* charts */}
      <div className="flex-1 overflow-y-auto px-5 ">
        <div className="grid grid-cols-10 gap-4 mx-3">
          <div className="pl-4 col-span-10 ">
                        <TimeUtilizationBreakdownChart startDate={startDate} endDate={endDate}  />
          </div>
          
        </div>
        <div className="grid grid-cols-2 gap-4 m-3 py-5">
          <div className="pl-4">
                        <AvgWaitingBeforeBerthChart  startDate={startDate} endDate={endDate}  />

          </div>
          <div className="">
            <PortVsNonPortTimeChart startDate={startDate} endDate={endDate} />
          </div> 
        </div>
      </div>
    </div>
  )
}
