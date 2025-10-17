"use client"

import { Card } from "@/components/ui/card"
import { Users, Activity, TrendingUp, AlertCircle } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      label: "Total Users",
      value: "1,234",
      icon: Users,
      color: "bg-blue-50",
      trend: "+12% from last month",
    },
    {
      label: "Active Cases",
      value: "456",
      icon: Activity,
      color: "bg-green-50",
      trend: "+8% from last month",
    },
    {
      label: "Assessments Completed",
      value: "892",
      icon: TrendingUp,
      color: "bg-purple-50",
      trend: "+23% from last month",
    },
    {
      label: "High Risk Cases",
      value: "78",
      icon: AlertCircle,
      color: "bg-red-50",
      trend: "-5% from last month",
    },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">System overview and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className={`p-6 ${stat.color}`}>
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</p>
              <p className="text-xs text-slate-600">{stat.trend}</p>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Users</h3>
          <div className="space-y-4">
            {[
              { name: "Dr. Priya Sharma", role: "Doctor", date: "2 hours ago" },
              { name: "Rajesh Kumar", role: "Caretaker", date: "4 hours ago" },
              { name: "Dr. Vikram Singh", role: "Doctor", date: "1 day ago" },
              { name: "Anjali Patel", role: "Caretaker", date: "2 days ago" },
            ].map((user, idx) => (
              <div key={idx} className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-0">
                <div>
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-600">{user.role}</p>
                </div>
                <p className="text-sm text-slate-600">{user.date}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">System Health</h3>
          <div className="space-y-4">
            {[
              { metric: "API Response Time", value: "145ms", status: "good" },
              { metric: "Database Status", value: "Healthy", status: "good" },
              { metric: "Storage Usage", value: "62%", status: "warning" },
              { metric: "Active Sessions", value: "234", status: "good" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-0">
                <p className="font-medium text-slate-900">{item.metric}</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${item.status === "good" ? "bg-green-600" : "bg-yellow-600"}`}
                  />
                  <p className="text-sm text-slate-600">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
