"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Users, Award } from "lucide-react"
import { getPublishedArticlesWithSync, getPublishedArticles, type Article } from "@/lib/mock-data"

function useAnimatedCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const startCount = 0

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(startCount + (end - startCount) * easeOutQuart)

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration, isVisible])

  return { count, setIsVisible }
}

export default function HomePage() {
  const observerRef = useRef<IntersectionObserver | null>(null)

   const publicationsCounter = useAnimatedCounter(30)
  const citationsCounter = useAnimatedCounter(1000)
  const awardsCounter = useAnimatedCounter(8)
  const [latestArticles, setLatestArticles] = useState<Article[]>([])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate")

            if (entry.target.id === "stats-section") {
              publicationsCounter.setIsVisible(true)
              citationsCounter.setIsVisible(true)
              awardsCounter.setIsVisible(true)
            }
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".scroll-animate")
    elements.forEach((el) => observerRef.current?.observe(el))

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [publicationsCounter, citationsCounter, awardsCounter])

  useEffect(() => {
    const load = async () => {
      try {
        const articles = await getPublishedArticlesWithSync()
        const sorted = articles
          .slice()
          .sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year
            const am = a.month || 12
            const bm = b.month || 12
            return bm - am
          })
        setLatestArticles(sorted.slice(0, 4))
      } catch {
        const fallback = getPublishedArticles()
        const sorted = fallback
          .slice()
          .sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year
            const am = a.month || 12
            const bm = b.month || 12
            return bm - am
          })
        setLatestArticles(sorted.slice(0, 4))
      }
    }
    load()
  }, [])

  return (
    <div className="container py-8 md:py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-[var(--font-heading)] font-black tracking-tight animate-fade-in-up">
            Agricultural Robotics & AI Innovation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up-delay-1">
            Advancing sustainable agriculture through cutting-edge robotics, computer vision, and AI automation for
            precision farming and orchard management.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up-delay-2">
          <Button
            asChild
            size="lg"
            className="backdrop-blur-md bg-primary/80 hover:bg-primary text-primary-foreground hover:text-primary-foreground hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <Link href="/publications">
              Discover My Research <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="backdrop-blur-md bg-card/70 hover:bg-card text-foreground hover:text-foreground hover:scale-105 transition-all duration-300 shadow-lg border-border/30"
          >
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Research Interests */}
      <section className="space-y-8 scroll-animate">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-[var(--font-heading)] font-black">Research Interests</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My research focuses on developing intelligent robotic systems for sustainable agricultural practices.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {[
            "Agricultural Engineering",
            "Artificial Intelligence",
            "Multimodal Large Language Models",
            "Agricultural Robotics",
            "Agricultural Automation",
            "Computer Vision",
            "Machine Learning",
            "Precision Agriculture",
          ].map((interest, index) => (
            <Badge
              key={interest}
              variant="secondary"
              className="text-sm backdrop-blur-md bg-secondary/70 hover:bg-secondary/90 transition-all duration-300 shadow-md border border-border/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {interest}
            </Badge>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section id="stats-section" className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-animate">
        <Card className="text-center backdrop-blur-md bg-card/70 border-border/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardHeader>
            <BookOpen className="h-8 w-8 mx-auto text-primary" />
            <CardTitle className="text-2xl font-[var(--font-heading)]">{publicationsCounter.count}+</CardTitle>
            <CardDescription>Publications</CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center backdrop-blur-md bg-card/70 border-border/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardHeader>
            <Users className="h-8 w-8 mx-auto text-primary" />
            <CardTitle className="text-2xl font-[var(--font-heading)]">{citationsCounter.count}+</CardTitle>
            <CardDescription>Citations</CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center backdrop-blur-md bg-card/70 border-border/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardHeader>
            <Award className="h-8 w-8 mx-auto text-primary" />
            <CardTitle className="text-2xl font-[var(--font-heading)]">{awardsCounter.count}</CardTitle>
            <CardDescription>Awards</CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Featured Publications */}
      <section className="space-y-8 scroll-animate">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-[var(--font-heading)] font-black">Featured Publications</h2>
          <p className="text-muted-foreground">Recent highlights from my research work</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestArticles.map((a) => (
            <Card key={a.slug} className="backdrop-blur-md bg-card/70 border-border/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-[var(--font-heading)]">
                  <Link href={a.url}>{a.title}</Link>
                </CardTitle>
                <CardDescription>{a.publication_venue} • {a.year}</CardDescription>
              </CardHeader>
              <CardContent>
                {a.abstract && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-4">{a.abstract}</p>
                )}
                {a.tags && a.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {a.tags.slice(0,3).map((t) => (
                      <Badge key={t} variant="outline" className="backdrop-blur-sm bg-background/50">{t}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            asChild
            className="backdrop-blur-md bg-card/70 hover:bg-card text-foreground hover:text-foreground hover:scale-105 transition-all duration-300 shadow-lg border-border/30"
          >
            <Link href="/publications">
              View All Publications <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
