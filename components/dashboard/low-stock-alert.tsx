"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Trash2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { useState } from "react"

interface LowStockAlertProps {
  products: Product[]
  onDeleteProduct?: (productId: string) => void
}

export function LowStockAlert({ products, onDeleteProduct }: LowStockAlertProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const lowStockProducts = products.filter((p) => p.stock < 10)

  const handleDelete = async (productId: string) => {
    setDeletingId(productId)
    try {
      if (onDeleteProduct) {
        await onDeleteProduct(productId)
      }
    } finally {
      setDeletingId(null)
    }
  }

  if (lowStockProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-green-500" />
            Stock Status
          </CardTitle>
          <CardDescription>All products are well stocked</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No low stock alerts at the moment</p>
          </div>
        </CardContent>
      </Card>
    )
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
          {lowStockProducts.slice(0, 5).map((product) => (
            <div key={product.id} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium">{product.name}</p>
                  <Badge 
                    variant={product.stock < 5 ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {product.stock < 5 ? "Critical" : "Low"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Only {product.stock} units remaining</span>
                  <span>•</span>
                  <span>KSH {product.price.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/products/${product.id}`}>Restock</Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      disabled={deletingId === product.id}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{product.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          {lowStockProducts.length > 5 && (
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/products">View all {lowStockProducts.length} low stock items</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}