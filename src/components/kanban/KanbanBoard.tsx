'use client';

import React, { useState, useEffect } from 'react';
import { TCardData} from '@/types/cards';
import { loadCardsFromStorage, saveCardsToStorage } from '@/utils/cards-storage';
import { useTaskModal } from '@/hooks/useTaskModal';
import { KanbanColumn } from './KanbanColumn';
import { AddColumnButton } from './AddColumnButton';
import { DragDropResult } from '@/types/drag-drop';
import { loadCustomStatuses, CustomStatus } from '@/utils/custom-statuses';

const KanbanBoard = () => {
  const [cards, setCards] = useState<TCardData[]>([]);
  const [statuses, setStatuses] = useState<CustomStatus[]>([]);
  const { refreshTrigger } = useTaskModal();

  // Загружаем статусы при монтировании
  useEffect(() => {
    const loadedStatuses = loadCustomStatuses();
    setStatuses(loadedStatuses);
  }, []);

  // Загружаем карточки при монтировании и при изменении refreshTrigger
  useEffect(() => {
    const loaded = loadCardsFromStorage();
    setCards(loaded);
  }, [refreshTrigger]);

  // Слушаем событие обновления карточек для синхронизации
  useEffect(() => {
    const handleCardsUpdated = () => {
      const loaded = loadCardsFromStorage();
      setCards(loaded);
    };

    window.addEventListener('cardsUpdated', handleCardsUpdated);
    
    return () => {
      window.removeEventListener('cardsUpdated', handleCardsUpdated);
    };
  }, []);

  // Слушаем событие обновления статусов
  useEffect(() => {
    const handleStatusesUpdated = () => {
      const loadedStatuses = loadCustomStatuses();
      setStatuses(loadedStatuses);
    };

    window.addEventListener('statusesUpdated', handleStatusesUpdated);
    
    return () => {
      window.removeEventListener('statusesUpdated', handleStatusesUpdated);
    };
  }, []);

  // Группируем карточки по статусам и сортируем по order
  const groupedCards = statuses.reduce((acc, status) => {
    const statusCards = cards
      .filter(card => card.status === status.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    acc[status.id] = statusCards;
    return acc;
  }, {} as Record<string, TCardData[]>);

  // Функция для пересчета порядка карточек в колонке
  const reorderCardsInColumn = (columnCards: TCardData[], startIndex: number, endIndex: number) => {
    const result = Array.from(columnCards);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    // Пересчитываем order для всех карточек в колонке
    return result.map((card, index) => ({
      ...card,
      order: index
    }));
  };

  // Обработчик перетаскивания
  const handleDragEnd = (result: DragDropResult) => {
    const { destination, source, draggableId } = result;

    // Если карточка не была перемещена
    if (!destination) return;

    // Если карточка осталась в том же месте
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    // Находим перемещаемую карточку
    const draggedCard = cards.find(card => card.id === draggableId);
    if (!draggedCard) return;

    let newCards = [...cards];

    if (sourceStatus === destStatus) {
      // Перемещение внутри одной колонки
      const columnCards = groupedCards[sourceStatus] || [];
      const reorderedCards = reorderCardsInColumn(columnCards, source.index, destination.index);
      
      // Заменяем карточки в общем массиве
      newCards = newCards.map(card => {
        const reorderedCard = reorderedCards.find(rc => rc.id === card.id);
        return reorderedCard || card;
      });
    } else {
      // Перемещение между колонками
      // Удаляем карточку из старой позиции
      newCards = newCards.filter(card => card.id !== draggableId);

      // Получаем карточки целевой колонки
      const destColumnCards = groupedCards[destStatus] || [];
      
      // Создаем обновленную карточку с новым статусом
      const updatedCard = { 
        ...draggedCard, 
        status: destStatus,
        order: destination.index
      };

      // Вставляем карточку в целевую колонку
      const newDestCards = [...destColumnCards];
      newDestCards.splice(destination.index, 0, updatedCard);

      // Пересчитываем order для целевой колонки
      const reorderedDestCards = newDestCards.map((card, index) => ({
        ...card,
        order: index
      }));

      // Обновляем карточки в общем массиве
      newCards = newCards.map(card => {
        const reorderedCard = reorderedDestCards.find(rc => rc.id === card.id);
        return reorderedCard || card;
      });

      // Добавляем новую карточку, если её еще нет
      if (!newCards.find(card => card.id === updatedCard.id)) {
        newCards.push(updatedCard);
      }

      // Пересчитываем order для исходной колонки
      const remainingSourceCards = newCards
        .filter(card => card.status === sourceStatus)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((card, index) => ({ ...card, order: index }));

      newCards = newCards.map(card => {
        const reorderedCard = remainingSourceCards.find(rc => rc.id === card.id);
        return reorderedCard || card;
      });
    }

    // Сохраняем изменения
    setCards(newCards);
    saveCardsToStorage(newCards);
    
    // Уведомляем другие компоненты об обновлении
    window.dispatchEvent(new Event('cardsUpdated'));
  };

  const handleColumnAdded = () => {
    // Обновляем список статусов после добавления новой колонки
    const loadedStatuses = loadCustomStatuses();
    setStatuses(loadedStatuses);
  };

  return (
    <div className="h-210 overflow-x-auto">
      <div className="flex gap-6 min-w-max p-6">
        {statuses.map(status => (
          <KanbanColumn
            key={status.id}
            status={status.id}
            title={status.label}
            cards={groupedCards[status.id] || []}
            onDragEnd={handleDragEnd}
          />
        ))}
        
        {/* Кнопка добавления новой колонки */}
        <AddColumnButton onColumnAdded={handleColumnAdded} />
      </div>
    </div>
  );
};

export default KanbanBoard;