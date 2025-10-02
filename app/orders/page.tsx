"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { OrderCard } from "@/components/orders/order-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus } from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"
import { useState, useEffect } from "react"
import type { Order } from "@/lib/types"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await api.getOrders()
        setOrders(data)
      } catch (error) {
        console.error("Failed to load orders:", error)
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Manage and track all your orders</p>
          </div>
          <Button asChild>
            <Link href="/orders/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Order
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search orders..." className="pl-10" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders yet</p>
            <p className="text-sm text-muted-foreground">Create your first order to get started</p>
            <Button asChild className="mt-4">
              <Link href="/orders/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Order
              </Link>
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
