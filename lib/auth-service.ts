import { apiClient } from "./api-client"

export interface AuthResponse {
  access: string
  refresh: string
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
    const response = await apiClient.post<AuthResponse>("/register/", data, false)
    if (response.success && response.data) {
      localStorage.setItem("access_token", response.data.access)
      localStorage.setItem("refresh_token", response.data.refresh)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      return response.data
    }
    return null
  },

  async login(email: string, password: string): Promise<AuthResponse | null> {
    const response = await apiClient.post<AuthResponse>("/login/", { email, password }, false)
    if (response.success && response.data) {
      localStorage.setItem("access_token", response.data.access)
      localStorage.setItem("refresh_token", response.data.refresh)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      return response.data
    }
    return null
  },

  logout(): void {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
  },

  getUser() {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
      return user ? JSON.parse(user) : null
    }
    return null
  },

  isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("access_token")
    }
    return false
  },
}
