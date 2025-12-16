"use client";

import {
  Card,
} from "@/components/ui/Card";
import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KPI {
  title: string;
  current: number | string;
  variance?: string;
  icon: ReactNode;
  borderColor?: string;
}
interface Props {
  data?: KPI[];
  onCardClick?: (kpi: KPI) => void; // 👈 added
}

export function KPICardsRowYoY({ data, onCardClick }: Props) {
  const [expanded, setExpanded] = useState(true);

  if (!data || data.length === 0) return null;

  const firstRowCount = 5;
  const visibleData = expanded ? data : data.slice(0, firstRowCount);

  return (
    <div className="px-4 lg:px-6 space-y-1">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 py-3 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
        <AnimatePresence>
          {visibleData.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onCardClick?.(kpi)} // 👈 handle click
              className="cursor-pointer"
            >
              <Card className="relative min-w-[200px] max-w-[260px] py-3 h-[110px] bg-white shadow-lg rounded-xl border-l-8 border-transparent overflow-hidden">
                <div className="px-4 pb-2">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">{kpi.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{kpi.current}</p>
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
                <div className="absolute bottom-3 right-3 text-2xl text-gray-300">
                  {kpi.icon}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Toggle Button */}
      {data.length > firstRowCount && (
        <div className="flex justify-end">
          <button
            className="text-sm text-[#014F86]"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}
