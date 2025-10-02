"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { OrderStatusSelect } from "@/components/orders/order-status-select"
import { ArrowLeft, Download, Mail } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Order } from "@/lib/types"

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch order data
  useEffect(() => {
    api
      .getOrder(id)
      .then(setOrder)
      .catch(() => {
        toast({
          title: "Error",
          description: "Could not load order details",
          variant: "destructive",
        })
      })
      .finally(() => setIsLoading(false))
  }, [id, toast])

  const handleGenerateInvoice = () => {
    toast({
      title: "Invoice generated",
      description: "Invoice has been generated and is ready for download",
    })
  }

  const handleSendEmail = () => {
    toast({
      title: "Email sent",
      description: "Order confirmation email sent to customer",
    })
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!order) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Order not found</p>
          <Button variant="outline" onClick={() => router.push("/orders")} className="mt-4">
            Back to Orders
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/orders")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{order.id}</h1>
            <p className="text-muted-foreground">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <OrderStatusSelect
            orderId={order.id}
            currentStatus={order.status}
            onStatusChange={(newStatus) => setOrder({ ...order, status: newStatus })}
          />
          <Button variant="outline" onClick={handleGenerateInvoice}>
            <Download className="w-4 h-4 mr-2" />
            Generate Invoice
          </Button>
          <Button variant="outline" onClick={handleSendEmail}>
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>{order.items.length} items in this order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">KSH {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-4 text-lg font-bold">
                    <span>Total</span>
                    <span>KSH {order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer & Order Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer ID</p>
                  <p className="font-medium">{order.customerId}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium">Order Placed</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.updatedAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
