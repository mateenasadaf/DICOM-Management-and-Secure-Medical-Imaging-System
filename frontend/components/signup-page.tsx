"use client"

import { useState } from "react"
import { Mail, Lock, User, Loader2, AlertCircle, Activity, Stethoscope, Wrench, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import type { UserRole } from "@/lib/dicom-types"

interface SignupPageProps {
  onSwitchToLogin: () => void
}

const ROLES: { value: UserRole; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: "doctor",
    label: "Doctor",
    icon: <Stethoscope className="h-5 w-5" />,
    description: "View and analyze patient studies",
  },
  {
    value: "technician",
    label: "Technician",
    icon: <Wrench className="h-5 w-5" />,
    description: "Upload and manage DICOM files",
  },
  {
    value: "admin",
    label: "Admin",
    icon: <Shield className="h-5 w-5" />,
    description: "Full system access and user management",
  },
]

export function SignupPage({ onSwitchToLogin }: SignupPageProps) {
  const { signup } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("doctor")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    const result = await signup(name, email, password, role)

    if (!result.success) {
      setError(result.error || "Signup failed")
    } else {
      // 🔥 ADDED: go to login page after signup
      onSwitchToLogin()
    }
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="pointer-events-none fixed -left-40 top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none fixed -right-40 bottom-20 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo/Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
            <Activity className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">DICOM PACS</h1>
          <p className="mt-1 text-sm text-muted-foreground">Medical Imaging System</p>
        </div>

        {/* Signup Card */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-8 backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative">
            <h2 className="mb-6 text-xl font-semibold text-foreground">Create Account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Dr. John Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-border/50 bg-secondary/50 pl-10 focus:border-primary/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-border/50 bg-secondary/50 pl-10 focus:border-primary/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-border/50 bg-secondary/50 pl-10 focus:border-primary/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Role</label>
                <div className="grid grid-cols-1 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                        role === r.value
                          ? "border-primary bg-primary/10 ring-1 ring-primary/50"
                          : "border-border/50 bg-secondary/30 hover:border-primary/30 hover:bg-secondary/50"
                      }`}
                    >
                      <div className={`rounded-lg p-2 ${
                        role === r.value ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                      }`}>
                        {r.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${role === r.value ? "text-foreground" : "text-foreground"}`}>
                          {r.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{r.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
