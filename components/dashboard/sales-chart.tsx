"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { SalesData } from "@/lib/types"

interface SalesChartProps {
  data: SalesData[]
}

export function SalesChart({ data }: SalesChartProps) {
  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Daily revenue for the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tickFormatter={(value) => `KSH ${(value / 1000).toFixed(0)}k`} tickLine={false} axisLine={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                  }}
                  formatter={(value) => [`KSH ${Number(value).toLocaleString()}`, "Revenue"]}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              fill="var(--color-revenue)"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
