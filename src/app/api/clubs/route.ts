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
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  // Buscar info do user (inclui o campo defaultClubId e role)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, defaultClubId: true },
  });

  let clubs;
  console.log(userId)
  console.log(user);
  console.log(user?.role);
  if (user?.role === "ADMIN") {
    clubs = await prisma.club.findMany();
  } else {
    clubs = await prisma.club.findMany({
      where: {
        clubUsers: {
          some: {
            userId: userId,
          },
        },
      },
    });
  }

  return NextResponse.json({
    clubs,
    defaultClubId: user?.defaultClubId || null,
  });
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