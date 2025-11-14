"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Activity, FileText, AlertCircle, TrendingUp, CheckCircle2, Clock, Loader2 } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalUsers: number
  totalChildren: number
  totalAssessments: number
  highRiskCases: number
  doctorCount: number
  caretakerCount: number
  pendingRequests: number
  completedAssessments: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalChildren: 0,
    totalAssessments: 0,
    highRiskCases: 0,
    doctorCount: 0,
    caretakerCount: 0,
    pendingRequests: 0,
    completedAssessments: 0,
  })
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL not set")
      // Fetch admin overview (totals)
      const overviewRes = await fetch(`${apiUrl}/api/dashboard/admin/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const overview = await overviewRes.json()

      // Fetch users list (backend returns array)
      const usersRes = await fetch(`${apiUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const usersArr = await usersRes.json()

      // Fetch analytics (optional breakdowns)
      const analyticsRes = await fetch(`${apiUrl}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const analytics = await analyticsRes.json()

      const users = Array.isArray(usersArr) ? usersArr : []
      const doctors = users.filter((u: any) => u.role === "doctor")
      const caretakers = users.filter((u: any) => u.role === "caretaker")

      setStats({
        totalUsers: overview.totalUsers ?? analytics.totalUsers ?? users.length,
        doctorCount: doctors.length,
        caretakerCount: caretakers.length,
        totalChildren: overview.totalChildren ?? 0,
        totalAssessments: overview.totalAssessments ?? analytics.totalAssessments ?? 0,
        highRiskCases: (overview.byRisk || analytics.byRisk || []).find((r: any) => (r._id || '').toLowerCase() === 'high')?.count || 0,
        pendingRequests: 0,
        completedAssessments: 0,
      })

      setRecentUsers(users.slice(0, 5))
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">Monitor system activity and manage users</p>
        <Button 
          onClick={fetchDashboardData} 
          variant="outline" 
          size="sm" 
          className="mt-4"
        >
          <Activity className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
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

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
              <p className="text-xs text-slate-500 mt-1">
                {stats.doctorCount} doctors, {stats.caretakerCount} caretakers
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Children</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalChildren}</p>
            </div>
            <Activity className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Assessments</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalAssessments}</p>
              <p className="text-xs text-slate-500 mt-1">
                {stats.completedAssessments} completed
              </p>
            </div>
            <FileText className="w-8 h-8 text-purple-400" />
          </div>
        </Card>

        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">High Risk</p>
              <p className="text-3xl font-bold text-slate-900">{stats.highRiskCases}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Pending Assessments</p>
              <p className="text-2xl font-bold text-slate-900">{stats.pendingRequests}</p>
            </div>
            <Clock className="w-7 h-7 text-yellow-400" />
          </div>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-slate-900">{stats.completedAssessments}</p>
            </div>
            <CheckCircle2 className="w-7 h-7 text-green-400" />
          </div>
        </Card>

        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">System Health</p>
              <p className="text-2xl font-bold text-green-600">Active</p>
            </div>
            <TrendingUp className="w-7 h-7 text-blue-400" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link href="/admin/users" className="block">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
            <Users className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Manage Users</h3>
            <p className="text-sm text-slate-600">View and manage all users</p>
          </Card>
        </Link>

        <Link href="/admin/analytics" className="block">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
            <Activity className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Analytics</h3>
            <p className="text-sm text-slate-600">View system analytics</p>
          </Card>
        </Link>

        <Link href="/admin/settings" className="block">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
            <FileText className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Settings</h3>
            <p className="text-sm text-slate-600">System configuration</p>
          </Card>
        </Link>
      </div>

      {/* Recent Users */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Users</h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  recentUsers.map((user, idx) => (
                    <tr key={user._id} className="border-b hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "doctor" 
                            ? "bg-blue-100 text-blue-700" 
                            : user.role === "caretaker"
                            ? "bg-green-100 text-green-700"
                            : "bg-purple-100 text-purple-700"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
