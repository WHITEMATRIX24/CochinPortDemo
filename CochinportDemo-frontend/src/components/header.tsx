"use client";

import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";


export default function Header() {
  const pathname = usePathname() ?? "";
  const pathSegments = pathname.split("/").filter(Boolean);

  const mainTitle = pathSegments[0]
    ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1)
    : "Home";
  const lastSegment = pathSegments[pathSegments.length - 1];


  return (
    <header className="flex items-center justify-between px-4 py-2  text-black border-b-2 border-[var(--sidebar)]">
      <div>
        <h1 className="text-[16px] font-bold leading-[1.2] mb-0 mt-[10px] uppercase">
          {decodeURIComponent(mainTitle).replace(/[-_]/g, " ")}
        </h1>
        <Breadcrumb className="h-[18px] ml-[1px] mt-[5px]">
          <BreadcrumbList className="text-[12px] leading-[1.2]">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-grey-500">
                {decodeURIComponent(mainTitle).replace(/[-_]/g, " ")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-[#C1292E]" />
            <BreadcrumbItem>
              <BreadcrumbEllipsis className="text-grey-500" />
            </BreadcrumbItem>
            {lastSegment && (
              <>
                <BreadcrumbSeparator className="text-[#C1292E]" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-grey-500">
                    {decodeURIComponent(lastSegment).replace(/[-_]/g, " ")}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      
    </header>
  );
}
