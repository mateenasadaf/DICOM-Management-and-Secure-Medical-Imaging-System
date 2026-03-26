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

// Demo users for UI showcase (in production, this would connect to a real backend)
const DEMO_USERS: (User & { password: string })[] = [
  { id: "1", name: "Dr. Sarah Johnson", email: "doctor@demo.com", password: "demo123", role: "doctor" },
  { id: "2", name: "Mike Chen", email: "tech@demo.com", password: "demo123", role: "technician" },
  { id: "3", name: "Admin User", email: "admin@demo.com", password: "demo123", role: "admin" },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [registeredUsers, setRegisteredUsers] = useState<(User & { password: string })[]>(DEMO_USERS)

  useEffect(() => {
    // Check for existing session
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

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 500))

    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      sessionStorage.setItem("pacs_user", JSON.stringify(userWithoutPassword))
      return { success: true }
    }

    return { success: false, error: "Invalid email or password" }
  }, [registeredUsers])

  const signup = useCallback(async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 500))

    // Check if email already exists
    const existingUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )

    if (existingUser) {
      return { success: false, error: "Email already registered" }
    }

    // Create new user
    const newUser: User & { password: string } = {
      id: `user_${Date.now()}`,
      name,
      email,
      password,
      role,
    }

    setRegisteredUsers((prev) => [...prev, newUser])
    
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    sessionStorage.setItem("pacs_user", JSON.stringify(userWithoutPassword))

    return { success: true }
  }, [registeredUsers])

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
