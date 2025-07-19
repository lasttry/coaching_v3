// src/components/dashboard/DashboardLayout.tsx

'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ClubSelector } from '@/components/clubs/ClubSelector';
import type { Club, ClubWithUser } from '@/types/club';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentClub?: Club | null;
  userClubs?: ClubWithUser[];
  userRole: string;
}

export function DashboardLayout({ 
  children, 
  currentClub, 
  userClubs = [], 
  userRole 
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations('dashboard');
  const tClubs = useTranslations('clubs');

  const navigation = [
    { name: t('dashboard'), href: '/dashboard', icon: HomeIcon, current: true },
    ...(userRole === 'ADMIN' ? [
      { name: tClubs('title'), href: '/dashboard/clubs', icon: BuildingOfficeIcon, current: false },
      { name: t('users'), href: '/dashboard/users', icon: UsersIcon, current: false },
    ] : []),
    { name: t('settings'), href: '/dashboard/settings', icon: Cog6ToothIcon, current: false },
  ];

  const handleClubClick = () => {
    router.push('/dashboard/clubs/select');
  };

  // Club Header Component
  const ClubHeader = ({ isDesktop = false }: { isDesktop?: boolean }) => {
    if (!currentClub) {
      return (
        <div className="flex h-16 shrink-0 items-center justify-center">
          <button
            onClick={handleClubClick}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors w-full"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="h-6 w-6 text-gray-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900">
                {tClubs('selectClub')}
              </p>
            </div>
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex h-16 shrink-0 items-center">
        <button
          onClick={handleClubClick}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors w-full group"
        >
          {/* Club Image */}
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
            {currentClub.image ? (
              <img
                src={currentClub.image}
                alt={currentClub.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: currentClub.backgroundColor }}
              >
                <span style={{ color: currentClub.foregroundColor }}>
                  {currentClub.shortName || currentClub.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          
          {/* Club Name */}
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentClub.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {tClubs('clickToChange')}
            </p>
          </div>
          
          {/* Chevron Icon */}
          <ChevronDownIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">{t('closeSidebar')}</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  {/* Mobile Club Header */}
                  <ClubHeader />
                  
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <a
                                href={item.href}
                                className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                              >
                                <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        <button
                          onClick={() => signOut()}
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        >
                          {t('logout')}
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
          {/* Desktop Club Header */}
          <ClubHeader isDesktop />
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <button
                  onClick={() => signOut()}
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                >
                  {t('logout')}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">{t('openSidebar')}</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          {currentClub?.name || t('dashboard')}
        </div>
      </div>

      {/* Main content */}
      <main className="py-10 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}