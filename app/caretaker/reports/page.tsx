"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, Loader2, AlertCircle, X } from "lucide-react"
import { reportService } from "@/lib/report-service"
import { childService } from "@/lib/child-service"

export default function ReportsPage() {
  const searchParams = useSearchParams()
  const childId = searchParams.get("childId")

  const [reports, setReports] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedReport, setSelectedReport] = React.useState<any | null>(null)

  React.useEffect(() => {
    const fetchReports = async () => {
      if (!childId) {
        setError("No child selected")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await reportService.getReports(childId)
        if (response.success && response.data) {
          setReports(response.data)
        } else {
          setError(response.error || "Failed to load reports")
        }
      } catch (err: any) {
        console.error("[ReportsPage] Failed to fetch reports:", err)
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
        <Card className="p-8 flex flex-col items-center text-center bg-red-50 border-red-200">
          <AlertCircle className="w-10 h-10 text-red-600 mb-3" />
            <h2 className="text-lg font-semibold text-red-700 mb-1">Unable to load reports</h2>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            {childId && (
              <Button variant="outline" onClick={() => window.location.reload()} size="sm">Try Again</Button>
            )}
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
              <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-transparent"
                onClick={() => setSelectedReport(report)}
              >
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

      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedReport(null)}>
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedReport.analysis?.summary || "Medical Report"}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {new Date(selectedReport.createdAt).toLocaleDateString()} at {new Date(selectedReport.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedReport(null)}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Close
              </Button>
            </div>
            
            <div className="p-6">
              {selectedReport.analysis?.riskLevel && (
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-600">Risk Level:</span>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    selectedReport.analysis.riskLevel === "High" ? "bg-red-100 text-red-700" :
                    selectedReport.analysis.riskLevel === "Medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {selectedReport.analysis.riskLevel}
                  </span>
                </div>
              )}

              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                  {selectedReport.text}
                </pre>
              </div>

              {selectedReport.analysis?.keyFindings && selectedReport.analysis.keyFindings.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Key Findings:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                    {selectedReport.analysis.keyFindings.map((finding: string, idx: number) => (
                      <li key={idx}>{finding}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedReport.analysis?.recommendations && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-3">Recommendations:</h4>
                  <div className="text-sm text-green-800 whitespace-pre-wrap">
                    {Array.isArray(selectedReport.analysis.recommendations) 
                      ? selectedReport.analysis.recommendations.join('\n')
                      : selectedReport.analysis.recommendations
                    }
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => window.print()}
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Print Report
                </Button>
                {selectedReport.pdfUrl && (
                  <Button variant="outline" asChild>
                    <a href={selectedReport.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
