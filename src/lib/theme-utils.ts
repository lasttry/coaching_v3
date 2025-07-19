// src/lib/theme-utils.ts

export function forceThemeRefresh() {
  // Remove todos os estilos de tema existentes
  const existingStyles = document.querySelectorAll('#club-theme-styles');
  existingStyles.forEach(style => style.remove());
  
  // Força re-render removendo e re-adicionando classes do body
  const body = document.body;
  const classes = body.className;
  body.className = '';
  
  setTimeout(() => {
    body.className = classes;
    
    // Dispara evento customizado para forçar re-render dos componentes
    window.dispatchEvent(new CustomEvent('club-theme-changed', {
      detail: { timestamp: Date.now() }
    }));
  }, 100);
}

// Hook para escutar mudanças de tema
export function useThemeChangeListener(callback: () => void) {
  if (typeof window !== 'undefined') {
    window.addEventListener('club-theme-changed', callback);
    
    return () => {
      window.removeEventListener('club-theme-changed', callback);
    };
  }
  
  return () => {};
}
