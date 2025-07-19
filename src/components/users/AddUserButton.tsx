// src/components/users/AddUserButton.tsx

'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

const userSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Password deve ter pelo menos 6 caracteres'),
  role: z.enum(['ADMIN', 'COACH', 'CLIENT']),
});

type UserFormData = z.infer<typeof userSchema>;

export function AddUserButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('users');
  const tRoles = useTranslations('roles');
  const tErrors = useTranslations('errors');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'CLIENT',
    },
  });

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar utilizador');
      }

      toast.success('Utilizador criado com sucesso');
      setIsOpen(false);
      reset();
      window.location.reload();
    } catch (error) {
      toast.error('Erro ao criar utilizador');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        {t('addUser')}
      </button>

      <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                {t('addUser')}
              </Dialog.Title>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  {...register('password')}
                  type="password"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('role')}
                </label>
                <select
                  {...register('role')}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="CLIENT">{tRoles('CLIENT')}</option>
                  <option value="COACH">{tRoles('COACH')}</option>
                  <option value="ADMIN">{tRoles('ADMIN')}</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Criando...' : t('addUser')}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}