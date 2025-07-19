// src/app/api/clubs/[id]/users/[userId]/route.ts

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// DELETE /api/clubs/[id]/users/[userId] - Remover utilizador do clube
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const { id, userId } = await params;
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.clubUser.delete({
      where: {
        userId_clubId: {
          userId,
          clubId: id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing user from club:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}