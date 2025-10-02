"use client"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/router"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const isLowStock = product.stock < 10

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => router.push(`/products/${product.id}`)}
    >
      <div className="aspect-square relative overflow-hidden bg-muted">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isLowStock && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Low Stock
          </Badge>
        )}
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1">{product.name}</CardTitle>
          <Badge variant={product.stock > 0 ? "default" : "destructive"}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            KSH {product.price.toFixed(2)}
            {product.unit && <span className="text-sm font-normal text-muted-foreground">/{product.unit}</span>}
          </div>
          <div className="text-sm text-muted-foreground">{product.stock} in stock</div>
        </div>
        <div className="mt-2">
          <Badge variant="outline">{product.category}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
