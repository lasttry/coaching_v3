// src/app/api/clubs/route.ts

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createClubSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1).max(10),
  image: z.string().nullable().optional(),
  foregroundColor: z.string().regex(/^#[0-9A-F]{6}$/i),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i),
});

// GET /api/clubs - Listar clubes (Admin apenas)
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clubs = await prisma.club.findMany({
      include: {
        seasons: {
          where: { active: true },
          orderBy: { createdAt: 'desc' },
        },
        clubUsers: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        _count: {
          select: { clubUsers: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(clubs);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/clubs - Criar clube (Admin apenas)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createClubSchema.parse(body);

    const club = await prisma.club.create({
      data: validatedData,
    });

    // Criar uma season padrão
    await prisma.season.create({
      data: {
        name: `Época ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
        startDate: new Date(),
        clubId: club.id,
        active: true,
      },
    });

    return NextResponse.json(club, { status: 201 });
  } catch (error) {
    console.error('Error creating club:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}