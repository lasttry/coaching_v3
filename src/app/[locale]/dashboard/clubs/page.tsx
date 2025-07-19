// src/app/[locale]/dashboard/clubs/page.tsx

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAllClubs } from '@/lib/clubs';
import { ClubsTable } from '@/components/clubs/ClubsTable';
import { CreateClubButton } from '@/components/clubs/CreateClubButton';
import { getTranslations } from 'next-intl/server';

export default async function ClubsPage() {
  const session = await auth();
  const t = await getTranslations('clubs');
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const clubs = await getAllClubs();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600">{t('description')}</p>
        </div>
        <CreateClubButton />
      </div>

      <ClubsTable clubs={clubs} />
    </div>
  );
}