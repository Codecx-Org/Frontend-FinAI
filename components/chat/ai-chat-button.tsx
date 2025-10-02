"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import { AIChatOverlay } from "./ai-chat-overlay"

export function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        size="lg"
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 rounded-full w-14 h-14 shadow-lg z-40"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="w-6 h-6" />
      </Button>

      <AIChatOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
