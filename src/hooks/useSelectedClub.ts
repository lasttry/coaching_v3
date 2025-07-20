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
}

interface ClubUser {
  id: string;
  role: string;
  club: Club;
}

export function useSelectedClub() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      try {
        // 1. Buscar clubes do utilizador
        const clubsRes = await fetch('/api/clubs/user-clubs');
        if (!clubsRes.ok) throw new Error('Erro ao buscar clubes');
        const clubsData = await clubsRes.json();

        // Extrair só os clubes da resposta
        const userClubs = clubsData.clubs?.map((cu: ClubUser) => cu.club) || [];
        setClubs(userClubs);

        // 2. Buscar clube padrão atual
        const defaultRes = await fetch('/api/clubs/default-club');
        if (defaultRes.ok) {
          const defaultData = await defaultRes.json();
          if (defaultData.defaultClub) {
            setSelectedClub(defaultData.defaultClub);
            return; // Temos clube padrão, done!
          }
        }

        // 3. Fallback: primeiro clube se não há padrão
        if (userClubs.length > 0) {
          setSelectedClub(userClubs[0]);
        }

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

  // Selecionar clube e definir como padrão
  const selectClub = async (clubId: string) => {
    try {
      const res = await fetch('/api/clubs/default-club', {
        method: 'PATCH', // Corrigido: era POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao gravar clube por defeito');
      }

      const data = await res.json();
      
      if (data.defaultClub) {
        setSelectedClub(data.defaultClub);
        return true;
      }

      // Fallback: encontrar clube na lista local
      const club = clubs.find(c => c.id === clubId);
      if (club) {
        setSelectedClub(club);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Erro ao selecionar clube:', err);
      return false;
    }
  };

  return {
    selectedClub,
    loading,
    selectClub,
    getAllClubs: () => clubs,
    clubs,
  };
}