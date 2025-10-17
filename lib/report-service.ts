import { apiClient } from "./api-client"

export interface Report {
  id: string
  child_id: string
  doctor_id: string
  report_text: string
  attachments: string[]
  created_at: string
}

export const reportService = {
  async addReport(childId: string, data: { report_text: string; attachments?: File[] }) {
    return apiClient.post("/doctor/add_report/", {
      child_id: childId,
      report_text: data.report_text,
    })
  },

  async getReports(childId: string) {
    return apiClient.get<Report[]>(`/caretaker/get_reports/${childId}/`)
  },

  async getReport(reportId: string) {
    return apiClient.get<Report>(`/reports/${reportId}/`)
  },
}
