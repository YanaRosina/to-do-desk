
'use client';

import { CreateTaskButton } from '@/components/CreateTaskButton';
import { useTaskModal } from '@/hooks/useTaskModal';
import  CardsList  from '@/components/CardsList'; // Ваш существующий компонент

export function HomePage() {
  const { openCreateModal } = useTaskModal();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Create Button */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 ">
              To-Do Desk
            </h1>
            <CreateTaskButton onClick={openCreateModal} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <CardsList />
      </div>
    </div>
  );
}

