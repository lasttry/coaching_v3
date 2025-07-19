import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcryptjs from 'bcryptjs'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, role, password } = await request.json()

    switch (action) {
      case 'updateRole':
        await prisma.user.update({
          where: { id },
          data: { role }
        })
        break

      case 'toggleActive':
        const user = await prisma.user.findUnique({ where: { id } })
        await prisma.user.update({
          where: { id },
          data: { active: !user?.active }
        })
        break

      case 'resetPassword':
        const hashedPassword = await bcryptjs.hash(password, 12)
        await prisma.user.update({
          where: { id },
          data: { password: hashedPassword }
        })
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
