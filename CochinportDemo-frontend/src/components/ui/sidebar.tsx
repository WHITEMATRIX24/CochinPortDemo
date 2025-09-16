"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { collapsible?: "icon" | "full" }
>(({ className, collapsible = "full", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-screen flex-col border-r bg-background text-foreground",
        collapsible === "icon" ? "w-[250px]" : "w-[260px]",
        className
      )}
      {...props}
    />
  );
});
Sidebar.displayName = "Sidebar";

export function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center px-4 py-3 border-b", className)}
      {...props}
    />
  );
}

export function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto px-2 py-4", className)}
      {...props}
    />
  );
}

export function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-4 py-3 border-t", className)}
      {...props}
    />
  );
}

export function SidebarRail({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("absolute right-0 top-0 h-full w-[2px] bg-border", className)} {...props} />
  );
}
