"use client"

import { useState } from "react"
import { Mail, Lock, Loader2, AlertCircle, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

interface LoginPageProps {
  onSwitchToSignup: () => void
}

export function LoginPage({ onSwitchToSignup }: LoginPageProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await login(email, password)
    
    if (!result.success) {
      setError(result.error || "Login failed")
    }
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
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

        {/* Login Card */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-8 backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative">
            <h2 className="mb-6 text-xl font-semibold text-foreground">Welcome back</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-border/50 bg-secondary/50 pl-10 focus:border-primary/50"
                    required
                  />
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
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {"Don't have an account? "}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="font-medium text-primary hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>

            {/* Demo credentials */}
            <div className="mt-6 rounded-lg border border-border/30 bg-secondary/30 p-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><span className="text-foreground">Doctor:</span> doctor@demo.com / demo123</p>
                <p><span className="text-foreground">Technician:</span> tech@demo.com / demo123</p>
                <p><span className="text-foreground">Admin:</span> admin@demo.com / demo123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
