// src/app/[locale]/dashboard/page.tsx

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { getUserClubs, getCurrentClubFromUrl } from '@/lib/clubs';
import { getTranslations } from 'next-intl/server';

interface DashboardPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth();
  const t = await getTranslations('dashboard');
  
  if (!session?.user) {
    redirect('/login');
  }

  // Buscar searchParams de forma segura
  let params: { [key: string]: string | string[] | undefined } = {};
  
  try {
    if (searchParams) {
      params = await searchParams;
    }
  } catch (error) {
    console.warn('Error reading searchParams:', error);
    params = {};
  }

  // Se for ADMIN, pode trabalhar sem clube
  if (session.user.role === 'ADMIN') {
    let currentClub = null;
    
    try {
      currentClub = await getCurrentClubFromUrl(
        new URLSearchParams(params as Record<string, string>), 
        session.user.id
      );
    } catch (error) {
      console.warn('Error getting current club:', error);
    }
    
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold club-text">
            {t('welcome')}, {session.user.name || session.user.email}
          </h1>
          {currentClub && (
            <p className="text-gray-600">
              {t('workingWith')} {currentClub.name}
            </p>
          )}
        </div>
        
        <DashboardStats currentClub={currentClub} />
      </div>
    );
  }

  // Para outros utilizadores, verificar clubes
  const userClubs = await getUserClubs(session.user.id);
  
  // Se não tem clubes, redirecionar para página sem acesso
  if (userClubs.length === 0) {
    redirect('/no-access');
  }

  // Se tem apenas um clube, usar automaticamente
  if (userClubs.length === 1 && !params.clubId) {
    redirect(`/dashboard?clubId=${userClubs[0].club.id}`);
  }

  // Se tem múltiplos clubes e não especificou um, redirecionar para seleção
  if (userClubs.length > 1 && !params.clubId) {
    redirect('/select-club');
  }

  let currentClub = null;
  
  try {
    currentClub = await getCurrentClubFromUrl(
      new URLSearchParams(params as Record<string, string>), 
      session.user.id
    );
  } catch (error) {
    console.warn('Error getting current club:', error);
  }
  
  // Se não encontrou clube válido, redirecionar para seleção
  if (!currentClub) {
    redirect('/select-club');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold club-text">
          {t('welcome')}, {session.user.name || session.user.email}
        </h1>
        <p className="text-gray-600">
          {t('workingWith')} {currentClub.name}
        </p>
      </div>
      
      <DashboardStats currentClub={currentClub} />
    </div>
  );
}