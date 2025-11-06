import { apiClient } from "./api-client"

export interface AssessmentData {
  _id: string
  childId: string
  questionnaireId?: string
  type: "MCHAT" | "SCQ" | "TABC"
  answers: Record<string, any>
  score: number
  risk: "Low" | "Medium" | "Moderate" | "High"
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
  async createAssessment(data: {
    childId: string
    questionnaireId: string
    answers: Record<string, any>
  }): Promise<AssessmentData> {
    const response = await apiClient.post("/api/assessments/add", data)
    return response.data as AssessmentData
  },

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
