"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Clock, AlertCircle, Send } from "lucide-react"
import { accessService, type AccessRequest } from "@/lib/access-service"

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const response = await accessService.getMyRequests()
      if (response.success && response.data) {
        setRequests(response.data)
      } else {
        setError(response.error || "Failed to load requests")
      }
    } catch (err) {
      console.error("Load requests error:", err)
      setError("Failed to load access requests")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        )
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3" />
            Access Granted
          </span>
        )
      case "denied":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" />
            Access Denied
          </span>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-32 bg-slate-200 rounded"></div>
          <div className="h-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const approvedRequests = requests.filter((r) => r.status === "approved")
  const deniedRequests = requests.filter((r) => r.status === "denied")

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Access Requests</h1>
        <p className="text-slate-600">Track your child profile access requests</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{pendingRequests.length}</p>
              <p className="text-sm text-slate-600">Pending</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{approvedRequests.length}</p>
              <p className="text-sm text-slate-600">Approved</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{deniedRequests.length}</p>
              <p className="text-sm text-slate-600">Denied</p>
            </div>
          </div>
        </Card>
      </div>

      {/* All Requests */}
      {requests.length === 0 ? (
        <Card className="p-12 text-center">
          <Send className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Access Requests Yet</h3>
          <p className="text-slate-600 mb-4">
            Search for children to start requesting access to their profiles.
          </p>
          <Button onClick={() => (window.location.href = "/doctor/search-child")}>Search Children</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">All Requests</h2>
          {requests.map((request) => (
            <Card key={request._id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {request.childId.name}
                    </h3>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      <strong>Caretaker:</strong> {request.caretakerId.name} ({request.caretakerId.email})
                    </p>
                    <p>
                      <strong>Child DOB:</strong> {new Date(request.childId.dob).toLocaleDateString()}
                    </p>
                    {request.childId.gender && (
                      <p>
                        <strong>Gender:</strong> {request.childId.gender}
                      </p>
                    )}
                    {request.message && (
                      <p>
                        <strong>Your Message:</strong> {request.message}
                      </p>
                    )}
                    <p className="text-xs text-slate-500">
                      Requested on {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    {request.respondedAt && (
                      <p className="text-xs text-slate-500">
                        {request.status === "approved" ? "Approved" : "Denied"} on{" "}
                        {new Date(request.respondedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                {request.status === "approved" && (
                  <Button onClick={() => (window.location.href = `/doctor/view-child/${request.childId._id}`)}>
                    View Profile
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
