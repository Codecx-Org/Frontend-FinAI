// Mock API layer simulating Medusa.js-style endpoints

import type { User, AuthResponse, Product, Order, Customer, DashboardStats, SalesData, PaymentMethod, MicroloanApplication, CreditScore, BusinessType } from "./types"
import { authUtils } from "./auth"
import { BUSINESS_TYPES } from "./types"

// Mock authentication token
const MOCK_TOKEN = "mock-jwt-token-12345"

// Hardcoded users for authentication
const MOCK_USERS = [
  {
    id: "1",
    email: "test@msme.com",
    password: "pass123",
    name: "John Doe",
    role: "admin" as const,
    businessType: "animal-feeds",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "demo@msme.com",
    password: "demo123",
    name: "Jane Smith",
    role: "user" as const,
    businessType: "animal-feeds",
    createdAt: "2024-01-15T00:00:00Z",
  },
]

// Mock data generators
const generateMockProducts = (): Product[] => {
  const currentUser = authUtils.getUser()
  const businessType = currentUser?.businessType || "animal-feeds"

  // Get categories for the selected business type
  const businessTypeData = BUSINESS_TYPES.find((bt: BusinessType) => bt.id === businessType)
  const categories = businessTypeData?.categories || ["Cattle Feed", "Poultry Feed", "Pet Food"]

  if (businessType === "animal-feeds") {
    return [
      {
        id: "1",
        name: "Premium Cattle Feed",
        description: "High-quality protein-rich cattle feed for optimal growth",
        price: 2500.00,
        stock: 45,
        category: "Cattle Feed",
        image: "/animal-feed-1.png",
        createdAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        name: "Layer Poultry Feed",
        description: "Complete feed for egg-laying chickens with essential nutrients",
        price: 1800.00,
        stock: 12,
        category: "Poultry Feed",
        image: "/animal-feed-2.png",
        createdAt: "2024-01-05T00:00:00Z",
      },
      {
        id: "3",
        name: "Fish Meal Supplement",
        description: "High-protein fish meal for livestock nutrition",
        price: 3200.00,
        stock: 8,
        category: "Supplements",
        image: "/animal-feed-3.png",
        createdAt: "2024-01-10T00:00:00Z",
      },
      {
        id: "4",
        name: "Mineral Mix for Cattle",
        description: "Essential minerals and vitamins for cattle health",
        price: 950.00,
        stock: 67,
        category: "Minerals",
        image: "/animal-feed-4.png",
        createdAt: "2024-01-12T00:00:00Z",
      },
      {
        id: "5",
        name: "Premium Dog Food",
        description: "Complete nutrition for adult dogs",
        price: 4200.00,
        stock: 3,
        category: "Pet Food",
        image: "/animal-feed-5.png",
        createdAt: "2024-01-15T00:00:00Z",
      },
    ]
  }

  // Default fallback for other business types
  return [
    {
      id: "1",
      name: "Sample Product 1",
      description: "Sample product for " + businessType,
      price: 100.00,
      stock: 10,
      category: categories[0] || "General",
      image: "/placeholder.png",
      createdAt: "2024-01-01T00:00:00Z",
    }
  ]
}

const generateMockOrders = (): Order[] => [
  {
    id: "ORD-001",
    customerId: "CUST-001",
    customerName: "Alice Johnson",
    customerEmail: "alice@example.com",
    items: [{ productId: "1", productName: "Premium Cattle Feed", quantity: 2, price: 2500.00 }],
    total: 5000.00,
    status: "delivered",
    createdAt: "2024-09-15T10:30:00Z",
    updatedAt: "2024-09-20T14:20:00Z",
  },
  {
    id: "ORD-002",
    customerId: "CUST-002",
    customerName: "Bob Smith",
    customerEmail: "bob@example.com",
    items: [
      { productId: "2", productName: "Layer Poultry Feed", quantity: 3, price: 1800.00 },
      { productId: "4", productName: "Mineral Mix for Cattle", quantity: 1, price: 950.00 },
    ],
    total: 6350.00,
    status: "shipped",
    createdAt: "2024-09-25T14:15:00Z",
    updatedAt: "2024-09-26T09:00:00Z",
  },
  {
    id: "ORD-003",
    customerId: "CUST-003",
    customerName: "Carol White",
    customerEmail: "carol@example.com",
    items: [{ productId: "5", productName: "Premium Dog Food", quantity: 2, price: 4200.00 }],
    total: 8400.00,
    status: "processing",
    createdAt: "2024-09-28T16:45:00Z",
    updatedAt: "2024-09-28T16:45:00Z",
  },
]

const generateMockCustomers = (): Customer[] => [
  {
    id: "CUST-001",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1-555-0101",
    totalOrders: 5,
    totalSpent: 1249.95,
    group: "vip",
    createdAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "CUST-002",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "+1-555-0102",
    totalOrders: 3,
    totalSpent: 799.97,
    group: "regular",
    createdAt: "2024-07-15T00:00:00Z",
  },
  {
    id: "CUST-003",
    name: "Carol White",
    email: "carol@example.com",
    phone: "+1-555-0103",
    totalOrders: 1,
    totalSpent: 149.99,
    group: "new",
    createdAt: "2024-09-28T00:00:00Z",
  },
]

const generateMockSalesData = (): SalesData[] => {
  const data: SalesData[] = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split("T")[0],
      revenue: Math.floor(Math.random() * 5000) + 1000,
      orders: Math.floor(Math.random() * 50) + 10,
    })
  }

  return data
}

const getStoredProducts = (): Product[] => {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem("products")
  const currentUser = authUtils.getUser()
  const businessType = currentUser?.businessType || "animal-feeds"

  // If products exist in storage, return them (don't override with mock data)
  if (stored) {
    try {
      const existingProducts = JSON.parse(stored)
      if (existingProducts && existingProducts.length > 0) {
        return existingProducts
      }
    } catch (error) {
      console.error("Error parsing stored products:", error)
    }
  }

  // Only generate animal feeds products if no products exist and business type is animal-feeds
  if (businessType === "animal-feeds") {
    const animalFeedsProducts = [
      {
        id: "1",
        name: "Premium Cattle Feed",
        description: "High-quality protein-rich cattle feed for optimal growth and health",
        price: 2500.00,
        stock: 45,
        category: "Cattle Feed",
        image: "CF",
        createdAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        name: "Layer Poultry Feed",
        description: "Complete balanced feed for egg-laying chickens with essential nutrients",
        price: 1800.00,
        stock: 12,
        category: "Poultry Feed",
        image: "PF",
        createdAt: "2024-01-05T00:00:00Z",
      },
      {
        id: "3",
        name: "Fish Meal Supplement",
        description: "High-protein fish meal supplement for enhanced livestock nutrition",
        price: 3200.00,
        stock: 8,
        category: "Supplements",
        image: "FM",
        createdAt: "2024-01-10T00:00:00Z",
      },
      {
        id: "4",
        name: "Mineral Mix for Cattle",
        description: "Essential minerals and vitamins mix for cattle health and productivity",
        price: 950.00,
        stock: 67,
        category: "Minerals",
        image: "MM",
        createdAt: "2024-01-12T00:00:00Z",
      },
      {
        id: "5",
        name: "Premium Dog Food",
        description: "Complete premium nutrition formula for adult dogs",
        price: 4200.00,
        stock: 3,
        category: "Pet Food",
        image: "DF",
        createdAt: "2024-01-15T00:00:00Z",
      },
    ]

    // Store the animal feeds products only if no products exist
    setStoredProducts(animalFeedsProducts)
    return animalFeedsProducts
  }

  return []
}

const setStoredProducts = (products: Product[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("products", JSON.stringify(products))
}

const getStoredOrders = (): Order[] => {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem("orders")

  // If no stored orders, generate and store animal feeds orders
  if (!stored) {
    const animalFeedsOrders: Order[] = [
      {
        id: "ORD-001",
        customerId: "CUST-001",
        customerName: "Alice Johnson",
        customerEmail: "alice@example.com",
        items: [{ productId: "1", productName: "Premium Cattle Feed", quantity: 2, price: 2500.00 }],
        total: 5000.00,
        status: "delivered" as const,
        createdAt: "2024-09-15T10:30:00Z",
        updatedAt: "2024-09-20T14:20:00Z",
      },
      {
        id: "ORD-002",
        customerId: "CUST-002",
        customerName: "Bob Smith",
        customerEmail: "bob@example.com",
        items: [
          { productId: "2", productName: "Layer Poultry Feed", quantity: 3, price: 1800.00 },
          { productId: "4", productName: "Mineral Mix for Cattle", quantity: 1, price: 950.00 },
        ],
        total: 6350.00,
        status: "shipped" as const,
        createdAt: "2024-09-25T14:15:00Z",
        updatedAt: "2024-09-26T09:00:00Z",
      },
      {
        id: "ORD-003",
        customerId: "CUST-003",
        customerName: "Carol White",
        customerEmail: "carol@example.com",
        items: [{ productId: "5", productName: "Premium Dog Food", quantity: 2, price: 4200.00 }],
        total: 8400.00,
        status: "processing" as const,
        createdAt: "2024-09-28T16:45:00Z",
        updatedAt: "2024-09-28T16:45:00Z",
      },
    ]

    setStoredOrders(animalFeedsOrders)
    return animalFeedsOrders
  }

  return JSON.parse(stored)
}

const setStoredOrders = (orders: Order[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("orders", JSON.stringify(orders))
}

const getStoredCustomers = (): Customer[] => {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem("customers")

  // If no stored customers, generate and store mock data
  if (!stored) {
    const mockCustomers = generateMockCustomers()
    setStoredCustomers(mockCustomers)
    return mockCustomers
  }

  return JSON.parse(stored)
}

const setStoredCustomers = (customers: Customer[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("customers", JSON.stringify(customers))
}

// API functions
export const api = {
  // Authentication
  login: async (email: string, password: string): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (!user) {
      throw new Error("Invalid credentials")
    }

    const { password: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      token: MOCK_TOKEN,
    }
  },

  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const existingUser = MOCK_USERS.find((u) => u.email === email)

    if (existingUser) {
      throw new Error("User already exists")
    }

    const newUser: User = {
      id: String(MOCK_USERS.length + 1),
      email,
      name,
      role: "user",
      createdAt: new Date().toISOString(),
    }

    return {
      user: newUser,
      token: MOCK_TOKEN,
    }
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      totalRevenue: 18750.00,
      totalOrders: 15,
      totalCustomers: 8,
      lowStockItems: 2,
      revenueChange: 23.5,
      ordersChange: 18.3,
      customersChange: 12.7,
    }
  },

  getSalesData: async (): Promise<SalesData[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return generateMockSalesData()
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return getStoredProducts()
  },

  getProduct: async (id: string): Promise<Product> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const products = getStoredProducts()
    const product = products.find((p) => p.id === id)
    if (!product) throw new Error("Product not found")
    return product
  },

  createProduct: async (product: Omit<Product, "id" | "createdAt">): Promise<Product> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newProduct: Product = {
      ...product,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    }
    const products = getStoredProducts()
    products.push(newProduct)
    setStoredProducts(products)
    return newProduct
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const products = getStoredProducts()
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) throw new Error("Product not found")
    products[index] = { ...products[index], ...updates }
    setStoredProducts(products)
    return products[index]
  },

  deleteProduct: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const products = getStoredProducts()
    const filtered = products.filter((p) => p.id !== id)
    setStoredProducts(filtered)
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return getStoredOrders()
  },

  getOrder: async (id: string): Promise<Order> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const orders = getStoredOrders()
    const order = orders.find((o) => o.id === id)
    if (!order) throw new Error("Order not found")
    return order
  },

  createOrder: async (order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const orders = getStoredOrders()
    const newOrder: Order = {
      ...order,
      id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    orders.push(newOrder)
    setStoredOrders(orders)

    // Update customer data if customer exists
    const customers = getStoredCustomers()
    const customerIndex = customers.findIndex((c) => c.id === order.customerId)
    if (customerIndex !== -1) {
      customers[customerIndex].totalOrders += 1
      customers[customerIndex].totalSpent += order.total
      setStoredCustomers(customers)
    }

    return newOrder
  },

  updateOrderStatus: async (id: string, status: Order["status"]): Promise<Order> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const orders = getStoredOrders()
    const index = orders.findIndex((o) => o.id === id)
    if (index === -1) throw new Error("Order not found")
    orders[index] = { ...orders[index], status, updatedAt: new Date().toISOString() }
    setStoredOrders(orders)
    return orders[index]
  },

  // Customers
  getCustomers: async (): Promise<Customer[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return getStoredCustomers()
  },

  getCustomer: async (id: string): Promise<Customer> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const customers = getStoredCustomers()
    const customer = customers.find((c) => c.id === id)
    if (!customer) throw new Error("Customer not found")
    return customer
  },

  createCustomer: async (
    customer: Omit<Customer, "id" | "createdAt" | "totalOrders" | "totalSpent">,
  ): Promise<Customer> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const customers = getStoredCustomers()
    const newCustomer: Customer = {
      ...customer,
      id: `CUST-${String(customers.length + 1).padStart(3, "0")}`,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
    }
    customers.push(newCustomer)
    setStoredCustomers(customers)
    return newCustomer
  },

  // AI Chat
  sendChatMessage: async (message: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const responses = [
      "Based on your sales data, I recommend focusing on promoting high-margin cattle feed products this quarter.",
      "Your inventory shows low stock on fish meal supplements. Would you like me to generate a restock report?",
      "Customer retention has improved by 15% this month. Great work on your bulk buyer loyalty program!",
      "I've analyzed your cash flow patterns. Consider adjusting payment terms with feed suppliers to improve liquidity.",
      "Your top-selling category is Cattle Feed. Consider expanding your product line in this high-demand area.",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  },

  // Payment Methods
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return [
      {
        id: "pm-1",
        type: "mpesa",
        phoneNumber: "+254712345678",
        accountName: "John Doe",
        isDefault: true,
        status: "active",
      },
      {
        id: "pm-2",
        type: "airtel_money",
        phoneNumber: "+254712345679",
        accountName: "Jane Smith",
        isDefault: false,
        status: "inactive",
      },
    ]
  },

  connectPaymentMethod: async (type: 'mpesa' | 'airtel_money', phoneNumber: string, accountName: string): Promise<PaymentMethod> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      id: `pm-${Date.now()}`,
      type,
      phoneNumber,
      accountName,
      isDefault: false,
      status: "pending",
    }
  },

  // Credit & Microloans
  getCreditScore: async (): Promise<CreditScore> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      overall: 85,
      businessPerformance: 90,
      paymentHistory: 80,
      creditUtilization: 75,
      factors: {
        positive: [
          "Consistent revenue growth",
          "Good payment history",
          "Strong customer base",
        ],
        negative: [
          "High credit utilization",
          "Limited business history",
        ],
      },
      recommendations: [
        "Reduce credit utilization below 50%",
        "Maintain consistent payment patterns",
        "Expand customer base",
      ],
      lastUpdated: new Date().toISOString(),
    }
  },

  applyForMicroloan: async (application: Omit<MicroloanApplication, "id" | "status" | "creditScore" | "appliedAt">): Promise<MicroloanApplication> => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const creditScore = await api.getCreditScore()

    // Simple approval logic based on credit score and amount
    const maxAmount = creditScore.overall > 80 ? 50000 : creditScore.overall > 60 ? 25000 : 10000
    const approved = application.amount <= maxAmount

    const interestRate = approved ? (creditScore.overall > 80 ? 12 : 15) : 0
    const monthlyPayment = approved ? (application.amount * (1 + interestRate / 100)) / application.term : 0

    return {
      id: `loan-${Date.now()}`,
      ...application,
      status: approved ? "approved" : "rejected",
      creditScore: creditScore.overall,
      approvedAmount: approved ? application.amount : undefined,
      interestRate: approved ? interestRate : undefined,
      monthlyPayment: approved ? monthlyPayment : undefined,
      appliedAt: new Date().toISOString(),
    }
  },

  getMicroloanApplications: async (): Promise<MicroloanApplication[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return [
      {
        id: "loan-001",
        amount: 25000,
        purpose: "Inventory expansion",
        term: 12,
        status: "approved",
        creditScore: 85,
        approvedAmount: 25000,
        interestRate: 12,
        monthlyPayment: 2250,
        appliedAt: "2024-01-15T10:00:00Z",
      },
    ]
  },
}
