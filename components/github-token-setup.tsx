"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Github, Key, ExternalLink } from "lucide-react"

export function GitHubTokenSetup() {
  const [token, setToken] = useState("")
  const [isStored, setIsStored] = useState(false)

  const handleSaveToken = () => {
    if (token.trim()) {
      localStorage.setItem("github_token", token.trim())
      setIsStored(true)
      setToken("")
      console.log("[v0] GitHub token saved to localStorage")
    }
  }

  const handleRemoveToken = () => {
    localStorage.removeItem("github_token")
    setIsStored(false)
    console.log("[v0] GitHub token removed from localStorage")
  }

  const hasStoredToken = typeof window !== "undefined" && localStorage.getItem("github_token")

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          GitHub Integration Setup
        </CardTitle>
        <CardDescription>Configure GitHub token to sync articles to your repository</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Key className="h-4 w-4" />
          <AlertDescription>
            You need a GitHub Personal Access Token with repository permissions to sync articles.
            <a
              href="https://github.com/settings/tokens/new?scopes=repo&description=Academic%20Portfolio%20Sync"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 ml-2 text-blue-600 hover:text-blue-800"
            >
              Create Token <ExternalLink className="h-3 w-3" />
            </a>
          </AlertDescription>
        </Alert>

        {!hasStoredToken && !isStored ? (
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Enter your GitHub Personal Access Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <Button onClick={handleSaveToken} disabled={!token.trim()}>
              Save GitHub Token
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Alert>
              <AlertDescription className="text-green-600">
                ✓ GitHub token is configured. Articles will sync to your repository.
              </AlertDescription>
            </Alert>
            <Button variant="outline" onClick={handleRemoveToken}>
              Remove Token
            </Button>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p>
            <strong>Repository:</strong> https://github.com/ranzosap/ranjan.sapkota
          </p>
          <p>
            <strong>Articles Path:</strong> /articles/draft/ and /articles/published/
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
