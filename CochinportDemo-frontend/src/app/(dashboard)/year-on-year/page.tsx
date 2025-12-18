"use client"

import { useEffect, useState } from "react"
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
import ThroughputChart from "@/components/yoycomparison/throughputChart"
import VesselTurnaroundChartYoy from "@/components/yoycomparison/VesselTurnaroundChartYoy"
import IdleTimeAtBerthChartYoy from "@/components/yoycomparison/IdleTimeAtBerthYoy"
import AvgOutputPerShipBerthDayChartYoY from "@/components/yoycomparison/AvgOutputPerShipDayYoy"
import PBDChart from "@/components/yoycomparison/PBDChart"
import { KPICardsRowYoY } from "@/components/KPICardsTwoRow"
import BerthOccupancyChartYoy from "@/components/yoycomparison/BerhOccupancyChartYoy"
import Loading from "../../../components/Loadind"
import { Modal } from "@/components/yoycomparison/CommdityTypeModal"
import OperationalTimeCompositionTwoCharts from "@/components/yoycomparison/OperationalTimeCompositionChart"

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
  const handleCardClick = async (kpi: any) => {
  if (kpi.title === "Liquid Cargo (MMT)" || kpi.title === "Containers (TEUs)") {
    setSelectedKPI(kpi);
    setLoadingCommodity(true);

    try {
      // Fetch commodity codes dynamically using start and end date
      const res = await fetch(
        `${serverUrl}/api/y-o-y/commodity-codes?kpi=${encodeURIComponent(
          kpi.title
        )}&startDate=${startDate}&endDate=${endDate}`
      );
      const data = await res.json();
      setCommodityCodes(data);
    } catch (err) {
      console.error("Error fetching commodity codes:", err);
      setCommodityCodes([]);
    } finally {
      setLoadingCommodity(false);
    }
  }
};

  // Fetch KPI data whenever date changes
  useEffect(() => {

    fetchData()
  }, []) 

  if (loading) return <div className="h-screen flex items-center justify-center"><Loading/></div>
  if (!kpiData) return <p className="p-4 text-red-500">No data available</p>
const cards = [
  
  {
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
  },
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
    title: "Avg. Vessel TRT (Container) (Hrs.)",
    current: kpiData.year1.avgContainerTRT.toFixed(2),
    variance: (kpiData.variation.avgContainerTRT ?? 0).toFixed(2) + "%",
    icon: <FiTruck size={30} className="text-purple-600" />,
    borderColor: "purple",
  },
   {
    title: "Output per Berth Day (MT)",
    current: kpiData.year1.outputPerBerthDay.toFixed(0),
    variance: (kpiData.variation.outputPerBerthDay ?? 0).toFixed(2) + "%",
    icon: <FiActivity size={30} className="text-orange-600" />,
    borderColor: "#ff8800",
  }, 
  {
    title: "Avg. PBD (Hrs.)",
    current: kpiData.year1.avgPBD.toFixed(2),
    variance: (kpiData.variation.avgPBD ?? 0).toFixed(2) + "%",
    icon: <FiClock size={30} className="text-teal-600" />,
    borderColor: "teal",
  },
  {
    title: "Idle Time at Berth (%)",
    current: kpiData.year1.idlePercent.toFixed(2) + "%",
    variance: (kpiData.variation.idlePercent ?? 0).toFixed(2) + "%",
    icon: <FiActivity size={30} className="text-rose-600" />,
    borderColor: "crimson",
  },
];

 // Example commodity data
  /* const commodityCodes = {
    "Liquid Cargo (MMT)": [
      { code: "1001", name: "Crude Oil" },
      { code: "1002", name: "Petroleum Products" },
      { code: "1003", name: "Chemicals" },
    ],
    "Containers (TEUs)": [
      { code: "2001", name: "Electronics" },
      { code: "2002", name: "Textiles" },
      { code: "2003", name: "Machinery" },
    ],
  }; */


  return (
    <div className="@container/main h-screen flex flex-col overflow-hidden font-sans">
      {/* header and kpi cards */}
      <div className="flex flex-col gap-4 py-4 md:gap-2 md:py-4 stickey">
        <div className="flex">
            <div className="p-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Year-on-Year Comparison
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
                        Year-on-Year Comparison
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

      </div>

      {/* charts */}
      <div className="flex-1 overflow-y-auto px-5 ">
<KPICardsRowYoY data={cards} onCardClick={handleCardClick} />

        <div className="grid grid-cols-10 gap-4 mx-3">
          <div className="pl-4 col-span-5 ">
                        <ThroughputChart startDate={startDate} endDate={endDate}  />
          </div>
          <div className="col-span-5">
            <AvgOutputPerShipBerthDayChartYoY startDate={startDate} endDate={endDate} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 m-3 py-5">
          <div className="pl-4">
                        <VesselTurnaroundChartYoy  startDate={startDate} endDate={endDate}  />

          </div>
          <div className="">
            <IdleTimeAtBerthChartYoy  startDate={startDate} endDate={endDate} />
          </div>
        </div>
         <div className="grid grid-cols-10 gap-4 m-3">
          <div className="pl-4 col-span-5 ">
                        <PBDChart startDate={startDate} endDate={endDate}  />
          </div>
          <div className="col-span-5">
             <BerthOccupancyChartYoy startDate={startDate} endDate={endDate} />
          </div>
        </div>
        <div className="grid grid-cols-10 g m-3">
          <div className="pl-4 col-span-10 ">
                        <OperationalTimeCompositionTwoCharts startDate={startDate} endDate={endDate}  />
          </div>
          
        </div>
      </div>
       {/* Modal for commodity codes */}
       <Modal
  isOpen={!!selectedKPI}
  onClose={() => {
    setSelectedKPI(null);
    setCommodityCodes([]);
  }}
  title={`Commodity Codes - ${selectedKPI?.title}`}
>
  {loadingCommodity ? (
    <p className="text-center py-6">Loading...</p>
  ) : commodityCodes.length === 0 ? (
    <p className="text-center py-6 text-gray-500">No data available</p>
  ) : (
    <div className="overflow-x-auto max-h-[400px] px-5 ">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-blue-300 text-md sticky top-0">
            <th className="text-left px-4 py-2 border-b border-gray-300">Commodity</th>
            <th className="text-left px-4 py-2 border-b border-gray-300">
              {selectedKPI?.title.includes("Liquid") ? "MMT" : "TEU"}
            </th>
          </tr>
        </thead>
        <tbody>
          {commodityCodes.map((c: any) => (
            <tr key={c.code} className="hover:bg-gray-50">
              <td className="px-4  text-sm py-2 border-b border-gray-300">{c.code}</td>
              {selectedKPI?.title.includes("Liquid")?
              <td className="px-4 py-2 border-b border-gray-300">{(c.value/1000000).toFixed(2)}</td>:
              <td className="px-4 py-2 border-b border-gray-300">{(c.value)}</td>
              }
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-200 font-semibold">
            <td className="px-4 py-2 border-t">Total</td>
            {selectedKPI?.title.includes("Liquid")?<td className="px-4 py-2 border-t">
              {((commodityCodes.reduce((sum, c) => sum + c.value, 0))/1000000).toFixed(2)}
            </td>:
            <td className="px-4 py-2 border-t">
              {((commodityCodes.reduce((sum, c) => sum + c.value, 0)))}
            </td>}
          </tr>
        </tfoot>
      </table>
    </div>
  )}
</Modal> 


{/* <CommodityModal
  isOpen={!!selectedKPI}
  onClose={() => {
    setSelectedKPI(null);
    setCommodityCodes([]);
  }}
  title={`Commodity Codes - ${selectedKPI?.title}`}
  data={commodityCodes}
  unit={selectedKPI?.title.includes("Liquid") ? "MMT" : "TEU"}
/> */}




    </div>
  )
}
