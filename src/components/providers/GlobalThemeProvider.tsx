// src/components/providers/GlobalThemeProvider.tsx

'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface GlobalThemeProviderProps {
  children: React.ReactNode;
}

export function GlobalThemeProvider({ children }: GlobalThemeProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const applyTheme = async () => {
      console.log('🎨 GlobalThemeProvider: Checking for club theme...');
      
      // Só aplicar tema se estivermos no dashboard
      if (!pathname.includes('/dashboard')) {
        console.log('❌ Not in dashboard, skipping theme');
        return;
      }

      try {
        // Extrair clubId da URL
        const clubId = searchParams.get('clubId') || 'default-club';
        console.log('🏢 Looking for club:', clubId);

        // Buscar dados do clube
        const response = await fetch(`/api/clubs/${clubId}`);
        
        if (!response.ok) {
          console.log('❌ Failed to fetch club:', response.status);
          return;
        }

        const club = await response.json();
        console.log('✅ Club fetched:', {
          name: club.name,
          foreground: club.foregroundColor,
          background: club.backgroundColor
        });

        // Aplicar tema imediatamente
        applyClubTheme(club);

      } catch (error) {
        console.error('❌ Error applying theme:', error);
      }
    };

    applyTheme();

    // Escutar mudanças na URL
    const handleUrlChange = () => {
      console.log('🔄 URL changed, reapplying theme...');
      setTimeout(applyTheme, 100);
    };

    // Escutar evento customizado
    window.addEventListener('club-theme-changed', handleUrlChange);
    
    return () => {
      window.removeEventListener('club-theme-changed', handleUrlChange);
    };
  }, [pathname, searchParams]);

  return <>{children}</>;
}

function applyClubTheme(club: any) {
  if (!club?.foregroundColor || !club?.backgroundColor) {
    console.log('❌ Invalid club colors:', club);
    return;
  }

  console.log('🎨 Applying theme:', {
    foreground: club.foregroundColor,
    background: club.backgroundColor
  });

  // Remover estilos antigos
  const existingStyle = document.getElementById('global-club-theme');
  if (existingStyle) {
    existingStyle.remove();
  }

  // Aplicar ao body imediatamente
  document.body.style.backgroundColor = club.backgroundColor;
  document.body.style.color = club.foregroundColor;

  // Criar novos estilos
  const style = document.createElement('style');
  style.id = 'global-club-theme';
  style.textContent = `
    /* THEME GLOBAL - FORÇA APLICAÇÃO */
    html, body, #__next {
      background-color: ${club.backgroundColor} !important;
      color: ${club.foregroundColor} !important;
    }
    
    /* Containers principais */
    .min-h-screen, main, [data-nextjs-scroll-focus-boundary] {
      background-color: ${club.backgroundColor} !important;
      color: ${club.foregroundColor} !important;
    }
    
    /* Sidebar */
    .lg\\:fixed.lg\\:inset-y-0 {
      background-color: ${club.backgroundColor} !important;
      color: ${club.foregroundColor} !important;
    }
    
    /* Cards brancos para legibilidade */
    .bg-white, .shadow, .rounded-lg {
      background-color: white !important;
      color: ${club.foregroundColor} !important;
    }
    
    /* Texto com cores do clube */
    h1, h2, h3, h4, h5, h6, .club-text {
      color: ${club.foregroundColor} !important;
    }
    
    /* Botões com tema do clube */
    .bg-blue-600 {
      background-color: ${club.foregroundColor} !important;
      border-color: ${club.foregroundColor} !important;
    }
    
    .bg-blue-600:hover {
      background-color: ${club.foregroundColor}dd !important;
    }
  `;

  document.head.appendChild(style);
  console.log('✅ Global theme applied successfully!');
}