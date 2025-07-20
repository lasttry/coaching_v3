// src/components/providers/GlobalThemeProvider.tsx

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface GlobalThemeProviderProps {
  children: React.ReactNode;
}

export function GlobalThemeProvider({ children }: GlobalThemeProviderProps) {
  const pathname = usePathname();

  useEffect(() => {
    const applyTheme = async () => {
      console.log('🎨 GlobalThemeProvider: Checking for club theme...');
      
      // Só aplicar tema se estivermos no dashboard
      if (!pathname.includes('/dashboard')) {
        console.log('❌ Not in dashboard, skipping theme');
        return;
      }

      try {
        // Buscar clube padrão do utilizador
        const response = await fetch('/api/clubs/default-club');
        
        if (!response.ok) {
          console.log('❌ Failed to fetch default club:', response.status);
          return;
        }

        const data = await response.json();
        const club = data.defaultClub;

        if (!club) {
          console.log('❌ No default club found');
          return;
        }

        console.log('✅ Default club fetched:', {
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

    // Escutar evento customizado para mudanças de clube
    const handleClubChange = () => {
      console.log('🔄 Club changed, reapplying theme...');
      setTimeout(applyTheme, 100);
    };

    window.addEventListener('club-theme-changed', handleClubChange);
    
    return () => {
      window.removeEventListener('club-theme-changed', handleClubChange);
    };
  }, [pathname]);

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

  // Criar novos estilos
  const style = document.createElement('style');
  style.id = 'global-club-theme';
  style.textContent = `
    /* THEME GLOBAL - CORES DO CLUBE */
    
    /* Sidebar com cores do clube */
    .lg\\:fixed.lg\\:inset-y-0 .flex.grow.flex-col {
      background: linear-gradient(135deg, ${club.backgroundColor} 0%, ${club.backgroundColor}dd 100%) !important;
    }
    
    /* Links da sidebar */
    .lg\\:fixed.lg\\:inset-y-0 a {
      color: ${club.foregroundColor} !important;
    }
    
    .lg\\:fixed.lg\\:inset-y-0 a:hover {
      background-color: ${club.foregroundColor}20 !important;
    }
    
    /* Header mobile */
    .sticky.top-0 {
      background: linear-gradient(90deg, ${club.backgroundColor} 0%, ${club.backgroundColor}dd 100%) !important;
      color: ${club.foregroundColor} !important;
    }
    
    /* Botões principais */
    .bg-blue-600, .bg-indigo-600 {
      background-color: ${club.backgroundColor} !important;
      border-color: ${club.backgroundColor} !important;
    }
    
    .bg-blue-600:hover, .bg-indigo-600:hover {
      background-color: ${club.backgroundColor}dd !important;
    }
    
    /* Links e elementos interativos */
    .text-blue-600, .text-indigo-600 {
      color: ${club.backgroundColor} !important;
    }
    
    /* Bordas e acentos */
    .border-blue-500, .border-indigo-500 {
      border-color: ${club.backgroundColor} !important;
    }
    
    /* Focus states */
    .focus\\:ring-blue-500, .focus\\:ring-indigo-500 {
      --tw-ring-color: ${club.backgroundColor} !important;
    }
  `;

  document.head.appendChild(style);
  console.log('✅ Global theme applied successfully!');
  
  // Disparar evento para outros componentes
  window.dispatchEvent(new CustomEvent('club-theme-applied', { detail: club }));
}