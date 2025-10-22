"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, AlertCircle, CheckCircle2, Clock, TrendingUp } from "lucide-react"
import { childService, type Child } from "@/lib/child-service"

export default function CaretakerDashboard() {
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await childService.getChildren()
        if (response.success && response.data) {
          setChildren(response.data)
        } else {
          setError(response.error || "Failed to load children")
        }
      } catch (err) {
        console.error("[v0] Error fetching children:", err)
        setError("Failed to load children")
      } finally {
        setLoading(false)
      }
    }

    fetchChildren()
  }, [])

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High":
        return "text-red-600 bg-red-50"
      case "Medium":
        return "text-yellow-600 bg-yellow-50"
      case "Low":
        return "text-green-600 bg-green-50"
      default:
        return "text-slate-600 bg-slate-50"
    }
  }

  const pendingAssessments = children.filter((child) => child.status === "pending").length
  const completedAssessments = children.filter((child) => child.status === "completed").length
  const highRiskChildren = children.filter((child) => child.riskLevel === "High").length

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Manage your children's autism screening assessments</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Children", value: children.length, icon: TrendingUp, color: "bg-blue-50" },
          {
            label: "Pending Assessments",
            value: pendingAssessments,
            icon: Clock,
            color: "bg-yellow-50",
          },
          {
            label: "Completed",
            value: completedAssessments,
            icon: CheckCircle2,
            color: "bg-green-50",
          },
          {
            label: "High Risk",
            value: highRiskChildren,
            icon: AlertCircle,
            color: "bg-red-50",
          },
        ].map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className={`p-6 ${stat.color}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 text-slate-400" />
              </div>
            </Card>
          )
        })}
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

        <div className="grid md:grid-cols-2 gap-6">
          {children.map((child) => (
            <Card key={child._id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{child.name}</h3>
                  <p className="text-sm text-slate-600">
                    DOB: {new Date(child.dob).toLocaleDateString()} • {child.gender}
                  </p>
                </div>
                {child.riskLevel && (
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(child.riskLevel)}`}>
                    {child.riskLevel} Risk
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Notes:</span>
                  <span className="font-medium text-slate-900">{child.notes || "No notes"}</span>
                </div>
                {child.lastAssessment && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Last Assessment:</span>
                    <span className="font-medium text-slate-900">{child.lastAssessment}</span>
                  </div>
                )}
                {child.status && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Status:</span>
                    <span
                      className={`font-medium ${child.status === "completed" ? "text-green-600" : "text-yellow-600"}`}
                    >
                      {child.status === "completed" ? "Completed" : "Pending"}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Link href={`/caretaker/questionnaires?childId=${child._id}`} className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Assessment
                  </Button>
                </Link>
                <Link href={`/caretaker/reports?childId=${child._id}`} className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Reports
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
