"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { serverUrl } from "@/services/serverUrl";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface TrendData {
  month: string;
  teus: number;
}

interface Props {
  startDate: string;
  endDate: string;
}

export default function ContainerTrafficTrendChart({ startDate, endDate }: Props) {
  const [data, setData] = useState<TrendData[]>([]);
  const [nodata, setNoData] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${serverUrl}/api/cargo/container-traffic-trend?startDate=${startDate}&endDate=${endDate}`
      );
      const json = await res.json();
     if (json.noData) {
          setNoData(true);
          setData([]); // clear previous chart data
        } else {
          setNoData(false);
          setData(json.data || []);
        }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Container Traffic (TEUs)",
        data: data.map((d) => d.teus),
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 👈 allow custom height
    layout: {
    padding: {
      bottom: 20, // 👈 extra space for x-axis labels
    },
  },
    plugins: {
      legend: { display: false }, // hide legend
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "TEUs" },
      },
      x: {
        title: { display: true, text: "Month-Year" },
      },
    },
  };

  if (nodata) {
    return (
      <div className="w-full h-[450px] bg-white rounded-2xl p-4 shadow  items-center  ">
        <h2 className="text-lg font-semibold mb-2">Top Commodities Handled</h2>
        <p className="text-black text-center flex items-center justify-center mt-25 ">
          No Data from {startDate} to {endDate}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[320px] bg-white rounded-2xl p-4 shadow">
      <h2 className="text-lg font-semibold mb-3">Container Traffic Trend By Month</h2>
      <Line data={chartData} options={options}  />
    </div>
  );
}
