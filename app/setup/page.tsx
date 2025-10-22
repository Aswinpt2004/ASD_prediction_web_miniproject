"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Copy, ExternalLink } from "lucide-react"

export default function SetupPage() {
  const [copiedScript, setCopiedScript] = useState<number | null>(null)

  const scripts = [
    {
      name: "Step 1: Create Tables",
      file: "01-create-tables.sql",
      description: "Creates all database tables for users, children, assessments, uploads, reports, and chat messages.",
    },
    {
      name: "Step 2: Enable Security",
      file: "02-enable-rls.sql",
      description: "Enables Row Level Security policies to protect user data.",
    },
    {
      name: "Step 3: Setup Storage",
      file: "03-create-storage.sql",
      description: "Creates storage buckets for audio and video uploads.",
    },
  ]

  const copyToClipboard = (index: number) => {
    setCopiedScript(index)
    setTimeout(() => setCopiedScript(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">PA</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Database Setup Required</h1>
          <p className="text-lg text-slate-600">
            Your PREDICT-ASD application needs to initialize the database before you can start using it.
          </p>
        </div>

        {/* Alert */}
        <Card className="mb-8 p-6 border-amber-200 bg-amber-50">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">One-time Setup Required</h3>
              <p className="text-amber-800 mb-4">
                You need to run three SQL scripts in your Supabase SQL Editor to initialize the database. This is a
                one-time process that takes about 2 minutes.
              </p>
              <a
                href="https://supabase.com/dashboard/project/imbswskzjnsvwkbwldfz/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 font-semibold"
              >
                Open Supabase SQL Editor
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <div className="space-y-6 mb-12">
          {scripts.map((script, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{script.name}</h3>
                  <p className="text-slate-600 mb-4">{script.description}</p>

                  <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-3">
                      Copy the SQL script from{" "}
                      <code className="bg-slate-200 px-2 py-1 rounded text-xs">{script.file}</code> in your project and
                      paste it into the Supabase SQL Editor.
                    </p>
                    <Button onClick={() => copyToClipboard(index)} variant="outline" size="sm" className="w-full">
                      {copiedScript === index ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Script
                        </>
                      )}
                    </Button>
                  </div>

                  <ol className="text-sm text-slate-600 space-y-2 ml-4 list-decimal">
                    <li>
                      Go to{" "}
                      <a
                        href="https://supabase.com/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Supabase Dashboard
                      </a>
                    </li>
                    <li>Click on "SQL Editor" in the left sidebar</li>
                    <li>Click "New Query"</li>
                    <li>
                      Copy the SQL script from <code className="bg-slate-200 px-1 rounded text-xs">{script.file}</code>
                    </li>
                    <li>Paste it into the editor</li>
                    <li>Click "Run" to execute the script</li>
                  </ol>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Completion */}
        <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-900 mb-2">All Done?</h3>
          <p className="text-slate-600 mb-6">
            After running all three SQL scripts, your database will be ready to use.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">Go to Registration</Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={async () => {
                try {
                  const res = await fetch("/api/init-db", { method: "POST" })
                  const data = await res.json()
                  if (data.initialized) {
                    alert("Database is ready! Redirecting to registration...")
                    window.location.href = "/register"
                  } else {
                    alert("Database not initialized yet. Please run the SQL scripts first.")
                  }
                } catch (error) {
                  alert("Error checking database status")
                }
              }}
            >
              Check Database Status
            </Button>
            {/* Add automatic database initialization button */}
            <Button
              size="lg"
              onClick={async () => {
                try {
                  const { initializeDatabase } = await import("@/app/actions/setup-db")
                  const result = await initializeDatabase()
                  if (result.success) {
                    alert("Database initialized successfully! Redirecting to registration...")
                    window.location.href = "/register"
                  } else {
                    alert(`Database initialization: ${result.message}`)
                  }
                } catch (error) {
                  alert("Error initializing database. Please run the SQL scripts manually.")
                }
              }}
            >
              Auto-Initialize Database
            </Button>
          </div>
        </Card>

        {/* Help */}
        <div className="mt-12 text-center text-slate-600">
          <p className="mb-2">Need help? Check the documentation or contact support.</p>
          <Link href="/" className="text-primary hover:underline font-semibold">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
