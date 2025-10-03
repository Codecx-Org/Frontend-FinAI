import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MetricCard } from "@/components/insights/metric-card"
import { CashFlowChart } from "@/components/insights/cash-flow-chart"
import { InventoryTurnoverChart } from "@/components/insights/inventory-turnover-chart"
import { CustomerGrowthChart } from "@/components/insights/customer-growth-chart"
import { AIBusinessHealthDashboard } from "@/components/insights/ai-business-health-dashboard"
import { DollarSign, TrendingUp, Percent, Target } from "lucide-react"

export default function InsightsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Business Intelligence Center</h1>
          <p className="text-muted-foreground">AI-powered insights and intelligent decision-making tools</p>
        </div>

        {/* AI Business Health Dashboard - Featured prominently */}
        <AIBusinessHealthDashboard />

        {/* Key Metrics Summary */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Profit Margin"
            value="32.5%"
            change={4.2}
            icon={Percent}
            description="Healthy margin growth"
          />
          <MetricCard
            title="Revenue Growth"
            value="KSH 12.5K"
            change={15.3}
            icon={TrendingUp}
            description="Month over month"
          />
          <MetricCard
            title="Customer LTV"
            value="KSH 1,248"
            change={8.7}
            icon={Target}
            description="Lifetime value per customer"
          />
          <MetricCard
            title="Cash Position"
            value="KSH 67.8K"
            change={12.1}
            icon={DollarSign}
            description="Available working capital"
          />
        </div>

        {/* Detailed Analytics Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <CashFlowChart />
          <InventoryTurnoverChart />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CustomerGrowthChart />
          </div>
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Order Value</span>
                  <span className="font-semibold">KSH 195.23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Conversion Rate</span>
                  <span className="font-semibold">3.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Return Rate</span>
                  <span className="font-semibold">2.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Customer Retention</span>
                  <span className="font-semibold">68%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
