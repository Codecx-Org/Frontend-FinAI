import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "./order-status-badge"
import { ChevronRight } from "lucide-react"
import type { Order } from "@/lib/types"

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{order.id}</p>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>{order.customerName}</p>
              <p>{order.customerEmail}</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">{order.items.length} items</span>
              <span className="font-semibold">KSH {order.total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/orders/${order.id}`}>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
