import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  change: number
  icon: LucideIcon
}

export function StatCard({ title, value, change, icon: Icon }: StatCardProps) {
  const isPositive = change >= 0

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className="flex items-center gap-1 text-xs">
              {isPositive ? (
                <ArrowUp className="w-3 h-3 text-green-500" />
              ) : (
                <ArrowDown className="w-3 h-3 text-red-500" />
              )}
              <span className={cn(isPositive ? "text-green-500" : "text-red-500")}>{Math.abs(change)}%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
