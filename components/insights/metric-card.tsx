import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: LucideIcon
  description?: string
}

export function MetricCard({ title, value, change, icon: Icon, description }: MetricCardProps) {
  const isPositive = change >= 0

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            <div className="flex items-center gap-1 text-sm">
              {isPositive ? (
                <ArrowUp className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500" />
              )}
              <span className={cn(isPositive ? "text-green-500" : "text-red-500", "font-medium")}>
                {Math.abs(change)}%
              </span>
              <span className="text-muted-foreground">vs last period</span>
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
