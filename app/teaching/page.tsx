import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Calendar, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Teaching - Dr. Academic",
  description: "Courses, teaching philosophy, and educational contributions by Dr. Academic.",
}

export default function TeachingPage() {
  const currentCourses = [
    {
      code: "CS 229",
      title: "Machine Learning",
      level: "Graduate",
      semester: "Fall 2024",
      students: 120,
      description: "Comprehensive introduction to machine learning algorithms, theory, and applications.",
    },
    {
      code: "CS 188",
      title: "Introduction to Artificial Intelligence",
      level: "Undergraduate",
      semester: "Fall 2024",
      students: 200,
      description: "Foundational concepts in AI including search, logic, planning, and learning.",
    },
  ]

  const pastCourses = [
    {
      code: "CS 330",
      title: "Deep Multi-Task Learning",
      level: "Graduate",
      semester: "Spring 2024",
      students: 80,
    },
    {
      code: "CS 231N",
      title: "Convolutional Neural Networks",
      level: "Graduate",
      semester: "Winter 2024",
      students: 150,
    },
    {
      code: "CS 106A",
      title: "Programming Methodology",
      level: "Undergraduate",
      semester: "Fall 2023",
      students: 300,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Teaching</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Passionate about education and mentoring the next generation of computer scientists and AI researchers.
          </p>
        </div>

        {/* Teaching Philosophy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Teaching Philosophy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              I believe in creating an inclusive and engaging learning environment where students are encouraged to
              think critically, ask questions, and explore beyond the curriculum. My teaching approach combines
              theoretical foundations with hands-on practical experience.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              I emphasize the importance of understanding not just the "how" but also the "why" behind algorithms and
              techniques. This helps students develop problem-solving skills that extend beyond specific technologies or
              frameworks.
            </p>
          </CardContent>
        </Card>

        {/* Current Courses */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Current Courses (Fall 2024)</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {currentCourses.map((course) => (
              <Card key={course.code} className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {course.code}: {course.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{course.level}</Badge>
                        <Badge variant="secondary">{course.semester}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{course.semester}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Course Materials
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Past Courses */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Past Courses</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pastCourses.map((course) => (
              <Card key={`${course.code}-${course.semester}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {course.code}: {course.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {course.level}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {course.semester}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{course.students} students</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Student Mentoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Mentoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">15</div>
                <div className="text-sm text-muted-foreground">PhD Students Supervised</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">45</div>
                <div className="text-sm text-muted-foreground">Master's Students Advised</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">120</div>
                <div className="text-sm text-muted-foreground">Undergraduate Researchers</div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              I am committed to mentoring students at all levels, from undergraduate researchers to PhD candidates. My
              mentoring approach focuses on developing independent thinking, research skills, and professional growth.
            </p>
          </CardContent>
        </Card>

        {/* Teaching Awards */}
        <Card>
          <CardHeader>
            <CardTitle>Teaching Recognition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-semibold">Outstanding Teaching Award</h3>
                  <p className="text-sm text-muted-foreground">University of Excellence, College of Engineering</p>
                </div>
                <Badge variant="secondary">2023</Badge>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-semibold">Best Graduate Course Award</h3>
                  <p className="text-sm text-muted-foreground">CS 229: Machine Learning</p>
                </div>
                <Badge variant="secondary">2022</Badge>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-semibold">Student Choice Teaching Award</h3>
                  <p className="text-sm text-muted-foreground">Voted by undergraduate students</p>
                </div>
                <Badge variant="secondary">2021</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
