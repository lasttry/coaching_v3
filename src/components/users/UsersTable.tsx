// src/components/users/UsersTable.tsx

'use client';

import { useState } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  CheckIcon, 
  XMarkIcon,
  BuildingOfficeIcon 
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface UserClub {
  club: {
    id: string;
    name: string;
    shortName: string;
  };
  role: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  active: boolean;
  createdAt: Date;
  clubUsers: UserClub[];
}

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users: initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    role: string;
    password?: string;
  }>({ role: '' });

  const t = useTranslations('users');
  const tRoles = useTranslations('roles');
  const tClubRoles = useTranslations('clubRoles');

  const handleEdit = (user: User) => {
    setEditingUser(user.id);
    setEditForm({ role: user.role });
  };

  const handleSave = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error(t('errorUpdatingUser'));
      }

      const updatedUser = await response.json();
      setUsers(users.map(u => u.id === userId ? { ...u, ...updatedUser } : u));
      setEditingUser(null);
      toast.success(t('userUpdatedSuccess'));
    } catch (error) {
      toast.error(t('errorUpdatingUser'));
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setEditForm({ role: '' });
  };

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive }),
      });

      if (!response.ok) {
        throw new Error(t('errorUpdatingUser'));
      }

      setUsers(users.map(u => 
        u.id === userId ? { ...u, active: !currentActive } : u
      ));
      
      toast.success(!currentActive ? t('userActivatedSuccess') : t('userDeactivatedSuccess'));
    } catch (error) {
      toast.error(t('errorUpdatingUser'));
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm(t('deleteUserConfirmation'))) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(t('errorDeletingUser'));
      }

      setUsers(users.filter(u => u.id !== userId));
      toast.success(t('userDeletedSuccess'));
    } catch (error) {
      toast.error(t('errorDeletingUser'));
    }
  };

  const handleResetPassword = async (userId: string) => {
    const newPassword = prompt(t('enterNewPassword'));
    if (!newPassword) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        throw new Error(t('errorResettingPassword'));
      }

      toast.success(t('passwordResetSuccess'));
    } catch (error) {
      toast.error(t('errorResettingPassword'));
    }
  };

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('user')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('role')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('status')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('userClubs')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {user.name?.substring(0, 2).toUpperCase() || user.email.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name || user.email}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingUser === user.id ? (
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="CLIENT">{tRoles('CLIENT')}</option>
                    <option value="COACH">{tRoles('COACH')}</option>
                    <option value="ADMIN">{tRoles('ADMIN')}</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'COACH' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {tRoles(user.role)}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleToggleActive(user.id, user.active)}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.active ? t('active') : t('inactive')}
                </button>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {user.clubUsers.map((clubUser, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                      title={`${clubUser.club.name} - ${tClubRoles(clubUser.role)}`}
                    >
                      <BuildingOfficeIcon className="w-3 h-3 mr-1" />
                      {clubUser.club.shortName}
                    </span>
                  ))}
                  {user.clubUsers.length === 0 && (
                    <span className="text-xs text-gray-500">{t('noClubs')}</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {editingUser === user.id ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSave(user.id)}
                      className="text-green-600 hover:text-green-900"
                      title={t('save')}
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-gray-600 hover:text-gray-900"
                      title={t('cancel')}
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-900"
                      title={t('editUser')}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleResetPassword(user.id)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title={t('resetPassword')}
                    >
                      🔑
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                      title={t('deleteUser')}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}