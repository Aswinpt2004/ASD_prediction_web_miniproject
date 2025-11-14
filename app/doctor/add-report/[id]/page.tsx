"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle2 } from "lucide-react"
import { reportService } from "@/lib/report-service"

export default function AddReportPage() {
  const params = useParams()
  const router = useRouter()
  const childId = params.id

  const [formData, setFormData] = useState({
    title: "",
    diagnosis: "",
    recommendations: "",
    followUp: "",
  })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Ensure childId is a string
      if (!childId || typeof childId !== "string") {
        throw new Error("Invalid child ID")
      }

      const text = `Title: ${formData.title}\n\nDiagnosis:\n${formData.diagnosis}\n\nRecommendations:\n${formData.recommendations}\n\nFollow-up:\n${formData.followUp}`
      
      console.log('[AddReport] Submitting report for child:', childId)
      const res = await reportService.addReport(childId, { text, pdfUrl: "" })
      
      console.log('[AddReport] Response:', res)
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to add report")
      }
      
      console.log('[AddReport] Report saved successfully:', res.data._id)
      setSuccess(true)
      setTimeout(() => {
        router.push(`/doctor/view-child/${childId}`)
      }, 2000)
    } catch (err) {
      console.error("Error submitting report:", err)
      alert('Failed to submit report. Please check the console and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Report Submitted!</h2>
          <p className="text-slate-600">The caretaker will be notified of the report. Redirecting...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Diagnostic Report</h1>
        <p className="text-slate-600">Child ID: {childId}</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Report Title *</label>
            <Input
              type="text"
              name="title"
              placeholder="e.g., Autism Spectrum Disorder Assessment"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Diagnosis *</label>
            <textarea
              name="diagnosis"
              placeholder="Provide your clinical diagnosis based on the assessment results..."
              value={formData.diagnosis}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Recommendations *</label>
            <textarea
              name="recommendations"
              placeholder="Provide recommendations for intervention, therapy, or further evaluation..."
              value={formData.recommendations}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Follow-up Plan</label>
            <textarea
              name="followUp"
              placeholder="Outline the follow-up plan and timeline for reassessment..."
              value={formData.followUp}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> This report will be securely shared with the caretaker and stored in the child's
              medical record.
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
