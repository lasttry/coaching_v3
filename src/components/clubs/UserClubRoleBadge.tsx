// src/components/clubs/UserClubRoleBadge.tsx

'use client';

import { useTranslations } from 'next-intl';
import type { UserClubRoleBadgeProps } from '@/types/club';

export function UserClubRoleBadge({ role }: UserClubRoleBadgeProps) {
  const t = useTranslations('clubRoles');

  const getColorClasses = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'bg-purple-100 text-purple-800';
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800';
      case 'COACH':
        return 'bg-green-100 text-green-800';
      case 'MEMBER':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClasses(role)}`}>
      {t(role)}
    </span>
  );
}
