"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle2, Clock, TrendingUp, FileText, MessageSquare, Search, Loader2 } from "lucide-react"
import { childService, type Child } from "@/lib/child-service"

export default function DoctorDashboard() {
  const [children, setChildren] = useState<Child[]>([])
  const [filteredChildren, setFilteredChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRisk, setFilterRisk] = useState<string>("all")

  useEffect(() => {
    fetchChildren()
  }, [])

  useEffect(() => {
    filterChildren()
  }, [searchQuery, filterRisk, children])

  const fetchChildren = async () => {
    try {
      setLoading(true)
      const response = await childService.getAuthorizedChildren()
      if (response.success && response.data && (response.data as any).data) {
        // API client wraps data; response.data holds full JSON
        const list: any[] = (response.data as any).data
        setChildren(list as Child[])
        setFilteredChildren(list as Child[])
      } else if (response.success && (response.data as any)?.success) {
        const list: any[] = (response.data as any).data || []
        setChildren(list as Child[])
        setFilteredChildren(list as Child[])
      } else {
        setError((response.error as string) || "Failed to load cases")
      }
    } catch (err) {
      console.error("Error fetching children:", err)
      setError("Failed to load cases")
    } finally {
      setLoading(false)
    }
  }

  const filterChildren = () => {
    let filtered = children

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((child) =>
        child.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Risk level filter
    if (filterRisk !== "all") {
      filtered = filtered.filter(
        (child) => (child as any).riskLevel?.toLowerCase() === filterRisk.toLowerCase()
      )
    }

    setFilteredChildren(filtered)
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

  const totalCases = children.length
  const pendingReview = children.filter((c: any) => c.status === 'pending').length
  const highRisk = children.filter((c: any) => c.riskLevel?.toLowerCase() === 'high').length
  const completed = children.filter((c: any) => c.status === 'completed').length

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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Doctor Dashboard</h1>
        <p className="text-slate-600">Review and manage autism screening cases</p>
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
              <p className="text-sm text-slate-600 mb-1">Total Cases</p>
              <p className="text-3xl font-bold text-slate-900">{totalCases}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-slate-900">{pendingReview}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>

        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">High Risk</p>
              <p className="text-3xl font-bold text-slate-900">{highRisk}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-slate-900">{completed}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link href="/doctor/search-child" className="block">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
            <Search className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Search Child</h3>
            <p className="text-sm text-slate-600">Find child by name</p>
          </Card>
        </Link>

        <Link href="/doctor/chat" className="block">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
            <MessageSquare className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Chat</h3>
            <p className="text-sm text-slate-600">Message caretakers</p>
          </Card>
        </Link>

        <Link href="/doctor/my-requests" className="block">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
            <FileText className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">My Requests</h3>
            <p className="text-sm text-slate-600">View access requests</p>
          </Card>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by child name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterRisk === "all" ? "default" : "outline"}
              onClick={() => setFilterRisk("all")}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filterRisk === "high" ? "default" : "outline"}
              onClick={() => setFilterRisk("high")}
              size="sm"
              className="bg-red-50 text-red-600 hover:bg-red-100"
            >
              High Risk
            </Button>
            <Button
              variant={filterRisk === "medium" ? "default" : "outline"}
              onClick={() => setFilterRisk("medium")}
              size="sm"
              className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
            >
              Medium
            </Button>
            <Button
              variant={filterRisk === "low" ? "default" : "outline"}
              onClick={() => setFilterRisk("low")}
              size="sm"
              className="bg-green-50 text-green-600 hover:bg-green-100"
            >
              Low Risk
            </Button>
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Cases ({filteredChildren.length})
        </h2>

        {filteredChildren.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Cases Found</h3>
            <p className="text-slate-600">
              {searchQuery || filterRisk !== "all"
                ? "Try adjusting your filters"
                : "No cases available at the moment"}
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChildren.map((child) => (
              <Card key={child._id} className="p-6 hover:shadow-lg transition-shadow border-2">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{child.name}</h3>
                    <p className="text-sm text-slate-600">
                      Age: {Math.floor((Date.now() - new Date(child.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{child.gender}</p>
                  </div>
                  {(child as any).riskLevel && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor((child as any).riskLevel)}`}>
                      {(child as any).riskLevel}
                    </span>
                  )}
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Status:</span>
                    <span className={`font-medium ${(child as any).status === "completed" ? "text-green-600" : "text-yellow-600"}`}>
                      {(child as any).status === "completed" ? "Completed" : "Pending"}
                    </span>
                  </div>
                  {(child as any).lastAssessmentDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Last Assessment:</span>
                      <span className="font-medium text-slate-900">{new Date((child as any).lastAssessmentDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/doctor/view-child/${child._id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/doctor/add-report/${child._id}`}>
                    <Button size="sm" className="w-full">
                      <FileText className="w-4 h-4 mr-1" />
                      Report
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

