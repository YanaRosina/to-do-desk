"use client";
import React, { useState, useEffect } from 'react';
import { CardItem } from '@/components/CardItem';
import { TCardData } from '@/types/cards';
import { loadCardsFromStorage } from '@/utils/cards-storage';

const CardsList = () => {
  const [cards, setCards] = useState<TCardData[]>([]);
  const [filter, setFilter] = useState<'date' | 'title' | 'status'>('date');

  useEffect(() => {
    const loaded = loadCardsFromStorage();
    setCards(loaded);
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as 'date' | 'title' | 'status');
  };

const sortedCards = [...cards].sort((a, b) => {
  switch (filter) {
    case 'date':
      return new Date(b.date).getTime() - new Date(a.date).getTime(); // по убыванию даты
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
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Фильтр */}
    <div className="flex justify-end mb-6">
  <label htmlFor="filter" className="mr-2 font-semibold text-white">
    Сортировать по:
  </label>
  <select
    id="filter"
    value={filter}
    onChange={handleFilterChange}
    className=" bg-[#393646] text-white rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 "
  >
    <option value="date" className="bg-[#393646] text-white">Дате</option>
    <option value="title" className="bg-[#393646] text-white">Названию</option>
    <option value="status" className="bg-[#393646] text-white ">Статусу</option>
  </select>
</div>

        {/* Карточки */}
        <div className="flex flex-col">
          {sortedCards.map((card) => (
            <CardItem
              key={card.id}
              title={card.title}
              description={card.description}
              date={card.date}
              priority={card.priority}
              status={card.status}
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