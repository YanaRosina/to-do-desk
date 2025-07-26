'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { TCardData } from '@/types/cards';
import { loadCardsFromStorage } from '@/utils/cards-storage';

export function useTaskModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Добавляем триггер для обновления
 
  const router = useRouter();
  const pathname = usePathname();

  // Отслеживаем изменения URL для определения нужно ли открыть модал
  useEffect(() => {
    const taskMatch = pathname.match(/^\/task\/(.+)$/);
   
    if (taskMatch) {
      const taskId = taskMatch[1];
      setCurrentTaskId(taskId);
     
      // Проверяем, существует ли карточка с таким ID
      const cards = loadCardsFromStorage();
      const existingCard = cards.find((c: TCardData) => c.id === taskId);
     
      setIsEditMode(!!existingCard);
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
      setCurrentTaskId(null);
      setIsEditMode(false);
    }
  }, [pathname]);

  const openCreateModal = () => {
    // Для создания используем специальный ID 'new'
    router.push(`/task/new`);
  };

  const openEditModal = (taskId: string) => {
    router.push(`/task/${taskId}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    router.push('/');
  };

  const handleSave = () => {
    // Увеличиваем счетчик для обновления списка карточек
    setRefreshTrigger(prev => prev + 1);
  };

  return {
    isModalOpen,
    currentTaskId,
    isEditMode,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSave,
    refreshTrigger // Экспортируем триггер для использования в компонентах
  };
}