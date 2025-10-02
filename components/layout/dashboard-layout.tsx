"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import { MobileNav } from "./mobile-nav"
import { AIChatButton } from "@/components/chat/ai-chat-button"
import { authUtils } from "@/lib/auth"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()

  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      router.push("/login")
      return
    }

    const user = authUtils.getUser()
    if (!user?.businessType) {
      router.push("/select-business")
    }
  }, [router])

  if (!authUtils.isAuthenticated()) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-64">
        <TopBar />
        <main className="p-4 md:p-6 pb-20 md:pb-6">{children}</main>
      </div>
      <MobileNav />
      <AIChatButton />
    </div>
  )
}
