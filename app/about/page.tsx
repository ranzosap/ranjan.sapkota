import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, GraduationCap, Award } from "lucide-react"

export const metadata: Metadata = {
  title: "About - Ranjan Sapkota",
  description:
    "Learn more about Ranjan Sapkota's background, education, and research interests in agricultural robotics and AI automation.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About Me</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Graduate Researcher in Biological and Environmental Engineering focusing on Mechatronics and Automation for
            sustainable agriculture.
          </p>
        </div>

        {/* Bio Section */}
        <Card className="backdrop-blur-md bg-card/70 border-border/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Biography
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              I am a passionate researcher dedicated to advancing sustainable agriculture through cutting-edge robotics,
              computer vision, and AI automation. My work focuses on developing intelligent robotic systems for
              precision farming and orchard management, with particular expertise in agricultural mechanization and
              automation.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Currently pursuing my PhD at Cornell University after transferring from Washington State University, I
              have extensive experience in designing, integrating, and testing robotic agricultural solutions including
              robotic pollination, pruning, and fruit thinning in commercial orchard environments. My research has
              contributed to significant chemical usage reduction and improved efficiency in agricultural practices.
            </p>
          </CardContent>
        </Card>

        {/* Education Section */}
        <Card className="backdrop-blur-md bg-card/70 border-border/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-l-2 border-primary pl-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="font-semibold">Ph.D. in Biological & Environmental Engineering</h3>
                  <Badge variant="secondary" className="w-fit">
                    2025-2026
                  </Badge>
                </div>
                <p className="text-muted-foreground">Cornell University, Ithaca, NY, USA</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Expected Graduation: December 2026, Transferred after 3 years of Ph.D. study
                </p>
              </div>

              <div className="border-l-2 border-muted pl-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="font-semibold">Ph.D. in Biological and Agricultural Engineering</h3>
                  <Badge variant="outline" className="w-fit">
                    2022-2025
                  </Badge>
                </div>
                <p className="text-muted-foreground">Washington State University, Prosser, WA, USA</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Completed 3 years of doctoral research and coursework before transferring to Cornell
                </p>
              </div>

              <div className="border-l-2 border-muted pl-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="font-semibold">MS in Agricultural and Biological Engineering</h3>
                  <Badge variant="outline" className="w-fit">
                    2022
                  </Badge>
                </div>
                <p className="text-muted-foreground">North Dakota State University, Fargo, ND, USA</p>
              </div>

              <div className="border-l-2 border-muted pl-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="font-semibold">B. Tech in Electrical and Electronics Engineering</h3>
                  <Badge variant="outline" className="w-fit">
                    2019
                  </Badge>
                </div>
                <p className="text-muted-foreground">Uttarakhand Technical University, Uttarakhand, India</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Position */}
        <Card className="backdrop-blur-md bg-card/70 border-border/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Current Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-semibold">Graduate Research Assistant</h3>
              <p className="text-muted-foreground">Biological and Environmental Engineering</p>
              <p className="text-muted-foreground">Cornell University, Ithaca, NY</p>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">2025 - Present</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Design, Integration, and testing of robotic agricultural solutions including Robotic Pollination,
                Pruning, and Fruit thinning in commercial orchard environments.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Research Interests */}
        <Card className="backdrop-blur-md bg-card/70 border-border/30 shadow-lg">
          <CardHeader>
            <CardTitle>Research Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                "Agricultural Engineering",
                "Artificial Intelligence",
                "Multimodal Large Language Models",
                "Agricultural Robotics",
                "Agricultural Automation",
                "Computer Vision",
                "Machine Learning",
                "Precision Agriculture",
              ].map((interest) => (
                <Badge key={interest} variant="secondary" className="backdrop-blur-sm bg-secondary/70">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Awards */}
        <Card className="backdrop-blur-md bg-card/70 border-border/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Selected Awards & Honors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-semibold">Outstanding Reviewer</h3>
                  <p className="text-sm text-muted-foreground">ASABE Technical Communities</p>
                </div>
                <Badge variant="secondary">2025</Badge>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-semibold">Arnie and Marta Kegel Fellowship</h3>
                  <p className="text-sm text-muted-foreground">Washington State University</p>
                </div>
                <Badge variant="secondary">2024</Badge>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-semibold">Three Minute Thesis Winner</h3>
                  <p className="text-sm text-muted-foreground">Department of Biological Systems Engineering, WSU</p>
                </div>
                <Badge variant="secondary">2024</Badge>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-semibold">Sustainability Top 100 Article</h3>
                  <p className="text-sm text-muted-foreground">Scientific Reports, Nature Portfolio</p>
                </div>
                <Badge variant="secondary">2023</Badge>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-semibold">ASABE 1-Minute Video Competition</h3>
                  <p className="text-sm text-muted-foreground">Fans Favorite</p>
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
