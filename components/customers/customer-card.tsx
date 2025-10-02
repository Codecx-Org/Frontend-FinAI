import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronRight, Mail, Phone } from "lucide-react"
import type { Customer } from "@/lib/types"

interface CustomerCardProps {
  customer: Customer
}

export function CustomerCard({ customer }: CustomerCardProps) {
  const groupColors = {
    vip: "default" as const,
    regular: "secondary" as const,
    new: "outline" as const,
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{customer.name}</h3>
              <Badge variant={groupColors[customer.group]}>{customer.group.toUpperCase()}</Badge>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                <span>{customer.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm pt-2">
              <div>
                <p className="text-muted-foreground">Orders</p>
                <p className="font-semibold">{customer.totalOrders}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Spent</p>
                <p className="font-semibold">KSH {customer.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <Button variant="ghost" size="icon" asChild>
            <Link href={`/customers/${customer.id}`}>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
