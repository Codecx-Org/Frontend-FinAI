"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Order } from "@/lib/types"

interface OrderStatusSelectProps {
  orderId: string
  currentStatus: Order["status"]
  onStatusChange?: (newStatus: Order["status"]) => void
}

export function OrderStatusSelect({ orderId, currentStatus, onStatusChange }: OrderStatusSelectProps) {
  const [status, setStatus] = useState<Order["status"]>(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleStatusChange = async (newStatus: Order["status"]) => {
    setIsUpdating(true)
    try {
      await api.updateOrderStatus(orderId, newStatus)
      setStatus(newStatus)
      onStatusChange?.(newStatus)
      toast({
        title: "Status updated",
        description: `Order status changed to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update order status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
      <SelectTrigger className="w-[180px]">
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
  )
}
