import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface KPI {
  title: string;
  current: number | string;
  variance?: string;
  icon: ReactNode;
  borderColor?: string; // allow custom border color
  fullTitle?: string; // add this
  shortTitle?: string;
}

interface Props {
  data?: KPI[];
}

export function KPICardsYoY({ data }: Props) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5 mt-2">
        <AnimatePresence>
          {data.map((kpi, index) => (
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
            >
              <Card
                className="relative min-w-[200px] max-w-[240px] py-3 h-[110px] bg-white shadow-lg rounded-xl border-l-8 border-transparent overflow-hidden"
              >
                {/* Gradient stripe */}
  {/*                 <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#014F86] via-[#006494] to-[#003049]" />
 */}
                {/* KPI Content */}
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

                {/* Icon */}
                <div className="absolute bottom-3 right-3 text-2xl text-gray-300">
                  {kpi.icon}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      
    </div>


  );
}
