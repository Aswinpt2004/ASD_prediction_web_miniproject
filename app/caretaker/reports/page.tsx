"use client"

import React from "react"

import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, Loader2 } from "lucide-react"
import { reportService } from "@/lib/report-service"
import { childService } from "@/lib/child-service"

export default function ReportsPage() {
  const searchParams = useSearchParams()
  const childId = searchParams.get("childId")

  const [reports, setReports] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchReports = async () => {
      if (!childId) {
        setError("No child selected")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await reportService.getReports(childId)
        setReports(data || [])
      } catch (err: any) {
        console.error("Failed to fetch reports:", err)
        setError(err.message || "Failed to load reports")
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [childId])

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="p-12 text-center border-red-200">
          <p className="text-red-600">{error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Reports</h1>
        <p className="text-slate-600">View diagnostic reports from healthcare providers</p>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report._id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <FileText className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {report.analysis?.summary || "Medical Report"}
                  </h3>
                  <p className="text-sm text-slate-600 mb-2">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-slate-700 line-clamp-3">{report.text}</p>
                  {report.analysis?.riskLevel && (
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      report.analysis.riskLevel === "High" ? "bg-red-100 text-red-700" :
                      report.analysis.riskLevel === "Medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {report.analysis.riskLevel} Risk
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Eye className="w-4 h-4" />
                View Report
              </Button>
              {report.pdfUrl && (
                <Button variant="outline" className="flex items-center gap-2 bg-transparent" asChild>
                  <a href={report.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {reports.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">No reports available yet</p>
        </Card>
      )}
    </div>
  )
}
