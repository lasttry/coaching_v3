// src/app/api/clubs/[id]/users/route.ts

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const addUserSchema = z.object({
  userId: z.string(),
  role: z.enum(['OWNER', 'MANAGER', 'COACH', 'MEMBER']),
});

// GET /api/clubs/[id]/users - Listar utilizadores do clube
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clubUsers = await prisma.clubUser.findMany({
      where: { clubId: id },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true, active: true },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    return NextResponse.json(clubUsers);
  } catch (error) {
    console.error('Error fetching club users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/clubs/[id]/users - Adicionar utilizador ao clube
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, role } = addUserSchema.parse(body);

    // Verificar se o utilizador já está no clube
    const existingClubUser = await prisma.clubUser.findUnique({
      where: {
        userId_clubId: {
          userId,
          clubId: id,
        },
      },
    });

    if (existingClubUser) {
      return NextResponse.json({ error: 'User already in club' }, { status: 400 });
    }

    const clubUser = await prisma.clubUser.create({
      data: {
        userId,
        clubId: id,
        role,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
        club: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(clubUser, { status: 201 });
  } catch (error) {
    console.error('Error adding user to club:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}