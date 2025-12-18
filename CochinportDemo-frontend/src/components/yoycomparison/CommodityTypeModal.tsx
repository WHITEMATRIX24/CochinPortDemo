"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


interface CommodityData {
  commodity: string;
  MMT: number;
}

interface CommodityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  data: CommodityData[];
  unit: "MMT" | "TEU";
}


const COLORS = ["#4f46e5", "#16a34a", "#dc2626", "#eab308", "#06b6d4", "#9333ea", "#f97316", "#475569"];

export default function CommodityModal({ isOpen, onClose, title, data, unit }: CommodityModalProps) {
  const [view, setView] = useState<"bar" | "pie" | "table">("bar");

  const totalMMT = data.reduce((sum, d) => sum + d.MMT, 0);
// data.reduce((sum, d) => sum + d.MMT, 0);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title} ({unit})</DialogTitle>
        </DialogHeader>

        {/* Toggle Buttons */}
        <div className="flex space-x-2 mb-4">
          <Button variant={view === "bar" ? "default" : "outline"} onClick={() => setView("bar")}>
            Bar Chart
          </Button>
          <Button variant={view === "pie" ? "default" : "outline"} onClick={() => setView("pie")}>
            Pie Chart
          </Button>
          <Button variant={view === "table" ? "default" : "outline"} onClick={() => setView("table")}>
            Table
          </Button>
        </div>

        {/* Bar Chart View */}
        {view === "bar" && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" label={{ value: "MMT", position: "insideBottom", offset: -5 }} />
              <YAxis dataKey="commodity" type="category" width={150} />
              <Tooltip formatter={(val) => `${val} MMT`} />
              <Bar dataKey="MMT" fill="#4f46e5">
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Pie Chart View */}
        {view === "pie" && (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
  data={data}
  dataKey="MMT"
  nameKey="commodity"
  cx="50%"
  cy="50%"
  outerRadius={140}
  label={({ commodity, percent }) =>
    `${commodity} ${((percent ?? 0) * 100).toFixed(1)}%`
  }
>
  {data.map((_, index) => (
    <Cell key={index} fill={COLORS[index % COLORS.length]} />
  ))}
</Pie>

              <Tooltip formatter={(val, _, entry) => `${entry.payload.commodity}: ${val} MMT`} />
            </PieChart>
          </ResponsiveContainer>
        )}

        {/* Table View */}
        {view === "table" && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commodity</TableHead>
                <TableHead>MMT</TableHead>
                <TableHead>% Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((d, i) => (
                <TableRow key={i}>
                  <TableCell>{d.commodity}</TableCell>
                  <TableCell>{d.MMT.toFixed(2)}</TableCell>
                  <TableCell>{((d.MMT / totalMMT) * 100).toFixed(2)}%</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold">
                <TableCell>Total</TableCell>
                <TableCell>{totalMMT.toFixed(2)}</TableCell>
                <TableCell>100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
