import { type NextRequest, NextResponse } from "next/server"

interface GitHubFile {
  path: string
  content: string
  message: string
  sha?: string
}

export async function POST(request: NextRequest) {
  try {
    const { file }: { file: GitHubFile } = await request.json()

    const token = process.env.GITHUB_TOKEN
    if (!token) {
      console.error("No GitHub token found in environment variables")
      return NextResponse.json({ success: false, error: "GitHub token not configured" }, { status: 401 })
    }

    const owner = "ranzosap"
    const repo = "ranjan.sapkota"
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`

    console.log("Server-side GitHub sync:", {
      owner,
      repo,
      path: file.path,
      url,
    })

    // First, try to get the existing file to get its SHA
    let existingSha: string | undefined
    try {
      const existingResponse = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.v3+json",
        },
      })
      if (existingResponse.ok) {
        const existingData = await existingResponse.json()
        existingSha = existingData.sha
      }
    } catch (error) {
      console.log("File doesn't exist yet, creating new file")
    }

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        message: file.message,
        content: btoa(unescape(encodeURIComponent(file.content))), // Proper UTF-8 encoding
        sha: existingSha || file.sha,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("GitHub API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        url: url,
      })

      return NextResponse.json(
        { success: false, error: `GitHub API error: ${response.status}` },
        { status: response.status },
      )
    }

    console.log("Successfully saved to GitHub:", file.path)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Server GitHub API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
