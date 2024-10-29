import { DataCharts } from "@/components/dashboard/data-charts";
import { DataGrid } from "@/components/dashboard/data-grid";
import React from "react";

export default function DashboardPage() {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid />
      <DataCharts />
    </div>
  )
}
