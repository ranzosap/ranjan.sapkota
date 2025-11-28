import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { path, message }: { path: string; message: string } = await req.json()

    if (!path || !message) {
      return NextResponse.json({ success: false, error: "Missing path or message" }, { status: 400 })
    }

    const token = process.env.GITHUB_TOKEN
    if (!token) {
      return NextResponse.json({ success: false, error: "GitHub token not configured" }, { status: 401 })
    }

    const owner = "ranzosap"
    const repo = "ranjan.sapkota"
    const branch = "main"
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`

    let sha: string | undefined
    const getRes = await fetch(`${url}?ref=${branch}`, {
      headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
    })

    if (getRes.ok) {
      const data = await getRes.json()
      sha = data.sha
    } else if (getRes.status === 404) {
      return NextResponse.json({ success: true })
    } else {
      const err = await getRes.json()
      return NextResponse.json(
        { success: false, error: `GitHub fetch error: ${getRes.status}`, details: err },
        { status: getRes.status },
      )
    }

    const delRes = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
      body: JSON.stringify({ message, sha, branch }),
    })

    if (!delRes.ok) {
      const err = await delRes.json()
      return NextResponse.json(
        { success: false, error: `GitHub delete error: ${delRes.status}`, details: err },
        { status: delRes.status },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
