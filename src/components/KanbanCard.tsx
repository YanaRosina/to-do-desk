'use client';

import React, { useState } from 'react';
import { TCardData } from '@/types/cards';
import { CardActions } from './CardActions';
import { getPriorityColor, getPriorityLabel } from '@/utils/cardHelpers';

interface KanbanCardProps {
  card: TCardData;
  index: number;
}

export function KanbanCard({ card, index }: KanbanCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    
    // Устанавливаем данные для drag and drop
    e.dataTransfer.setData('text/plain', card.id);
    e.dataTransfer.setData('application/status', card.status);
    e.dataTransfer.setData('application/index', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      className={`group relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-move hover:shadow-md transition-all ${
        isDragging ? 'opacity-50 rotate-1 scale-105 z-50' : ''
      }`}
      style={{
        transform: isDragging ? 'rotate(2deg) scale(1.05)' : 'none',
      }}
    >
      {/* Кнопка редактирования */}
      <div className="absolute top-2 right-2">
        <CardActions taskId={card.id} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {/* Заголовок */}
      <div className="mb-2 pr-8">
        <h4 className="font-semibold text-gray-900 text-sm leading-tight">
          {card.title}
        </h4>
      </div>

      {/* Описание */}
      <p className="text-xs text-gray-600 mb-3 line-clamp-3">
        {card.description}
      </p>

      {/* Метаинформация */}
      <div className="flex items-center justify-between">
        {/* Приоритет */}
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(card.priority)}`}>
          {getPriorityLabel(card.priority)}
        </span>

        {/* Дата */}
        <span className="text-xs text-gray-400">
          {card.date}
        </span>
      </div>
    </div>
  );
}