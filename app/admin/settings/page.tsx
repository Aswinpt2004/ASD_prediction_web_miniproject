"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">System Settings</h1>
        <p className="text-slate-600">Configure system-wide settings and preferences</p>
      </div>

      {/* General Settings */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">General Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">System Name</label>
            <Input type="text" value="PREDICT-ASD" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Support Email</label>
            <Input type="email" placeholder="support@predict-asd.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Max File Upload Size (MB)</label>
            <Input type="number" value="100" />
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <p className="font-medium text-slate-900">Two-Factor Authentication</p>
              <p className="text-sm text-slate-600">Require 2FA for all users</p>
            </div>
            <input type="checkbox" className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <p className="font-medium text-slate-900">HIPAA Compliance Mode</p>
              <p className="text-sm text-slate-600">Enable strict HIPAA compliance</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <p className="font-medium text-slate-900">Encryption</p>
              <p className="text-sm text-slate-600">End-to-end encryption enabled</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </div>
      </Card>

      {/* Email Settings */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <p className="font-medium text-slate-900">New User Registration</p>
              <p className="text-sm text-slate-600">Notify admin on new registrations</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <p className="font-medium text-slate-900">High Risk Cases</p>
              <p className="text-sm text-slate-600">Alert on high-risk assessments</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex gap-4">
        <Button variant="outline" className="bg-transparent">
          Cancel
        </Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  )
}
