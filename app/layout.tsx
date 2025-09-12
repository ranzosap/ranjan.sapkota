import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Open_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StructuredData } from "@/components/structured-data"
import { AdminFloatingButton } from "@/components/admin-floating-button"
import { AuthProvider } from "@/lib/auth-context"
import { generatePersonSchema } from "@/lib/seo"
import { Toaster } from "@/components/toaster"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { Suspense } from "react"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600"],
})

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ranzosap.github.io/ranjan.sapkota"

export const metadata: Metadata = {
  title: {
    default: "Ranjan Sapkota - Agricultural Robotics Researcher",
    template: "%s | Ranjan Sapkota",
  },
  description:
    "PhD researcher in Agricultural Robotics and AI Automation at Cornell University. Specializing in robotic pollination, precision agriculture, and computer vision for sustainable farming.",
  keywords: [
    "agricultural robotics",
    "precision agriculture",
    "computer vision",
    "robotic pollination",
    "AI automation",
    "machine learning",
    "YOLO",
    "Cornell University",
    "sustainable farming",
  ],
  authors: [{ name: "Ranjan Sapkota", url: baseUrl }],
  creator: "Ranjan Sapkota",
  publisher: "Ranjan Sapkota",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "RSS Feed" }],
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Ranjan Sapkota - Agricultural Robotics",
    title: "Ranjan Sapkota - Agricultural Robotics Researcher",
    description:
      "PhD researcher in Agricultural Robotics and AI Automation at Cornell University. Specializing in robotic pollination, precision agriculture, and computer vision for sustainable farming.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ranjan Sapkota - Agricultural Robotics Researcher",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ranjan Sapkota - Agricultural Robotics Researcher",
    description:
      "PhD researcher in Agricultural Robotics and AI Automation at Cornell University. Specializing in robotic pollination, precision agriculture, and computer vision for sustainable farming.",
    images: ["/og-image.jpg"],
    creator: "@ranjan_sapkota",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const personSchema = generatePersonSchema(baseUrl)

  return (
    <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${openSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <StructuredData data={personSchema} />
      </head>
      <body className="min-h-screen bg-background font-[var(--font-body)] antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <AnalyticsTracker />
            <Suspense fallback={<div>Loading...</div>}>
              <div className="relative flex min-h-screen flex-col">
                <div className="mx-auto w-full max-w-[1600px]">
                  <Header />
                 <main className="flex flex-1 py-0 px-5 items-center justify-center">{children}</main>
                  <Footer />
                </div>
                <AdminFloatingButton />
              </div>
            </Suspense>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
