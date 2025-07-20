// src/components/clubs/ClubSelector.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { CheckIcon } from '@heroicons/react/24/outline';
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
  const [isSelecting, setIsSelecting] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const router = useRouter();
  const t = useTranslations('clubs');
  const { clubs, loading, selectedClub, selectClub } = useSelectedClub();

  const handleClubSelect = async (clubId: string) => {
    if (isSelecting || !clubId) return;
    
    console.log('🔄 Selecting club:', clubId);
    setIsSelecting(true);

    try {
      // Fazer chamada direta à API em vez de usar o hook
      const response = await fetch('/api/user/default-club', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clubId }),
      });

      console.log('📡 API Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Response data:', data);
        
        toast.success(t('select.success'));
        // Redirecionar para dashboard com o clube selecionado
        router.push(`/${locale}/dashboard`);
        router.refresh();
      } else {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error || 'Erro ao selecionar clube');
      }
    } catch (error) {
      console.error('❌ Erro ao selecionar clube:', error);
      toast.error(t('select.selectError'));
    } finally {
      setIsSelecting(false);
    }
  };

  const handleImageError = (clubId: string) => {
    setImageErrors(prev => new Set(prev).add(clubId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">{t('select.loading')}</span>
      </div>
    );
  }

  // Debug: mostrar dados dos clubes
  console.log('🏪 Clubs data:', clubs);
  console.log('⭐ Selected club:', selectedClub);

  return (
    <div className="space-y-6">
      {/* Lista de Clubes */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1">
        {clubs.map((club) => (
          <div
            key={club.id}
            className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedClub?.id === club.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            } ${!club.isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => club.isActive && handleClubSelect(club.id)}
          >
            <div className="flex items-center space-x-4">
              {/* Logo do Clube */}
              <div className="relative w-16 h-16 flex-shrink-0">
                {club.logo && !imageErrors.has(club.id) ? (
                  <Image
                    src={club.logo}
                    alt={`Logo ${club.name}`}
                    width={64}
                    height={64}
                    className="rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                    onError={() => handleImageError(club.id)}
                  />
                ) : (
                  // Fallback usando o SVG padrão
                  <Image
                    src="/images/default-club-logo.svg"
                    alt="Logo padrão"
                    width={64}
                    height={64}
                    className="rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  />
                )}
              </div>

              {/* Informações do Clube */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {club.name}
                  </h3>
                  {selectedClub?.id === club.id && (
                    <span className="ml-2 px-2 py-1 bg-green-200 text-green-700 rounded text-xs">
                      {t('select.current')}
                    </span>
                  )}
                </div>
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
              {isSelecting && selectedClub?.id === club.id ? (
                <div className="flex-shrink-0">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : selectedClub?.id === club.id ? (
                <div className="flex-shrink-0">
                  <CheckIcon className="h-6 w-6 text-blue-600" />
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-blue-400 transition-colors"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Informação */}
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('select.chooseClub')}
        </p>
      </div>
    </div>
  );
}