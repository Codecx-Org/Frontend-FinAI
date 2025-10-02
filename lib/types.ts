// Core TypeScript interfaces for the application

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  businessType?: string
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  unit?: string
  stock: number
  category: string
  image: string
  variants?: ProductVariant[]
  createdAt: string
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  stock: number
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  group: "vip" | "regular" | "new"
  createdAt: string
}

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  lowStockItems: number
  revenueChange: number
  ordersChange: number
  customersChange: number
}

export interface SalesData {
  date: string
  revenue: number
  orders: number
}

export interface CartItem {
  productId: string
  productName: string
  price: number
  quantity: number
  image: string
}

export interface AIMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface BusinessType {
  id: string
  name: string
  description: string
  icon: string
  categories: string[]
}

export const BUSINESS_TYPES: BusinessType[] = [
  {
    id: "animal-feeds",
    name: "Animal Feeds",
    description: "Livestock and pet nutrition products",
    icon: "🐄",
    categories: ["Cattle Feed", "Poultry Feed", "Pet Food", "Fish Feed", "Supplements", "Minerals"],
  },
  {
    id: "retail",
    name: "Retail Store",
    description: "General merchandise and consumer goods",
    icon: "🏪",
    categories: ["Electronics", "Clothing", "Home & Garden", "Sports", "Toys", "Books"],
  },
  {
    id: "restaurant",
    name: "Restaurant",
    description: "Food service and catering",
    icon: "🍽️",
    categories: ["Appetizers", "Main Course", "Desserts", "Beverages", "Specials"],
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    description: "Medical supplies and pharmaceuticals",
    icon: "💊",
    categories: ["Prescription", "OTC Medicine", "Vitamins", "First Aid", "Personal Care"],
  },
  {
    id: "hardware",
    name: "Hardware Store",
    description: "Construction and home improvement",
    icon: "🔨",
    categories: ["Tools", "Building Materials", "Plumbing", "Electrical", "Paint", "Hardware"],
  },
  {
    id: "grocery",
    name: "Grocery Store",
    description: "Food and household essentials",
    icon: "🛒",
    categories: ["Fresh Produce", "Dairy", "Meat", "Bakery", "Beverages", "Household"],
  },
]
