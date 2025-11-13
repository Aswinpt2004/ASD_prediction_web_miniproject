import { apiClient } from './api-client'

export interface Question {
  text: string
  order: number
}

export interface ScoringRule {
  minScore: number
  maxScore?: number
  riskLevel: 'Low' | 'Medium' | 'Moderate' | 'High'
  description?: string
}

export interface Questionnaire {
  _id: string
  name: string
  fullName: string
  description?: string
  questions: Question[]
  answerOptions: string[]
  scoringRules: ScoringRule[]
  scoringInfo?: string
  duration?: string
  ageRange?: string
  isActive: boolean
  createdBy?: string
  createdAt: string
  updatedAt: string
}

export interface CreateQuestionnaireData {
  name: string
  fullName: string
  description?: string
  questions: Question[]
  answerOptions?: string[]
  scoringRules: ScoringRule[]
  scoringInfo?: string
  duration?: string
  ageRange?: string
}

class QuestionnaireService {
  // Get all active questionnaires (for caretakers/doctors)
  async getActiveQuestionnaires(): Promise<Questionnaire[]> {
    try {
      const response = await apiClient.get('/api/questionnaires/active')
      return response.data as Questionnaire[]
    } catch (error) {
      console.error('[QuestionnaireService] Error fetching active questionnaires:', error)
      throw error
    }
  }

  // Get all questionnaires (admin only)
  async getAllQuestionnaires(): Promise<Questionnaire[]> {
    try {
      const response = await apiClient.get('/api/questionnaires/all')
      return response.data as Questionnaire[]
    } catch (error) {
      console.error('[QuestionnaireService] Error fetching all questionnaires:', error)
      throw error
    }
  }

  // Get single questionnaire by ID
  async getQuestionnaireById(id: string): Promise<Questionnaire> {
    try {
      const response = await apiClient.get(`/api/questionnaires/${id}`)
      return response.data as Questionnaire
    } catch (error) {
      console.error('[QuestionnaireService] Error fetching questionnaire:', error)
      throw error
    }
  }

  // Create new questionnaire (admin only)
  async createQuestionnaire(data: CreateQuestionnaireData): Promise<Questionnaire> {
    try {
      const response = await apiClient.post('/api/questionnaires/create', data)
      return (response.data as any).questionnaire
    } catch (error) {
      console.error('[QuestionnaireService] Error creating questionnaire:', error)
      throw error
    }
  }

  // Bulk import questionnaires (admin only)
  async bulkImport(items: CreateQuestionnaireData[]): Promise<{ insertedCount: number }> {
    try {
      const response = await apiClient.post('/api/questionnaires/bulk', { items })
      return { insertedCount: (response.data as any).insertedCount ?? 0 }
    } catch (error) {
      console.error('[QuestionnaireService] Error bulk importing questionnaires:', error)
      throw error
    }
  }

  // Update questionnaire (admin only)
  async updateQuestionnaire(id: string, data: Partial<CreateQuestionnaireData> & { isActive?: boolean }): Promise<Questionnaire> {
    try {
      const response = await apiClient.put(`/api/questionnaires/${id}`, data)
      return (response.data as any).questionnaire
    } catch (error) {
      console.error('[QuestionnaireService] Error updating questionnaire:', error)
      throw error
    }
  }

  // Delete questionnaire (admin only)
  async deleteQuestionnaire(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/questionnaires/${id}`)
    } catch (error) {
      console.error('[QuestionnaireService] Error deleting questionnaire:', error)
      throw error
    }
  }
}

export const questionnaireService = new QuestionnaireService()
