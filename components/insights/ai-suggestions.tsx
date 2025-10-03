"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, TrendingUp, AlertCircle, Target } from "lucide-react"

const suggestions = [
  {
    icon: TrendingUp,
    title: "Expand Cattle Feed Production",
    description: "Cattle Feed category shows 35% higher margins. Consider increasing production capacity for this high-demand product line.",
    priority: "high",
  },
  {
    icon: AlertCircle,
    title: "Low Stock Alert",
    description: "Fish Meal Supplement and Premium Dog Food are running low. Restock now to meet upcoming seasonal demand.",
    priority: "medium",
  },
  {
    icon: Target,
    title: "Customer Retention Program",
    description: "Bulk buyers represent 60% of revenue. Launch a loyalty program to improve retention and increase order frequency.",
    priority: "high",
  },
  {
    icon: Lightbulb,
    title: "Seasonal Opportunity",
    description: "Q4 typically shows 40% increase in livestock feed demand. Prepare inventory and consider bulk pricing for large orders.",
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
