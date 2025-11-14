"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
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
  Download,
  User
} from "lucide-react"

export default function DoctorPatientViewPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const childId = params.id as string
  const defaultTab = searchParams.get("tab") || "assessments"

  const [child, setChild] = useState<any>(null)
  const [assessments, setAssessments] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadPatientData()
  }, [childId])

  const loadPatientData = async () => {
    try {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("token")

      // Load child info
      const childRes = await fetch(`${apiUrl}/api/children/${childId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!childRes.ok) {
        const data = await childRes.json()
        throw new Error(data.error || 'Failed to load patient')
      }
      
      const childData = await childRes.json()
      setChild(childData)

      // Load assessments
      const assessmentsRes = await fetch(`${apiUrl}/api/assessments/${childId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (assessmentsRes.ok) {
        const assessmentsData = await assessmentsRes.json()
        setAssessments(assessmentsData)
      }

      // Load reports
      const reportsRes = await fetch(`${apiUrl}/api/reports/${childId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (reportsRes.ok) {
        const reportsData = await reportsRes.json()
        if (reportsData.success) {
          setReports(reportsData.data || [])
        }
      }
    } catch (err: any) {
      console.error('Error loading patient data:', err)
      setError(err.message || 'Failed to load patient information')
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !child) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-slate-600 mt-2">{error || 'You do not have access to this patient'}</p>
          <Button className="mt-4" onClick={() => router.push('/doctor/patients')}>
            Back to Patients
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/doctor/patients')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Patients
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
        </div>

        {child.notes && (
          <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-slate-700">{child.notes}</p>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab} className="w-full">
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
            <h3 className="text-lg font-semibold mb-4">Assessment History ({assessments.length})</h3>

            {assessments.length === 0 ? (
              <Card className="p-8 text-center">
                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No assessments on record</p>
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
                        <p className="text-sm text-slate-600 mb-1">Questions</p>
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
            <h3 className="text-lg font-semibold mb-4">Medical Reports ({reports.length})</h3>
            
            {reports.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No reports generated yet</p>
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
              View videos and images uploaded by the caretaker for review
            </p>
            <Link href={`/doctor/view-child/${childId}`}>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                View Media Files
              </Button>
            </Link>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
