"use client"

import { useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"

const QUESTIONNAIRES = {
  mchat: {
    name: "M-CHAT",
    fullName: "Modified Checklist for Autism in Toddlers",
    description: "20-question screening tool for children 16-30 months",
    questions: [
      "Does your child enjoy being swung, bounced on your knee, etc.?",
      "Does your child take an interest in other children?",
      "Does your child like to climb on things, such as up stairs?",
      "Does your child enjoy playing peek-a-boo/hide-and-seek?",
      "Does your child ever pretend, for example, to talk on the phone or pretend to feed a doll?",
      "Does your child ever use his/her index finger to point, to ask for something?",
      "Does your child ever use his/her index finger to point, to indicate interest in something?",
      "Can your child play properly with small toys (e.g. cars or blocks) without just mouthing, fiddling, or dropping them?",
      "Does your child ever bring things to you (parent) to show you something?",
      "Does your child look you in the eye for more than a second or two?",
      "Does your child ever seem oversensitive to noise? (e.g., plugging ears)",
      "Does your child smile in response to your face or your smiling at him/her?",
      "Does your child imitate you? (e.g., you make a face-does your child imitate it?)",
      "Does your child respond to his/her name when you call?",
      "If you point at a toy across the room, does your child look at it?",
      "Does your child walk?",
      "Does your child look at things you are looking at?",
      "Does your child make unusual finger movements near his/her face?",
      "Does your child try to attract your attention to his/her own activity?",
      "Have you ever wondered if your child is deaf?",
    ],
    scoringInfo: "0-2: Low Risk | 3-7: Medium Risk | 8+: High Risk",
  },
  scq: {
    name: "SCQ",
    fullName: "Social Communication Questionnaire",
    description: "Assesses social and communication abilities",
    questions: [
      "Does your child have difficulty understanding what people say?",
      "Does your child have difficulty expressing themselves with words or gestures?",
      "Does your child have difficulty making eye contact?",
      "Does your child have difficulty with social interactions?",
      "Does your child engage in repetitive behaviors or movements?",
      "Does your child have unusual sensory sensitivities?",
      "Does your child have difficulty with transitions or changes in routine?",
      "Does your child have difficulty with imaginative play?",
      "Does your child have difficulty with peer relationships?",
      "Does your child have difficulty with nonverbal communication?",
    ],
    scoringInfo: "Score ≥15: Risk for ASD",
  },
  tabc: {
    name: "TABC",
    fullName: "Toddler Autism Behavior Checklist",
    description: "20-item assessment of autistic behaviors",
    questions: [
      "Avoids eye contact",
      "Repeats certain movements or sounds",
      "Does not respond to their name",
      "Has difficulty with social interactions",
      "Shows unusual sensory interests",
      "Has difficulty with transitions",
      "Engages in repetitive play",
      "Has difficulty with communication",
      "Shows unusual body movements",
      "Has difficulty with pretend play",
      "Shows unusual hand movements",
      "Has difficulty with joint attention",
      "Shows unusual facial expressions",
      "Has difficulty with imitation",
      "Shows unusual posturing",
      "Has difficulty with social reciprocity",
      "Shows unusual vocalizations",
      "Has difficulty with understanding gestures",
      "Shows unusual object manipulation",
      "Has difficulty with social understanding",
    ],
    scoringInfo: "20-35: Low | 36-43: Moderate | ≥44: High",
  },
}

export default function QuestionnairePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = params.id as string
  const childId = searchParams.get("childId")

  const questionnaire = QUESTIONNAIRES[id as keyof typeof QUESTIONNAIRES]
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>(new Array(questionnaire.questions.length).fill(null))
  const [showResults, setShowResults] = useState(false)

  if (!questionnaire) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Questionnaire not found</h2>
        </Card>
      </div>
    )
  }

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const calculateScore = () => {
    const yesCount = answers.filter((a) => a === "yes").length
    return yesCount
  }

  const getRiskLevel = () => {
    const score = calculateScore()
    if (id === "mchat") {
      if (score <= 2) return "Low"
      if (score <= 7) return "Medium"
      return "High"
    } else if (id === "scq") {
      return score >= 15 ? "High" : "Low"
    } else if (id === "tabc") {
      if (score <= 35) return "Low"
      if (score <= 43) return "Moderate"
      return "High"
    }
    return "Unknown"
  }

  const handleSubmit = () => {
    if (answers.every((a) => a !== null)) {
      setShowResults(true)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questionnaire.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  if (showResults) {
    const score = calculateScore()
    const riskLevel = getRiskLevel()

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Assessment Results</h1>
          <p className="text-slate-600">{questionnaire.fullName}</p>
        </div>

        <Card className="p-8 mb-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{questionnaire.name} Score</h2>
            <div className="flex items-center justify-center gap-8">
              <div>
                <p className="text-sm text-slate-600 mb-2">Total Score</p>
                <p className="text-5xl font-bold text-primary">{score}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Risk Level</p>
                <p
                  className={`text-3xl font-bold ${
                    riskLevel === "High"
                      ? "text-red-600"
                      : riskLevel === "Medium" || riskLevel === "Moderate"
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {riskLevel}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-slate-700">
              <strong>Scoring Guide:</strong> {questionnaire.scoringInfo}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              <strong>Next Steps:</strong> Your assessment has been submitted to your assigned healthcare provider. They
              will review your responses and contact you within 2-3 business days with recommendations and next steps.
            </p>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
              Back to Questionnaires
            </Button>
            <Button className="flex-1" onClick={() => router.push("/caretaker/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const isAnswered = answers[currentQuestion] !== null
  const allAnswered = answers.every((a) => a !== null)
  const progress = ((currentQuestion + 1) / questionnaire.questions.length) * 100

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{questionnaire.name}</h1>
        <p className="text-slate-600">{questionnaire.fullName}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">
            Question {currentQuestion + 1} of {questionnaire.questions.length}
          </span>
          <span className="text-sm font-medium text-slate-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">{questionnaire.questions[currentQuestion]}</h2>

        <div className="space-y-3 mb-8">
          {["yes", "no", "sometimes"].map((option) => (
            <label
              key={option}
              className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                answers[currentQuestion] === option
                  ? "border-primary bg-primary/5"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="answer"
                value={option}
                checked={answers[currentQuestion] === option}
                onChange={() => handleAnswer(option)}
                className="w-4 h-4"
              />
              <span className="font-medium text-slate-900 capitalize">{option}</span>
            </label>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={handlePrev}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentQuestion === questionnaire.questions.length - 1 ? (
            <Button className="flex-1" onClick={handleSubmit} disabled={!allAnswered}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Submit Assessment
            </Button>
          ) : (
            <Button className="flex-1" onClick={handleNext} disabled={!isAnswered}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </Card>

      {/* Answer Summary */}
      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Your Answers</h3>
        <div className="grid grid-cols-5 gap-2">
          {answers.map((answer, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestion(idx)}
              className={`aspect-square rounded-lg font-semibold text-sm transition-colors ${
                idx === currentQuestion
                  ? "bg-primary text-white"
                  : answer
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
