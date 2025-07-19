"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requiredRole?: string
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  requiredRole 
}: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === "loading") return

    // Extrair locale do pathname
    const locale = pathname.split('/')[1] || 'pt'

    if (requireAuth && !session) {
      router.push(`/${locale}/login`)
      return
    }

    if (requiredRole && session?.user.role !== requiredRole) {
      router.push(`/${locale}/dashboard`)
      return
    }
  }, [session, status, router, requireAuth, requiredRole, pathname])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (requireAuth && !session) {
    return null
  }

  if (requiredRole && session?.user.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}