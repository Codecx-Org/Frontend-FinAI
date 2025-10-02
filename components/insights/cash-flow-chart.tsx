"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const cashFlowData = [
  { month: "Jan", income: 45000, expenses: 32000 },
  { month: "Feb", income: 52000, expenses: 35000 },
  { month: "Mar", income: 48000, expenses: 33000 },
  { month: "Apr", income: 61000, expenses: 38000 },
  { month: "May", income: 55000, expenses: 36000 },
  { month: "Jun", income: 67000, expenses: 41000 },
]

export function CashFlowChart() {
  const chartConfig = {
    income: {
      label: "Income",
      color: "hsl(var(--chart-1))",
    },
    expenses: {
      label: "Expenses",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow Analysis</CardTitle>
        <CardDescription>Income vs Expenses over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={cashFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} tickLine={false} axisLine={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString()}`,
                    name === "income" ? "Income" : "Expenses",
                  ]}
                />
              }
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
