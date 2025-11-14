"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

export default function QuestionSetsPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [questionCol, setQuestionCol] = useState<string>("Question")
  const [optionCols, setOptionCols] = useState<string[]>([])
  const [meta, setMeta] = useState({ name: "", fullName: "", duration: "", ageRange: "" })


  const handleCsvChoose: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    setMessage(null); setError(null)
    const file = e.target.files?.[0]
    setCsvFile(file || null)
    setCsvHeaders([])
    if (!file) return
    try {
      // Read first line to get headers (simple CSV header parse)
      const text = await file.text()
      const firstLine = text.split(/\r?\n/)[0] || ""
      // Split by comma, trim quotes
      const headers = firstLine.split(",").map(h => h.replace(/^\s*"|"\s*$/g, '').trim())
      setCsvHeaders(headers)
      // Auto-detect
      const qh = headers.find(h => /question/i.test(h)) || headers[0]
      setQuestionCol(qh)
      const opt = headers.filter(h => /option/i.test(h))
      setOptionCols(opt)
    } catch (err: any) {
      setError("Failed to read CSV header: " + (err?.message || ""))
    }
  }

  const handleCsvUpload = async () => {
    try {
      setLoading(true); setMessage(null); setError(null)
      if (!csvFile) throw new Error("Please choose a CSV file")
      if (!meta.name || !meta.fullName) throw new Error("Please enter Name and Full Name")

      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("token")
      const form = new FormData()
      form.append("file", csvFile)
      form.append("name", meta.name)
      form.append("fullName", meta.fullName)
      form.append("duration", meta.duration)
      form.append("ageRange", meta.ageRange)
      form.append("questionColumn", questionCol)
      if (optionCols.length > 0) form.append("optionColumns", optionCols.join(","))

      const res = await fetch(`${apiUrl}/api/questionnaires/import-csv`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'CSV import failed')

      setMessage(`Imported questionnaire '${data.questionnaire?.name}' with ${data.questionCount} questions`)
      setCsvFile(null); setCsvHeaders([]); setQuestionCol("Question"); setOptionCols([])
      setMeta({ name: "", fullName: "", duration: "", ageRange: "" })
    } catch (err: any) {
      setError(err?.message || 'CSV import failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Question Sets</h1>
        <p className="text-slate-600">Create or upload standardized questionnaires for assessments.</p>
      </div>

      {message && (
        <Card className="p-4 mb-4 border-green-200 bg-green-50 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
          <p className="text-green-700">{message}</p>
        </Card>
      )}
      {error && (
        <Card className="p-4 mb-4 border-red-200 bg-red-50 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" /> Upload CSV (with header mapping)
        </h2>
        <div className="grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Name (e.g., MCHAT)"
              className="border rounded p-2"
              value={meta.name}
              onChange={e => setMeta(m => ({ ...m, name: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Full Name"
              className="border rounded p-2"
              value={meta.fullName}
              onChange={e => setMeta(m => ({ ...m, fullName: e.target.value }))}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Duration (e.g., 5-10 minutes)"
              className="border rounded p-2"
              value={meta.duration}
              onChange={e => setMeta(m => ({ ...m, duration: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Age Range (e.g., 16-30 months)"
              className="border rounded p-2"
              value={meta.ageRange}
              onChange={e => setMeta(m => ({ ...m, ageRange: e.target.value }))}
            />
          </div>

          <input type="file" accept=".csv" onChange={handleCsvChoose} />

          {csvHeaders.length > 0 && (
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-600">Question Column</label>
                <select className="border rounded p-2 w-full" value={questionCol} onChange={e => setQuestionCol(e.target.value)}>
                  {csvHeaders.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-600">Option Columns (multi-select)</label>
                <select
                  multiple
                  className="border rounded p-2 w-full h-32"
                  value={optionCols}
                  onChange={e => {
                    const opts = Array.from(e.target.selectedOptions).map(o => o.value)
                    setOptionCols(opts)
                  }}
                >
                  {csvHeaders.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Leave empty to auto-detect from the first data row.</p>
              </div>
            </div>
          )}

          <div>
            <Button onClick={handleCsvUpload} disabled={loading || !csvFile} className="flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {loading ? 'Importing CSV...' : 'Import CSV as Questionnaire'}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" /> Notes
        </h2>
        <ul className="list-disc ml-6 text-sm text-slate-600 space-y-1">
          <li>Answer options default to ["yes","no","sometimes"] if omitted.</li>
          <li>Question <code>order</code> is auto-assigned by index if omitted.</li>
          <li>Use <code>scoringRules</code> to map score ranges to risk levels.</li>
        </ul>
      </Card>
    </div>
  )
}
