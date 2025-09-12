import { getAllProjects } from "@/lib/mock-data"
import { ProjectCard } from "@/components/project-card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Research Projects",
  description: "Explore my current and completed research projects in machine learning, AI, and computer science.",
}

export default function ProjectsPage() {
  const allProjects = getAllProjects()

  const sortedProjects = allProjects.sort((a, b) => {
    // Sort by featured first, then by start date (newest first)
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })

  const featuredProjects = sortedProjects.filter((project) => project.featured)
  const otherProjects = sortedProjects.filter((project) => !project.featured)

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Research Projects</h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Explore my current and completed research projects spanning machine learning, distributed systems, and
          computational optimization.
        </p>
      </div>

      {featuredProjects.length > 0 && (
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Featured Projects</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}

      {otherProjects.length > 0 && (
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">All Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {otherProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
