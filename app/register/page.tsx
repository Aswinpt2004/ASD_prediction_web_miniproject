"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { authService } from "@/lib/auth-service"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [role, setRole] = useState<"caretaker" | "doctor" | "admin">("caretaker")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    organization: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const roleParam = searchParams.get("role")
    if (roleParam === "doctor" || roleParam === "admin") {
      setRole(roleParam)
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const result = await authService.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role,
      })

      if (!result) {
        setError(
          "Backend API is not accessible. Make sure your backend is running at http://localhost:4000 and NEXT_PUBLIC_API_URL is set in environment variables.",
        )
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed. Please try again."

      if (errorMessage.includes("Failed to fetch")) {
        setError("Cannot connect to backend. Ensure your backend is running at http://localhost:4000")
      } else {
        setError(errorMessage)
      }
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-slate-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h2>
          <p className="text-slate-600 mb-6">Your account has been successfully created. Redirecting to login...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-slate-100 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold">PA</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-600 mt-2">Join PREDICT-ASD today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-900 mb-3">I am a:</label>
          <div className="space-y-2">
            {[
              { value: "caretaker", label: "Parent/Caretaker" },
              { value: "doctor", label: "Healthcare Provider" },
              { value: "admin", label: "Administrator" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50"
                style={{
                  borderColor: role === option.value ? "var(--color-primary)" : undefined,
                  backgroundColor: role === option.value ? "var(--color-primary-light)" : undefined,
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={role === option.value}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-slate-900">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Full Name</label>
            <Input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Email Address</label>
            <Input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Phone Number</label>
            <Input
              type="tel"
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {role === "doctor" && (
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Organization/Clinic</label>
              <Input
                type="text"
                name="organization"
                placeholder="Your clinic or hospital name"
                value={formData.organization}
                onChange={handleChange}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Password</label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Confirm Password</label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-center text-slate-600 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
