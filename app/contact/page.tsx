"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, MapPin, Phone, Calendar, ExternalLink, Send, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    affiliation: "",
    subject: "",
    message: "",
  })
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // EmailJS integration - replace with your actual service details
      const emailData = {
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        affiliation: formData.affiliation,
        subject: formData.subject,
        message: formData.message,
        to_name: "Ranjan Sapkota",
      }

      // Simulate EmailJS send (replace with actual EmailJS implementation)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. I'll get back to you within 1-3 business days.",
      })

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        affiliation: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact me directly via email.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            I welcome collaborations, speaking opportunities, and discussions about agricultural robotics and AI
            automation research. Feel free to reach out through any of the channels below.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="backdrop-blur-md bg-card/70 border-border/30 shadow-lg">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">rs2672@cornell.edu</p>
                    <p className="text-sm text-muted-foreground">Primary contact method</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+123213123132321</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">
                      111 Wing Dr
                      <br />
                      Ithaca, NY 14853
                      <br />
                      Cornell University
                      <br />
                      Biological and Environmental Engineering
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Availability</p>
                    <p className="text-muted-foreground">
                      Monday - Friday
                      <br />
                      9:00 AM - 5:00 PM EST
                    </p>
                    <p className="text-sm text-muted-foreground">Or by appointment</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="backdrop-blur-md bg-card/70 border-border/30 shadow-lg">
              <CardHeader>
                <CardTitle>Academic Profiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start backdrop-blur-sm bg-background/50 hover:bg-background/70"
                  asChild
                >
                  <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Google Scholar Profile
                  </a>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start backdrop-blur-sm bg-background/50 hover:bg-background/70"
                  asChild
                >
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    LinkedIn Profile
                  </a>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start backdrop-blur-sm bg-background/50 hover:bg-background/70"
                  asChild
                >
                  <a href="https://orcid.org" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    ORCID Profile
                  </a>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start backdrop-blur-sm bg-background/50 hover:bg-background/70"
                  asChild
                >
                  <a href="https://researchgate.net" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    ResearchGate Profile
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="backdrop-blur-md bg-card/70 border-border/30 shadow-lg">
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Conference Invitations</span>
                    <span className="text-sm text-muted-foreground">2-3 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Student Inquiries</span>
                    <span className="text-sm text-muted-foreground">1-2 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">General Questions</span>
                    <span className="text-sm text-muted-foreground">3-5 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="backdrop-blur-md bg-card/70 border-border/30 shadow-lg">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder=""
                      className="backdrop-blur-sm bg-background/50"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder=""
                      className="backdrop-blur-sm bg-background/50"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email address..."
                    className="backdrop-blur-sm bg-background/50"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affiliation">Affiliation (Optional)</Label>
                  <Input
                    id="affiliation"
                    placeholder="University, Company, or Organization..."
                    className="backdrop-blur-sm bg-background/50"
                    value={formData.affiliation}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Type here..."
                    className="backdrop-blur-sm bg-background/50"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your inquiry..."
                    className="min-h-[120px] backdrop-blur-sm bg-background/50"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full backdrop-blur-md bg-primary/80 hover:bg-primary text-primary-foreground hover:scale-105 transition-all duration-300 disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  I typically respond within 1-3 business days. For urgent research matters, please mention it in the
                  subject line.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
