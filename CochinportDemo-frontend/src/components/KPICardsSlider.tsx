"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";

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

export function KPICardsSliderYoY({ data }: Props) {
  if (!data) return null;

  return (
    <div className="relative w-full px-8 lg:px-12 mt-2">
      {/* Custom Prev Button */}
      <button
        className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 
          bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition"
      >
        <ChevronLeft className="w-5 h-5 text-gray-800" />
      </button>

      {/* Custom Next Button */}
      <button
        className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 
          bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition"
      >
        <ChevronRight className="w-5 h-5 text-gray-800" />
      </button>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={16}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
          1440: { slidesPerView: 4.2 },
        }}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="pb-6"
      >
        {data?.map((kpi, index) => (
          <SwiperSlide key={index} className="!h-auto">
             <Card
              className="bg-white border-gray relative shadow-md h-[120px] py-1"
              style={{ borderLeft: `8px solid ${kpi.borderColor ?? "#4e5166"}` }}
            >
              <CardHeader className="flex flex-col gap-0">
                <CardTitle className="text-[14px] font-medium tabular-nums text-black font-heading h-[40px]">
                  {kpi.title}
                </CardTitle>
                <CardDescription className="text-[25px] font-extralight tabular-nums text-black drop-shadow-md">
                  {kpi.current}
                  {kpi.variance !== "0" && kpi.variance && (
                    <p
                      className={`${
                        kpi.variance.indexOf("+") !== -1
                          ? "text-green-800"
                          : kpi.variance.indexOf("-") !== -1
                          ? "text-red-800"
                          : ""
                      } text-[14px] text-start font-semibold tabular-nums drop-shadow-md`}
                    >
                      {kpi.variance}
                    </p>
                  )}
                </CardDescription>
              </CardHeader>
              <div className="absolute top-8 right-3">{kpi.icon}</div>
            </Card> 
       {/*      <Card className="relative w-[200px] h-[120px] bg-white/30 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl overflow-hidden p-4">
  <div className="flex justify-between items-start">
    <div>
      <h3 className="text-sm font-semibold text-gray-700">{kpi.title}</h3>
      <p className="text-3xl font-bold text-gray-900">{kpi.current}</p>
      {kpi.variance && (
        <span
          className={`text-sm font-semibold ${
            kpi.variance.startsWith("+") ? "text-green-600" : "text-red-600"
          }`}
        >
          {kpi.variance}
        </span>
      )}
    </div>
    <div className="text-4xl opacity-30">{kpi.icon}</div>
  </div>
</Card> */}

          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
