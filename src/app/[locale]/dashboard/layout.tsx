// src/app/[locale]/dashboard/layout.tsx

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { getUserClubs, getCurrentClubFromUrl } from '@/lib/clubs';

interface DashboardLayoutPageProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardLayoutPage({ 
  children, 
  params, 
  searchParams 
}: DashboardLayoutPageProps) {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  const userClubs = await getUserClubs(session.user.id);
  
  // Buscar searchParams de forma segura
  let searchParamsData: { [key: string]: string | string[] | undefined } = {};
  
  try {
    if (searchParams) {
      searchParamsData = await searchParams;
    }
  } catch (error) {
    console.warn('Error reading searchParams:', error);
    searchParamsData = {};
  }
  
  // SEMPRE buscar o clube atual fresh da base de dados
  let currentClub = null;
  
  // Se tem clubId na URL, usar esse
  const clubIdFromUrl = searchParamsData?.clubId as string;
  if (clubIdFromUrl) {
    try {
      currentClub = await getCurrentClubFromUrl(
        new URLSearchParams({ clubId: clubIdFromUrl }), 
        session.user.id
      );
    } catch (error) {
      console.warn('Error getting club from URL:', error);
    }
  }
  
  // Se não encontrou clube da URL, tentar buscar o padrão
  if (!currentClub && userClubs.length > 0) {
    try {
      currentClub = await getCurrentClubFromUrl(
        new URLSearchParams(searchParamsData as Record<string, string>), 
        session.user.id
      );
    } catch (error) {
      console.warn('Error getting default club:', error);
    }
  }

  // Criar key único para forçar re-render quando necessário
  const layoutKey = currentClub 
    ? `${currentClub.id}-${currentClub.foregroundColor}-${currentClub.backgroundColor}`
    : 'no-club';

  return (
    <DashboardLayout 
      currentClub={currentClub} 
      userClubs={userClubs}
      userRole={session.user.role || 'CLIENT'}
      key={layoutKey}
    >
      {children}
    </DashboardLayout>
  );
}