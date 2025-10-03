"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  BarChart3,
  Users,
  DollarSign,
  ShoppingCart,
  Star,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react"

interface AIBusinessHealthDashboardProps {
  className?: string
}

export function AIBusinessHealthDashboard({ className }: AIBusinessHealthDashboardProps) {
  const [showPredictions, setShowPredictions] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, ordersData, customersData] = await Promise.all([
          api.getProducts(),
          api.getOrders(),
          api.getCustomers()
        ])
        setProducts(productsData)
        setOrders(ordersData)
        setCustomers(customersData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate dynamic insights based on real data
  const calculateRevenuePredictions = () => {
    if (orders.length === 0) {
      return [
        { month: "Oct", predicted: 0, actual: null, confidence: 50 },
        { month: "Nov", predicted: 0, actual: null, confidence: 50 },
        { month: "Dec", predicted: 0, actual: null, confidence: 50 },
        { month: "Jan", predicted: 0, actual: null, confidence: 50 },
      ]
    }

    // Calculate average monthly revenue from recent orders
    const recentOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt)
      const now = new Date()
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
      return orderDate >= threeMonthsAgo
    })

    const totalRevenue = recentOrders.reduce((sum, order) => sum + order.total, 0)
    const avgMonthlyRevenue = totalRevenue / 3

    // Calculate growth rate based on recent trends
    const thisMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt)
      const now = new Date()
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()
    })

    const lastMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt)
      const now = new Date()
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      return orderDate.getMonth() === lastMonth.getMonth() && orderDate.getFullYear() === lastMonth.getFullYear()
    })

    const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + order.total, 0)
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.total, 0)
    const growthRate = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 10

    // Generate predictions based on current performance
    const baseAmount = avgMonthlyRevenue
    return [
      { month: "Oct", predicted: Math.round(baseAmount * 1.1), actual: null, confidence: 75 },
      { month: "Nov", predicted: Math.round(baseAmount * 1.15 + (baseAmount * growthRate / 100)), actual: null, confidence: 70 },
      { month: "Dec", predicted: Math.round(baseAmount * 1.25 + (baseAmount * growthRate / 100)), actual: null, confidence: 65 },
      { month: "Jan", predicted: Math.round(baseAmount * 1.2 + (baseAmount * growthRate / 100)), actual: null, confidence: 60 },
    ]
  }

  const calculateGrowthTips = () => {
    if (products.length === 0 || orders.length === 0) return []

    // Find top performing category
    const categoryRevenue = products.reduce((acc, product) => {
      const productOrders = orders.filter(order =>
        order.items.some((item: any) => item.productId === product.id)
      )
      const revenue = productOrders.reduce((sum, order) => sum + order.total, 0)

      if (!acc[product.category]) {
        acc[product.category] = { revenue: 0, products: [] }
      }
      acc[product.category].revenue += revenue
      acc[product.category].products.push(product)
      return acc
    }, {} as Record<string, { revenue: number, products: any[] }>)

    const topCategory = Object.entries(categoryRevenue)
      .sort(([,a], [,b]) => (b as { revenue: number }).revenue - (a as { revenue: number }).revenue)[0]

    // Find low stock products
    const lowStockProducts = products.filter(p => p.stock <= 5)

    // Calculate average order value
    const avgOrderValue = orders.length > 0
      ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length
      : 0

    return [
      {
        id: 1,
        title: `Expand ${topCategory ? topCategory[0] : 'Top'} Category`,
        description: `Your ${topCategory ? topCategory[0] : 'top'} category generates the most revenue. Consider adding ${lowStockProducts.length > 0 ? 'more inventory and' : ''} new products in this category.`,
        impact: "High",
        effort: "Medium",
        roi: "185%",
        action: "View Products",
        icon: ShoppingCart,
        color: "bg-blue-500"
      },
      {
        id: 2,
        title: "Optimize Pricing Strategy",
        description: `Your average order value is KSH ${Math.round(avgOrderValue)}. Consider dynamic pricing to increase margins.`,
        impact: "Medium",
        effort: "Low",
        roi: "145%",
        action: "Adjust Prices",
        icon: DollarSign,
        color: "bg-green-500"
      }
    ]
  }

  const calculatePerformanceInsights = () => {
    if (customers.length === 0 || orders.length === 0) return []

    // Calculate customer acquisition cost (simplified)
    const totalCustomers = customers.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const cac = totalCustomers > 0 ? totalRevenue / totalCustomers * 0.1 : 0 // Simplified CAC calculation

    // Calculate customer lifetime value
    const vipCustomers = customers.filter(c => c.group === 'vip')
    const vipRevenue = vipCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0)
    const clv = vipCustomers.length > 0 ? vipRevenue / vipCustomers.length : 0

    // Calculate inventory turnover (simplified)
    const totalStockValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0)
    const turnoverRate = totalStockValue > 0 ? (totalRevenue / totalStockValue) * 12 : 0 // Annualized

    return [
      {
        metric: "Customer Acquisition Cost",
        current: `KSH ${Math.round(cac)}`,
        target: "KSH 500",
        status: cac < 500 ? "good" : "warning",
        trend: -5, // Simplified trend
        insight: `CAC is ${cac < 500 ? 'below' : 'above'} target, indicating ${cac < 500 ? 'efficient' : 'expensive'} customer acquisition`
      },
      {
        metric: "Customer Lifetime Value",
        current: `KSH ${Math.round(clv)}`,
        target: "KSH 2,000",
        status: clv > 2000 ? "good" : "warning",
        trend: 8,
        insight: `LTV is ${clv > 2000 ? 'above' : 'below'} target, showing ${clv > 2000 ? 'strong' : 'room for improvement in'} customer retention`
      },
      {
        metric: "Inventory Turnover",
        current: `${turnoverRate.toFixed(1)}x`,
        target: "6.0x",
        status: turnoverRate > 6 ? "good" : "warning",
        trend: 3,
        insight: `Turnover rate is ${turnoverRate > 6 ? 'healthy' : 'low'}, indicating ${turnoverRate > 6 ? 'good' : 'slow'} inventory movement`
      }
    ]
  }

  const revenuePredictions = calculateRevenuePredictions()
  const growthTips = calculateGrowthTips()
  const performanceInsights = calculatePerformanceInsights()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'danger': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <Target className="w-4 h-4 text-gray-500" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Very High': return 'bg-red-100 text-red-800 border-red-200'
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Low': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold">AI Business Health Dashboard</h2>
          </div>
          <p className="text-muted-foreground">Loading intelligent insights...</p>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-2xl font-bold">AI Business Health Dashboard</h2>
        </div>
        <p className="text-muted-foreground">Intelligent insights to drive your business growth</p>
      </div>

      {/* Revenue Predictions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Revenue Predictions
              </CardTitle>
              <CardDescription>AI-powered revenue forecasting for the next 4 months</CardDescription>
            </div>
            <Button
              onClick={() => setShowPredictions(!showPredictions)}
              variant="outline"
              className="flex items-center gap-2"
            >
              {showPredictions ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Hide Predictions
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Show Predictions
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showPredictions ? (
            <div className="space-y-4">
              {revenuePredictions.map((prediction, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{prediction.month} 2024</span>
                      <Badge variant={prediction.actual ? "secondary" : "default"}>
                        {prediction.actual ? "Actual" : "Predicted"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Confidence: {prediction.confidence}%
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-bold text-lg">
                      KSH {prediction.actual || prediction.predicted.toLocaleString()}
                    </div>
                    {prediction.actual && (
                      <div className={`text-sm ${prediction.actual > prediction.predicted ? 'text-green-600' : 'text-red-600'}`}>
                        {prediction.actual > prediction.predicted ? '+' : ''}
                        {((prediction.actual - prediction.predicted) / prediction.predicted * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                  <Progress value={prediction.confidence} className="w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Click "Show Predictions" to reveal AI-powered revenue forecasts</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Growth Tips with Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            AI Growth Recommendations
          </CardTitle>
          <CardDescription>Actionable insights to accelerate your business growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {growthTips.map((tip) => {
              const Icon = tip.icon
              return (
                <div key={tip.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${tip.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-sm">{tip.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Impact:</span>
                      <Badge className={`ml-1 ${getImpactColor(tip.impact)}`}>
                        {tip.impact}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">ROI:</span>
                      <span className="ml-1 font-semibold text-green-600">{tip.roi}</span>
                    </div>
                  </div>

                  <Button size="sm" className="w-full">
                    {tip.action}
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Performance Insights
          </CardTitle>
          <CardDescription>Detailed analysis of key business metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceInsights.map((insight, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(insight.status)}
                    <h4 className="font-semibold">{insight.metric}</h4>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${insight.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {insight.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(insight.trend)}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Current:</span>
                    <span className="ml-2 font-semibold">{insight.current}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Target:</span>
                    <span className="ml-2 font-semibold">{insight.target}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {insight.status === 'good' ? '100%' :
                       insight.metric === 'Customer Acquisition Cost' ?
                         `${((parseFloat(insight.target.replace('KSH ', '')) - parseFloat(insight.current.replace('KSH ', ''))) / parseFloat(insight.target.replace('KSH ', '')) * 100).toFixed(0)}%` :
                         `${(parseFloat(insight.current.replace('x', '')) / parseFloat(insight.target.replace('x', '')) * 100).toFixed(0)}%`}
                    </span>
                  </div>
                  <Progress
                    value={insight.status === 'good' ? 100 :
                           insight.metric === 'Customer Acquisition Cost' ?
                             ((parseFloat(insight.target.replace('KSH ', '')) - parseFloat(insight.current.replace('KSH ', ''))) / parseFloat(insight.target.replace('KSH ', '')) * 100) :
                             (parseFloat(insight.current.replace('x', '')) / parseFloat(insight.target.replace('x', '')) * 100)}
                    className="h-2"
                  />
                </div>

                <p className="text-sm text-muted-foreground">{insight.insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
