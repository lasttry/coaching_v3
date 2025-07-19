import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ClubSelectionForm } from '@/components/clubs/ClubSelectionForm';
import { getUserClubs } from '@/lib/clubs';
import { getTranslations } from 'next-intl/server';

export default async function SelectClubPage() {
  const session = await auth();
  const t = await getTranslations('clubs');
  
  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role === 'ADMIN') {
    redirect('/dashboard');
  }

  const userClubs = await getUserClubs(session.user.id);
  
  if (userClubs.length === 0) {
    redirect('/no-access');
  }

  if (userClubs.length === 1) {
    redirect(`/dashboard?clubId=${userClubs[0].club.id}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('selectClub')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('selectClubDescription')}
          </p>
        </div>
        <ClubSelectionForm clubs={userClubs} />
      </div>
    </div>
  );
}
