// src/app/api/user/clubs/route.ts

import { auth } from '@/lib/auth';
import { getUserClubs } from '@/lib/clubs';
import { NextResponse } from 'next/server';

// GET /api/user/clubs - Obter clubes do utilizador atual
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userClubs = await getUserClubs(session.user.id);
    
    return NextResponse.json(userClubs);
  } catch (error) {
    console.error('Error fetching user clubs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}