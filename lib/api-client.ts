const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002"

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    console.log("[v0] API Client initialized with base URL:", this.baseUrl)
  }

  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (includeAuth) {
      const token = this.getToken()
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
    }

    return headers
  }

  async post<T>(endpoint: string, data?: any, includeAuth = true): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      console.log("[v0] POST request to:", url)

      const response = await fetch(url, {
        method: "POST",
        headers: this.getHeaders(includeAuth),
        body: JSON.stringify(data),
      })

      const result = await response.json()
      console.log("[v0] Response status:", response.status, "Data:", result)

      if (!response.ok) {
        return { success: false, error: result.error || result.message || "Request failed" }
      }

      return { success: true, data: result }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error"
      console.error("[v0] API Error:", errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  async get<T>(endpoint: string, includeAuth = true): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      console.log("[v0] GET request to:", url)

      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(includeAuth),
      })

      const result = await response.json()
      console.log("[v0] Response status:", response.status, "Data:", result)

      if (!response.ok) {
        return { success: false, error: result.error || result.message || "Request failed" }
      }

      return { success: true, data: result }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error"
      console.error("[v0] API Error:", errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  async put<T>(endpoint: string, data?: any, includeAuth = true): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      console.log("[v0] PUT request to:", url)

      const response = await fetch(url, {
        method: "PUT",
        headers: this.getHeaders(includeAuth),
        body: JSON.stringify(data),
      })

      const result = await response.json()
      console.log("[v0] Response status:", response.status, "Data:", result)

      if (!response.ok) {
        return { success: false, error: result.error || result.message || "Request failed" }
      }

      return { success: true, data: result }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error"
      console.error("[v0] API Error:", errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  async delete<T>(endpoint: string, includeAuth = true): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      console.log("[v0] DELETE request to:", url)

      const response = await fetch(url, {
        method: "DELETE",
        headers: this.getHeaders(includeAuth),
      })

      const result = await response.json()
      console.log("[v0] Response status:", response.status, "Data:", result)

      if (!response.ok) {
        return { success: false, error: result.error || result.message || "Request failed" }
      }

      return { success: true, data: result }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error"
      console.error("[v0] API Error:", errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      console.log("[v0] File upload to:", url)

      const formData = new FormData()
      formData.append("file", file)

      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, String(value))
        })
      }

      const headers: HeadersInit = {}
      const token = this.getToken()
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      })

      const result = await response.json()
      console.log("[v0] Upload response status:", response.status, "Data:", result)

      if (!response.ok) {
        return { success: false, error: result.error || result.message || "Upload failed" }
      }

      return { success: true, data: result }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error"
      console.error("[v0] Upload Error:", errorMsg)
      return { success: false, error: errorMsg }
    }
  }
}

export const apiClient = new ApiClient()
