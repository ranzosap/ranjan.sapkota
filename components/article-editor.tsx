"use client"

import type React from "react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Eye, Plus, X, Bold, Italic, Link, List, Code } from "lucide-react"
import type { Article } from "@/lib/mock-data"
import { saveArticle, updateArticle } from "@/lib/mock-data"
import { githubService } from "@/lib/github-service"

interface ArticleEditorProps {
  article?: Article
}

export function ArticleEditor({ article }: ArticleEditorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = !!article

  const [formData, setFormData] = useState({
    title: article?.title || "",
    abstract: article?.abstract || "",
    body: { code: article?.body?.code || "" },
    tags: article?.tags || [],
    published: article?.published || false,
    publication_venue: article?.publication_venue || "",
    year: article?.year || new Date().getFullYear(),
    month: article?.month || new Date().getMonth() + 1,
    doi: article?.doi || "",
    authors: article?.authors || ["Ranjan Sapkota"],
    pdf_url: article?.pdf_url || "",
    code_url: article?.code_url || "",
    dataset_url: article?.dataset_url || "",
    featured: article?.featured || false,
  })

  const [newTag, setNewTag] = useState("")
  const [newAuthor, setNewAuthor] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const insertFormatting = (before: string, after = "") => {
    const textarea = document.getElementById("content-textarea") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const replacement = before + selectedText + after

    const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end)
    setFormData((prev) => ({ ...prev, body: { code: newValue } }))

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const githubLink = githubService.generateArticleLink(formData.title)

      if (isEditing && article) {
        updateArticle(article.slug, formData)
        toast({
          title: "Article Updated",
          description: `Article updated successfully! GitHub link: ${githubLink}`,
          variant: "success",
        })
      } else {
        saveArticle(formData)
        toast({
          title: "Article Created",
          description: `Article created successfully! GitHub link: ${githubLink}`,
          variant: "success",
        })
      }

      router.push("/admin")
    } catch (error) {
      console.error("Error saving article:", error)
      toast({
        title: "Error",
        description: "Error saving article. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleAddAuthor = () => {
    if (newAuthor.trim() && !formData.authors.includes(newAuthor.trim())) {
      setFormData((prev) => ({
        ...prev,
        authors: [...prev.authors, newAuthor.trim()],
      }))
      setNewAuthor("")
    }
  }

  const handleRemoveAuthor = (authorToRemove: string) => {
    if (formData.authors.length > 1) {
      setFormData((prev) => ({
        ...prev,
        authors: prev.authors.filter((author) => author !== authorToRemove),
      }))
    }
  }

  // const handlePreview = () => {
  //   toast({
  //     title: "Preview",
  //     description: "Preview functionality would open here",
  //   })
  // }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()} className="hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {isEditing ? "Edit Article" : "Create New Article"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {isEditing ? "Update your existing article" : "Write and publish a new research article"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {/* <Button variant="outline" onClick={handlePreview} className="bg-white/50 backdrop-blur-sm border-white/20">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button> */}
            <Button
              form="article-form"
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : isEditing ? "Update" : "Publish"}
            </Button>
          </div>
        </div>

        <form id="article-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle>Article Content</CardTitle>
                  <CardDescription>Write your research article content with basic formatting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter article title"
                      className="bg-white/50 border-white/20"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="abstract">Abstract *</Label>
                    <Textarea
                      id="abstract"
                      value={formData.abstract}
                      onChange={(e) => setFormData((prev) => ({ ...prev, abstract: e.target.value }))}
                      placeholder="Brief abstract of your research"
                      className="bg-white/50 border-white/20 min-h-[120px]"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <div className="bg-white/50 border border-white/20 rounded-md overflow-hidden">
                      <div className="flex items-center gap-2 p-2 border-b border-white/20 bg-white/30">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertFormatting("**", "**")}
                          className="h-8 w-8 p-0"
                          title="Bold"
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertFormatting("*", "*")}
                          className="h-8 w-8 p-0"
                          title="Italic"
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertFormatting("[", "](url)")}
                          className="h-8 w-8 p-0"
                          title="Link"
                        >
                          <Link className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertFormatting("- ", "")}
                          className="h-8 w-8 p-0"
                          title="List"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertFormatting("`", "`")}
                          className="h-8 w-8 p-0"
                          title="Code"
                        >
                          <Code className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        id="content-textarea"
                        value={formData.body.code}
                        onChange={(e) => setFormData((prev) => ({ ...prev, body: { code: e.target.value } }))}
                        placeholder="Write your full article content here... Use the toolbar above for basic formatting."
                        className="min-h-[400px] bg-transparent border-0 resize-none focus:ring-0 focus:outline-none"
                        style={{
                          fontFamily:
                            'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle>Publication Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="published">Status</Label>
                    <Select
                      value={formData.published ? "published" : "draft"}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, published: value === "published" }))}
                    >
                      <SelectTrigger className="bg-white/50 border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                    <SelectContent className="bg-blue-50">
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="publication_venue">Journal/Venue</Label>
                    <Input
                      id="publication_venue"
                      value={formData.publication_venue}
                      onChange={(e) => setFormData((prev) => ({ ...prev, publication_venue: e.target.value }))}
                      placeholder="Journal or conference name"
                      className="bg-white/50 border-white/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData((prev) => ({ ...prev, year: Number.parseInt(e.target.value) }))}
                        className="bg-white/50 border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="month">Month</Label>
                      <Input
                        id="month"
                        type="number"
                        min="1"
                        max="12"
                        value={formData.month}
                        onChange={(e) => setFormData((prev) => ({ ...prev, month: Number.parseInt(e.target.value) }))}
                        className="bg-white/50 border-white/20"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="doi">DOI</Label>
                    <Input
                      id="doi"
                      value={formData.doi}
                      onChange={(e) => setFormData((prev) => ({ ...prev, doi: e.target.value }))}
                      placeholder="10.1000/xyz123"
                      className="bg-white/50 border-white/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pdf_url">PDF URL</Label>
                    <Input
                      id="pdf_url"
                      value={formData.pdf_url}
                      onChange={(e) => setFormData((prev) => ({ ...prev, pdf_url: e.target.value }))}
                      placeholder="Link to PDF"
                      className="bg-white/50 border-white/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="code_url">Code URL</Label>
                    <Input
                      id="code_url"
                      value={formData.code_url}
                      onChange={(e) => setFormData((prev) => ({ ...prev, code_url: e.target.value }))}
                      placeholder="Link to code repository"
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle>Authors</CardTitle>
                  <CardDescription>Manage article authors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="Add author"
                      className="bg-white/50 border-white/20"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAuthor())}
                    />
                    <Button
                      type="button"
                      onClick={handleAddAuthor}
                      size="icon"
                      variant="outline"
                      className="bg-white/50 border-white/20"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {formData.authors.map((author, index) => (
                      <div key={author} className="flex items-center justify-between p-2 bg-white/30 rounded-md">
                        <span className="text-sm">{author}</span>
                        {formData.authors.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-red-100"
                            onClick={() => handleRemoveAuthor(author)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                  <CardDescription>Add relevant tags to categorize your article</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      className="bg-white/50 border-white/20"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      size="icon"
                      variant="outline"
                      className="bg-white/50 border-white/20"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 hover:bg-blue-200 dark:hover:bg-blue-800"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
