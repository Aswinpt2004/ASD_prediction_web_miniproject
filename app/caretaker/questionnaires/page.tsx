"use client"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export default function QuestionnairesPage() {
  const searchParams = useSearchParams()
  const childId = searchParams.get("childId")

  const questionnaires = [
    {
      id: "mchat",
      name: "M-CHAT",
      fullName: "Modified Checklist for Autism in Toddlers",
      description: "20-question screening tool for children 16-30 months",
      duration: "5-10 minutes",
      status: "completed",
      score: 8,
      riskLevel: "High",
    },
    {
      id: "scq",
      name: "SCQ",
      fullName: "Social Communication Questionnaire",
      description: "Assesses social and communication abilities",
      duration: "10-15 minutes",
      status: "pending",
      score: null,
      riskLevel: null,
    },
    {
      id: "tabc",
      name: "TABC",
      fullName: "Toddler Autism Behavior Checklist",
      description: "20-item assessment of autistic behaviors",
      duration: "5-10 minutes",
      status: "not-started",
      score: null,
      riskLevel: null,
    },
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Screening Questionnaires</h1>
        <p className="text-slate-600">Complete standardized autism screening assessments</p>
      </div>

      <div className="space-y-4">
        {questionnaires.map((q) => (
          <Card key={q.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">{q.name}</h3>
                <p className="text-sm text-slate-600 mb-2">{q.fullName}</p>
                <p className="text-slate-700 mb-3">{q.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-600">Duration: {q.duration}</span>
                  <span
                    className={`px-3 py-1 rounded-full font-semibold ${
                      q.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : q.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {q.status === "completed" ? "Completed" : q.status === "pending" ? "In Progress" : "Not Started"}
                  </span>
                </div>
              </div>
              {q.status === "completed" && (
                <div className="text-right ml-4">
                  <p className="text-sm text-slate-600 mb-1">Score</p>
                  <p className="text-2xl font-bold text-slate-900">{q.score}</p>
                  <p
                    className={`text-sm font-semibold ${
                      q.riskLevel === "High"
                        ? "text-red-600"
                        : q.riskLevel === "Medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                    }`}
                  >
                    {q.riskLevel} Risk
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {q.status === "not-started" ? (
                <Link href={`/caretaker/questionnaires/${q.id}?childId=${childId}`} className="flex-1">
                  <Button className="w-full flex items-center justify-center gap-2">
                    Start Assessment
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : q.status === "pending" ? (
                <Link href={`/caretaker/questionnaires/${q.id}?childId=${childId}`} className="flex-1">
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-transparent">
                    Continue Assessment
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href={`/caretaker/questionnaires/${q.id}?childId=${childId}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      View Results
                    </Button>
                  </Link>
                  <Button variant="outline">Retake</Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

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
