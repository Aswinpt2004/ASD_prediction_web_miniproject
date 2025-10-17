"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, FileText, MessageSquare, Upload } from "lucide-react"

export default function ViewChildPage() {
  const params = useParams()
  const childId = params.id

  const [childData] = useState({
    id: childId,
    name: "Arjun",
    age: 3,
    gender: "Male",
    dateOfBirth: "2022-05-15",
    caretaker: "Rajesh Kumar",
    caretakerEmail: "rajesh@example.com",
    medicalHistory: "No significant medical history",
    riskLevel: "High",
  })

  const [assessments] = useState([
    {
      id: "A001",
      tool: "M-CHAT",
      date: "2025-10-15",
      score: 8,
      riskLevel: "High",
      status: "completed",
    },
    {
      id: "A002",
      tool: "SCQ",
      date: "2025-10-10",
      score: 12,
      riskLevel: "Medium",
      status: "completed",
    },
  ])

  const [uploads] = useState([
    {
      id: "U001",
      type: "video",
      name: "Behavioral observation - 2025-10-15",
      date: "2025-10-15",
      url: "#",
    },
    {
      id: "U002",
      type: "audio",
      name: "Speech sample - 2025-10-10",
      date: "2025-10-10",
      url: "#",
    },
  ])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{childData.name}</h1>
        <p className="text-slate-600">Child ID: {childData.id}</p>
      </div>

      {/* Child Info Card */}
      <Card className="p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Child Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Age</p>
                <p className="font-medium text-slate-900">{childData.age} years</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Gender</p>
                <p className="font-medium text-slate-900">{childData.gender}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Date of Birth</p>
                <p className="font-medium text-slate-900">{childData.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Medical History</p>
                <p className="font-medium text-slate-900">{childData.medicalHistory}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Caretaker Information</h3>
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm text-slate-600">Name</p>
                <p className="font-medium text-slate-900">{childData.caretaker}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="font-medium text-slate-900">{childData.caretakerEmail}</p>
              </div>
            </div>

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
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="assessments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="uploads">Media</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        {/* Assessments Tab */}
        <TabsContent value="assessments">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Assessment Results</h3>
            <div className="space-y-4">
              {assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{assessment.tool}</p>
                    <p className="text-sm text-slate-600">{assessment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{assessment.score}</p>
                    <p
                      className={`text-sm font-semibold ${
                        assessment.riskLevel === "High"
                          ? "text-red-600"
                          : assessment.riskLevel === "Medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {assessment.riskLevel} Risk
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="uploads">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Uploaded Media</h3>
            <div className="space-y-4">
              {uploads.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Upload className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-semibold text-slate-900">{upload.name}</p>
                      <p className="text-sm text-slate-600">{upload.date}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Report Tab */}
        <TabsContent value="report">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Diagnostic Report</h3>
            <Link href={`/doctor/add-report/${childId}`}>
              <Button className="flex items-center gap-2 mb-6">
                <FileText className="w-4 h-4" />
                Create Report
              </Button>
            </Link>

            <div className="bg-slate-50 p-6 rounded-lg text-center">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600">No report submitted yet</p>
            </div>
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
