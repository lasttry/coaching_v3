// src/hooks/useSelectedClub.ts
'use client';

import { useState, useEffect } from 'react';

interface Club {
  id: string;
  name: string;
  shortName?: string;
  image?: string;
  foregroundColor?: string;
  backgroundColor?: string;
  // Adiciona outros campos conforme necessário
}

export function useSelectedClub() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/clubs');
        if (!res.ok) throw new Error('Erro ao buscar clubes');
        const data = await res.json();
        setClubs(data);

        // Selecionar clube salvo ou o primeiro
        const savedClubId = localStorage.getItem('selectedClub');
        let club = null;
        if (savedClubId) {
          club = data.find((c: Club) => c.id === savedClubId);
        }
        if (!club && data.length > 0) {
          club = data[0];
          localStorage.setItem('selectedClub', club.id);
        }
        setSelectedClub(club);
      } catch (error) {
        console.error('Erro ao buscar clubes:', error);
        setClubs([]);
        setSelectedClub(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const selectClub = (clubId: string) => {
    const club = clubs.find(c => c.id === clubId);
    if (club) {
      setSelectedClub(club);
      localStorage.setItem('selectedClub', clubId);
      return true;
    }
    return false;
  };

  return {
    selectedClub,
    loading,
    selectClub,
    getAllClubs: () => clubs,
    clubs,
  };
}