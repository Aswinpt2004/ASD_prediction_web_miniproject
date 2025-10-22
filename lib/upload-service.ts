import { apiClient } from "./api-client"

export interface Upload {
  _id: string
  childId: string
  fileType: "video" | "audio" | "image"
  url: string
  fileName: string
  fileSize: number
  createdAt: string
}

export const uploadService = {
  async uploadMedia(childId: string, file: File, fileType: "video" | "audio" | "image"): Promise<Upload | null> {
    try {
      const response = await apiClient.uploadFile<{ url: string }>("/api/media/upload", file, {
        childId,
        fileType,
      })

      if (!response.success || !response.data) {
        throw new Error(response.error || "Upload failed")
      }

      return {
        _id: Date.now().toString(),
        childId,
        fileType,
        url: response.data.url,
        fileName: file.name,
        fileSize: file.size,
        createdAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Upload error:", error)
      return null
    }
  },

  async getUploads(childId: string): Promise<Upload[]> {
    try {
      const response = await apiClient.get<Upload[]>(`/api/media/${childId}`)

      if (!response.success || !response.data) {
        return []
      }

      return response.data
    } catch (error) {
      console.error("Get uploads error:", error)
      return []
    }
  },

  async deleteUpload(uploadId: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(`/api/media/${uploadId}`)
      return response.success
    } catch (error) {
      console.error("Delete upload error:", error)
      return false
    }
  },
}
