"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Product } from "@/lib/types"

interface ProductFormProps {
  product?: Product
  mode: "create" | "edit"
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    unit: product?.unit || "unit",
    stock: product?.stock || 0,
    category: product?.category || "",
    image: product?.image || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (mode === "create") {
        await api.createProduct(formData)
        toast({
          title: "Product created",
          description: "Your product has been added to the catalog",
        })
      } else if (product) {
        await api.updateProduct(product.id, formData)
        toast({
          title: "Product updated",
          description: "Your changes have been saved",
        })
      }
      router.push("/products")
    } catch (error) {
      toast({
        title: "Error",
        description: mode === "create" ? "Could not create product" : "Could not update product",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "Create New Product" : "Edit Product"}</CardTitle>
          <CardDescription>
            {mode === "create" ? "Add a new product to your catalog" : "Update product information"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter product description"
              rows={4}
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price (KSH)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange("price", Number.parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => handleChange("unit", e.target.value)}
                placeholder="e.g., kg, bag, liter, piece"
                required
              />
              <p className="text-sm text-muted-foreground">e.g., kg, bag, liter, piece, box</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleChange("stock", Number.parseInt(e.target.value) || 0)}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="e.g., Electronics, Accessories"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => handleChange("image", e.target.value)}
              placeholder="/placeholder.svg?height=400&width=600"
              required
            />
            <p className="text-sm text-muted-foreground">Enter a URL or use a placeholder image</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/products")}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
