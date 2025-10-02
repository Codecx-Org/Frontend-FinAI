import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Bot, ShoppingBag, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FinAI MSME</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-balance">
              Financial Intelligence for <span className="text-primary">Small Businesses</span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance leading-relaxed">
              Manage your e-commerce operations and gain financial insights with AI-powered assistance. Built for MSMEs
              who want to grow smarter.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href="/register">
                  Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">View Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">E-Commerce Management</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Manage products, orders, and inventory from a single dashboard
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Financial Insights</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Real-time analytics on sales, cash flow, and business performance
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">AI Assistant</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get intelligent recommendations and answers to your business questions
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Customer Management</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track customer behavior and build lasting relationships
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2025 FinAI MSME. Built for small businesses with big ambitions.</p>
        </div>
      </footer>
    </div>
  )
}
