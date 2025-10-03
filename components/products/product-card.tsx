"use client"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Edit, Trash2, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  onProductUpdate?: () => void
}

export function ProductCard({ product, onProductUpdate }: ProductCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const isLowStock = product.stock < 10

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this product?")) return

    setIsDeleting(true)
    try {
      await api.deleteProduct(product.id)
      toast({
        title: "Product deleted",
        description: "Product has been removed from your catalog",
      })
      onProductUpdate?.()
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Could not delete product",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/products/${product.id}`)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative overflow-hidden bg-muted" onClick={() => router.push(`/products/${product.id}`)}>
        {/* Display text code in a styled badge instead of trying to load as image */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl font-bold text-primary bg-background/80 rounded-full w-24 h-24 flex items-center justify-center">
            {product.image}
          </div>
        </div>
        {isLowStock && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Low Stock
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 flex-1">{product.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} disabled={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold">
            KSH {product.price.toFixed(2)}
            {product.unit && <span className="text-sm font-normal text-muted-foreground">/{product.unit}</span>}
          </div>
          <Badge variant={product.stock > 0 ? "default" : "destructive"}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>{product.stock} in stock</span>
          <span>Code: {product.image}</span>
        </div>

        <div className="mt-2">
          <Badge variant="outline">{product.category}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
