"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, X } from "lucide-react"
// Local definitions to avoid missing module '@/lib/questionnaire-service'
export type Questionnaire = {
  _id: string
  name: string
  fullName: string
  description?: string
  questions: { text: string; order: number }[]
  answerOptions: string[]
  scoringRules: any[]
  scoringInfo?: string
  duration?: string
  ageRange?: string
  isActive?: boolean
}

export type CreateQuestionnaireData = {
  name: string
  fullName: string
  description?: string
  questions: { text: string; order: number }[]
  answerOptions: string[]
  scoringRules: any[]
  scoringInfo?: string
  duration?: string
  ageRange?: string
  isActive?: boolean
}

export const questionnaireService = {
  async getAllQuestionnaires(): Promise<Questionnaire[]> {
    const res = await fetch('/api/questionnaires')
    if (!res.ok) throw new Error('Failed to fetch questionnaires')
    return res.json()
  },

  async createQuestionnaire(data: CreateQuestionnaireData) {
    const res = await fetch('/api/questionnaires', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create questionnaire')
    return res.json()
  },

  async updateQuestionnaire(id: string, data: Partial<CreateQuestionnaireData> | any) {
    const res = await fetch(`/api/questionnaires/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update questionnaire')
    return res.json()
  },

  async deleteQuestionnaire(id: string) {
    const res = await fetch(`/api/questionnaires/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete questionnaire')
    return res.json()
  },
}

export default function AdminQuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateQuestionnaireData>({
    name: "",
    fullName: "",
    description: "",
    questions: [],
    answerOptions: ["yes", "no", "sometimes"],
    scoringRules: [],
    scoringInfo: "",
    duration: "",
    ageRange: ""
  })
  const [questionText, setQuestionText] = useState("")

  useEffect(() => {
    loadQuestionnaires()
  }, [])

  const loadQuestionnaires = async () => {
    try {
      setLoading(true)
      const data = await questionnaireService.getAllQuestionnaires()
      setQuestionnaires(data)
    } catch (err) {
      console.error('Error loading questionnaires:', err)
      alert('Failed to load questionnaires')
    } finally {
      setLoading(false)
    }
  }

  const handleAddQuestion = () => {
    if (questionText.trim()) {
      setFormData({
        ...formData,
        questions: [
          ...formData.questions,
          { text: questionText, order: formData.questions.length }
        ]
      })
      setQuestionText("")
    }
  }

  const handleRemoveQuestion = (index: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.questions.length === 0) {
      alert('Please add at least one question')
      return
    }

    try {
      if (editingId) {
        await questionnaireService.updateQuestionnaire(editingId, formData)
        alert('Questionnaire updated successfully!')
      } else {
        await questionnaireService.createQuestionnaire(formData)
        alert('Questionnaire created successfully!')
      }
      
      setShowForm(false)
      setEditingId(null)
      resetForm()
      loadQuestionnaires()
    } catch (err) {
      console.error('Error saving questionnaire:', err)
      alert('Failed to save questionnaire')
    }
  }

  const handleEdit = (questionnaire: Questionnaire) => {
    setEditingId(questionnaire._id)
    setFormData({
      name: questionnaire.name,
      fullName: questionnaire.fullName,
      description: questionnaire.description || "",
      questions: questionnaire.questions,
      answerOptions: questionnaire.answerOptions,
      scoringRules: questionnaire.scoringRules,
      scoringInfo: questionnaire.scoringInfo || "",
      duration: questionnaire.duration || "",
      ageRange: questionnaire.ageRange || ""
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this questionnaire?')) return
    
    try {
      await questionnaireService.deleteQuestionnaire(id)
      alert('Questionnaire deleted successfully!')
      loadQuestionnaires()
    } catch (err) {
      console.error('Error deleting questionnaire:', err)
      alert('Failed to delete questionnaire')
    }
  }

  const handleToggleActive = async (questionnaire: Questionnaire) => {
    try {
      await questionnaireService.updateQuestionnaire(questionnaire._id, {
        isActive: !questionnaire.isActive
      })
      loadQuestionnaires()
    } catch (err) {
      console.error('Error toggling active status:', err)
      alert('Failed to update questionnaire status')
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      fullName: "",
      description: "",
      questions: [],
      answerOptions: ["yes", "no", "sometimes"],
      scoringRules: [],
      scoringInfo: "",
      duration: "",
      ageRange: ""
    })
    setQuestionText("")
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Questionnaires</h1>
          <p className="text-slate-600">Create and manage autism screening questionnaires</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Questionnaire
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              {editingId ? 'Edit Questionnaire' : 'Create New Questionnaire'}
            </h2>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
                resetForm()
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Short Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., M-CHAT"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name *
                </label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g., Modified Checklist for Autism in Toddlers"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the questionnaire"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Duration
                </label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 5-10 minutes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Age Range
                </label>
                <Input
                  value={formData.ageRange}
                  onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                  placeholder="e.g., 16-30 months"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Scoring Info
                </label>
                <Input
                  value={formData.scoringInfo}
                  onChange={(e) => setFormData({ ...formData, scoringInfo: e.target.value })}
                  placeholder="e.g., 0-2: Low | 3-7: Med | 8+: High"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Questions ({formData.questions.length}) *
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter question text..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddQuestion()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddQuestion}>
                  Add
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {formData.questions.map((q, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                    <span className="text-sm font-medium text-slate-600">{idx + 1}.</span>
                    <span className="flex-1 text-sm text-slate-900">{q.text}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveQuestion(idx)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? 'Update Questionnaire' : 'Create Questionnaire'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {questionnaires.map((q) => (
          <Card key={q._id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{q.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      q.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {q.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{q.fullName}</p>
                <p className="text-sm text-slate-700 mb-3">{q.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span>📝 {q.questions.length} questions</span>
                  {q.duration && <span>⏱️ {q.duration}</span>}
                  {q.ageRange && <span>👶 {q.ageRange}</span>}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(q)}
                  title={q.isActive ? 'Deactivate' : 'Activate'}
                >
                  {q.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(q)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(q._id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {questionnaires.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-slate-600 mb-4">No questionnaires yet</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Questionnaire
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
