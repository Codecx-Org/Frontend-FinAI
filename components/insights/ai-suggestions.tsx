"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, TrendingUp, AlertCircle, Target } from "lucide-react"

const suggestions = [
  {
    icon: TrendingUp,
    title: "Optimize Pricing Strategy",
    description: "Your Electronics category has 23% higher margins. Consider expanding this product line.",
    priority: "high",
  },
  {
    icon: AlertCircle,
    title: "Inventory Alert",
    description: "3 products are running low on stock. Restock now to avoid lost sales opportunities.",
    priority: "medium",
  },
  {
    icon: Target,
    title: "Customer Retention",
    description: "VIP customers generate 45% of revenue. Launch a loyalty program to increase retention.",
    priority: "high",
  },
  {
    icon: Lightbulb,
    title: "Seasonal Opportunity",
    description: "Sales typically increase 30% in Q4. Start preparing inventory and marketing campaigns.",
    priority: "low",
  },
]

export function AISuggestions() {
  const priorityColors = {
    high: "text-red-500",
    medium: "text-orange-500",
    low: "text-blue-500",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Suggestions</CardTitle>
        <CardDescription>Intelligent recommendations to grow your business</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon
            return (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{suggestion.title}</h4>
                    <span
                      className={`text-xs uppercase font-medium ${priorityColors[suggestion.priority as keyof typeof priorityColors]}`}
                    >
                      {suggestion.priority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{suggestion.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
