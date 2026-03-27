"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import type { User, UserRole } from "@/lib/dicom-types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ❌ REMOVED DEMO USERS (fake system removed)
// const DEMO_USERS = [...]

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null)

  // ❌ REMOVED fake registeredUsers state
  // const [registeredUsers, setRegisteredUsers] = useState(...)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = sessionStorage.getItem("pacs_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        sessionStorage.removeItem("pacs_user")
      }
    }
    setIsLoading(false)
  }, [])

  // =========================
  // 🔥 LOGIN (CONNECTED TO BACKEND)
  // =========================
  const login = useCallback(async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await response.json()

      if (data.error) {
        return { success: false, error: data.error }
      }

      // 🔥 CHANGED: create user from backend response
      const userData: User = {
        id: "temp-id", // backend not sending id (can improve later)
        name: email,   // backend not sending name
        email: email,
        role: data.role
      }

      setUser(userData)
      sessionStorage.setItem("pacs_user", JSON.stringify(userData))

      return { success: true }

    } catch (err) {
      return { success: false, error: "Server error" }
    }

  }, [])

  // =========================
  // 🔥 SIGNUP (CONNECTED TO BACKEND)
  // =========================
  const signup = useCallback(async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {

    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          // 🔥 CHANGED: sending correct fields to backend
          email: email,
          password: password,
          role: role
        })
      })

      const data = await response.json()

      if (data.error) {
        return { success: false, error: data.error }
      }

      // 🔥 CHANGED: no local storage user creation here
      return { success: true }

    } catch (err) {
      return { success: false, error: "Server error" }
    }

  }, [])

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem("pacs_user")
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}