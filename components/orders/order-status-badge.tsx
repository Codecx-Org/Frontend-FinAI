import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/types"

interface OrderStatusBadgeProps {
  status: Order["status"]
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const variants: Record<
    Order["status"],
    { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
  > = {
    pending: { label: "Pending", variant: "secondary" },
    processing: { label: "Processing", variant: "default" },
    shipped: { label: "Shipped", variant: "outline" },
    delivered: { label: "Delivered", variant: "default" },
    cancelled: { label: "Cancelled", variant: "destructive" },
  }

  const { label, variant } = variants[status]

  return <Badge variant={variant}>{label}</Badge>
}
