"use client";

import React, { useState, useEffect } from 'react';
import { CardItem } from '@/components/CardItem';
import { TCardData } from '@/types/cards';
import { loadCardsFromStorage } from '@/utils/cards-storage';
import { useTaskModal } from '@/hooks/useTaskModal';

const CardsList = () => {
  const [cards, setCards] = useState<TCardData[]>([]);
  const [filter, setFilter] = useState<'date' | 'title' | 'status'>('date');
  const { refreshTrigger } = useTaskModal(); // Получаем триггер обновления

  // Загружаем карточки при монтировании и при изменении refreshTrigger
  useEffect(() => {
    const loaded = loadCardsFromStorage();
    setCards(loaded);
  }, [refreshTrigger]); // Добавляем refreshTrigger в зависимости

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as 'date' | 'title' | 'status');
  };

  const sortedCards = [...cards].sort((a, b) => {
    switch (filter) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'status': {
        const statusOrder: Record<string, number> = {
          low: 0,
          medium: 1,
          high: 2,
        };
        return statusOrder[a.priority] - statusOrder[b.priority];
      }
      default:
        return 0;
    }
  });

  return (
    <div className=" py-8">
      <div className="container mx-auto px-4">
        {/* Фильтр */}
        <div className="flex justify-end mb-6">
          <label htmlFor="filter" className="mr-2 font-semibold text-gray-700">
            Сортировать по:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            className="bg-white text-gray-700 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="date">Дате</option>
            <option value="title">Названию</option>
            <option value="status">Приоритету</option>
          </select>
        </div>

        {/* Карточки */}
        <div className="flex flex-col space-y-4">
          {sortedCards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
            />
          ))}
        </div>

        {sortedCards.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Карточки не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardsList;