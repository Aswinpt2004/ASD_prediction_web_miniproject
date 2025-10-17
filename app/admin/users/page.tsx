"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Trash2, Edit2, CheckCircle2, AlertCircle } from "lucide-react"

export default function UserManagementPage() {
  const [users, setUsers] = useState([
    {
      id: "U001",
      name: "Dr. Maya Patel",
      email: "maya@example.com",
      role: "doctor",
      status: "active",
      joinDate: "2025-08-15",
      organization: "City Medical Center",
    },
    {
      id: "U002",
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      role: "caretaker",
      status: "active",
      joinDate: "2025-09-20",
      organization: "-",
    },
    {
      id: "U003",
      name: "Dr. Vikram Singh",
      email: "vikram@example.com",
      role: "doctor",
      status: "inactive",
      joinDate: "2025-07-10",
      organization: "Children's Hospital",
    },
    {
      id: "U004",
      name: "Anjali Patel",
      email: "anjali@example.com",
      role: "caretaker",
      status: "active",
      joinDate: "2025-10-01",
      organization: "-",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<"all" | "doctor" | "caretaker">("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  const getRoleColor = (role: string) => {
    return role === "doctor" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
  }

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">User Management</h1>
        <p className="text-slate-600">Manage system users and permissions</p>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Roles</option>
            <option value="doctor">Doctors</option>
            <option value="caretaker">Caretakers</option>
          </select>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Organization</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Join Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getRoleColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.organization}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.status === "active" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-slate-400" />
                      )}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(user.status)}`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.joinDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="bg-transparent">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredUsers.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-slate-600">No users found matching your criteria</p>
        </Card>
      )}
    </div>
  )
}
