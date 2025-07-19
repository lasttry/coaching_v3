// src/components/clubs/ClubDetails.tsx

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { ClubDetailsProps, UpdateClubFormData } from '@/types/club';
import { ColorPicker } from './ColorPicker';
import { ImageUpload } from './ImageUpload';
import { toast } from 'sonner';

export function ClubDetails({ club }: ClubDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateClubFormData>({
    name: club.name,
    shortName: club.shortName,
    image: club.image,
    foregroundColor: club.foregroundColor,
    backgroundColor: club.backgroundColor,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const t = useTranslations('clubs');
  const tSeasons = useTranslations('seasons');
  const router = useRouter();

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/clubs/${club.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(t('errorUpdatingClub'));
      }

      toast.success(t('clubUpdatedSuccess'));
      setIsEditing(false);
      
      // Disparar evento customizado para forçar refresh do tema
      console.log('🎨 Triggering theme refresh event');
      window.dispatchEvent(new CustomEvent('club-theme-changed', {
        detail: { 
          clubId: club.id,
          newColors: {
            foreground: formData.foregroundColor,
            background: formData.backgroundColor
          }
        }
      }));
      
      // Aguardar um pouco e recarregar a página
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      toast.error(t('errorUpdatingClub'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: club.name,
      shortName: club.shortName,
      image: club.image,
      foregroundColor: club.foregroundColor,
      backgroundColor: club.backgroundColor,
    });
    setIsEditing(false);
  };

  return (
    <div className="club-card bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium club-text">
          {t('clubDetails')}
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
        >
          {isEditing ? t('cancel') : t('edit')}
        </button>
      </div>

      <div className="space-y-6">
        {isEditing ? (
          <>
            {/* Preview em tempo real */}
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
              <h4 className="text-sm font-medium text-gray-900 mb-3">{t('preview')}</h4>
              <div 
                className="inline-flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-500"
                style={{ 
                  backgroundColor: formData.backgroundColor || club.backgroundColor,
                  color: formData.foregroundColor || club.foregroundColor,
                  border: `2px solid ${formData.foregroundColor || club.foregroundColor}`
                }}
              >
                {formData.image ? (
                  <img 
                    src={formData.image} 
                    alt={t('logoPreview')} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500"
                    style={{ 
                      backgroundColor: formData.foregroundColor || club.foregroundColor, 
                      color: formData.backgroundColor || club.backgroundColor 
                    }}
                  >
                    {(formData.shortName || club.shortName).substring(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="font-medium">{formData.name || club.name}</span>
              </div>
              
              <div className="mt-3 p-3 bg-blue-50 rounded text-xs text-blue-800">
                <p><strong>📱 {t('themeWillBeApplied')}:</strong></p>
                <p>• <strong>{t('pageBackground')}:</strong> {formData.backgroundColor || club.backgroundColor}</p>
                <p>• <strong>{t('mainTextColor')}:</strong> {formData.foregroundColor || club.foregroundColor}</p>
                <p>• <strong>{t('sidebar')}:</strong> {t('sameColors')}</p>
                <p>• <strong>{t('cards')}:</strong> {t('whiteBackgroundClubText')}</p>
              </div>
            </div>

            {/* Upload de Imagem */}
            <ImageUpload
              value={formData.image}
              onChange={(image) => setFormData({ ...formData, image })}
              disabled={isLoading}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('clubName')}
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('clubNamePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('shortName')}
              </label>
              <input
                type="text"
                value={formData.shortName || ''}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                maxLength={10}
                placeholder={t('shortNamePlaceholder')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎨 {t('primaryColor')} ({t('textColor')})
                </label>
                <ColorPicker
                  value={formData.foregroundColor || '#000000'}
                  onChange={(color) => setFormData({ ...formData, foregroundColor: color })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🖼️ {t('backgroundColor')} ({t('pageBackground')})
                </label>
                <ColorPicker
                  value={formData.backgroundColor || '#FFFFFF'}
                  onChange={(color) => setFormData({ ...formData, backgroundColor: color })}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? `🎨 ${t('applyingTheme')}...` : `🎨 ${t('save')} ${t('andApplyTheme')}`}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Vista de leitura */}
            <div className="flex items-center space-x-4">
              {club.image ? (
                <img
                  src={club.image}
                  alt={club.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-gray-200"
                  style={{ 
                    backgroundColor: club.foregroundColor, 
                    color: club.backgroundColor 
                  }}
                >
                  {club.shortName.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h4 className="text-lg font-medium club-text">{club.name}</h4>
                <p className="text-sm text-gray-500">{club.shortName}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('clubName')}
              </label>
              <p className="mt-1 text-sm club-text">{club.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('shortName')}
              </label>
              <p className="mt-1 text-sm club-text">{club.shortName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('colors')}
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded border-2 border-gray-300"
                    style={{ backgroundColor: club.foregroundColor }}
                    title={`${t('textColor')}: ${club.foregroundColor}`}
                  />
                  <div className="text-xs">
                    <div className="font-medium">{t('textColor')}</div>
                    <div className="text-gray-500">{club.foregroundColor}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded border-2 border-gray-300"
                    style={{ backgroundColor: club.backgroundColor }}
                    title={`${t('pageBackground')}: ${club.backgroundColor}`}
                  />
                  <div className="text-xs">
                    <div className="font-medium">{t('pageBackground')}</div>
                    <div className="text-gray-500">{club.backgroundColor}</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Épocas */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium club-text mb-3">
          {tSeasons('seasons')}
        </h4>
        <div className="space-y-2">
          {club.seasons.map((season) => (
            <div key={season.id} className="flex justify-between items-center py-2">
              <div>
                <span className="text-sm font-medium club-text">{season.name}</span>
                {season.active && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {tSeasons('active')}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {new Date(season.startDate).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}