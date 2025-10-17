import { apiClient } from "./api-client"

export interface Upload {
  id: string
  child_id: string
  type: "video" | "audio"
  url: string
  uploaded_by: string
  created_at: string
}

export const uploadService = {
  async uploadMedia(childId: string, file: File, type: "video" | "audio") {
    return apiClient.uploadFile<Upload>("/upload_media/", file, {
      child_id: childId,
      type,
    })
  },

  async getUploads(childId: string) {
    return apiClient.get<Upload[]>(`/uploads/${childId}/`)
  },

  async deleteUpload(uploadId: string) {
    return apiClient.post(`/uploads/${uploadId}/delete/`)
  },
}
