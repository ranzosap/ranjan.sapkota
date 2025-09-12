"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Quote } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BibtexModalProps {
  article: {
    title: string
    authors: string[]
    journal?: string
    year: number
    doi?: string
    bibtex?: string
  }
}

export function BibtexModal({ article }: BibtexModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  // Generate BibTeX if not provided
  const generateBibtex = () => {
    if (article.bibtex) return article.bibtex

    const key = `${article.authors[0]?.split(" ").pop()?.toLowerCase() || "author"}${article.year}`
    const authorsStr = article.authors.join(" and ")

    return `@article{${key},
  title={${article.title}},
  author={${authorsStr}},
  journal={${article.journal || "Journal Name"}},
  year={${article.year}},
  ${article.doi ? `doi={${article.doi}},` : ""}
}`
  }

  const bibtexContent = generateBibtex()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bibtexContent)
      toast({
        title: "Copied to clipboard",
        description: "BibTeX citation has been copied to your clipboard.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please manually copy the BibTeX citation.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="backdrop-blur-sm bg-background/50 hover:bg-background/70">
          <Quote className="h-4 w-4 mr-2" />
          Cite
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white border border-gray-200 text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900">BibTeX Citation</DialogTitle>
          <DialogDescription className="text-gray-600">Copy the BibTeX citation for this article.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={bibtexContent}
            readOnly
            className="font-mono text-sm min-h-[200px] bg-white border border-gray-300 text-gray-900"
          />
          <div className="flex justify-end">
            <Button onClick={copyToClipboard} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
