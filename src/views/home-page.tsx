'use client';

import React, { useState, useEffect } from 'react';
import { CreateTaskButton } from '@/components/CreateTaskButton';
import { ViewToggle, ViewMode } from '@/components/ViewToggle';
import { useTaskModal } from '@/hooks/useTaskModal';
import CardsList from '@/components/CardsList';
import KanbanBoard from '@/components/KanbanBoard';
import { loadCardsFromStorage, saveCardsToStorage } from '@/utils/cards-storage';
import {  TCardItemProps } from '@/types/cards';

export function HomePage() {
  const { openCreateModal } = useTaskModal();
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Сохраняем предпочтение пользователя в localStorage
  useEffect(() => {
    const savedView = localStorage.getItem('viewMode') as ViewMode;
    if (savedView) {
      setViewMode(savedView);
    }
  }, []);

  const handleViewChange = (view: ViewMode) => {
    setViewMode(view);
    localStorage.setItem('viewMode', view);
  };

  // Обработчик изменения статуса карточки через drag-and-drop (только для канбан)
  useEffect(() => {
    const handleCardStatusChange = (e: CustomEvent) => {
      const { cardId, newStatus } = e.detail;
      
      const cards = loadCardsFromStorage();
      const cardIndex = cards.findIndex(card => card.id === cardId);
      
      if (cardIndex !== -1) {
        const updatedCards = [...cards];
        updatedCards[cardIndex] = {
          ...updatedCards[cardIndex],
          status: newStatus as TCardItemProps['status']
        };
        
        saveCardsToStorage(updatedCards);
        
        // Уведомляем компоненты об обновлении
        window.dispatchEvent(new Event('cardsUpdated'));
      }
    };

    window.addEventListener('cardStatusChange', handleCardStatusChange as EventListener);
    
    return () => {
      window.removeEventListener('cardStatusChange', handleCardStatusChange as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              To-Do Desk
            </h1>
            
            <div className="flex items-center space-x-4">
              <ViewToggle 
                currentView={viewMode} 
                onViewChange={handleViewChange} 
              />
              <CreateTaskButton onClick={openCreateModal} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={viewMode === 'kanban' ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        {viewMode === 'list' ? <CardsList /> : <KanbanBoard />}
      </div>
    </div>
  );
}