"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface NavSubItem {
  title: string;
  url: string;
  disabled?: boolean;
}

interface NavItem {
  title: string;
  url: string;
  icon?: any;
  items?: NavSubItem[];
}

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <div key={item.title}>
          <Link
            href={item.url}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            )}
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            <span>{item.title}</span>
          </Link>

          {item.items && (
            <div className="ml-6 mt-1 flex flex-col gap-1">
              {item.items.map((sub) => (
                <Link
                  key={sub.title}
                  href={sub.url}
                  className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <ChevronRight className="h-3 w-3" />
                  {sub.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
