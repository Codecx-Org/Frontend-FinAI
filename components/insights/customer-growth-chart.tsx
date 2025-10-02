"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

const customerData = [
  { month: "Jan", customers: 120 },
  { month: "Feb", customers: 135 },
  { month: "Mar", customers: 142 },
  { month: "Apr", customers: 148 },
  { month: "May", customers: 156 },
  { month: "Jun", customers: 165 },
]

export function CustomerGrowthChart() {
  const chartConfig = {
    customers: {
      label: "Customers",
      color: "hsl(var(--chart-4))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Growth</CardTitle>
        <CardDescription>Total customer base over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={customerData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => [`${value}`, "Customers"]} />} />
            <Area
              type="monotone"
              dataKey="customers"
              stroke="var(--color-customers)"
              fill="var(--color-customers)"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
