// src/components/clubs/ClubSelectorDebug.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface ClubSelectorDebugProps {
  locale: string;
}

export default function ClubSelectorDebug({ locale }: ClubSelectorDebugProps) {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations('clubs');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      console.log('🔄 Fetching clubs...');
      const response = await fetch('/api/clubs/user-clubs');
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Clubs data:', data);
        setClubs(data.clubs || []);
      } else {
        console.error('❌ Failed to fetch clubs');
      }
    } catch (error) {
      console.error('❌ Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClubSelect = async (clubId: string) => {
    console.log('🎯 Club selected:', clubId);
    console.log('👤 Current session:', session);
    
    setIsSelecting(true);

    try {
      const response = await fetch('/api/user/default-club', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clubId }),
      });

      console.log('📡 API Response:', response.status);
      const data = await response.json();
      console.log('📋 Response data:', data);

      if (response.ok) {
        toast.success('Clube selecionado!');
        router.push(`/${locale}/dashboard`);
        router.refresh();
      } else {
        toast.error(data.error || 'Erro ao selecionar clube');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Erro de rede');
    } finally {
      setIsSelecting(false);
    }
  };

  if (loading) {
    return <div className="p-4">A carregar clubes...</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Debug - Seleção de Clubes</h2>
      
      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold">Session Info:</h3>
        <pre className="text-sm">{JSON.stringify(session, null, 2)}</pre>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold">Clubs ({clubs.length}):</h3>
        <pre className="text-sm">{JSON.stringify(clubs, null, 2)}</pre>
      </div>

      <div className="space-y-2">
        {clubs.map((clubUser: any) => (
          <button
            key={clubUser.club.id}
            onClick={() => handleClubSelect(clubUser.club.id)}
            disabled={isSelecting}
            className="w-full p-4 border rounded hover:bg-gray-50 disabled:opacity-50 text-left"
          >
            <div className="font-semibold">{clubUser.club.name}</div>
            <div className="text-sm text-gray-600">ID: {clubUser.club.id}</div>
            <div className="text-sm text-gray-600">Role: {clubUser.role}</div>
            {isSelecting && <div className="text-blue-600">Selecionando...</div>}
          </button>
        ))}
      </div>
    </div>
  );
}