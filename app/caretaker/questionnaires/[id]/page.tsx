"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { questionnaireService, type Questionnaire } from "@/lib/questionnaire-service"
import { assessmentService } from "@/lib/assessment-service"

export default function QuestionnairePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = params.id as string
  const childId = searchParams.get("childId")

  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>([])
  const [showResults, setShowResults] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [assessmentResult, setAssessmentResult] = useState<any>(null)

  useEffect(() => {
    loadQuestionnaire()
  }, [id])

  const loadQuestionnaire = async () => {
    try {
      setLoading(true)
      const data = await questionnaireService.getQuestionnaireById(id)
      setQuestionnaire(data)
      setAnswers(new Array(data.questions.length).fill(null))
    } catch (err) {
      console.error('Error loading questionnaire:', err)
      setError('Failed to load questionnaire')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !questionnaire) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Questionnaire not found</h2>
          <p className="text-slate-600 mt-2">{error || 'This questionnaire is not available.'}</p>
          <Button className="mt-4" onClick={() => router.back()}>
            Go Back
          </Button>
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
    // Find matching risk level from scoring rules
    if (questionnaire.scoringRules && questionnaire.scoringRules.length > 0) {
      for (const rule of questionnaire.scoringRules) {
        const inRange = score >= rule.minScore && 
          (rule.maxScore === undefined || score <= rule.maxScore)
        if (inRange) {
          return rule.riskLevel
        }
      }
    }
    return "Unknown"
  }

  const handleSubmit = async () => {
    if (!answers.every((a) => a !== null)) {
      alert('Please answer all questions before submitting.')
      return
    }

    if (!childId) {
      alert('Child ID is missing. Please return to the child selection page.')
      return
    }

    try {
      setSubmitting(true)
      
      // Convert answers array to object format expected by backend
      const answersObj: Record<string, string> = {}
      answers.forEach((answer, idx) => {
        answersObj[`q${idx}`] = answer || ''
      })

      const result = await assessmentService.createAssessment({
        childId,
        questionnaireId: questionnaire._id,
        answers: answersObj
      })

      setAssessmentResult(result)
      setShowResults(true)
    } catch (err) {
      console.error('Error submitting assessment:', err)
      alert('Failed to submit assessment. Please try again.')
    } finally {
      setSubmitting(false)
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

  if (showResults && assessmentResult) {
    const score = assessmentResult.score
    const riskLevel = assessmentResult.risk

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

          {questionnaire.scoringInfo && (
            <div className="bg-slate-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-slate-700">
                <strong>Scoring Guide:</strong> {questionnaire.scoringInfo}
              </p>
            </div>
          )}

          {assessmentResult.llmAnalysis?.summary && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-purple-900 mb-2">AI Analysis</h3>
              <p className="text-sm text-purple-800 mb-3">{assessmentResult.llmAnalysis.summary}</p>
              {assessmentResult.llmAnalysis.keyFindings && assessmentResult.llmAnalysis.keyFindings.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-purple-900 mb-1">Key Findings:</p>
                  <ul className="text-sm text-purple-800 list-disc list-inside space-y-1">
                    {assessmentResult.llmAnalysis.keyFindings.map((finding: string, idx: number) => (
                      <li key={idx}>{finding}</li>
                    ))}
                  </ul>
                </div>
              )}
              {assessmentResult.llmAnalysis.recommendations && (
                <div>
                  <p className="text-sm font-semibold text-purple-900 mb-1">Recommendations:</p>
                  <p className="text-sm text-purple-800">{assessmentResult.llmAnalysis.recommendations}</p>
                </div>
              )}
            </div>
          )}

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
  const answerOptions = questionnaire.answerOptions || ["yes", "no", "sometimes"]

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
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          {questionnaire.questions[currentQuestion].text}
        </h2>

        <div className="space-y-3 mb-8">
          {answerOptions.map((option) => (
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
            <Button className="flex-1" onClick={handleSubmit} disabled={!allAnswered || submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Submit Assessment
                </>
              )}
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
