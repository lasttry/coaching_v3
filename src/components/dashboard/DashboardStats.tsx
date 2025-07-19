// src/components/dashboard/DashboardStats.tsx

import { useTranslations } from 'next-intl';
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  CalendarIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import type { ClubWithDetails } from '@/types/club';

interface DashboardStatsProps {
  currentClub?: ClubWithDetails | null;
}

export function DashboardStats({ currentClub }: DashboardStatsProps) {
  const t = useTranslations('dashboard');
  const tClubs = useTranslations('clubs');

  const stats = [
    {
      name: tClubs('members'),
      value: currentClub?._count.clubUsers || 0,
      icon: UsersIcon,
      change: '+4.75%',
      changeType: 'positive' as const,
    },
    {
      name: t('activeSeasons'),
      value: currentClub?.seasons.filter(s => s.active).length || 0,
      icon: CalendarIcon,
      change: '+54.02%',
      changeType: 'negative' as const,
    },
    {
      name: t('totalSeasons'),
      value: currentClub?.seasons.length || 0,
      icon: ChartBarIcon,
      change: '-1.39%',
      changeType: 'positive' as const,
    },
    {
      name: t('clubsManaged'),
      value: 1,
      icon: BuildingOfficeIcon,
      change: '+10.18%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div>
      <h3 className="text-base font-semibold leading-6 club-text">
        {t('statistics')}
      </h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="club-card relative overflow-hidden rounded-lg px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="club-stat-icon absolute rounded-md p-3">
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold club-text">
                {item.value}
              </p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {item.change}
              </p>
              <div className="absolute inset-x-0 bottom-0 club-bg px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a
                    href="#"
                    className="club-stat-link font-medium hover:opacity-80"
                  >
                    {t('viewAll')}
                  </a>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}