const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
const API_ADMIN_PATH = "/api/admin"

export class ApiService {
  private static getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (includeAuth && typeof window !== "undefined") {
      const token = localStorage.getItem("upconnection_admin_token")
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    return headers
  }

  static async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await fetch(`${API_BASE_URL}${API_ADMIN_PATH}/login`, {
      method: "POST",
      headers: this.getHeaders(false),
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Erro de autenticação" }))
      throw new Error(error.message || "Credenciais inválidas")
    }

    return response.json()
  }

  static async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}${API_ADMIN_PATH}/auth/logout`, {
        method: "POST",
        headers: this.getHeaders(),
      })
    } catch (error) {
      console.warn("Erro ao fazer logout no servidor:", error)
    } finally {
      // Always clear local storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("upconnection_admin_token")
        localStorage.removeItem("upconnection_admin_user")
      }
    }
  }

  static async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${API_ADMIN_PATH}${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("upconnection_admin_token")
          localStorage.removeItem("upconnection_admin_user")
          window.location.href = "/login"
        }
      }
      const error = await response.json().catch(() => ({ message: "Erro na requisição" }))
      throw new Error(error.message || `API Error: ${response.statusText}`)
    }

    return response.json()
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${API_ADMIN_PATH}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("upconnection_admin_token")
          localStorage.removeItem("upconnection_admin_user")
          window.location.href = "/login"
        }
      }
      const error = await response.json().catch(() => ({ message: "Erro na requisição" }))
      throw new Error(error.message || `API Error: ${response.statusText}`)
    }

    return response.json()
  }

  static async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${API_ADMIN_PATH}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("upconnection_admin_token")
          localStorage.removeItem("upconnection_admin_user")
          window.location.href = "/login"
        }
      }
      const error = await response.json().catch(() => ({ message: "Erro na requisição" }))
      throw new Error(error.message || `API Error: ${response.statusText}`)
    }

    return response.json()
  }

  static async patch<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${API_ADMIN_PATH}${endpoint}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("upconnection_admin_token")
          localStorage.removeItem("upconnection_admin_user")
          window.location.href = "/login"
        }
      }
      const error = await response.json().catch(() => ({ message: "Erro na requisição" }))
      throw new Error(error.message || `API Error: ${response.statusText}`)
    }

    return response.json()
  }


  static async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${API_ADMIN_PATH}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("upconnection_admin_token")
          localStorage.removeItem("upconnection_admin_user")
          window.location.href = "/login"
        }
      }
      const error = await response.json().catch(() => ({ message: "Erro na requisição" }))
      throw new Error(error.message || `API Error: ${response.statusText}`)
    }

    return response.json()
  }
}
