"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StockAdjusterProps {
  productId: string
  currentStock: number
  onStockChange?: (newStock: number) => void
}

export function StockAdjuster({ productId, currentStock, onStockChange }: StockAdjusterProps) {
  const [stock, setStock] = useState(currentStock)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleAdjust = (amount: number) => {
    const newStock = Math.max(0, stock + amount)
    setStock(newStock)
  }

  const handleSave = async () => {
    setIsUpdating(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      onStockChange?.(stock)
      toast({
        title: "Stock updated",
        description: `Stock level changed to ${stock} units`,
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update stock level",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Adjust Stock Level</Label>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => handleAdjust(-1)} disabled={stock === 0 || isUpdating}>
            <Minus className="w-4 h-4" />
          </Button>
          <Input
            type="number"
            value={stock}
            onChange={(e) => setStock(Math.max(0, Number.parseInt(e.target.value) || 0))}
            className="text-center"
            disabled={isUpdating}
          />
          <Button variant="outline" size="icon" onClick={() => handleAdjust(1)} disabled={isUpdating}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <Button onClick={handleSave} disabled={stock === currentStock || isUpdating} className="w-full">
        {isUpdating ? "Updating..." : "Save Changes"}
      </Button>
    </div>
  )
}
