"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Send,
  Package,
  DollarSign,
  TrendingUp,
  Brain,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { Product } from "@/lib/types"

// Original StatCard
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

// AI Chatbot Messaging Card
interface ChatbotMessagingProps {
  onSendMessage: (message: string, language: "sw" | "en") => void
  recentMessages?: Array<{ text: string; sender: "user" | "bot"; timestamp: string }>
}

export function ChatbotMessaging({ onSendMessage, recentMessages = [] }: ChatbotMessagingProps) {
  const [message, setMessage] = useState("")
  const [language, setLanguage] = useState<"sw" | "en">("en")
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return
    
    setIsSending(true)
    try {
      await onSendMessage(message, language)
      setMessage("")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Send Customer Message
        </CardTitle>
        <CardDescription>Send messages via AI chatbot in Kiswahili or English</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recent Messages */}
        {recentMessages.length > 0 && (
          <div className="space-y-2 max-h-32 overflow-y-auto border rounded-lg p-3 bg-muted/20">
            {recentMessages.slice(-3).map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "text-sm p-2 rounded",
                  msg.sender === "user" ? "bg-primary/10 ml-4" : "bg-secondary mr-4"
                )}
              >
                <p className="text-xs text-muted-foreground mb-1">
                  {msg.sender === "user" ? "You" : "Bot"} • {msg.timestamp}
                </p>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Language Toggle */}
        <div className="flex gap-2">
          <Button
            variant={language === "en" ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage("en")}
            className="flex-1"
          >
            English
          </Button>
          <Button
            variant={language === "sw" ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage("sw")}
            className="flex-1"
          >
            Kiswahili
          </Button>
        </div>

        {/* Message Input */}
        <div className="space-y-2">
          <Textarea
            placeholder={language === "en" ? "Type your message..." : "Andika ujumbe wako..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button onClick={handleSend} disabled={isSending || !message.trim()} className="w-full">
            <Send className="w-4 h-4 mr-2" />
            {isSending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Complete Inventory Status Card
interface InventoryStatusProps {
  products: Product[]
  onDeleteProduct?: (productId: string) => void
}

export function CompleteInventoryStatus({ products, onDeleteProduct }: InventoryStatusProps) {
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const totalValue = products.reduce((sum, p) => sum + p.stock * p.price, 0)
  const lowStockCount = products.filter((p) => p.stock < 10).length
  const outOfStockCount = products.filter((p) => p.stock === 0).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Complete Inventory Status
        </CardTitle>
        <CardDescription>All products with stock levels</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Units</p>
            <p className="text-2xl font-bold">{totalStock}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Stock Value</p>
            <p className="text-2xl font-bold">KSH {(totalValue / 1000).toFixed(0)}k</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Low Stock</p>
            <p className="text-lg font-semibold text-orange-600">{lowStockCount} items</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Out of Stock</p>
            <p className="text-lg font-semibold text-red-600">{outOfStockCount} items</p>
          </div>
        </div>

        {/* Product List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className={cn(
                "p-3 border rounded-lg",
                product.stock === 0 && "bg-red-50 border-red-200",
                product.stock > 0 && product.stock < 10 && "bg-orange-50 border-orange-200",
                product.stock >= 10 && "bg-green-50 border-green-200"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={product.stock === 0 ? "destructive" : product.stock < 10 ? "secondary" : "default"}
                      className="text-xs"
                    >
                      {product.stock} units
                    </Badge>
                    <span className="text-xs text-muted-foreground">KSH {product.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// AI Pricing Suggestions for All Products
interface PricingSuggestion {
  productId: string
  currentPrice: number
  suggestedPrice: number
  reason: string
  impact: number
}

interface AllProductPricingProps {
  products: Product[]
  suggestions: PricingSuggestion[]
  onApplyPrice?: (productId: string, newPrice: number) => void
}

export function AllProductPricing({ products, suggestions, onApplyPrice }: AllProductPricingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          AI Pricing for All Products
        </CardTitle>
        <CardDescription>Current prices vs AI recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {products.map((product) => {
            const suggestion = suggestions.find((s) => s.productId === product.id)

            return (
              <div key={product.id} className="p-3 border rounded-lg bg-gradient-to-r from-blue-50/30 to-purple-50/30">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    {suggestion && (
                      <p className="text-xs text-muted-foreground mt-1">{suggestion.reason}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Current</p>
                      <p className="text-sm font-semibold">KSH {product.price.toLocaleString()}</p>
                    </div>
                    {suggestion && (
                      <>
                        <ArrowUp className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Suggested</p>
                          <p className="text-sm font-semibold text-green-600">
                            KSH {suggestion.suggestedPrice.toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          +{suggestion.impact}%
                        </Badge>
                      </>
                    )}
                    {!suggestion && (
                      <Badge variant="outline" className="text-xs">
                        Optimal price
                      </Badge>
                    )}
                  </div>
                  {suggestion && onApplyPrice && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onApplyPrice(product.id, suggestion.suggestedPrice)}
                    >
                      Apply
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Product Demand Predictions
interface DemandPrediction {
  productId: string
  currentStock: number
  predictedDemand: number
  daysUntilStockout: number
  confidence: number
  suggestedRestock: number
}

interface ProductDemandPredictionsProps {
  products: Product[]
  predictions: DemandPrediction[]
}

export function ProductDemandPredictions({ products, predictions }: ProductDemandPredictionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          Demand Prediction for Each Product
        </CardTitle>
        <CardDescription>AI-powered stock forecasting</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {products.map((product) => {
            const prediction = predictions.find((p) => p.productId === product.id)
            const urgency = prediction
              ? prediction.daysUntilStockout <= 7
                ? "high"
                : prediction.daysUntilStockout <= 14
                ? "medium"
                : "low"
              : "none"

            return (
              <div
                key={product.id}
                className={cn(
                  "p-3 border rounded-lg",
                  urgency === "high" && "bg-red-50 border-red-200",
                  urgency === "medium" && "bg-orange-50 border-orange-200",
                  urgency === "low" && "bg-green-50 border-green-200",
                  urgency === "none" && "bg-gray-50 border-gray-200"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>Current: {product.stock} units</span>
                      {prediction && (
                        <>
                          <span>•</span>
                          <span>Predicted demand: {prediction.predictedDemand} units</span>
                        </>
                      )}
                    </div>
                  </div>
                  {prediction && (
                    <Badge variant="outline" className="text-xs">
                      {prediction.confidence}% confidence
                    </Badge>
                  )}
                </div>
                {prediction ? (
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Restock in: </span>
                        <span
                          className={cn(
                            "font-semibold",
                            urgency === "high" && "text-red-600",
                            urgency === "medium" && "text-orange-600",
                            urgency === "low" && "text-green-600"
                          )}
                        >
                          {prediction.daysUntilStockout} days
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Order {prediction.suggestedRestock} units
                    </Badge>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground mt-2">No prediction available</p>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}