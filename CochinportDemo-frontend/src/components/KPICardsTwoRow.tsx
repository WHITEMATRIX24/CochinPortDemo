"use client";

import {
  Card,
} from "@/components/ui/Card";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button"; // assuming shadcn button

interface KPI {
  title: string;
  current: number | string;
  variance?: string;
  icon: ReactNode;
  borderColor?: string;
}

interface Props {
  data?: KPI[];
}

export function KPICardsRowYoY({ data }: Props) {
  const [expanded, setExpanded] = useState(true);

  if (!data || data.length === 0) return null;

  // Show only first row (e.g., 5 cards) when collapsed
  const firstRowCount = 5;
  const visibleData = expanded ? data : data.slice(0, firstRowCount);

  return (
    <div className="px-4 lg:px-6 mt-2 space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 py-3 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
        {visibleData.map((kpi, index) => (
          <Card
            key={index}
            className="relative min-w-[200px] max-w-[240px] py-3 h-[110px] bg-white shadow-lg rounded-xl border-l-8 border-transparent overflow-hidden"
          >
            {/* Gradient stripe */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#014F86] via-[#006494] to-[#003049]" />

            {/* KPI Content */}
            <div className="px-4 pb-2">
              <h3 className="text-sm font-medium text-gray-600 mb-2">{kpi.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{kpi.current}</p>
              {kpi.variance && (
                <span
                  className={`text-sm font-semibold ${
                    kpi.variance.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {kpi.variance}
                </span>
              )}
            </div>

            {/* Icon */}
            <div className="absolute bottom-3 right-3 text-3xl text-gray-300">
              {kpi.icon}
            </div>
          </Card>
        ))}
      </div>

      {/* Toggle Button */}
      {data.length > firstRowCount && (
        <div className="flex justify-end">
          <button
        className="text-sm text-[#014F86] "
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}
