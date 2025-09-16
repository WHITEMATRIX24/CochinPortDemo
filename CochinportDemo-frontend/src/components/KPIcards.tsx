import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ReactNode } from "react";

interface KPI {
  title: string;
  value: number | string;
  change?: string;
  icon: ReactNode;
  borderColor?: string; // allow custom border color
}

interface Props {
  data?: KPI[];
}

export function KPICards({ data }: Props) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-6">
      {data?.map((kpi, index) => (
        <Card
          key={index}
          className="bg-white border-gray relative shadow-md h-[110px] py-1"
          style={{ borderLeft: `8px solid ${kpi.borderColor ?? "#4e5166"}` }}
        >
          <CardHeader className="flex flex-col gap-0 ">
            <CardTitle className="text-[14px] font-medium tabular-nums text-black">
              {kpi.title}
            </CardTitle>
            <CardDescription className="text-[25px] font-extralight tabular-nums text-black drop-shadow-md">
              {kpi.value}
              {/* {kpi.change !== "0" && kpi.change && (
                <p
                  className={`${
                    kpi.change.indexOf("+") !== -1
                      ? "text-green-800"
                      : kpi.change.indexOf("-") !== -1
                      ? "text-red-800"
                      : ""
                  } text-[14px] text-start font-semibold tabular-nums drop-shadow-md`}
                >
                  {kpi.change}
                </p>
              )} */}
            </CardDescription>
          </CardHeader>
{/*           <div className="absolute top-8 right-3">{kpi.icon}</div>
 */}        </Card>
      ))}
    </div>
  );
}
