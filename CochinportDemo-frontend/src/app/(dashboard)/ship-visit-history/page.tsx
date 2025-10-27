"use client";

import React, { useState, useEffect } from "react";
import { FaShip } from "react-icons/fa";
import { MdHistory } from "react-icons/md";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { serverUrl } from "@/services/serverUrl";
import Loading from "@/components/Loadind";

interface ShipVisit {
  vesselId: string;
  name: string;
  berthNumber: string;
  arrivalDate: string;
  departureDate: string;
  cargoType: string;
  country: string;
  foreignCoastal: string;
  grossTonnage: number;
  commodity: string;
}

export default function ShipVisitTracker() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const [visits, setVisits] = useState<ShipVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [cargoType, setCargoType] = useState<string>(""); // ✅ Selected cargo type
  const [cargoTypes, setCargoTypes] = useState<string[]>(["Containerised","Liquid Bulk", "Break Bulk", "Dry Bulk Mechanical"]); // ✅ Available cargo types
  const [selectedVesselId, setSelectedVesselId] = useState<string>("");
  const [year, setYear] = useState<number | "">("");
  const [startDate, setStartDate] = useState<string>(
    new Date(currentYear, currentMonth, 1).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date(currentYear, currentMonth + 1, 0).toISOString().split("T")[0]
  );

  // Pagination state (from backend)
  const [pagination, setPagination] = useState({
    totalDocs: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const fetchVisits = async (page = 1, limit = rowsPerPage) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedVesselId) params.append("vesselId", selectedVesselId);
      if (year) params.append("year", String(year));
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if(cargoType) params.append("cargoType", cargoType);

      // Add pagination params
      params.append("page", String(page));
      if (limit !== -1) params.append("limit", String(limit));

      const res = await fetch(
        `${serverUrl}/api/vessel/ship-visits?${params.toString()}`
      );
      const json = await res.json();

      setVisits(Array.isArray(json.data) ? json.data : []);
      setPagination(json.pagination);
       // ✅ Collect unique cargo types dynamically from API response
      /* if (Array.isArray(json.data)) {
      const uniqueCargoTypes = Array.from(
      new Set((json.data as ShipVisit[]).map((v) => v.cargoType))
  );
  setCargoTypes(uniqueCargoTypes);
} */
    } catch (err) {
      console.error("Failed to fetch ship visits:", err);
      setVisits([]);
      setPagination({ totalDocs: 0, page: 1, limit, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters or rowsPerPage change
  useEffect(() => {
    fetchVisits(1, rowsPerPage); // reset to first page
  }, [selectedVesselId, year, startDate, endDate, rowsPerPage, cargoType]);

  
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="px-4 pb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Ship Visit Tracker
        </h1>
        <Breadcrumb className="h-[18px] ml-[1px] mt-[5px]">
          <BreadcrumbList className="text-[12px] leading-[1.2]">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-grey-500">
                Ship Management
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-[#C1292E]" />
            <BreadcrumbItem>
              <BreadcrumbEllipsis className="text-grey-500" />
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-[#C1292E]" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-grey-500">
                Ship Visit Tracker
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg h-[82vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <FaShip className="text-[#003049] text-3xl" />
          <h2 className="text-2xl font-bold text-[#003049]">
            Ship Visit History
          </h2>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-7">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Vessel ID
            </label>
            <input
              type="text"
              value={selectedVesselId}
              onChange={(e) => setSelectedVesselId(e.target.value)}
              className="w-full border border-gray-300 text-black rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. 5004ANHSIRK-LS"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) =>
                setYear(e.target.value === "" ? "" : parseInt(e.target.value))
              }
              className="w-full border border-gray-300 text-black rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. 2025"
            />
          </div>
           {/* ✅ Cargo Type Filter (Dropdown) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Cargo Type
            </label>
            <select
              value={cargoType}
              onChange={(e) => setCargoType(e.target.value)}
              className="w-full border border-gray-300 text-gray-600 rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 h-[40px]"
            >
              <option value="">All</option>
              {cargoTypes.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 text-black rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 text-black rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Visit Summary & Table */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-inner overflow-y-auto">
          <div className="flex items-center gap-2 text-blue-800 mb-4">
            <MdHistory className="text-xl" />
            {loading ? (<Loading/>
            ) : pagination?.totalDocs > 0 ? (
              <h3 className="text-lg font-semibold">
                Showing {pagination.totalDocs} visit(s){" "}
                {year
                  ? `in ${year}`
                  : `between ${startDate} and ${endDate}`}
              </h3>
            ) : (
              <h3 className="text-lg font-semibold text-red-600">
                No visits found for selected filters
              </h3>
            )}
          </div>

          {!loading && visits.length > 0 && (
            <>
              <div className="overflow-x-auto overflow-y-auto">
                <table className="min-w-full text-sm border border-gray-300 bg-white rounded-md text-black">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="px-4 py-2">Berth</th>
                      <th className="px-4 py-2">Vessel Id</th>
                      <th className="px-4 py-2">Arrival</th>
                      <th className="px-4 py-2">Departure</th>
                      <th className="px-4 py-2">Cargo Type</th>
                      <th className="px-4 py-2">Commodity</th>
                      <th className="px-4 py-2">Country</th>
                      <th className="px-4 py-2">Tonnage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.map((v, i) => (
                      <tr
                        key={i}
                        className="border-t border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-2">{v.berthNumber}</td>
                        <td className="px-4 py-2">{v.vesselId}</td>
                        <td className="px-4 py-2">
                          {new Date(v.arrivalDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          {new Date(v.departureDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">{v.cargoType}</td>
                        <td className="px-4 py-2">{v.commodity}</td>
                        <td className="px-4 py-2">
                          {v.country}{" "}
                          <span className="ml-1">{v.foreignCoastal}</span>
                        </td>
                        <td className="px-4 py-2">
                          {v.grossTonnage.toLocaleString()} T
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">
                    Rows per page:
                  </label>
                  <select
                    value={rowsPerPage}
                    onChange={(e) =>
                      setRowsPerPage(
                        e.target.value === "all" ? -1 : parseInt(e.target.value)
                      )
                    }
                    className="border rounded-md px-2 py-1 text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value="all">All</option>
                  </select>
                </div>

                {rowsPerPage !== -1 && (
                  <div className="flex items-center gap-2">
                    <button
                      disabled={pagination.page === 1}
                      onClick={() =>
                        fetchVisits(pagination.page - 1, rowsPerPage)
                      }
                      className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() =>
                        fetchVisits(pagination.page + 1, rowsPerPage)
                      }
                      className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
