"use client"

import { Activity, Database, LogOut, Stethoscope, Wrench, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export function DashboardHeader() {
  const { user, logout } = useAuth()

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'doctor':
        return <Stethoscope className="h-4 w-4" />
      case 'technician':
        return <Wrench className="h-4 w-4" />
      case 'admin':
        return <Shield className="h-4 w-4" />
      default:
        return null
    }
  }

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'doctor':
        return 'Doctor'
      case 'technician':
        return 'Technician'
      case 'admin':
        return 'Admin'
      default:
        return ''
    }
  }

  return (
    <header className="relative border-b border-border/50 bg-card/80 backdrop-blur-xl">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
      
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Logo with pulse animation */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-md" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              DICOM PACS Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Medical Imaging System
            </p>
          </div>
        </div>

        {/* Status and User Info */}
        <div className="flex items-center gap-4">
          {/* Status indicator */}
          <div className="hidden items-center gap-3 rounded-full border border-border/50 bg-secondary/50 px-4 py-2 sm:flex">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Connected</span>
            </div>
          </div>

          {/* User info and logout */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {getRoleIcon()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{getRoleLabel()}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
