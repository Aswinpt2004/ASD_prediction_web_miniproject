"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, FileText, MessageSquare, Upload, Loader2, Sparkles } from "lucide-react"
import { childService } from "@/lib/child-service"
import { assessmentService } from "@/lib/assessment-service"
import { reportService } from "@/lib/report-service"

export default function ViewChildPage() {
  const params = useParams()
  const router = useRouter()
  const childId = params.id as string

  const [childData, setChildData] = useState<any>(null)
  const [assessments, setAssessments] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [child, assessmentData, reportData] = await Promise.all([
          childService.getChild(childId),
          assessmentService.getAssessments(childId),
          reportService.getReports(childId)
        ])
        
        setChildData(child)
        setAssessments(assessmentData || [])
        setReports(reportData || [])
      } catch (err: any) {
        console.error("Failed to fetch child data:", err)
        setError(err.message || "Failed to load child data")
      } finally {
        setLoading(false)
      }
    }

    if (childId) {
      fetchData()
    }
  }, [childId])

  const handleGenerateAIReport = async (assessmentId: string) => {
    if (!assessmentId || generating) return

    setGenerating(true)
    try {
      const result = await reportService.generateFromAssessment({
        assessmentId,
        childId,
      })

      if (result.success) {
        alert("AI Report generated successfully!")
        // Refresh reports
        const updatedReports = await reportService.getReports(childId)
        setReports(updatedReports || [])
      }
    } catch (err: any) {
      console.error("Failed to generate report:", err)
      alert(err.message || "Failed to generate AI report")
    } finally {
      setGenerating(false)
      setSelectedAssessment(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !childData) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Card className="p-12 text-center border-red-200">
          <p className="text-red-600">{error || "Child not found"}</p>
          <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
        </Card>
      </div>
    )
  }

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const latestAssessment = assessments.length > 0 ? assessments[0] : null
  const highestRisk = assessments.reduce((max, a) => {
    const riskOrder = { Low: 1, Medium: 2, Moderate: 3, High: 4 }
    return (riskOrder[a.risk as keyof typeof riskOrder] || 0) > (riskOrder[max as keyof typeof riskOrder] || 0) ? a.risk : max
  }, "Unknown")

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{childData.name}</h1>
        <p className="text-slate-600">Child ID: {childData._id}</p>
      </div>

      {/* Child Info Card */}
      <Card className="p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Child Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Age</p>
                <p className="font-medium text-slate-900">{calculateAge(childData.dob)} years</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Gender</p>
                <p className="font-medium text-slate-900">{childData.gender}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Date of Birth</p>
                <p className="font-medium text-slate-900">{new Date(childData.dob).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Medical History</p>
                <p className="font-medium text-slate-900">{childData.medicalHistory || childData.notes || "No medical history available"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Caretaker Information</h3>
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm text-slate-600">Name</p>
                <p className="font-medium text-slate-900">{childData.caretakerId?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="font-medium text-slate-900">{childData.caretakerId?.email || "N/A"}</p>
              </div>
            </div>

            {highestRisk === "High" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900">High Risk Assessment</p>
                    <p className="text-sm text-red-800 mt-1">
                      This child has been identified as high risk. Recommend in-person evaluation.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="assessments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="report">Reports</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        {/* Assessments Tab */}
        <TabsContent value="assessments">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Assessment Results</h3>
            
            {assessments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600">No assessments available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div
                    key={assessment._id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        {assessment.type || "Assessment"}
                      </p>
                      <p className="text-sm text-slate-600">
                        {new Date(assessment.createdAt).toLocaleDateString()}
                      </p>
                      {assessment.llmAnalysis?.summary && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {assessment.llmAnalysis.summary}
                        </p>
                      )}
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-2xl font-bold text-slate-900">{assessment.score}</p>
                      <p
                        className={`text-sm font-semibold ${
                          assessment.risk === "High"
                            ? "text-red-600"
                            : assessment.risk === "Medium" || assessment.risk === "Moderate"
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      >
                        {assessment.risk} Risk
                      </p>
                    </div>
                    <Button 
                      onClick={() => {
                        setSelectedAssessment(assessment._id)
                        handleGenerateAIReport(assessment._id)
                      }}
                      disabled={generating && selectedAssessment === assessment._id}
                      className="flex items-center gap-2"
                    >
                      {generating && selectedAssessment === assessment._id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate AI Report
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Report Tab */}
        <TabsContent value="report">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Diagnostic Reports</h3>
            
            <Link href={`/doctor/add-report/${childId}`}>
              <Button className="flex items-center gap-2 mb-6">
                <FileText className="w-4 h-4" />
                Create Manual Report
              </Button>
            </Link>

            {reports.length === 0 ? (
              <div className="bg-slate-50 p-6 rounded-lg text-center">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">No reports submitted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report._id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">
                          {report.analysis?.summary || "Medical Report"}
                        </p>
                        <p className="text-sm text-slate-600">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                        {report.analysis?.generatedBy && (
                          <span className="inline-block mt-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            {report.analysis.generatedBy}
                          </span>
                        )}
                      </div>
                      {report.analysis?.riskLevel && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          report.analysis.riskLevel === "High" ? "bg-red-100 text-red-700" :
                          report.analysis.riskLevel === "Medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {report.analysis.riskLevel} Risk
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-3">{report.text}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Chat with Caretaker</h3>
            <Link href={`/doctor/chat?childId=${childId}`}>
              <Button className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Open Chat
              </Button>
            </Link>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
