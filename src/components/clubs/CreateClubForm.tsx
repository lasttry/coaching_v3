// src/components/clubs/CreateClubForm.tsx

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ColorPicker } from './ColorPicker';
import { ImageUpload } from './ImageUpload';
import { useTranslations } from 'next-intl';
import type { CreateClubFormProps, CreateClubFormData } from '@/types/club';

export function CreateClubForm({ onSuccess, onCancel }: CreateClubFormProps) {
  const [image, setImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('clubs');
  const tErrors = useTranslations('errors');

  const clubSchema = z.object({
    name: z.string().min(1, tErrors('nameRequired')),
    shortName: z.string().min(1, tErrors('shortNameRequired')).max(10, tErrors('shortNameMaxLength')),
    foregroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, tErrors('invalidColor')),
    backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, tErrors('invalidColor')),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateClubFormData>({
    resolver: zodResolver(clubSchema),
    defaultValues: {
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
    },
  });

  const foregroundColor = watch('foregroundColor');
  const backgroundColor = watch('backgroundColor');
  const clubName = watch('name');
  const shortName = watch('shortName');

  const onSubmit = async (data: CreateClubFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          image: image || null,
        }),
      });

      if (!response.ok) {
        throw new Error(t('errorCreatingClub'));
      }

      toast.success(t('clubCreatedSuccess'));
      const club = await response.json();
      onSuccess?.(club);
    } catch (error) {
      toast.error(t('errorCreatingClub'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Preview do Clube */}
      <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
        <h4 className="text-sm font-medium text-gray-900 mb-3">{t('preview')}</h4>
        <div 
          className="inline-flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300"
          style={{ 
            backgroundColor: backgroundColor,
            color: foregroundColor,
            border: `2px solid ${foregroundColor}`
          }}
        >
          {image ? (
            <img src={image} alt={t('logoPreview')} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: foregroundColor, color: backgroundColor }}
            >
              {shortName?.substring(0, 2).toUpperCase() || 'XX'}
            </div>
          )}
          <span className="font-medium">{clubName || t('clubName')}</span>
        </div>
        
        <div className="mt-3 p-3 bg-blue-50 rounded text-xs text-blue-800">
          <p><strong>📱 {t('themeWillBeApplied')}:</strong></p>
          <p>• <strong>{t('pageBackground')}:</strong> {backgroundColor}</p>
          <p>• <strong>{t('mainTextColor')}:</strong> {foregroundColor}</p>
          <p>• <strong>{t('sidebar')}:</strong> {t('sameColors')}</p>
        </div>
      </div>

      {/* Upload de Imagem */}
      <ImageUpload
        value={image}
        onChange={setImage}
        disabled={isLoading}
      />

      {/* Nome do Clube */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('clubName')} *
        </label>
        <input
          {...register('name')}
          type="text"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('clubNamePlaceholder')}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Nome Curto */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('shortName')} *
        </label>
        <input
          {...register('shortName')}
          type="text"
          maxLength={10}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('shortNamePlaceholder')}
        />
        <p className="mt-1 text-xs text-gray-500">{t('shortNameHelp')}</p>
        {errors.shortName && (
          <p className="mt-1 text-sm text-red-600">{errors.shortName.message}</p>
        )}
      </div>

      {/* Cores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎨 {t('primaryColor')} ({t('textColor')}) *
          </label>
          <ColorPicker
            value={foregroundColor}
            onChange={(color) => setValue('foregroundColor', color)}
          />
          {errors.foregroundColor && (
            <p className="mt-1 text-sm text-red-600">{errors.foregroundColor.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🖼️ {t('backgroundColor')} ({t('pageBackground')}) *
          </label>
          <ColorPicker
            value={backgroundColor}
            onChange={(color) => setValue('backgroundColor', color)}
          />
          {errors.backgroundColor && (
            <p className="mt-1 text-sm text-red-600">{errors.backgroundColor.message}</p>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
        <div className="text-sm text-yellow-800">
          <p className="font-medium">{t('importantNote')}:</p>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li>{t('colorsWillChangeTheme')}</li>
            <li>{t('logoOptional')}</li>
            <li>{t('shortNameUsedFallback')}</li>
          </ul>
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            {t('cancel')}
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? `🎨 ${t('creating')}...` : `🎨 ${t('createClub')}`}
        </button>
      </div>
    </form>
  );
}