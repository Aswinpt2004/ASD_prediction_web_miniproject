import { apiClient } from "./api-client"

export interface AssessmentData {
  _id: string
  childId: string
  type: "MCHAT" | "SCQ" | "TABC"
  answers: Record<string, number>
  score: number
  risk: "Low" | "Medium" | "High"
  llmAnalysis?: {
    summary: string
    recommendations: string
    keyFindings: string[]
    generatedAt: string
  }
  reviewedByDoctor?: string
  reviewedAt?: string
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

  /**
   * Request LLM analysis for an assessment (doctor only)
   */
  async requestAnalysis(assessmentId: string) {
    return apiClient.post<{ message: string; assessment: AssessmentData }>(
      `/api/assessments/${assessmentId}/analyze`,
      {},
    )
  },
}
