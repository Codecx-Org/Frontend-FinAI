"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"

const turnoverData = [
  { month: "Jan", turnover: 4.2 },
  { month: "Feb", turnover: 4.5 },
  { month: "Mar", turnover: 4.1 },
  { month: "Apr", turnover: 4.8 },
  { month: "May", turnover: 5.2 },
  { month: "Jun", turnover: 5.5 },
]

export function InventoryTurnoverChart() {
  const chartConfig = {
    turnover: {
      label: "Turnover Rate",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Turnover</CardTitle>
        <CardDescription>How quickly inventory is sold and replaced</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={turnoverData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value) => [`${Number(value).toFixed(1)}x`, "Turnover Rate"]} />}
            />
            <Line
              type="monotone"
              dataKey="turnover"
              stroke="var(--color-turnover)"
              strokeWidth={2}
              dot={{ fill: "var(--color-turnover)", r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
