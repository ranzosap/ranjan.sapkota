"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Grid, List, ImageIcon, Video, File, Download, Trash2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface MediaFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: string
  usedIn: string[]
}

export default function MediaManagementPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Mock media files
  const [mediaFiles] = useState<MediaFile[]>([
    {
      id: "1",
      name: "neural-network-diagram.png",
      type: "image/png",
      size: 2048000,
      url: "/neural-network-visualization.png",
      uploadedAt: "2024-01-15",
      usedIn: ["Advanced Neural Networks", "Machine Learning Optimization"],
    },
    {
      id: "2",
      name: "research-presentation.mp4",
      type: "video/mp4",
      size: 15728640,
      url: "#",
      uploadedAt: "2024-01-10",
      usedIn: ["Quantum Computing Algorithms"],
    },
    {
      id: "3",
      name: "algorithm-flowchart.jpg",
      type: "image/jpeg",
      size: 1536000,
      url: "/algorithm-flowchart.png",
      uploadedAt: "2024-01-08",
      usedIn: [],
    },
  ])

  const filteredFiles = mediaFiles.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon
    if (type.startsWith("video/")) return Video
    return File
  }

  const handleDeleteFile = (fileId: string, fileName: string) => {
    if (confirm(`Are you sure you want to delete "${fileName}"?`)) {
      // In a real app, this would delete from the database
      console.log("Deleting file:", fileId)
      alert("File deleted successfully!")
    }
  }

  return (
    <ProtectedRoute>
 <div className="min-h-screen dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4 py-8 max-w-[1600px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.back()} className="hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Media Management</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Upload and manage images, videos, and other media files
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/50 border-white/20 w-64"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="bg-white/50 backdrop-blur-sm border-white/20"
              >
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-2">
              <FileUpload
                onFilesUploaded={(files) => {
                  console.log("Files uploaded:", files)
                  alert(`${files.length} file(s) uploaded successfully!`)
                }}
                maxSize={50 * 1024 * 1024} // 50MB
              />
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle>Storage Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Total Files</span>
                    <span className="font-semibold">{mediaFiles.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Storage Used</span>
                    <span className="font-semibold">
                      {formatFileSize(mediaFiles.reduce((acc, file) => acc + file.size, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Images</span>
                    <span className="font-semibold">
                      {mediaFiles.filter((f) => f.type.startsWith("image/")).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Videos</span>
                    <span className="font-semibold">
                      {mediaFiles.filter((f) => f.type.startsWith("video/")).length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Media Gallery */}
          <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-lg mt-8">
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>Browse and manage your uploaded files</CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredFiles.map((file) => {
                    const FileIcon = getFileIcon(file.type)
                    return (
                      <div
                        key={file.id}
                        className="group relative bg-white/40 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden hover:bg-white/60 transition-all duration-200"
                      >
                        {/* File Preview */}
                        <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          {file.type.startsWith("image/") ? (
                            <img
                              src={file.url || "/placeholder.svg"}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileIcon className="h-12 w-12 text-gray-400" />
                          )}
                        </div>

                        {/* File Info */}
                        <div className="p-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)} • {file.uploadedAt}
                          </p>
                          {file.usedIn.length > 0 && (
                            <div className="mt-2">
                              <Badge variant="secondary" className="text-xs">
                                Used in {file.usedIn.length} article{file.usedIn.length !== 1 ? "s" : ""}
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-8 w-8 bg-white/80 hover:bg-white">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteFile(file.id, file.name)}
                              className="h-8 w-8 bg-white/80 hover:bg-red-100 text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map((file) => {
                    const FileIcon = getFileIcon(file.type)
                    return (
                      <div
                        key={file.id}
                        className="flex items-center gap-4 p-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/60 transition-all duration-200"
                      >
                        <div className="flex-shrink-0">
                          {file.type.startsWith("image/") ? (
                            <img
                              src={file.url || "/placeholder.svg"}
                              alt={file.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                              <FileIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)} • {file.uploadedAt}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {file.usedIn.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              Used in {file.usedIn.length}
                            </Badge>
                          )}
                          <Button size="sm" variant="ghost" className="hover:bg-blue-100 dark:hover:bg-blue-900/30">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteFile(file.id, file.name)}
                            className="hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {filteredFiles.length === 0 && (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No files found</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {searchQuery ? "Try adjusting your search terms." : "Upload some files to get started."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
