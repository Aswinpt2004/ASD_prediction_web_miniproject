"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Clock, Users } from "lucide-react"
import { childService } from "@/lib/child-service"

export default function DoctorDashboard() {
  const [cases, setCases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await childService.getMyChildren()
        setCases(response || [])
      } catch (err) {
        console.error("[v0] Error fetching cases:", err)
        setError("Failed to load cases")
      } finally {
        setLoading(false)
      }
    }

    fetchCases()
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending-review":
        return "bg-yellow-100 text-yellow-700"
      case "report-submitted":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-green-100 text-green-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Doctor Dashboard</h1>
        <p className="text-slate-600">Manage and review child assessments</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Cases", value: cases.length, icon: Users, color: "bg-blue-50" },
          {
            label: "Pending Review",
            value: cases.filter((c) => c.status === "pending-review").length,
            icon: Clock,
            color: "bg-yellow-50",
          },
          {
            label: "High Risk",
            value: cases.filter((c) => c.riskLevel === "High").length,
            icon: AlertCircle,
            color: "bg-red-50",
          },
          {
            label: "Completed",
            value: cases.filter((c) => c.status === "completed").length,
            icon: CheckCircle2,
            color: "bg-green-50",
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

      {/* Cases Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Active Cases</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Child Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Age</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Risk Level</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((caseItem) => (
                <tr key={caseItem.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{caseItem.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{caseItem.age} years</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(caseItem.riskLevel)}`}
                    >
                      {caseItem.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(caseItem.status)}`}>
                      {caseItem.status === "pending-review"
                        ? "Pending Review"
                        : caseItem.status === "report-submitted"
                          ? "Report Submitted"
                          : "Completed"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/doctor/view-child/${caseItem.id}`}>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
