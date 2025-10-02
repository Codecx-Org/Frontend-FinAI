"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Product } from "@/lib/types"

interface LowStockAlertProps {
  products: Product[]
}

export function LowStockAlert({ products }: LowStockAlertProps) {
  const lowStockProducts = products.filter((p) => p.stock < 10)

  if (lowStockProducts.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Low Stock Alert
        </CardTitle>
        <CardDescription>{lowStockProducts.length} products need restocking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lowStockProducts.slice(0, 3).map((product) => (
            <div key={product.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">Only {product.stock} units remaining</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/products/${product.id}`}>Restock</Link>
              </Button>
            </div>
          ))}
          {lowStockProducts.length > 3 && (
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/products">View all low stock items</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
