import { apiClient } from "./api-client"

export interface AccessRequest {
  _id: string
  doctorId: {
    _id: string
    name: string
    email: string
  }
  childId: {
    _id: string
    name: string
    dob: string
    gender?: string
  }
  caretakerId: {
    _id: string
    name: string
    email: string
  }
  status: "pending" | "approved" | "denied"
  message?: string
  respondedAt?: string
  createdAt: string
}

export const accessService = {
  /**
   * Doctor requests access to a child profile
   */
  async requestAccess(childId: string, message?: string) {
    return apiClient.post<AccessRequest>("/api/access/request", {
      childId,
      message: message || "Requesting access to review assessment and provide consultation",
    })
  },

  /**
   * Get pending access requests (for caretaker)
   */
  async getPendingRequests() {
    return apiClient.get<AccessRequest[]>("/api/access/pending")
  },

  /**
   * Get all access requests (caretaker sees their children's requests, doctor sees their own)
   */
  async getAllRequests() {
    return apiClient.get<AccessRequest[]>("/api/access/all")
  },

  /**
   * Get doctor's own access requests status
   */
  async getMyRequests() {
    return apiClient.get<AccessRequest[]>("/api/access/my-requests")
  },

  /**
   * Caretaker approves or denies an access request
   */
  async respondToRequest(requestId: string, status: "approved" | "denied") {
    return apiClient.put<AccessRequest>(`/api/access/${requestId}/respond`, {
      status,
    })
  },
}
