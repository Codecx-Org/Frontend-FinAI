"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Mail, Phone, Calendar } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Customer, Order } from "@/lib/types"

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>
}

export default function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch customer data
  useEffect(() => {
    Promise.all([api.getCustomer(id), api.getOrders()])
      .then(([customerData, allOrders]) => {
        setCustomer(customerData)
        setOrders(allOrders.filter((order) => order.customerId === id))
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Could not load customer details",
          variant: "destructive",
        })
      })
      .finally(() => setIsLoading(false))
  }, [id, toast])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading customer details...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Customer not found</p>
          <Button variant="outline" onClick={() => router.push("/customers")} className="mt-4">
            Back to Customers
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const groupColors = {
    vip: "default" as const,
    regular: "secondary" as const,
    new: "outline" as const,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/customers")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <p className="text-muted-foreground">{customer.email}</p>
          </div>
          <Badge variant={groupColors[customer.group]}>{customer.group.toUpperCase()}</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Customer Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Since</p>
                    <p className="font-medium">
                      {new Date(customer.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>{orders.length} orders placed</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">KSH {order.total.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No orders yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-3xl font-bold">{customer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-3xl font-bold">KSH {customer.totalSpent.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Order Value</p>
                  <p className="text-3xl font-bold">
                    KSH {customer.totalOrders > 0 ? (customer.totalSpent / customer.totalOrders).toFixed(2) : "0.00"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer ID</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-sm">{customer.id}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
