import { apiClient } from "./api-client"

export interface AssessmentData {
  child_id: string
  tool: "MCHAT" | "SCQ" | "TABC"
  answers: Array<{ question: string; answer: string }>
  score: number
  risk_level: "Low" | "Medium" | "High"
}

export const assessmentService = {
  async submitAssessment(data: Omit<AssessmentData, "score" | "risk_level">) {
    return apiClient.post("/submit_assessment/", data)
  },

  async getAssessments(childId: string) {
    return apiClient.get(`/assessments/${childId}/`)
  },

  async getAssessmentDetail(assessmentId: string) {
    return apiClient.get(`/assessments/${assessmentId}/`)
  },
}
