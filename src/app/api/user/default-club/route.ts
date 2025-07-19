import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const defaultClubSchema = z.object({
  clubId: z.string().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { clubId } = defaultClubSchema.parse(body);

    if (clubId) {
      const clubUser = await prisma.clubUser.findUnique({
        where: {
          userId_clubId: {
            userId: session.user.id,
            clubId,
          },
        },
      });

      if (!clubUser) {
        return NextResponse.json({ error: 'User not in club' }, { status: 400 });
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { defaultClubId: clubId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting default club:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
