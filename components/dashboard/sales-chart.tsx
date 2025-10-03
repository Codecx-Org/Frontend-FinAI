"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Line, ComposedChart } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { SalesData } from "@/lib/types"

interface EnhancedSalesData extends SalesData {
  expenses?: number
  profit?: number
  stockValue?: number
}

interface SalesChartProps {
  data: EnhancedSalesData[]
}

export function SalesChart({ data }: SalesChartProps) {
  // Calculate totals
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0)
  const totalExpenses = data.reduce((sum, d) => sum + (d.expenses || 0), 0)
  const totalProfit = data.reduce((sum, d) => sum + (d.profit || d.revenue - (d.expenses || 0)), 0)
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

  const revenueChartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
  }

  const cashflowChartConfig = {
    revenue: {
      label: "Income",
      color: "hsl(142, 76%, 36%)",
    },
    expenses: {
      label: "Expenses",
      color: "hsl(0, 84%, 60%)",
    },
  }

  const profitChartConfig = {
    profit: {
      label: "Profit",
      color: "hsl(262, 83%, 58%)",
    },
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>Track revenue, expenses, and profit</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              {profitMargin.toFixed(1)}% margin
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="cashflow">Cashflow</TabsTrigger>
            <TabsTrigger value="profit">Profit</TabsTrigger>
          </TabsList>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-lg font-bold">KSH {(totalRevenue / 1000).toFixed(0)}k</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Avg Daily</p>
                <p className="text-lg font-bold">KSH {(totalRevenue / data.length / 1000).toFixed(1)}k</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Transactions</p>
                <p className="text-lg font-bold">{data.length}</p>
              </div>
            </div>
            <ChartContainer config={revenueChartConfig} className="h-[300px] w-full">
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
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} tickLine={false} axisLine={false} />
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
          </TabsContent>

          {/* Cashflow Tab */}
          <TabsContent value="cashflow" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  Total Income
                </p>
                <p className="text-lg font-bold text-green-600">KSH {(totalRevenue / 1000).toFixed(0)}k</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-red-500" />
                  Total Expenses
                </p>
                <p className="text-lg font-bold text-red-600">KSH {(totalExpenses / 1000).toFixed(0)}k</p>
              </div>
            </div>
            <ChartContainer config={cashflowChartConfig} className="h-[300px] w-full">
              <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} tickLine={false} axisLine={false} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        const date = new Date(value)
                        return date.toLocaleDateString("en-US", { month: "long", day: "numeric" })
                      }}
                      formatter={(value, name) => [
                        `KSH ${Number(value).toLocaleString()}`,
                        name === "revenue" ? "Income" : "Expenses",
                      ]}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="var(--color-expenses)"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ChartContainer>
          </TabsContent>

          {/* Profit Tab */}
          <TabsContent value="profit" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Net Profit</p>
                <p className="text-lg font-bold text-purple-600">KSH {(totalProfit / 1000).toFixed(0)}k</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Profit Margin</p>
                <p className="text-lg font-bold">{profitMargin.toFixed(1)}%</p>
              </div>
            </div>
            <ChartContainer config={profitChartConfig} className="h-[300px] w-full">
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
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} tickLine={false} axisLine={false} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        const date = new Date(value)
                        return date.toLocaleDateString("en-US", { month: "long", day: "numeric" })
                      }}
                      formatter={(value) => [`KSH ${Number(value).toLocaleString()}`, "Profit"]}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="var(--color-profit)"
                  fill="var(--color-profit)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}