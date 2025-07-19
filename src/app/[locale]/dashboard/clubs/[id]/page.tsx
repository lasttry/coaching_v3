// src/app/[locale]/dashboard/clubs/[id]/page.tsx

import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { getClubById } from '@/lib/clubs';
import { ClubDetails } from '@/components/clubs/ClubDetails';
import { ClubUsersManager } from '@/components/clubs/ClubUsersManager';
import { getTranslations } from 'next-intl/server';

interface ClubDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function ClubDetailPage({ params }: ClubDetailPageProps) {
  const { id } = await params;
  const session = await auth();
  const t = await getTranslations('clubs');
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const club = await getClubById(id);
  
  if (!club) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        {club.image ? (
          <img src={club.image} alt={club.name} className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: club.backgroundColor, color: club.foregroundColor }}
          >
            {club.shortName.substring(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{club.name}</h1>
          <p className="text-gray-600">
            {club.shortName} • {club.clubUsers.length} {t('members')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClubDetails club={club} />
        <ClubUsersManager club={club} />
      </div>
    </div>
  );
}