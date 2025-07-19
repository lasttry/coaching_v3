// src/components/clubs/ClubsTable.tsx

'use client';

import { useState } from 'react';
import { PencilIcon, TrashIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import type { ClubsTableProps } from '@/types/club';

export function ClubsTable({ clubs: initialClubs }: ClubsTableProps) {
  const [clubs, setClubs] = useState(initialClubs);
  const router = useRouter();
  const t = useTranslations('clubs');

  const handleDeleteClub = async (clubId: string) => {
    if (!confirm(t('deleteConfirmation'))) {
      return;
    }

    try {
      const response = await fetch(`/api/clubs/${clubId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(t('errorDeletingClub'));
      }

      setClubs(clubs.filter(c => c.id !== clubId));
      toast.success(t('clubDeletedSuccess'));
    } catch (error) {
      toast.error(t('errorDeletingClub'));
    }
  };

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('title')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('seasons')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('members')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('colors')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clubs.map((club) => (
            <tr key={club.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-3">
                  {club.image ? (
                    <img src={club.image} alt={club.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: club.backgroundColor, color: club.foregroundColor }}
                    >
                      {club.shortName.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{club.name}</div>
                    <div className="text-sm text-gray-500">{club.shortName}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {club.seasons.filter(s => s.active).length} {t('active')}
                </div>
                <div className="text-sm text-gray-500">
                  {club.seasons.length} {t('total')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-1">
                  <UsersIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{club._count.clubUsers}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: club.foregroundColor }}
                    title={club.foregroundColor}
                  />
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: club.backgroundColor }}
                    title={club.backgroundColor}
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => router.push(`/dashboard/clubs/${club.id}`)}
                    className="text-blue-600 hover:text-blue-900"
                    title={t('viewDetails')}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClub(club.id)}
                    className="text-red-600 hover:text-red-900"
                    title={t('deleteClub')}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}