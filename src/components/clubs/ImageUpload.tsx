// src/components/clubs/ImageUpload.tsx

'use client';

import { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

interface ImageUploadProps {
  value?: string | null;
  onChange: (base64Image: string | null) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('clubs');

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error(t('imageProcessingError')));
        return;
      }

      img.onload = () => {
        // Calcular dimensões mantendo aspect ratio
        const maxSize = 256;
        let { width, height } = img;
        
        // Manter aspect ratio - redimensionar baseado na maior dimensão
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        // Definir tamanho do canvas
        canvas.width = width;
        canvas.height = height;

        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Converter para base64
        const base64 = canvas.toDataURL('image/jpeg', 0.85);
        resolve(base64);
      };

      img.onerror = () => {
        reject(new Error(t('imageLoadError')));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert(t('invalidFileType'));
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(t('fileTooLarge'));
      return;
    }

    setIsUploading(true);

    try {
      const resizedBase64 = await resizeImage(file);
      setPreview(resizedBase64);
      onChange(resizedBase64);
    } catch (error) {
      console.error('Error processing image:', error);
      alert(t('imageProcessingError'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {t('clubLogo')}
      </label>
      
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt={t('logoPreview')}
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
          />
          {!disabled && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              title={t('removeImage')}
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={handleUploadClick}
          className={`
            w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg 
            flex flex-col items-center justify-center cursor-pointer
            hover:border-gray-400 transition-colors
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-xs text-gray-500 text-center px-2">
            {isUploading ? t('processing') : t('clickToUpload')}
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div className="text-xs text-gray-500 space-y-1">
        <p>• {t('supportedFormats')}: JPG, PNG, GIF</p>
        <p>• {t('maxFileSize')}: 5MB</p>
        <p>• {t('automaticResize')}: {t('resizeDescription')}</p>
      </div>
    </div>
  );
}