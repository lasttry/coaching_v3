"use client"

import { LoginForm } from "@/components/auth/LoginForm"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  
  useEffect(() => {
    if (status !== "loading" && session) {
      const locale = params.locale || 'pt'
      router.push(`/${locale}/dashboard`)
    }
  }, [session, status, router, params])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (session) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginForm />
      </div>
    </div>
  )
}
