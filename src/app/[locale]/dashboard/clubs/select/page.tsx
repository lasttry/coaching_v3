// src/app/[locale]/dashboard/clubs/select/page.tsx
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import ClubSelector from '@/components/clubs/ClubSelector';
import ClubSelectorDebug from '@/components/clubs/ClubSelectorDebug';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ClubSelectPage({ params }: PageProps) {
  const { locale } = await params;
  const session = await auth();
  const t = await getTranslations('clubs');

  if (!session) {
    redirect(`/${locale}/login`);
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('select.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('select.subtitle')}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Suspense fallback={
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            }>
              <ClubSelectorDebug locale={locale} />
            </Suspense>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}