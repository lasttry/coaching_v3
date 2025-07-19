// src/components/clubs/ColorPicker.tsx

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ColorPickerProps } from '@/types/club';

const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#008000', '#FFC0CB', '#A52A2A', '#808080', '#000080',
];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const t = useTranslations('clubs');

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="w-10 h-10 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="#000000"
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 border-gray-300 rounded-md"
        />
      </div>

      {showPicker && (
        <div className="absolute z-10 mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="grid grid-cols-5 gap-2 mb-3">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  onChange(color);
                  setShowPicker(false);
                }}
                className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowPicker(false)}
            className="w-full text-sm text-gray-600 hover:text-gray-800"
          >
            {t('close')}
          </button>
        </div>
      )}
    </div>
  );
}