"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Loader2 } from "lucide-react"
import { questionnaireService, type Questionnaire } from "@/lib/questionnaire-service"

export default function QuestionnairesPage() {
  const searchParams = useSearchParams()
  const childId = searchParams.get("childId")
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadQuestionnaires()
  }, [])

  const loadQuestionnaires = async () => {
    try {
      setLoading(true)
      const data = await questionnaireService.getActiveQuestionnaires()
      setQuestionnaires(data)
    } catch (err) {
      console.error('Error loading questionnaires:', err)
      setError('Failed to load questionnaires')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-red-600">{error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Screening Questionnaires</h1>
        <p className="text-slate-600">Complete standardized autism screening assessments</p>
      </div>

      {!questionnaires || questionnaires.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-slate-600">No questionnaires available at this time.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {questionnaires.map((q) => (
            <Card key={q._id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900">{q.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">{q.fullName}</p>
                  <p className="text-slate-700 mb-3">{q.description || 'Autism screening assessment'}</p>
                  <div className="flex items-center gap-4 text-sm">
                    {q.duration && <span className="text-slate-600">Duration: {q.duration}</span>}
                    {q.ageRange && <span className="text-slate-600">Age Range: {q.ageRange}</span>}
                    <span className="text-slate-600">{q.questions?.length || 0} questions</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/caretaker/questionnaires/${q._id}${childId ? `?childId=${childId}` : ''}`} className="flex-1">
                  <Button className="w-full flex items-center justify-center gap-2">
                    Start Assessment
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-slate-900 mb-2">About These Assessments</h4>
        <p className="text-sm text-slate-700 mb-3">
          These standardized questionnaires are designed to screen for autism spectrum disorder in young children. They
          are not diagnostic tools but help identify children who may benefit from further evaluation by a healthcare
          professional.
        </p>
        <p className="text-sm text-slate-700">
          Your responses will be reviewed by a qualified healthcare provider who will provide personalized
          recommendations and next steps.
        </p>
      </Card>
    </div>
  )
}
