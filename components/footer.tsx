import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/30 backdrop-blur-lg bg-background/80 mt-auto">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-[var(--font-heading)] font-black mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Ranjan Sapkota
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              PhD researcher in Agricultural Robotics and AI Automation at Cornell University, specializing in robotic
              pollination, precision agriculture, and computer vision for sustainable farming.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-[var(--font-heading)] font-semibold mb-4 text-foreground">Quick Links</h4>
            <nav className="space-y-3">
              <Link
                href="/publications"
                className="block text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1"
              >
                Publications
              </Link>
              <Link
                href="/projects"
                className="block text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1"
              >
                Projects
              </Link>
              <Link
                href="/about"
                className="block text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1"
              >
                About
              </Link>
              {/* <Link
                href="/teaching"
                className="block text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1"
              >
                Teaching
              </Link> */}
            </nav>
          </div>

          <div>
            <h4 className="text-sm font-[var(--font-heading)] font-semibold mb-4 text-foreground">Connect</h4>
            <nav className="space-y-3">
              <Link
                href="/contact"
                className="block text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1"
              >
                Contact
              </Link>
              <Link
                href="#"
                className="block text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1"
              >
                ORCID
              </Link>
              <Link
                href="#"
                className="block text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1"
              >
                Google Scholar
              </Link>
              <Link
                href="#"
                className="block text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1"
              >
                ResearchGate
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 lg:mt-12 pt-8 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Ranjan Sapkota. All rights reserved. Built by Suraj Chaudhary
          </p>
        </div>
      </div>
    </footer>
  )
}
