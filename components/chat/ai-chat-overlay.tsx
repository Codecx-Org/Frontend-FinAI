"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, Bot, User } from "lucide-react"
import { api } from "@/lib/api"
import type { AIMessage } from "@/lib/types"
import { cn } from "@/lib/utils"

interface AIChatOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function AIChatOverlay({ isOpen, onClose }: AIChatOverlayProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI financial assistant. I can help you with insights about your business, answer questions about your data, and provide recommendations. How can I assist you today?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await api.sendChatMessage(input)
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm having trouble processing your request right now. Please try again.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const quickPrompts = [
    "Show me my top selling products",
    "What's my cash flow status?",
    "Which customers should I focus on?",
    "Give me inventory recommendations",
  ]

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">AI Assistant</h2>
              <p className="text-xs text-muted-foreground">Always here to help</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="h-[calc(100vh-140px)]" ref={scrollRef}>
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickPrompt(prompt)}
                className="text-xs"
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border bg-card p-4">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your business..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
