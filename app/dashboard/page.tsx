"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatCard, ChatbotMessaging, CompleteInventoryStatus, AllProductPricing, ProductDemandPredictions } from "@/components/dashboard/stat-card"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { LowStockAlert } from "@/components/dashboard/low-stock-alert"
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, LayoutDashboard } from "lucide-react"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DashboardStats, Product } from "@/lib/types"

// Extended sales data type
interface EnhancedSalesData {
  date: string
  revenue: number
  expenses?: number
  profit?: number
}

interface DemandPrediction {
  productId: string
  currentStock: number
  predictedDemand: number
  daysUntilStockout: number
  confidence: number
  suggestedRestock: number
}

interface PricingSuggestion {
  productId: string
  currentPrice: number
  suggestedPrice: number
  reason: string
  impact: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [salesData, setSalesData] = useState<EnhancedSalesData[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [demandPredictions, setDemandPredictions] = useState<DemandPrediction[]>([])
  const [pricingSuggestions, setPricingSuggestions] = useState<PricingSuggestion[]>([])
  const [recentMessages, setRecentMessages] = useState<Array<{ text: string; sender: "user" | "bot"; timestamp: string }>>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, salesDataResult, productsData] = await Promise.all([
          api.getDashboardStats(),
          api.getSalesData(),
          api.getProducts(),
        ])
        setStats(statsData)
        
        // Convert sales data to enhanced format with expenses and profit
        const enhancedSales = salesDataResult.map((sale: any) => ({
          ...sale,
          expenses: sale.expenses || sale.revenue * 0.7, // Default 70% cost if not provided
          profit: sale.profit || sale.revenue * 0.3, // Default 30% profit if not provided
        }))
        setSalesData(enhancedSales)
        setProducts(productsData)

        // Generate AI predictions (replace with actual API calls)
        generateDemandPredictions(productsData)
        generatePricingSuggestions(productsData)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      }
    }

    loadData()
  }, [])

  // Generate demand predictions based on current stock
  const generateDemandPredictions = (products: Product[]) => {
    const predictions = products.map((product) => {
      const dailyDemand = Math.floor(Math.random() * 20) + 10
      const daysUntilStockout = product.stock > 0 ? Math.floor(product.stock / dailyDemand) : 0
      
      return {
        productId: product.id,
        currentStock: product.stock,
        predictedDemand: dailyDemand * 30, // Monthly demand
        daysUntilStockout,
        confidence: Math.floor(Math.random() * 20) + 80,
        suggestedRestock: Math.max(0, dailyDemand * 30 - product.stock),
      }
    })
    setDemandPredictions(predictions)
  }

  // Generate pricing suggestions
  const generatePricingSuggestions = (products: Product[]) => {
    const suggestions = products
      .filter(() => Math.random() > 0.5) // Random selection for demo
      .map((product) => {
        const increase = Math.random() > 0.5
        const adjustment = increase ? 1.1 : 0.95
        const reasons = increase
          ? ["High demand detected", "Market price increase", "Supply shortage", "Competitor pricing higher"]
          : ["Increase volume sales", "Competitor pricing lower", "Excess stock clearance"]
        
        return {
          productId: product.id,
          currentPrice: product.price,
          suggestedPrice: Math.round(product.price * adjustment),
          reason: reasons[Math.floor(Math.random() * reasons.length)],
          impact: Math.floor((adjustment - 1) * 100),
        }
      })
    setPricingSuggestions(suggestions)
  }

  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    try {
      await api.deleteProduct(productId)
      setProducts(products.filter((p) => p.id !== productId))
      // Update predictions after deletion
      const updatedProducts = products.filter((p) => p.id !== productId)
      generateDemandPredictions(updatedProducts)
      generatePricingSuggestions(updatedProducts)
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  // Handle chatbot message
  const handleSendMessage = async (message: string, language: "sw" | "en") => {
    const newMessage = {
      text: message,
      sender: "user" as const,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }
    setRecentMessages([...recentMessages, newMessage])

    try {
      // Call your chatbot API here
      // const response = await api.sendChatbotMessage(message, language)
      
      // Simulate bot response for now
      setTimeout(() => {
        const botResponse = {
          text: language === "sw" 
            ? "Asante kwa ujumbe wako. Nitakusaidia!" 
            : "Thank you for your message. I'll help you!",
          sender: "bot" as const,
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        }
        setRecentMessages((prev) => [...prev, botResponse])
      }, 1000)
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  // Handle price update
  const handleApplyPrice = async (productId: string, newPrice: number) => {
    try {
      await api.updateProductPrice(productId, newPrice)
      setProducts(products.map((p) => (p.id === productId ? { ...p, price: newPrice } : p)))
      // Remove applied suggestion
      setPricingSuggestions(pricingSuggestions.filter((s) => s.productId !== productId))
    } catch (error) {
      console.error("Failed to update price:", error)
    }
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-2"></div>
            <div className="h-4 bg-muted rounded w-96"></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Calculate financial metrics
  const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0)
  const totalExpenses = salesData.reduce((sum, d) => sum + (d.expenses || 0), 0)
  const netProfit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">AI Bookkeeping Assistant</h1>
          <p className="text-muted-foreground">Smart financial management for your business</p>
        </div>

        {/* Quick Stats - Always visible */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={`KSH ${stats.totalRevenue.toLocaleString()}`}
            change={stats.revenueChange}
            icon={DollarSign}
          />
          <StatCard
            title="Net Profit"
            value={`KSH ${netProfit.toLocaleString()}`}
            change={profitMargin}
            icon={TrendingUp}
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toString()}
            change={stats.ordersChange}
            icon={ShoppingCart}
          />
          <StatCard 
            title="Products" 
            value={products.length.toString()} 
            change={stats.lowStockItems > 0 ? -5.2 : 2.3} 
            icon={Package} 
          />
        </div>

        {/* Tabbed Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="finances" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Track Finances</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Sell Smarter</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Operate Faster</span>
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <SalesChart data={salesData} />
              </div>
              <LowStockAlert products={products} onDeleteProduct={handleDeleteProduct} />
            </div>
          </TabsContent>

          {/* TRACK FINANCES TAB */}
          <TabsContent value="finances" className="space-y-6">
            <SalesChart data={salesData} />
            <div className="grid gap-6 lg:grid-cols-2">
              <CompleteInventoryStatus products={products} onDeleteProduct={handleDeleteProduct} />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg bg-green-50">
                    <p className="text-xs text-muted-foreground mb-1">Total Income</p>
                    <p className="text-2xl font-bold text-green-600">
                      KSH {(totalRevenue / 1000).toFixed(0)}k
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">From stock sales</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-red-50">
                    <p className="text-xs text-muted-foreground mb-1">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">
                      KSH {(totalExpenses / 1000).toFixed(0)}k
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Stock purchases</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-purple-50">
                  <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
                  <p className="text-2xl font-bold text-purple-600">
                    KSH {(netProfit / 1000).toFixed(0)}k
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {profitMargin.toFixed(1)}% profit margin
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* SELL SMARTER TAB */}
          <TabsContent value="customers" className="space-y-6">
            <ChatbotMessaging onSendMessage={handleSendMessage} recentMessages={recentMessages} />
            <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="text-lg font-semibold mb-3">AI Chatbot Features</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Handle queries in Kiswahili & English
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Share product catalogs automatically
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Process orders seamlessly
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Follow up with customers
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Send broadcast messages
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    24/7 customer support
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* OPERATE FASTER TAB */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <CompleteInventoryStatus products={products} />
              <LowStockAlert products={products} onDeleteProduct={handleDeleteProduct} />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <ProductDemandPredictions products={products} predictions={demandPredictions} />
              <AllProductPricing 
                products={products} 
                suggestions={pricingSuggestions} 
                onApplyPrice={handleApplyPrice} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}