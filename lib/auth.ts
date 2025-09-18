export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "moderator"
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

import { ApiService } from "./services/api"

export class AuthService {
  private static TOKEN_KEY = "upconnection_admin_token"
  private static USER_KEY = "upconnection_admin_user"

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('oi 1.1');
      const response = await ApiService.login(credentials.email, credentials.password)
      
      // Store in localStorage and cookies
      localStorage.setItem(this.TOKEN_KEY, response.token)
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user))

      document.cookie = `${this.TOKEN_KEY}=${response.token}; path=/; max-age=86400; SameSite=Lax`

      return response
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Erro ao fazer login")
    }
  }

  static async logout(): Promise<void> {
    try {
      await ApiService.logout()
    } catch (error) {
      console.warn("Erro ao fazer logout:", error)
    }

    // Always clear local data
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    document.cookie = `${this.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }

  static getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static getUser(): User | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem(this.USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }
}
