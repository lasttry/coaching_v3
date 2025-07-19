// src/components/clubs/ClubThemeProvider.tsx

'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import type { Club, ClubThemeContextType } from '@/types/club';

const ClubThemeContext = createContext<ClubThemeContextType>({ club: null });

export function useClubTheme() {
  const context = useContext(ClubThemeContext);
  if (!context) {
    throw new Error('useClubTheme must be used within a ClubThemeProvider');
  }
  return context;
}

interface ClubThemeProviderProps {
  club: Club | null;
  children: ReactNode;
}

export function ClubThemeProvider({ club, children }: ClubThemeProviderProps) {
  useEffect(() => {
    console.log('🎨 ClubThemeProvider useEffect triggered:', {
      club: club?.name,
      foreground: club?.foregroundColor,
      background: club?.backgroundColor
    });

    // Sempre limpar estilos existentes primeiro
    const styleId = 'club-theme-styles';
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      console.log('🗑️ Removing existing theme styles');
      document.head.removeChild(existingStyle);
    }

    if (!club) {
      console.log('🚫 No club provided, using default theme');
      // Se não tem clube, usar tema padrão
      document.documentElement.style.setProperty('--club-bg', '#ffffff');
      document.documentElement.style.setProperty('--club-text', '#000000');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
      return;
    }

    console.log('✅ Applying club theme:', {
      background: club.backgroundColor,
      foreground: club.foregroundColor
    });

    // Aplicar imediatamente ao body
    document.body.style.backgroundColor = club.backgroundColor;
    document.body.style.color = club.foregroundColor;
    
    // Definir variáveis CSS customizadas
    const root = document.documentElement;
    root.style.setProperty('--club-foreground', club.foregroundColor);
    root.style.setProperty('--club-background', club.backgroundColor);
    
    // Criar estilos dinâmicos
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* FORÇAR tema do clube em TUDO */
      html, body {
        background-color: ${club.backgroundColor} !important;
        color: ${club.foregroundColor} !important;
      }
      
      /* Aplicar a todos os containers principais */
      #__next, [data-nextjs-scroll-focus-boundary] {
        background-color: ${club.backgroundColor} !important;
        color: ${club.foregroundColor} !important;
      }
      
      /* Sidebar com tema do clube */
      .club-sidebar {
        background-color: ${club.backgroundColor} !important;
        color: ${club.foregroundColor} !important;
      }
      
      /* Cards e containers brancos para legibilidade */
      .club-card, .club-container, 
      .bg-white, .shadow, .rounded-lg {
        background-color: white !important;
        color: ${club.foregroundColor} !important;
        border: 1px solid ${club.foregroundColor}20 !important;
      }
      
      /* Texto específico com cores do clube */
      .club-text, h1, h2, h3, h4, h5, h6 {
        color: ${club.foregroundColor} !important;
      }
      
      /* Links de navegação */
      .club-nav-link {
        color: ${club.foregroundColor} !important;
      }
      
      .club-nav-link:hover {
        background-color: ${club.foregroundColor}22 !important;
      }
      
      .club-nav-link.active {
        background-color: ${club.foregroundColor} !important;
        color: ${club.backgroundColor} !important;
      }
      
      /* Botões com tema */
      .club-btn-primary, .bg-blue-600 {
        background-color: ${club.foregroundColor} !important;
        color: ${club.backgroundColor} !important;
        border-color: ${club.foregroundColor} !important;
      }
      
      .club-btn-primary:hover, .bg-blue-600:hover {
        background-color: ${club.foregroundColor}cc !important;
      }
      
      /* Estatísticas */
      .club-stat-icon {
        background-color: ${club.foregroundColor} !important;
        color: ${club.backgroundColor} !important;
      }
      
      .club-stat-link {
        color: ${club.foregroundColor} !important;
      }
      
      /* Mobile header */
      .club-mobile-header {
        background-color: white !important;
        color: ${club.foregroundColor} !important;
      }
      
      /* Main layout areas */
      main, .club-main {
        background-color: ${club.backgroundColor} !important;
        color: ${club.foregroundColor} !important;
      }
      
      /* Override qualquer fundo branco não desejado */
      .min-h-screen {
        background-color: ${club.backgroundColor} !important;
      }
    `;
    
    document.head.appendChild(style);
    
    console.log('✅ Theme styles applied successfully');

    return () => {
      console.log('🧹 Cleanup theme styles');
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        document.head.removeChild(styleToRemove);
      }
    };
  }, [club?.id, club?.foregroundColor, club?.backgroundColor]);
  
  return (
    <ClubThemeContext.Provider value={{ club }}>
      {children}
    </ClubThemeContext.Provider>
  );
}