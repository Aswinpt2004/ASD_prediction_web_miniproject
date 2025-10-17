"use client"

import React from "react"

import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye } from "lucide-react"

export default function ReportsPage() {
  const searchParams = useSearchParams()
  const childId = searchParams.get("childId")

  const [reports] = React.useState([
    {
      id: "R001",
      title: "Autism Spectrum Disorder Assessment",
      doctor: "Dr. Maya Patel",
      date: "2025-10-15",
      status: "completed",
      summary: "Based on M-CHAT and SCQ assessments, child shows moderate to high risk indicators for ASD.",
    },
    {
      id: "R002",
      title: "Follow-up Evaluation",
      doctor: "Dr. Rajesh Singh",
      date: "2025-09-20",
      status: "completed",
      summary: "Continued monitoring recommended. Consider speech and occupational therapy.",
    },
  ])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Reports</h1>
        <p className="text-slate-600">View diagnostic reports from healthcare providers</p>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <FileText className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{report.title}</h3>
                  <p className="text-sm text-slate-600 mb-2">
                    By {report.doctor} • {report.date}
                  </p>
                  <p className="text-slate-700">{report.summary}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {report.status}
              </span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Eye className="w-4 h-4" />
                View Report
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Download
              </Button>
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
