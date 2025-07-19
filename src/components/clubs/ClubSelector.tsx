// src/components/clubs/ClubSelector.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { CheckIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useSelectedClub } from '@/hooks/useSelectedClub';

interface Club {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  isActive: boolean;
}

interface ClubSelectorProps {
  locale: string;
}

export default function ClubSelector({ locale }: ClubSelectorProps) {
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const router = useRouter();
  const t = useTranslations('clubs');
  const { clubs, loading, selectClub } = useSelectedClub();

  const handleClubSelect = async (clubId: string) => {
    if (isSelecting) return;

    setIsSelecting(true);
    setSelectedClub(clubId);

    try {
      // Simular API call para selecionar clube
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usar o hook para selecionar o clube
      const success = selectClub(clubId);
      
      if (success) {
        toast.success(t('select.success'));
        // Redirecionar para dashboard
        router.push(`/${locale}/dashboard`);
      } else {
        throw new Error('Clube não encontrado');
      }
    } catch (error) {
      console.error('Erro ao selecionar clube:', error);
      toast.error(t('select.selectError'));
      setSelectedClub(null);
    } finally {
      setIsSelecting(false);
    }
  };

  const handleCreateClub = () => {
    router.push(`/${locale}/dashboard/clubs/create`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">{t('select.loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lista de Clubes */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {clubs.map((club) => (
          <div
            key={club.id}
            className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedClub === club.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            } ${!club.isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => club.isActive && handleClubSelect(club.id)}
          >
            <div className="flex items-center space-x-4">
              {/* Logo do Clube */}
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={club.logo || '/images/default-club-logo.png'}
                  alt={`Logo ${club.name}`}
                  width={64}
                  height={64}
                  className="rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/default-club-logo.png';
                  }}
                />
              </div>

              {/* Informações do Clube */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {club.name}
                </h3>
                {club.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {club.description}
                  </p>
                )}
                {!club.isActive && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                    {t('select.inactive')}
                  </span>
                )}
              </div>

              {/* Indicador de Seleção */}
              {selectedClub === club.id && isSelecting && (
                <div className="flex-shrink-0">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              )}

              {selectedClub === club.id && !isSelecting && (
                <div className="flex-shrink-0">
                  <CheckIcon className="h-6 w-6 text-blue-600" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Botão para Criar Novo Clube */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <button
          onClick={handleCreateClub}
          className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
          disabled={isSelecting}
        >
          <PlusIcon className="h-6 w-6 mr-2" />
          <span className="font-medium">{t('select.createNew')}</span>
        </button>
      </div>

      {/* Informação Adicional */}
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('select.info')}
        </p>
      </div>
    </div>
  );
}