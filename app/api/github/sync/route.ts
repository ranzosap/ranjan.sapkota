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

    if (!file || !file.path || !file.content || !file.message) {
      return NextResponse.json(
        { success: false, error: "Missing file path, content, or message" },
        { status: 400 },
      )
    }

    const token = process.env.GITHUB_TOKEN
    if (!token) {
      console.error("No GitHub token found in environment variables")
      return NextResponse.json(
        { success: false, error: "GitHub token not configured" },
        { status: 401 },
      )
    }

    const owner = "ranzosap"
    const repo = "ranjan.sapkota"
    const branch = "main"
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`

    console.log("Server-side GitHub sync:", { owner, repo, path: file.path, url })

    // Step 1: Check if the file exists to get its SHA
    let existingSha: string | undefined
    try {
      const existingResponse = await fetch(`${url}?ref=${branch}`, {
        headers: {
          Authorization: `token ${token}`,
          "Accept": "application/vnd.github.v3+json",
        },
      })

      if (existingResponse.ok) {
        const existingData = await existingResponse.json()
        existingSha = existingData.sha
      } else if (existingResponse.status !== 404) {
        const errorData = await existingResponse.json()
        console.error("GitHub API error fetching file:", existingResponse.status, errorData)
        return NextResponse.json(
          { success: false, error: `GitHub API fetch error: ${existingResponse.status}` },
          { status: existingResponse.status },
        )
      }
      // If 404, file does not exist — we will create it
    } catch (err) {
      console.log("File does not exist, will create new file", err)
    }

    // Step 2: Encode content in Base64
    const contentBase64 = Buffer.from(file.content, "utf-8").toString("base64")

    // Step 3: PUT request to create or update file
    const putResponse = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        message: file.message,
        content: contentBase64,
        sha: existingSha, // only include if updating
        branch,
      }),
    })

    if (!putResponse.ok) {
      const errorData = await putResponse.json()
      console.error("GitHub API error during PUT:", {
        status: putResponse.status,
        error: errorData,
      })
      return NextResponse.json(
        { success: false, error: `GitHub API error: ${putResponse.status}` },
        { status: putResponse.status },
      )
    }

    console.log("Successfully saved to GitHub:", file.path)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Server GitHub API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
