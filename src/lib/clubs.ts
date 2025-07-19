// src/lib/clubs.ts

import { prisma } from './prisma';
import type { ClubWithUser, ClubWithDetails } from '@/types/club';

export async function getUserClubs(userId: string): Promise<ClubWithUser[]> {
  try {
    const clubUsers = await prisma.clubUser.findMany({
      where: { userId },
      include: {
        club: true,
      },
      orderBy: { joinedAt: 'desc' },
    });

    return clubUsers.map(cu => ({
      club: cu.club,
      role: cu.role as ClubWithUser['role'],
      joinedAt: cu.joinedAt,
    }));
  } catch (error) {
    console.error('Error fetching user clubs:', error);
    return [];
  }
}

export async function getUserDefaultClub(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        defaultClub: true,
      },
    });

    return user?.defaultClub || null;
  } catch (error) {
    console.error('Error fetching default club:', error);
    return null;
  }
}

export async function getClubById(clubId: string): Promise<ClubWithDetails | null> {
  try {
    return await prisma.club.findUnique({
      where: { id: clubId },
      include: {
        seasons: {
          orderBy: { createdAt: 'desc' },
        },
        clubUsers: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true, active: true },
            },
          },
        },
        _count: {
          select: { clubUsers: true },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching club by ID:', error);
    return null;
  }
}

export async function getAllClubs(): Promise<ClubWithDetails[]> {
  try {
    return await prisma.club.findMany({
      include: {
        seasons: {
          where: { active: true },
          orderBy: { createdAt: 'desc' },
        },
        clubUsers: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true, active: true },
            },
          },
        },
        _count: {
          select: { clubUsers: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching all clubs:', error);
    return [];
  }
}

export async function userHasAccessToClub(userId: string, clubId: string): Promise<boolean> {
  try {
    // Admins têm acesso a todos os clubes
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role === 'ADMIN') {
      return true;
    }

    // Verificar se o utilizador pertence ao clube
    const clubUser = await prisma.clubUser.findUnique({
      where: {
        userId_clubId: {
          userId,
          clubId,
        },
      },
    });

    return !!clubUser;
  } catch (error) {
    console.error('Error checking club access:', error);
    return false;
  }
}

export async function getCurrentClubFromUrl(searchParams: URLSearchParams, userId: string) {
  try {
    const clubIdFromUrl = searchParams.get('clubId');
    
    if (clubIdFromUrl) {
      // Verificar se o utilizador tem acesso
      const hasAccess = await userHasAccessToClub(userId, clubIdFromUrl);
      if (hasAccess) {
        const club = await getClubById(clubIdFromUrl);
        if (club) return club;
      }
    }

    // Se não tem clube na URL ou não tem acesso, verificar clube padrão
    const defaultClub = await getUserDefaultClub(userId);
    if (defaultClub) {
      const hasAccess = await userHasAccessToClub(userId, defaultClub.id);
      if (hasAccess) {
        const club = await getClubById(defaultClub.id);
        if (club) return club;
      }
    }

    // Se não tem clube padrão ou não tem acesso, retornar o primeiro clube do utilizador
    const userClubs = await getUserClubs(userId);
    if (userClubs.length > 0) {
      const club = await getClubById(userClubs[0].club.id);
      if (club) return club;
    }

    return null;
  } catch (error) {
    console.error('Error getting current club from URL:', error);
    return null;
  }
}