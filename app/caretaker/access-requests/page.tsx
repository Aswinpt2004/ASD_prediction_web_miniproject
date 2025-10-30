"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react"
import { accessService, type AccessRequest } from "@/lib/access-service"

export default function AccessRequestsPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const response = await accessService.getAllRequests()
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

  const handleRespond = async (requestId: string, status: "approved" | "denied") => {
    try {
      setProcessing(requestId)
      const response = await accessService.respondToRequest(requestId, status)
      
      if (response.success) {
        // Update local state
        setRequests((prev) =>
          prev.map((req) => (req._id === requestId ? { ...req, status, respondedAt: new Date().toISOString() } : req)),
        )
      } else {
        setError(response.error || `Failed to ${status} request`)
      }
    } catch (err) {
      console.error("Respond error:", err)
      setError(`Failed to ${status} request`)
    } finally {
      setProcessing(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        )
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        )
      case "denied":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" />
            Denied
          </span>
        )
      default:
        return null
    }
  }

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const respondedRequests = requests.filter((r) => r.status !== "pending")

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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Access Requests</h1>
        <p className="text-slate-600">Manage doctor access to your children's profiles</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Pending Requests</h2>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <Card key={request._id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Dr. {request.doctorId.name}
                      </h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="space-y-2 text-sm text-slate-600 mb-4">
                      <p>
                        <strong>Email:</strong> {request.doctorId.email}
                      </p>
                      <p>
                        <strong>Child:</strong> {request.childId.name} (
                        {new Date(request.childId.dob).toLocaleDateString()})
                      </p>
                      {request.message && (
                        <p>
                          <strong>Message:</strong> {request.message}
                        </p>
                      )}
                      <p className="text-xs text-slate-500">
                        Requested on {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleRespond(request._id, "approved")}
                      disabled={processing === request._id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {processing === request._id ? "Processing..." : "Approve"}
                    </Button>
                    <Button
                      onClick={() => handleRespond(request._id, "denied")}
                      disabled={processing === request._id}
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Deny
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pendingRequests.length === 0 && requests.length === 0 && (
        <Card className="p-12 text-center">
          <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Access Requests</h3>
          <p className="text-slate-600">You don't have any pending or historical access requests.</p>
        </Card>
      )}

      {/* Responded Requests */}
      {respondedRequests.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Previous Requests</h2>
          <div className="space-y-4">
            {respondedRequests.map((request) => (
              <Card key={request._id} className="p-6 opacity-75">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-slate-900">Dr. {request.doctorId.name}</h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p>
                        <strong>Child:</strong> {request.childId.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {request.status === "approved" ? "Approved" : "Denied"} on{" "}
                        {request.respondedAt && new Date(request.respondedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
