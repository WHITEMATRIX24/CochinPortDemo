"use client";

import { serverUrl } from "@/services/serverUrl";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  startDate: string;
  endDate: string;
}

export default function ThroughputTrendChart({ startDate, endDate }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [cargoTypes, setCargoTypes] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [yearOptions, setYearOptions] = useState<string[]>([]);

  // Generate year options up to current year
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const startYear = new Date(startDate).getFullYear();

    // Dropdown: from (previous year of startDate) → current year
    const years: string[] = [];
    for (let y = startYear - 5; y <= currentYear; y++) {
      years.push(String(y));
    }
    setYearOptions(years);

    // Default select = startDate year
     setSelectedYear(String(startYear));
    fetchData([String(startYear - 1), String(startYear)]); 
    
  }, [startDate]);

  const fetchData = async (years: string[]) => {
    try {
      const res = await fetch(
        `${serverUrl}/api/cargo/throughput-trend-cargo?years=${years.join(
          ","
        )}&startDate=${startDate}&endDate=${endDate}`
      );
      const result = await res.json();
      console.log(result);
      
      setData(result);

      // Extract cargo types dynamically
      const cargos = new Set<string>();
      result.forEach((item: any) => {
        Object.keys(item).forEach((key) => {
          if (key !== "month") cargos.add(key);
        });
      });
      setCargoTypes(Array.from(cargos));
    } catch (error) {
      console.error("Error fetching throughput trend:", error);
    }
  };

  const COLORS = [
    "#1E40AF",
    "#3B82F6",
    "#60A5FA",
    "#F97316",
    "#10B981",
    "#D946EF",
  ];

  return (
    <div className="w-full h-96 p-4 bg-white shadow rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">
        Throughput Trend by Cargo Type
      </h2>

      {/* Year Dropdown */}
      {/* <div className="mb-4">
        <label className="mr-2 font-medium">Select Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => {
            const year = e.target.value;
            setSelectedYear(year);
            fetchData([String(Number(year) - 1), year]); // fetch previous + selected
          }}
          className="border rounded px-2 py-1"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
 */}
      {data[0]?.month==="No Data"?<p className='text-black text-center mt-20'>No Data from {startDate} to {endDate}</p>
      :<ResponsiveContainer width="100%" height="80%">
        <LineChart data={data} margin={{ right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
  <XAxis
  dataKey="month"
  tickFormatter={(value) => {
    const date = new Date(value); // works for "2025-01", "2025-01-01", or ISO string
    if (!isNaN(date.getTime())) {
      return date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
    }

    // If it's just a number (1–12), fallback to current selected year
    if (!isNaN(Number(value))) {
      const y = Number(selectedYear);
      return new Date(y, Number(value) - 1).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
    }

    return value;
  }}
/>


<YAxis
  tickFormatter={(value) => {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
    return value;
  }}
/>
          <Tooltip formatter={(value: number) => value.toLocaleString()} />
          <Legend />
          {cargoTypes.map((cargo, index) => (
            <Line
              key={cargo}
              type="monotone"
              dataKey={cargo}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              name={cargo}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>}
    </div>
  );
}
