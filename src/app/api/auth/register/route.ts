import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcryptjs from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'COACH', 'CLIENT']).optional().default('CLIENT')
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, role } = registerSchema.parse(body)

    // Verificar se o utilizador já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Utilizador já existe' }, 
        { status: 400 }
      )
    }

    // Hash da password
    const hashedPassword = await bcryptjs.hash(password, 12)

    // Criar utilizador
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors }, 
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    )
  }
}
