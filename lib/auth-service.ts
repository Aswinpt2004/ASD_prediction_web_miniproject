import { apiClient } from "./api-client"

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    role: "caretaker" | "doctor" | "admin"
  }
}

export const authService = {
  async register(data: {
    email: string
    password: string
    name: string
    role: "caretaker" | "doctor" | "admin"
  }): Promise<AuthResponse | null> {
    try {
      const response = await apiClient.post<AuthResponse>("/api/auth/register", data, false)

      if (!response.success || !response.data) {
        throw new Error(response.error || "Registration failed")
      }

      // Store token and user info
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      return response.data
    } catch (error) {
      console.error("Registration error:", error instanceof Error ? error.message : error)
      throw error
    }
  },

  async login(email: string, password: string): Promise<AuthResponse | null> {
    try {
      const response = await apiClient.post<AuthResponse>("/api/auth/login", { email, password }, false)

      if (!response.success || !response.data) {
        throw new Error(response.error || "Login failed")
      }

      // Store token and user info
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      return response.data
    } catch (error) {
      console.error("Login error:", error)
      return null
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  async getUser(): Promise<AuthResponse["user"] | null> {
    try {
      const userStr = localStorage.getItem("user")
      if (!userStr) return null
      return JSON.parse(userStr)
    } catch (error) {
      console.error("Get user error:", error)
      return null
    }
  },

  async isAuthenticated(): Promise<boolean> {
    return !!localStorage.getItem("token")
  },
}
