"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BUSINESS_TYPES } from "@/lib/types"
import { authUtils } from "@/lib/auth"
import { Building2 } from "lucide-react"

export default function SelectBusinessPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | null>(null)

  useEffect(() => {
    // Redirect if not authenticated
    if (!authUtils.isAuthenticated()) {
      router.push("/login")
      return
    }

    // Redirect if business type already selected
    const user = authUtils.getUser()
    if (user?.businessType) {
      router.push("/dashboard")
    }
  }, [router])

  const handleSelectBusiness = (businessTypeId: string) => {
    setSelectedType(businessTypeId)
  }

  const handleContinue = () => {
    if (selectedType) {
      authUtils.updateUser({ businessType: selectedType })
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-balance">Select Your Business Type</h1>
          <p className="text-muted-foreground text-pretty">
            Choose the type of business you run to customize your experience
          </p>
        </div>

        {/* Business Type Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {BUSINESS_TYPES.map((business) => (
            <Card
              key={business.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                selectedType === business.id ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => handleSelectBusiness(business.id)}
            >
              <CardHeader>
                <div className="text-4xl mb-2">{business.icon}</div>
                <CardTitle className="text-lg">{business.name}</CardTitle>
                <CardDescription className="text-sm">{business.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Categories:</p>
                  <p className="line-clamp-2">{business.categories.slice(0, 3).join(", ")}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <Button size="lg" onClick={handleContinue} disabled={!selectedType}>
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
