'use client';

import { useEffect } from 'react';
import type { Club } from '@/types/club';

export function useClubTheme(club: Club | null) {
  useEffect(() => {
    if (!club) return;

    const root = document.documentElement;
    root.style.setProperty('--club-primary', club.foregroundColor);
    root.style.setProperty('--club-secondary', club.backgroundColor);
    
    const style = document.createElement('style');
    style.textContent = `
      .club-primary { color: ${club.foregroundColor} !important; }
      .club-bg-primary { background-color: ${club.foregroundColor} !important; }
      .club-secondary { color: ${club.backgroundColor} !important; }
      .club-bg-secondary { background-color: ${club.backgroundColor} !important; }
      .club-border-primary { border-color: ${club.foregroundColor} !important; }
      .club-text-primary { color: ${club.foregroundColor} !important; }
    `;
    
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
      root.style.removeProperty('--club-primary');
      root.style.removeProperty('--club-secondary');
    };
  }, [club]);
}
