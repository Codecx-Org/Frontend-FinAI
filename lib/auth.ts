// Authentication utilities

import type { User } from "./types"

const AUTH_TOKEN_KEY = "finai_auth_token"
const AUTH_USER_KEY = "finai_auth_user"

export const authUtils = {
  setAuth: (token: string, user: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    }
  },

  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(AUTH_TOKEN_KEY)
    }
    return null
  },

  getUser: (): User | null => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(AUTH_USER_KEY)
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  },

  updateUser: (updates: Partial<User>) => {
    if (typeof window !== "undefined") {
      const currentUser = authUtils.getUser()
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates }
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser))
      }
    }
  },

  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
    }
  },

  isAuthenticated: (): boolean => {
    return !!authUtils.getToken()
  },
}
