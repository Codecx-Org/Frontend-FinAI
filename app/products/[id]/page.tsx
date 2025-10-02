"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StockAdjuster } from "@/components/products/stock-adjuster"
import { ArrowLeft, Edit, Trash2, Package, Tag } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api
      .getProduct(id)
      .then(setProduct)
      .catch(() => {
        toast({
          title: "Error",
          description: "Could not load product details",
          variant: "destructive",
        })
      })
      .finally(() => setIsLoading(false))
  }, [id, toast])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      await api.deleteProduct(id)
      toast({
        title: "Product deleted",
        description: "Product has been removed from your catalog",
      })
      router.push("/products")
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Could not delete product",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Product not found</p>
          <Button variant="outline" onClick={() => router.push("/products")} className="mt-4">
            Back to Products
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const isLowStock = product.stock < 10

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/products")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">{product.category}</p>
          </div>
          {isLowStock && <Badge variant="destructive">Low Stock</Badge>}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Product
          </Button>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Product Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-3xl">{product.name}</CardTitle>
                    <CardDescription>{product.category}</CardDescription>
                  </div>
                  <Badge variant={product.stock > 0 ? "default" : "destructive"} className="text-sm">
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="aspect-video relative overflow-hidden rounded-lg bg-muted">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">KSH {product.price.toFixed(2)}</span>
                    {product.unit && <span className="text-xl text-muted-foreground">per {product.unit}</span>}
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {product.stock} {product.unit || "units"} available
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span>{product.category}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {product.variants && product.variants.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Product Variants</CardTitle>
                  <CardDescription>Available variations of this product</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {product.variants.map((variant) => (
                      <div key={variant.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{variant.name}</p>
                          <p className="text-sm text-muted-foreground">{variant.stock} in stock</p>
                        </div>
                        <p className="font-semibold">KSH {variant.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Inventory Management */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>Manage stock levels</CardDescription>
              </CardHeader>
              <CardContent>
                <StockAdjuster
                  productId={product.id}
                  currentStock={product.stock}
                  onStockChange={(newStock) => setProduct({ ...product, stock: newStock })}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Product ID</p>
                  <p className="font-medium">{product.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(product.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
