// src/components/clubs/ClubUsersManager.tsx

'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import type { ClubUsersManagerProps, ClubUser } from '@/types/club';
import { AddUserToClubModal } from './AddUserToClubModal';
import { UserClubRoleBadge } from './UserClubRoleBadge';

export function ClubUsersManager({ club }: ClubUsersManagerProps) {
  const [clubUsers, setClubUsers] = useState<ClubUser[]>(club.clubUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations('clubs');
  const tUsers = useTranslations('users');

  const handleRemoveUser = async (userId: string) => {
    if (!confirm(t('removeUserConfirmation'))) {
      return;
    }

    try {
      const response = await fetch(`/api/clubs/${club.id}/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(t('errorRemovingUser'));
      }

      setClubUsers(clubUsers.filter(cu => cu.userId !== userId));
      toast.success(t('userRemovedSuccess'));
    } catch (error) {
      toast.error(t('errorRemovingUser'));
    }
  };

  const handleUserAdded = () => {
    window.location.reload();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          {t('members')} ({clubUsers.length})
        </h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          {tUsers('addUser')}
        </button>
      </div>

      <div className="space-y-3">
        {clubUsers.map((clubUser) => (
          <div key={clubUser.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {clubUser.user.name?.substring(0, 2).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {clubUser.user.name || clubUser.user.email}
                </p>
                <p className="text-xs text-gray-500">{clubUser.user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <UserClubRoleBadge role={clubUser.role} />
              <button
                onClick={() => handleRemoveUser(clubUser.userId)}
                className="text-red-600 hover:text-red-900"
                title={tUsers('removeUser')}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {clubUsers.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            {t('noMembersInClub')}
          </p>
        )}
      </div>

      <AddUserToClubModal
        club={club}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleUserAdded}
      />
    </div>
  );
}