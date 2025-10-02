"use client"

import type React from "react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Product, Customer } from "@/lib/types"

type OrderItem = {
  productId: string
  productName: string
  quantity: number
  price: number
}

export default function NewOrderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [status, setStatus] = useState<"pending" | "processing" | "shipped" | "delivered" | "cancelled">("pending")

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, customersData] = await Promise.all([api.getProducts(), api.getCustomers()])
        setProducts(productsData)
        setCustomers(customersData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        })
      }
    }
    loadData()
  }, [toast])

  const addOrderItem = () => {
    setOrderItems([...orderItems, { productId: "", productName: "", quantity: 1, price: 0 }])
  }

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  const updateOrderItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const updated = [...orderItems]
    if (field === "productId") {
      const product = products.find((p) => p.id === value)
      if (product) {
        updated[index] = {
          ...updated[index],
          productId: product.id,
          productName: product.name,
          price: product.price,
        }
      }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setOrderItems(updated)
  }

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCustomerId) {
      toast({
        title: "Error",
        description: "Please select a customer",
        variant: "destructive",
      })
      return
    }

    if (orderItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item",
        variant: "destructive",
      })
      return
    }

    const invalidItems = orderItems.filter((item) => !item.productId || item.quantity <= 0)
    if (invalidItems.length > 0) {
      toast({
        title: "Error",
        description: "Please complete all order items",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const customer = customers.find((c) => c.id === selectedCustomerId)
      if (!customer) throw new Error("Customer not found")

      await api.createOrder({
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        items: orderItems,
        total: calculateTotal(),
        status,
      })

      toast({
        title: "Success",
        description: "Order created successfully",
      })

      router.push("/orders")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create order",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/orders">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Order</h1>
            <p className="text-muted-foreground">Add a new order to your system</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Customer Information</h2>

              <div className="space-y-2">
                <Label htmlFor="customer">Customer *</Label>
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} ({customer.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Order Status *</Label>
                <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Order Items</h2>
              <Button type="button" variant="outline" size="sm" onClick={addOrderItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            {orderItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No items added yet</p>
                <p className="text-sm">Click "Add Item" to start building the order</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Product *</Label>
                      <Select
                        value={item.productId}
                        onValueChange={(value) => updateOrderItem(index, "productId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - KSH {product.price.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-24 space-y-2">
                      <Label>Quantity *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateOrderItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                      />
                    </div>

                    <div className="w-32 space-y-2">
                      <Label>Subtotal</Label>
                      <Input value={`KSH ${(item.price * item.quantity).toFixed(2)}`} disabled />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOrderItem(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <div className="pt-4 border-t flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">KSH {calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            )}
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Order"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/orders">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
