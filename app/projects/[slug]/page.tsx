import { mockProjects } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import type { Metadata } from "next/metadata"
import { MdxContent } from "@/components/mdx-content"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Users, DollarSign, Github, ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { StructuredData } from "@/components/structured-data"

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return mockProjects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = mockProjects.find((project) => project.slug === params.slug)

  if (!project) {
    return {}
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      publishedTime: project.startDate,
      tags: project.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
    },
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = mockProjects.find((project) => project.slug === params.slug)

  if (!project) {
    notFound()
  }

  const statusColors = {
    "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "on-hold": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ResearchProject",
    name: project.title,
    description: project.description,
    startDate: project.startDate,
    endDate: project.endDate,
    keywords: project.tags.join(", "),
    author: {
      "@type": "Person",
      name: "Your Name",
    },
  }

  return (
    <>
      <StructuredData data={structuredData} />
      <article className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="mb-6 md:mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <h1 className="text-2xl md:text-4xl font-bold">{project.title}</h1>
            <Badge
              variant="secondary"
              className={`${statusColors[project.status as keyof typeof statusColors]} text-xs md:text-sm whitespace-nowrap`}
            >
              {project.status.replace("-", " ")}
            </Badge>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground mb-4 md:mb-6">{project.description}</p>

          {/* Project metadata */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 md:mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 flex-shrink-0" />
              <span>
                <strong>Timeline:</strong> {new Date(project.startDate).toLocaleDateString()} -{" "}
                {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Ongoing"}
              </span>
            </div>

            {project.collaborators && project.collaborators.length > 0 && (
              <div className="flex items-start gap-2 text-sm">
                <Users className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Collaborators:</strong> {project.collaborators.join(", ")}
                </span>
              </div>
            )}

            {project.funding && project.funding.length > 0 && (
              <div className="flex items-start gap-2 text-sm lg:col-span-2">
                <DollarSign className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Funding:</strong> {project.funding.join(", ")}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs md:text-sm">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8">
            {project.github && (
              <Button variant="outline" size="sm" asChild className="text-xs md:text-sm bg-transparent">
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">View Code</span>
                  <span className="sm:hidden">Code</span>
                </a>
              </Button>
            )}
            {project.website && (
              <Button variant="outline" size="sm" asChild className="text-xs md:text-sm bg-transparent">
                <a href={project.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Visit Website</span>
                  <span className="sm:hidden">Website</span>
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none prose-sm md:prose-base">
          <MdxContent code={project.body.code} />
        </div>
      </article>
    </>
  )
}
