// src/app/api/clubs/[id]/route.ts

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const updateClubSchema = z.object({
  name: z.string().min(1).optional(),
  shortName: z.string().min(1).max(10).optional(),
  image: z.string().nullable().optional(),
  foregroundColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
});

// GET /api/clubs/[id] - Obter clube específico
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

    const club = await prisma.club.findUnique({
      where: { id },
      include: {
        seasons: {
          orderBy: { createdAt: 'desc' },
        },
        clubUsers: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
        },
      },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    // Verificar se o utilizador tem acesso ao clube
    if (session.user.role !== 'ADMIN') {
      const hasAccess = club.clubUsers.some(cu => cu.userId === session.user.id);
      if (!hasAccess) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    return NextResponse.json(club);
  } catch (error) {
    console.error('Error fetching club:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/clubs/[id] - Atualizar clube
export async function PATCH(
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
    const validatedData = updateClubSchema.parse(body);

    const club = await prisma.club.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(club);
  } catch (error) {
    console.error('Error updating club:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/clubs/[id] - Eliminar clube
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.club.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting club:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}