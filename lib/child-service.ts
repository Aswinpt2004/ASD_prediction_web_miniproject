import { apiClient } from "./api-client"

export interface Child {
  _id: string
  name: string
  dob: string
  gender: string
  notes?: string
  caretakerId: string
  createdAt?: string
  updatedAt?: string
}

export const childService = {
  async addChild(data: { name: string; dob: string; gender: string; notes?: string }) {
    return apiClient.post<Child>("/api/children/add", data)
  },

  async getChildren() {
    return apiClient.get<Child[]>("/api/children/my")
  },

  async getMyChildren() {
    // Alias for doctor dashboard compatibility
    return this.getChildren()
  },

  async getChild(childId: string) {
    return apiClient.get<Child>(`/api/children/${childId}`)
  },

  async updateChild(childId: string, data: { name?: string; dob?: string; gender?: string; notes?: string }) {
    return apiClient.put<{ message: string; child: Child }>(`/api/children/${childId}`, data)
  },

  async deleteChild(childId: string) {
    return apiClient.delete(`/api/children/${childId}`)
  },
}
