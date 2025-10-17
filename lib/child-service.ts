import { apiClient } from "./api-client"

export interface Child {
  id: string
  name: string
  age: number
  gender: string
  risk_level: "Low" | "Medium" | "High"
  caretaker_id: string
}

export const childService = {
  async addChild(data: Omit<Child, "id" | "caretaker_id">) {
    return apiClient.post("/add_child/", data)
  },

  async getChildren() {
    return apiClient.get<Child[]>("/children/")
  },

  async getChild(childId: string) {
    return apiClient.get<Child>(`/children/${childId}/`)
  },

  async updateChild(childId: string, data: Partial<Child>) {
    return apiClient.put(`/children/${childId}/`, data)
  },
}
