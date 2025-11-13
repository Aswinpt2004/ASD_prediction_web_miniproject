"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  FileText, 
  Upload, 
  Activity, 
  AlertCircle, 
  Loader2,
  CheckCircle2,
  Clock,
  Download,
  UserCog
} from "lucide-react"
import { childService, type Child } from "@/lib/child-service"
import { assessmentService, type AssessmentData } from "@/lib/assessment-service"
import { questionnaireService, type Questionnaire } from "@/lib/questionnaire-service"
import { reportService } from "@/lib/report-service"

export default function ChildViewPage() {
  const params = useParams()
  const router = useRouter()
  const childId = params.id as string

  const [child, setChild] = useState<Child | null>(null)
  const [assessments, setAssessments] = useState<AssessmentData[]>([])
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadChildData()
  }, [childId])

  const loadChildData = async () => {
    try {
      setLoading(true)
      
      // Load child info
      const childResponse = await childService.getChild(childId)
      if (childResponse.success && childResponse.data) {
        setChild(childResponse.data)
      }

      // Load assessments
      const assessmentsResponse = await assessmentService.getAssessments(childId)
      if (assessmentsResponse.success && assessmentsResponse.data) {
        setAssessments(assessmentsResponse.data)
      }

      // Load all questionnaires to check completion
      const questionnairesResponse = await questionnaireService.getActiveQuestionnaires()
      setQuestionnaires(questionnairesResponse)

      // Load reports
      const reportsResponse = await reportService.getReports(childId)
      if (reportsResponse.success && reportsResponse.data) {
        setReports(reportsResponse.data)
      }
    } catch (err) {
      console.error('Error loading child data:', err)
      setError('Failed to load child information')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateCombinedReport = async () => {
    try {
      setGeneratingReport(true)
      setError("")

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002"
      const token = localStorage.getItem("token")

      const response = await fetch(`${apiUrl}/api/reports/generate-combined`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ childId })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report')
      }

      alert('Combined report generated successfully!')
      await loadChildData() // Reload to show new report
    } catch (err: any) {
      console.error('Error generating report:', err)
      setError(err.message || 'Failed to generate combined report')
    } finally {
      setGeneratingReport(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!child) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Child not found</h2>
          <Button className="mt-4" onClick={() => router.push('/caretaker/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  // Check if all questionnaires are completed
  const completedQuestionnaireIds = new Set(
    assessments.map(a => a.questionnaireId).filter(Boolean)
  )
  const allQuestionnairesCompleted = questionnaires.every(q => 
    completedQuestionnaireIds.has(q._id)
  )
  const totalQuestionnaires = questionnaires.length
  const completedCount = assessments.length

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
      case "moderate":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-slate-600 bg-slate-50 border-slate-200"
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/caretaker/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{child.name}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span>DOB: {new Date(child.dob).toLocaleDateString()}</span>
              <span>•</span>
              <span>{child.gender}</span>
              <span>•</span>
              <span>
                Age: {Math.floor((Date.now() - new Date(child.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href={`/caretaker/child/${childId}/manage-access`}>
              <Button variant="outline" className="flex items-center gap-2">
                <UserCog className="w-4 h-4" />
                Manage Doctor Access
              </Button>
            </Link>

            {allQuestionnairesCompleted && (
              <Button 
                onClick={handleGenerateCombinedReport}
                disabled={generatingReport}
                className="flex items-center gap-2"
              >
                {generatingReport ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Generate Combined Report
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {child.notes && (
          <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-slate-700">{child.notes}</p>
          </Card>
        )}
      </div>

      {error && (
        <Card className="p-4 mb-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </Card>
      )}

      {/* Progress Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Assessment Progress</h3>
          <span className="text-sm text-slate-600">
            {completedCount} of {totalQuestionnaires} completed
          </span>
        </div>
        
        <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
          <div 
            className="bg-primary h-3 rounded-full transition-all"
            style={{ width: `${(completedCount / totalQuestionnaires) * 100}%` }}
          />
        </div>

        {!allQuestionnairesCompleted && (
          <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-900">
                Complete all questionnaires to generate comprehensive report
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                {totalQuestionnaires - completedCount} questionnaire(s) remaining
              </p>
            </div>
          </div>
        )}

        {allQuestionnairesCompleted && (
          <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <p className="text-sm font-semibold text-green-900">
              All questionnaires completed! You can now generate a comprehensive report.
            </p>
          </div>
        )}
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="assessments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assessments">
            <Activity className="w-4 h-4 mr-2" />
            Assessments
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="uploads">
            <Upload className="w-4 h-4 mr-2" />
            Media
          </TabsTrigger>
        </TabsList>

        {/* Assessments Tab */}
        <TabsContent value="assessments" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Completed Assessments</h3>
              <Link href={`/caretaker/questionnaires?childId=${childId}`}>
                <Button size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Take New Assessment
                </Button>
              </Link>
            </div>

            {assessments.length === 0 ? (
              <Card className="p-8 text-center">
                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">No assessments completed yet</p>
                <Link href={`/caretaker/questionnaires?childId=${childId}`}>
                  <Button>Start First Assessment</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <Card key={assessment._id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{assessment.type}</h4>
                        <p className="text-sm text-slate-600">
                          {new Date(assessment.createdAt).toLocaleDateString()} at{' '}
                          {new Date(assessment.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(assessment.risk)}`}>
                        {assessment.risk} Risk
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600 mb-1">Score</p>
                        <p className="text-2xl font-bold text-slate-900">{assessment.score}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600 mb-1">Total Questions</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {Object.keys(assessment.answers || {}).length}
                        </p>
                      </div>
                    </div>

                    {assessment.llmAnalysis?.summary && (
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <h5 className="font-semibold text-purple-900 mb-2">AI Analysis</h5>
                        <p className="text-sm text-purple-800 mb-3">{assessment.llmAnalysis.summary}</p>
                        {assessment.llmAnalysis.recommendations && (
                          <div className="mt-3 pt-3 border-t border-purple-200">
                            <p className="text-xs font-semibold text-purple-900 mb-1">Recommendations:</p>
                            <p className="text-xs text-purple-800">{assessment.llmAnalysis.recommendations}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Generated Reports</h3>
            
            {reports.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">No reports generated yet</p>
                <p className="text-sm text-slate-500">
                  Complete all assessments to generate a comprehensive report
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <Card key={report._id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">Comprehensive Report</h4>
                        <p className="text-sm text-slate-600">
                          Generated on {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {report.pdfUrl && (
                        <a href={report.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                        </a>
                      )}
                    </div>
                    
                    <div className="prose prose-sm max-w-none">
                      <p className="text-slate-700 whitespace-pre-wrap">{report.text}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Uploads Tab */}
        <TabsContent value="uploads" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Media Uploads</h3>
            <p className="text-sm text-slate-600 mb-4">
              Upload videos and images of your child for doctor review
            </p>
            <Link href={`/caretaker/uploads?childId=${childId}`}>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Manage Uploads
              </Button>
            </Link>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
