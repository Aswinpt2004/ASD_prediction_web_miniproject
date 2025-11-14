"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Search, FileText, Activity, Upload, Users, AlertCircle } from "lucide-react"

export default function DoctorChildrenPage() {
  const [children, setChildren] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    loadChildren()
  }, [])

  const loadChildren = async () => {
    try {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("token")

      const res = await fetch(`${apiUrl}/api/children/authorized`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      
      if (res.ok && data.success) {
        setChildren(data.data || [])
      } else {
        setError(data.error || 'Failed to load children')
      }
    } catch (err: any) {
      console.error('Error loading children:', err)
      setError('Failed to load children')
    } finally {
      setLoading(false)
    }
  }

  const filteredChildren = children.filter(child =>
    child.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Patient Profiles</h1>
        <p className="text-slate-600">Children you have been granted access to review</p>
      </div>

      {error && (
        <Card className="p-4 mb-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </Card>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search children..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Patients</p>
              <p className="text-3xl font-bold text-slate-900">{children.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Active Today</p>
              <p className="text-3xl font-bold text-slate-900">0</p>
            </div>
            <Activity className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Pending Reviews</p>
              <p className="text-3xl font-bold text-slate-900">0</p>
            </div>
            <FileText className="w-8 h-8 text-purple-400" />
          </div>
        </Card>
      </div>

      {/* Children List */}
      {filteredChildren.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {searchTerm ? 'No matching children found' : 'No patients assigned yet'}
          </h3>
          <p className="text-slate-600 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Caretakers will grant you access to their children\'s profiles'}
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChildren.map((child) => (
            <Card key={child._id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{child.name}</h3>
                <div className="text-sm text-slate-600 space-y-1">
                  <p>DOB: {new Date(child.dob).toLocaleDateString()}</p>
                  <p>Gender: {child.gender}</p>
                  <p>Age: {Math.floor((Date.now() - new Date(child.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years</p>
                </div>
              </div>

              {child.caretakerId && (
                <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Caretaker</p>
                  <p className="text-sm font-medium text-slate-900">{child.caretakerId.name}</p>
                  <p className="text-xs text-slate-600">{child.caretakerId.email}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <Link href={`/doctor/patient/${child._id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    <Activity className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </Link>
                <Link href={`/doctor/patient/${child._id}?tab=assessments`}>
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="w-4 h-4 mr-1" />
                    Assess
                  </Button>
                </Link>
                <Link href={`/doctor/patient/${child._id}?tab=uploads`}>
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="w-4 h-4 mr-1" />
                    Media
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
