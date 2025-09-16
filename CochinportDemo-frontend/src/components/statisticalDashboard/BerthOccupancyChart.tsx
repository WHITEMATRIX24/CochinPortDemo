"use client";

import { serverUrl } from "@/services/serverUrl";
import { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

interface Props {
  startDate:string;
  endDate:string;
}
export default function BerthOccupancyChart({startDate, endDate}:Props) {
  const [occupancy, setOccupancy] = useState<number>(0);
  const [berths, setBerths] = useState<string[]>([]);
  const [selectedBerth, setSelectedBerth] = useState<string>("All");

  // Fetch distinct berths
  useEffect(() => {
    const fetchBerths = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/berthData/berths`);
        const data: string[] = await res.json();
        setBerths(data);
      } catch (error) {
        console.error("Error fetching berths:", error);
      }
    };
    fetchBerths();
  }, []);

  // Fetch occupancy whenever selectedBerth changes
  useEffect(() => {
    const fetchOccupancy = async () => {
      try {
        const queryParams = new URLSearchParams({
          startDate:startDate,
          endDate: endDate,
          totalBerths: selectedBerth === "All" ? berths.length.toString() : "1",
        });

        if (selectedBerth !== "All") {
          queryParams.append("berth", selectedBerth);
        }

        const res = await fetch(`${serverUrl}/api/berthData/berth-occupancy?${queryParams}`);
        const data = await res.json();
        setOccupancy(data.occupancy || 0);
      } catch (error) {
        console.error("Error fetching berth occupancy:", error);
      }
    };

    if (berths.length > 0) {
      fetchOccupancy();
    }
  }, [selectedBerth, berths]);

  const chartData = [
    { name: "Occupancy", value: occupancy, fill: "#3B82F6" },
  ];

  return (
    <div className="w-full h-96 p-4 bg-white shadow rounded-2xl flex flex-col items-center ">
      <h2 className="text-xl font-semibold mb-4">Berth Occupancy</h2>

      <div className="ms-auto">
        {/* Dynamic Berth Dropdown */}
        <select
          value={selectedBerth}
          onChange={(e) => setSelectedBerth(e.target.value)}
          className="mb-4 border border-gray-300 rounded px-3 py-2"
        >
          <option value="All">All Berths</option>
          {berths.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {occupancy===0?
      <p className='text-black text-center '>No Data from {startDate} to {endDate}</p>:
      <>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            barSize={20}
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar dataKey="value" cornerRadius={10} background />
          </RadialBarChart>
        </ResponsiveContainer>
  
        <p className="text-lg font-bold mt-2">{occupancy.toFixed(1)}%</p>
      </>}
    </div>
  );
}
