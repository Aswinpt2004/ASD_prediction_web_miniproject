"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, AlertCircle, CheckCircle2, Clock, TrendingUp, MessageSquare, FileText, Upload, Loader2 } from "lucide-react"
import { childService, type Child } from "@/lib/child-service"

export default function CaretakerDashboard() {
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchChildren()
  }, [])

  const fetchChildren = async () => {
    try {
      setLoading(true)
      const response = await childService.getChildren()
      if (response.success && response.data) {
        setChildren(response.data)
      } else {
        setError(response.error || "Failed to load children")
      }
    } catch (err) {
      console.error("Error fetching children:", err)
      setError("Failed to load children")
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
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Manage your children's autism screening assessments</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="p-4 mb-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Children</p>
              <p className="text-3xl font-bold text-slate-900">{children.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Need Assessment</p>
              <p className="text-3xl font-bold text-slate-900">
                {children.filter((c: any) => !c.lastAssessment).length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-slate-900">
                {children.filter((c: any) => c.lastAssessment).length}
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">High Risk</p>
              <p className="text-3xl font-bold text-slate-900">
                {children.filter((c: any) => c.riskLevel?.toLowerCase() === "high").length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link href="/caretaker/add-child" className="block">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
            <Plus className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Add Child</h3>
            <p className="text-sm text-slate-600">Register a new child</p>
          </Card>
        </Link>

        <Link href="/caretaker/chat" className="block">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
            <MessageSquare className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Chat with Doctor</h3>
            <p className="text-sm text-slate-600">Ask questions</p>
          </Card>
        </Link>

        <Link href="/caretaker/questionnaires" className="block">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
            <FileText className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Take Assessment</h3>
            <p className="text-sm text-slate-600">Screening questionnaires</p>
          </Card>
        </Link>
      </div>

      {/* Children List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Your Children</h2>
          <Link href="/caretaker/add-child">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Child
            </Button>
          </Link>
        </div>

        {children.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Children Added Yet</h3>
            <p className="text-slate-600 mb-6">Start by adding your child's information to begin assessments.</p>
            <Link href="/caretaker/add-child">
              <Button className="inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Child
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {children.map((child) => (
              <Card key={child._id} className="p-6 hover:shadow-lg transition-shadow border-2">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{child.name}</h3>
                    <p className="text-sm text-slate-600">
                      DOB: {new Date(child.dob).toLocaleDateString()} • {child.gender}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Age: {Math.floor((Date.now() - new Date(child.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years
                    </p>
                  </div>
                  {(child as any).riskLevel && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor((child as any).riskLevel)}`}>
                      {(child as any).riskLevel} Risk
                    </span>
                  )}
                </div>

                {child.notes && (
                  <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-700">{child.notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/caretaker/child/${child._id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/caretaker/chat?childId=${child._id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Chat
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
