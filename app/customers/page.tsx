"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CustomerGroupsTabs } from "@/components/customers/customer-groups-tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import { api } from "@/lib/api"
import { useState, useEffect } from "react"
import type { Customer } from "@/lib/types"
import Link from "next/link"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await api.getCustomers()
        setCustomers(data)
      } catch (error) {
        console.error("Failed to load customers:", error)
      } finally {
        setLoading(false)
      }
    }
    loadCustomers()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading customers...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-muted-foreground">Manage your customer relationships</p>
          </div>
          <Button asChild>
            <Link href="/customers/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search customers..." className="pl-10" />
        </div>

        {/* Customer Groups */}
        {customers.length > 0 ? (
          <CustomerGroupsTabs customers={customers} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No customers yet</p>
            <p className="text-sm text-muted-foreground">Add your first customer to get started</p>
            <Button asChild className="mt-4">
              <Link href="/customers/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Link>
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
