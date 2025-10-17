"use client"

import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function AnalyticsPage() {
  const assessmentData = [
    { month: "Aug", completed: 120, pending: 30 },
    { month: "Sep", completed: 180, pending: 45 },
    { month: "Oct", completed: 220, pending: 35 },
  ]

  const riskDistribution = [
    { name: "Low Risk", value: 45, percentage: "35%" },
    { name: "Medium Risk", value: 58, percentage: "45%" },
    { name: "High Risk", value: 25, percentage: "20%" },
  ]

  const userGrowth = [
    { month: "Aug", doctors: 12, caretakers: 45 },
    { month: "Sep", doctors: 18, caretakers: 78 },
    { month: "Oct", doctors: 24, caretakers: 112 },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics</h1>
        <p className="text-slate-600">System-wide statistics and insights</p>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Assessments Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Assessments Completed</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={assessmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#0066cc" />
              <Bar dataKey="pending" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* User Growth Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="doctors" stroke="#0066cc" />
              <Line type="monotone" dataKey="caretakers" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Risk Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Risk Level Distribution</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {riskDistribution.map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="mb-4">
                <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-slate-100">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                    <p className="text-sm text-slate-600">{item.percentage}</p>
                  </div>
                </div>
              </div>
              <p className="font-semibold text-slate-900">{item.name}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
