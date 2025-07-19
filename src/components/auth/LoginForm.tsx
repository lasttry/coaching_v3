"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import Link from "next/link"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const t = useTranslations()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    setIsLoading(true)
    
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(t('auth.invalidCredentials'))
      } else {
        // Extrair o locale atual do pathname
        const currentPath = window.location.pathname
        const locale = currentPath.split('/')[1] || 'pt'
        
        // Redirecionar para o dashboard com o locale correto
        window.location.href = `/${locale}/dashboard`
      }
    } catch (error) {
      toast.error("Erro inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('auth.loginTitle')}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('common.email')}
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('common.password')}
          </label>
          <input
            type="password"
            {...register("password")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? "A carregar..." : t('auth.loginButton')}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        {t('auth.needAccount')}{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          {t('common.register')}
        </Link>
      </p>
    </div>
  )
}