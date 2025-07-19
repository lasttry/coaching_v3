// src/components/dashboard/ClubHeader.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useSelectedClub } from '@/hooks/useSelectedClub';

interface ClubHeaderProps {
  className?: string;
}

export default function ClubHeader({ 
  className = ""
}: ClubHeaderProps) {
  const router = useRouter();
  const locale = useLocale();

  const handleClubClick = () => {
    router.push(`/${locale}/dashboard/clubs/select`);
  };

  return (
    <div 
      className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 ${className}`}
      onClick={handleClubClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClubClick();
        }
      }}
    >
      <div className="flex items-center space-x-3 w-full">
        {/* Logo do Clube */}
        <div className="relative w-10 h-10 flex-shrink-0">
          <Image
            src={selectedClub?.logo || '/images/default-club-logo.png'}
            alt={`Logo ${selectedClub?.name || 'Clube'}`}
            width={40}
            height={40}
            className="rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
            onError={(e) => {
              // Fallback para logo padrão se a imagem falhar
              const target = e.target as HTMLImageElement;
              target.src = '/images/default-club-logo.png';
            }}
          />
        </div>

        {/* Nome do Clube */}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {selectedClub?.name || 'Selecionar Clube'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('select.info').split(' ')[0]} {/* Primeira palavra de "Alterar clube" */}
          </p>
        </div>

        {/* Ícone de navegação */}
        <div className="flex-shrink-0">
          <svg 
            className="w-4 h-4 text-gray-400 dark:text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
}