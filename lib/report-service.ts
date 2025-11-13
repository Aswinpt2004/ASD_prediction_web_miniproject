import { apiClient } from "./api-client"

export interface Report {
  _id: string
  childId: string
  doctorId: string
  text: string
  pdfUrl?: string
  createdAt: string
}

export const reportService = {
  async addReport(childId: string, data: { text: string; pdfUrl?: string }) {
    return apiClient.post<Report>("/api/reports/add", {
      childId,
      ...data,
    })
  },

  async getReports(childId: string) {
    return apiClient.get<Report[]>(`/api/reports/${childId}`)
  },

  async getReport(reportId: string) {
    return apiClient.get<Report>(`/api/reports/details/${reportId}`)
  },

  async deleteReport(reportId: string) {
    return apiClient.delete(`/api/reports/${reportId}`)
  },

  async generateFromAssessment(data: {
    assessmentId: string
    childId: string
    additionalNotes?: string
  }) {
    return apiClient.post<{
      success: boolean
      report: Report
      analysis: any
    }>("/api/reports/generate-from-assessment", data)
  },
}
