"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X } from "lucide-react"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Publications", href: "/publications" },
  { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
  // { name: "Teaching", href: "/teaching" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg shadow-lg rounded-bl-[25px] rounded-br-[25px]">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-[var(--font-heading)] font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Ranjan Sapkota
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-all duration-300 hover:scale-105 px-2 py-1 rounded-md hover:bg-primary/10"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden backdrop-blur-sm bg-card/50 hover:bg-card/80 text-foreground hover:text-foreground transition-all duration-300 border border-white/20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/30 backdrop-blur-lg bg-background/95 absolute left-0 right-0 shadow-lg">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-3 px-4 text-sm font-medium text-foreground hover:text-primary transition-all duration-300 hover:bg-primary/10 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
