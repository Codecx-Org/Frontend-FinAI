"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerCard } from "./customer-card"
import type { Customer } from "@/lib/types"

interface CustomerGroupsTabsProps {
  customers: Customer[]
}

export function CustomerGroupsTabs({ customers }: CustomerGroupsTabsProps) {
  const vipCustomers = customers.filter((c) => c.group === "vip")
  const regularCustomers = customers.filter((c) => c.group === "regular")
  const newCustomers = customers.filter((c) => c.group === "new")

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all">All ({customers.length})</TabsTrigger>
        <TabsTrigger value="vip">VIP ({vipCustomers.length})</TabsTrigger>
        <TabsTrigger value="regular">Regular ({regularCustomers.length})</TabsTrigger>
        <TabsTrigger value="new">New ({newCustomers.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4 mt-6">
        {customers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </TabsContent>

      <TabsContent value="vip" className="space-y-4 mt-6">
        {vipCustomers.length > 0 ? (
          vipCustomers.map((customer) => <CustomerCard key={customer.id} customer={customer} />)
        ) : (
          <p className="text-center text-muted-foreground py-8">No VIP customers yet</p>
        )}
      </TabsContent>

      <TabsContent value="regular" className="space-y-4 mt-6">
        {regularCustomers.length > 0 ? (
          regularCustomers.map((customer) => <CustomerCard key={customer.id} customer={customer} />)
        ) : (
          <p className="text-center text-muted-foreground py-8">No regular customers yet</p>
        )}
      </TabsContent>

      <TabsContent value="new" className="space-y-4 mt-6">
        {newCustomers.length > 0 ? (
          newCustomers.map((customer) => <CustomerCard key={customer.id} customer={customer} />)
        ) : (
          <p className="text-center text-muted-foreground py-8">No new customers yet</p>
        )}
      </TabsContent>
    </Tabs>
  )
}
