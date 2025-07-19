// src/components/clubs/CreateClubButton.tsx

'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { CreateClubForm } from './CreateClubForm';
import { useTranslations } from 'next-intl';

export function CreateClubButton() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('clubs');

  const handleSuccess = () => {
    setIsOpen(false);
    window.location.reload(); // Recarregar para mostrar o novo clube
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        {t('newClub')}
      </button>

      <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                {t('createNewClub')}
              </Dialog.Title>
            </div>
            
            <div className="px-6 py-4">
              <CreateClubForm 
                onSuccess={handleSuccess}
                onCancel={() => setIsOpen(false)}
              />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}