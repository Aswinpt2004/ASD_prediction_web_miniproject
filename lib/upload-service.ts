import { apiClient } from "./api-client"

// UI-friendly Upload shape used by pages
export interface Upload {
  id: string
  childId: string
  type: "video" | "audio" | "image"
  url: string
  name: string
  size: number
  created_at: string
}

export const uploadService = {
  async uploadMedia(childId: string, file: File, fileType: "video" | "audio" | "image"): Promise<Upload | null> {
    try {
      // Expect server to return the saved media document including its _id and createdAt
      const response = await apiClient.uploadFile<any>("/api/media/upload", file, {
        childId,
        fileType,
      })

      if (!response.success || !response.data) {
        throw new Error(response.error || "Upload failed")
      }

      const media = response.data // ideally { _id, childId, fileUrl, fileType, uploadedBy, createdAt }

      return {
        id: media._id || Date.now().toString(),
        childId: media.childId || childId,
        type: (media.fileType as any) || fileType,
        url: media.fileUrl || media.url || '',
        name: file.name,
        size: file.size,
        created_at: media.createdAt ? new Date(media.createdAt).toISOString() : new Date().toISOString(),
      }
    } catch (error) {
      console.error("Upload error:", error)
      return null
    }
  },

  async getUploads(childId: string): Promise<Upload[]> {
    try {
      const response = await apiClient.get<any[]>(`/api/media/${childId}`)

      if (!response.success || !response.data) {
        return []
      }

      // Map server media docs to UI Upload shape
      return response.data.map((m: any) => ({
        id: m._id?.toString?.() || m.id || Date.now().toString(),
        childId: m.childId || childId,
        type: (m.fileType as any) || 'video',
        url: m.fileUrl || m.url || '',
        name: m.fileName || (m.fileUrl ? m.fileUrl.split('/').pop() : 'file'),
        size: m.fileSize || 0,
        created_at: m.createdAt ? new Date(m.createdAt).toISOString() : (m.created_at || new Date().toISOString()),
      }))
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
