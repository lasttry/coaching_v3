// src/app/[locale]/dashboard/users/page.tsx

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UsersTable } from '@/components/users/UsersTable';
import { AddUserButton } from '@/components/users/AddUserButton';
import { getTranslations } from 'next-intl/server';

export default async function UsersPage() {
  const session = await auth();
  const t = await getTranslations('users');
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const users = await prisma.user.findMany({
    include: {
      clubUsers: {
        include: {
          club: {
            select: { id: true, name: true, shortName: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600">{t('description')}</p>
        </div>
        <AddUserButton />
      </div>

      <UsersTable users={users} />
    </div>
  );
}