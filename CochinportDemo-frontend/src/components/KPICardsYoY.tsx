import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
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
      {data?.map((kpi, index) => (
        <Card
          key={index}
          className="relative flex-1 min-w-[220px] h-[123px] bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden group"
        >
          {/* Gradient stripe */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#014F86] via-[#006494] to-[#003049]" />

          {/* KPI Content */}
          <div className="px-4 flex flex-col justify-between h-full">
            {/* Title with tooltip */}
            <h4
              className="text-sm font-semibold text-[#003049] mb-1 truncate "
              title={kpi.fullTitle || kpi.title}  // tooltip on hover
            >
              {kpi.title}
            </h4>

            <p className="text-2xl font-bold text-gray-900 leading-tight ">
              {kpi.current}
            </p>

            {kpi.variance && (
              <span
                className={`text-sm font-semibold ${kpi.variance.startsWith("+") ? "text-green-600" : "text-red-600"
                  }`}
              >
                {kpi.variance}
              </span>
            )}
            {/* Icon */}

          </div>
          <div className="absolute bottom-3 right-3 text-sm text-gray-300 group-hover:text-[#006494] transition-colors duration-300">
            {kpi.icon}
          </div>

        </Card>

      ))}
    </div>


  );
}
