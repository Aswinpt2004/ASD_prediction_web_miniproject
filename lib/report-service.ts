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
    console.log('[reportService] Adding report for child:', childId, 'text length:', data.text?.length)
    const response = await apiClient.post<Report>("/api/reports/add", {
      childId,
      ...data,
    })
    console.log('[reportService] Response:', { success: response.success, hasData: !!response.data, error: response.error })
    // Backend returns report directly, not wrapped
    if (response.success && response.data) {
      console.log('[reportService] Report saved successfully:', response.data._id)
      return { success: true, data: response.data }
    }
    console.error('[reportService] Failed to save report:', response.error)
    return { success: false, error: response.error || 'Failed to add report' }
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
