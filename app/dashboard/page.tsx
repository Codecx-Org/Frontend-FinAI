import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatCard } from "@/components/dashboard/stat-card"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { LowStockAlert } from "@/components/dashboard/low-stock-alert"
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import { api } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const stats = await api.getDashboardStats()
  const salesData = await api.getSalesData()
  const products = await api.getProducts()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-balance">Welcome back!</h1>
          <p className="text-muted-foreground">{"Here's what's happening with your business today."}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={`KSH ${stats.totalRevenue.toLocaleString()}`}
            change={stats.revenueChange}
            icon={DollarSign}
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toString()}
            change={stats.ordersChange}
            icon={ShoppingCart}
          />
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers.toString()}
            change={stats.customersChange}
            icon={Users}
          />
          <StatCard title="Low Stock Items" value={stats.lowStockItems.toString()} change={-5.2} icon={Package} />
        </div>

        {/* Charts and Alerts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SalesChart data={salesData} />
          </div>
          <div>
            <LowStockAlert products={products} />
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New order received</p>
                  <p className="text-xs text-muted-foreground">Order #ORD-003 from Carol White</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Product stock updated</p>
                  <p className="text-xs text-muted-foreground">Mechanical Keyboard restocked</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Low stock alert</p>
                  <p className="text-xs text-muted-foreground">USB-C Hub has only 3 units left</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
