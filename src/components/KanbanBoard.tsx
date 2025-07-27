'use client';

import React, { useState, useEffect } from 'react';
import { TCardData, TCardItemProps } from '@/types/cards';
import { loadCardsFromStorage, saveCardsToStorage } from '@/utils/cards-storage';
import { useTaskModal } from '@/hooks/useTaskModal';
import { KanbanColumn } from './KanbanColumn';
import { DragDropResult } from '@/types/drag-drop';

const KanbanBoard = () => {
  const [cards, setCards] = useState<TCardData[]>([]);
  const { refreshTrigger } = useTaskModal();

  // Определяем колонки канбан доски
  const columns: { status: TCardItemProps['status']; label: string }[] = [
    { status: 'new', label: 'Новые' },
    { status: 'in-progress', label: 'В процессе' },
    { status: 'tested', label: 'Протестированы' },
    { status: 'done', label: 'Завершены' }
  ];

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

  // Группируем карточки по статусам и сортируем по order
  const groupedCards = columns.reduce((acc, column) => {
    const columnCards = cards
      .filter(card => card.status === column.status)
      .sort((a, b) => (a.order || 0) - (b.order || 0)); // Сортируем по order
    acc[column.status] = columnCards;
    return acc;
  }, {} as Record<TCardItemProps['status'], TCardData[]>);

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

    const sourceStatus = source.droppableId as TCardItemProps['status'];
    const destStatus = destination.droppableId as TCardItemProps['status'];

    // Находим перемещаемую карточку
    const draggedCard = cards.find(card => card.id === draggableId);
    if (!draggedCard) return;

    let newCards = [...cards];

    if (sourceStatus === destStatus) {
      // Перемещение внутри одной колонки
      const columnCards = groupedCards[sourceStatus];
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
      const destColumnCards = groupedCards[destStatus];
      
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

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-6 min-w-max p-6">
        {columns.map(column => (
          <KanbanColumn
            key={column.status}
            status={column.status}
            title={column.label}
            cards={groupedCards[column.status] || []}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;