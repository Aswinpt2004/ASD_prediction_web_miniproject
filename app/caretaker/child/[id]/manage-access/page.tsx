"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  UserPlus, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Search
} from "lucide-react"

export default function ManageAccessPage() {
  const params = useParams()
  const router = useRouter()
  const childId = params.id as string

  const [child, setChild] = useState<any>(null)
  const [authorizedDoctors, setAuthorizedDoctors] = useState<any[]>([])
  const [searchEmail, setSearchEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadChildAndDoctors()
  }, [childId])

  const loadChildAndDoctors = async () => {
    try {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("token")

      // Get child info with authorized doctors
      const childRes = await fetch(`${apiUrl}/api/children/${childId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (childRes.ok) {
        const childData = await childRes.json()
        setChild(childData)
        
        // Get full doctor details
        if (childData.authorizedDoctors && childData.authorizedDoctors.length > 0) {
          const doctorsRes = await fetch(`${apiUrl}/api/children/${childId}/authorized-doctors`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (doctorsRes.ok) {
            const doctors = await doctorsRes.json()
            setAuthorizedDoctors(doctors)
          }
        }
      }
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGrantAccess = async () => {
    if (!searchEmail.trim()) {
      setMessage({ type: 'error', text: 'Please enter doctor email' })
      return
    }

    try {
      setSearching(true)
      setMessage(null)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("token")

      const res = await fetch(`${apiUrl}/api/access/grant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          childId,
          doctorEmail: searchEmail.trim()
        })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Access granted successfully!' })
        setSearchEmail("")
        await loadChildAndDoctors()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to grant access' })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to grant access' })
    } finally {
      setSearching(false)
    }
  }

  const handleRevokeAccess = async (doctorId: string) => {
    if (!confirm('Are you sure you want to revoke access for this doctor?')) return

    try {
      setMessage(null)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("token")

      const res = await fetch(`${apiUrl}/api/access/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ childId, doctorId })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Access revoked successfully' })
        await loadChildAndDoctors()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to revoke access' })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to revoke access' })
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!child) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Child not found</h2>
          <Button className="mt-4" onClick={() => router.back()}>Go Back</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(`/caretaker/child/${childId}`)}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Child Profile
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Doctor Access</h1>
        <p className="text-slate-600">Grant or revoke doctor access to {child.name}'s profile</p>
      </div>

      {message && (
        <Card className={`p-4 mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-3">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
              {message.text}
            </p>
          </div>
        </Card>
      )}

      {/* Grant Access Section */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Grant Access to Doctor</h2>
        <div className="flex gap-3">
          <Input
            type="email"
            placeholder="Enter doctor's email address"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGrantAccess()}
            className="flex-1"
          />
          <Button 
            onClick={handleGrantAccess} 
            disabled={searching || !searchEmail.trim()}
            className="flex items-center gap-2"
          >
            {searching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Grant Access
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Enter the email address of a registered doctor to grant them access to this child's profile
        </p>
      </Card>

      {/* Authorized Doctors List */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Authorized Doctors ({authorizedDoctors.length})</h2>
        
        {authorizedDoctors.length === 0 ? (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">No doctors have access yet</p>
            <p className="text-sm text-slate-500 mt-1">Grant access to a doctor to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {authorizedDoctors.map((doctor) => (
              <div 
                key={doctor._id} 
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div>
                  <p className="font-semibold text-slate-900">{doctor.name}</p>
                  <p className="text-sm text-slate-600">{doctor.email}</p>
                  {doctor.phone && (
                    <p className="text-xs text-slate-500 mt-1">Phone: {doctor.phone}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevokeAccess(doctor._id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Revoke Access
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
