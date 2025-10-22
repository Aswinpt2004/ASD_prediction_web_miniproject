import { apiClient } from "./api-client"

export interface AssessmentData {
  _id: string
  childId: string
  type: "MCHAT" | "SCQ" | "TABC"
  answers: Record<string, number>
  score: number
  risk: "Low" | "Medium" | "High"
  createdAt: string
}

export const assessmentService = {
  async submitAssessment(data: {
    childId: string
    type: "MCHAT" | "SCQ" | "TABC"
    answers: Record<string, number>
  }) {
    return apiClient.post<AssessmentData>("/api/assessments/add", data)
  },

  async getAssessments(childId: string) {
    return apiClient.get<AssessmentData[]>(`/api/assessments/${childId}`)
  },

  async getAssessmentDetail(assessmentId: string) {
    return apiClient.get<AssessmentData>(`/api/assessments/details/${assessmentId}`)
  },

  async deleteAssessment(assessmentId: string) {
    return apiClient.delete(`/api/assessments/${assessmentId}`)
  },
}
