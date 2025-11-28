"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home, ArrowLeft, Lightbulb } from "lucide-react"

export default function NotFound() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="text-center space-y-6">
          <div className="text-9xl font-black text-primary/20">404</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 bg-secondary/10 rounded-full blur-3xl -bottom-48 -right-48"></div>
      </div>

     
      <Card className="max-w-md w-full shadow-lg glass backdrop-blur-md border-border/30">
        <div className="p-8 space-y-6">
          <div className="relative text-center">
            <div className="text-9xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse">
              404
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl -z-10"></div>
          </div>


          <div className="space-y-3 text-center">
            <h2 className="text-2xl font-bold text-foreground">Page Not Found</h2>
            <p className="text-muted-foreground leading-relaxed">
              Oops! The page you're looking for doesn't exist.
            </p>
          </div>

        
          <div className="flex flex-col gap-3 pt-4">
            <Button
              asChild
              className="w-full bg-primary/80 hover:bg-primary text-primary-foreground hover:scale-105 transition-all duration-300"
            >
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full backdrop-blur-sm bg-card/50 hover:bg-card border-border/30 hover:scale-105 transition-all duration-300"
            >
              <Link href="/publications" className="flex items-center justify-center gap-2">
                <Lightbulb className="w-4 h-4" />
                View Publications
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full backdrop-blur-sm bg-card/50 hover:bg-card border-border/30 hover:scale-105 transition-all duration-300"
            >
              <Link href="/about" className="flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                About Me
              </Link>
            </Button>
          </div>

         
        </div>
      </Card>

      <div className="absolute top-1/4 left-10 w-2 h-2 bg-primary rounded-full opacity-50 animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-10 w-3 h-3 bg-secondary rounded-full opacity-50 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      ></div>
      <div
        className="absolute top-1/2 right-1/4 w-1 h-1 bg-primary rounded-full opacity-30 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
    </div>
  )
}
