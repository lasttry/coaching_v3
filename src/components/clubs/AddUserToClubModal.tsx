// src/components/clubs/AddUserToClubModal.tsx

'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import type { AddUserToClubModalProps, ClubRole } from '@/types/club';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  active: boolean;
}

export function AddUserToClubModal({ club, isOpen, onClose, onSuccess }: AddUserToClubModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<ClubRole>('MEMBER');
  const [isLoading, setIsLoading] = useState(false);
  
  const t = useTranslations('clubs');
  const tRoles = useTranslations('clubRoles');
  const tUsers = useTranslations('users');

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const allUsers = await response.json();
        // Filtrar utilizadores que já estão no clube
        const existingUserIds = club.clubUsers.map(cu => cu.userId);
        const availableUsers = allUsers.filter((user: User) => 
          !existingUserIds.includes(user.id) && user.active
        );
        setUsers(availableUsers);
      }
    } catch (error) {
      toast.error(t('errorAddingUser'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId) {
      toast.error(t('pleaseSelectUser'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/clubs/${club.id}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserId,
          role: selectedRole,
        }),
      });

      if (!response.ok) {
        throw new Error(t('errorAddingUser'));
      }

      toast.success(t('userAddedSuccess'));
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(t('errorAddingUser'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              {tUsers('addUser')}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('selectUserToAdd')}
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">{t('pleaseSelectUser')}</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('selectRole')}
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as ClubRole)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="MEMBER">{tRoles('MEMBER')}</option>
                <option value="COACH">{tRoles('COACH')}</option>
                <option value="MANAGER">{tRoles('MANAGER')}</option>
                <option value="OWNER">{tRoles('OWNER')}</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading || !selectedUserId}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? t('loading') : tUsers('addUser')}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}