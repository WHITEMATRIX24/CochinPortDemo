'use client'

import Header from "@/components/header"
import { KPICards } from "@/components/KPIcards"
import BerthOccupancyChart from "@/components/statisticalDashboard/BerthOccupancyChart"
import CargoMixPieChart from "@/components/statisticalDashboard/CargoMixPieChart"
import CommodityCargoBarChart from "@/components/statisticalDashboard/CommodityCodeWiseBarChart"
import ThroughputTrendChart from "@/components/statisticalDashboard/ThroughputTrendChart"
import { FiTrendingUp, FiTrendingDown, FiBox, FiTruck, FiClock, FiActivity, FiDroplet, FiMoreVertical } from "react-icons/fi"
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
    BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import VesselTurnaroundChart from "@/components/vesselPerfromance/VesselTurnAroundChart"
import IdleVsTRTScatterChart from "@/components/vesselPerfromance/IdleVsTRTScatterChart"
import { useEffect, useState } from "react"
import { serverUrl } from "@/services/serverUrl"
import NationalityChart from "@/components/vesselPerfromance/NationalityBarChart"
import AvgOutputPerShipBerthDayChart from "@/components/vesselPerfromance/AvgOutputPerShipBerthDayChart"
import { KPICardsYoY } from "@/components/KPICardsYoY"
import Loading from "@/components/Loadind"

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

  return `${year}-${month}-${day}`;
};
export default function VesselPerformance() {
     const [kpiData, setKpiData] = useState<any>(null)
          const [loading, setLoading] = useState(true)
          //const [startDate, setStartDate] = useState<string>(getSameDayFromPastSixMonth());
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
        fetchData()
      }
    // Fetch KPI data whenever date changes
      useEffect(() => {
        fetchData()
      }, [startDate, endDate]) 
    
  if (loading) return <div className="h-screen flex items-center justify-center"><Loading/></div>
      if (!kpiData) return <p className="p-4 text-red-500">No data available</p>
    
    const cards = [
  /*{
    title: "Total Throughput (MMT)",
    current: kpiData.year1.totalThroughputMMT.toFixed(2),
    variance: (kpiData.variation.totalThroughputMMT ?? 0).toFixed(2) + "%",
    icon: <FiTrendingUp size={30} className="text-[#4e5166]" />,
    borderColor: "#4e5166",
  },
  {
    title: "Dry Cargo (MMT)",
    current: kpiData.year1.dryCargoMMT.toFixed(2),
    variance: (kpiData.variation.dryCargoMMT ?? 0).toFixed(2) + "%",
    icon: <FiBox size={30} className="text-green-700" />,
    borderColor: "green",
  },
  {
    title: "Liquid Cargo (MMT)",
    current: kpiData.year1.liquidCargoMMT.toFixed(2),
    variance: (kpiData.variation.liquidCargoMMT ?? 0).toFixed(2) + "%",
    icon: <FiDroplet size={30} className="text-[#610345]" />,
    borderColor: "#C1292E",
  },
  {
    title: "Containers (TEUs)",
    current: kpiData.year1.containerTEUs,
    variance: (kpiData.variation.containerTEUs ?? 0).toFixed(2) + "%",
    icon: <FiTruck size={30} className="text-[#C1292E]" />,
    borderColor: "#610345",
  }, */
  {
    title: "Mean TRT (Hrs.)",
    current: kpiData.year1.meanTRT.toFixed(2),
    variance: (kpiData.variation.meanTRT ?? 0).toFixed(2) + "%",
    icon: <FiClock size={30} className="text-blue-600" />,
    borderColor: "#0077b6",
  },
  {
    title: "Median TRT (Hrs.)",
    current: kpiData.year1.medianTRT.toFixed(2),
    variance: (kpiData.variation.medianTRT ?? 0).toFixed(2) + "%",
    icon: <FiClock size={30} className="text-indigo-600" />,
    borderColor: "#5A189A",
  },
  {
    title: "Avg. Container TRT (Hrs.)",
    current: kpiData.year1.avgContainerTRT.toFixed(2),
    variance: (kpiData.variation.avgContainerTRT ?? 0).toFixed(2) + "%",
    icon: <FiClock size={30} className="text-purple-600" />,
    borderColor: "purple",
  },  
  {
    title: "Output per Berth Day (MT)",
    current: kpiData.year1.outputPerBerthDay.toFixed(0),
    variance: (kpiData.variation.outputPerBerthDay ?? 0).toFixed(2) + "%",
    icon: <FiActivity size={30} className="text-orange-600" />,
    borderColor: "#ff8800",
  },
  /* {
    title: "Avg. PBD (Hrs.)",
    current: kpiData.year1.avgPBD.toFixed(2),
    variance: (kpiData.variation.avgPBD ?? 0).toFixed(2) + "%",
    icon: <FiClock size={30} className="text-teal-600" />,
    borderColor: "teal",
  }, */
  {
    title: "Idle Time at Berth (%)",
    current: kpiData.year1.idlePercent.toFixed(2) + "%",
    variance: (kpiData.variation.idlePercent ?? 0).toFixed(2) + "%",
    icon: <FiActivity size={30} className="text-rose-600" />,
    borderColor: "crimson",
  }, 
];



    return (

        <div className="@container/main  h-screen flex flex-col overflow-hidden font-sans">
            {/* header and kpi cards */}
            <div className="flex flex-col gap-4 py-4 md:gap-2 md:py-4 stickey">
                <div className="flex">
                  <div className="p-4">
                      <h1 className="text-2xl font-bold text-gray-800 mb-1">
                          Vessel Performance
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
                        Vessel Performance
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                </BreadcrumbList>
              </Breadcrumb>
                  </div>
                     {/* Three-dot button */}
                              <div className="relative ms-auto">
                                <button
                                  className="p-2 rounded hover:bg-gray-200"
                                  onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                  <FiMoreVertical size={24} />
                                </button>
                    
                                {dropdownOpen && (
                                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 me-3 rounded shadow-lg z-50">
                                    <button
                                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    /*                   onClick={() => handleExport("image")}
                     */                >
                                      Export as Image
                                    </button>
                                    <button
                                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    /*                   onClick={() => handleExport("pdf")}
                     */                >
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

                <KPICardsYoY data={cards} />
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
                <div className="grid grid-cols-10 gap-4">
                    {/* Cargo trend takes 70% width */}
                    <div className="col-span-6 pl-4">
                        <VesselTurnaroundChart startDate={startDate} endDate={endDate} />
                    </div>

                    {/* Top commodities takes 30% width */}
                    <div className="col-span-4">
                        <NationalityChart startDate={startDate} endDate={endDate} />
                    </div>
                </div>

                 <div className="grid grid-cols-10 gap-4 m-5 ">

<div className="col-span-6">
                          <AvgOutputPerShipBerthDayChart startDate={startDate} endDate={endDate} />
                 </div>
                    <div className=" col-span-4" >
                     <IdleVsTRTScatterChart startDate={startDate} endDate={endDate} />
                    </div>
                    
                </div>  
            </div>
        </div>

    )
}
