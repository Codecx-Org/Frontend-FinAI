"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  })

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const resolvedParams = await params
        const productData = await api.getProduct(resolvedParams.id)
        setProduct(productData)
        setEditForm({
          name: productData.name,
          description: productData.description,
          price: productData.price.toString(),
          category: productData.category,
          image: productData.image,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load product details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [params, toast])

  const handleEdit = async () => {
    if (!product) return

    setIsUpdating(true)
    try {
      const resolvedParams = await params
      await api.updateProduct(resolvedParams.id, {
        name: editForm.name,
        description: editForm.description,
        price: parseFloat(editForm.price),
        category: editForm.category,
        image: editForm.image,
      })

      // Update local state
      setProduct({
        ...product,
        name: editForm.name,
        description: editForm.description,
        price: parseFloat(editForm.price),
        category: editForm.category,
        image: editForm.image,
      })

      setIsEditOpen(false)
      toast({
        title: "Product updated",
        description: "Product information has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update product information",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const resolvedParams = await params
      await api.deleteProduct(resolvedParams.id)
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
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>Update product information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    disabled={isUpdating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    disabled={isUpdating}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Price (KSH)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      disabled={isUpdating}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Input
                      id="edit-category"
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      disabled={isUpdating}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-image">Product Code</Label>
                  <Input
                    id="edit-image"
                    value={editForm.image}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value.toUpperCase().slice(0, 3) })}
                    disabled={isUpdating}
                    maxLength={3}
                    placeholder="e.g., CF, PF, FM"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleEdit} disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update Product"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isUpdating}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                <div className="aspect-video relative overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-6xl font-bold text-primary bg-background/80 rounded-full w-24 h-24 flex items-center justify-center">
                    {product.image}
                  </div>
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
