'use client';

import React, { useState } from 'react';
import { TCardData, TCardItemProps } from '@/types/cards';
import { KanbanCard } from './KanbanCard';
import { getStatusColor } from '@/utils/cardHelpers';
import { DragDropResult } from '@/types/drag-drop';

interface KanbanColumnProps {
  status: TCardItemProps['status'];
  title: string;
  cards: TCardData[];
  onDragEnd: (result: DragDropResult) => void;
}

export function KanbanColumn({ status, title, cards, onDragEnd }: KanbanColumnProps) {
  const [draggedOver, setDraggedOver] = useState(false);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Проверяем, что мышь действительно покинула область колонки
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDraggedOver(false);
      setDraggedOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(false);
    setDraggedOverIndex(null);

    const cardId = e.dataTransfer.getData('text/plain');
    const sourceStatus = e.dataTransfer.getData('application/status');
    const sourceIndexStr = e.dataTransfer.getData('application/index');
    
    if (!cardId || !sourceStatus) return;

    const sourceIndex = parseInt(sourceIndexStr) || 0;
    let targetIndex = draggedOverIndex !== null ? draggedOverIndex : cards.length;

    // Если перетаскиваем внутри той же колонки и целевой индекс больше исходного, уменьшаем на 1
    if (sourceStatus === status && sourceIndex < targetIndex) {
      targetIndex--;
    }

    // Создаем результат перетаскивания
    const result: DragDropResult = {
      source: {
        droppableId: sourceStatus,
        index: sourceIndex
      },
      destination: {
        droppableId: status,
        index: targetIndex
      },
      draggableId: cardId
    };

    onDragEnd(result);
  };

  const handleDropZoneDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOver(true);
    setDraggedOverIndex(index);
  };

  const handleDropZoneDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOver(false);
    setDraggedOverIndex(null);

    const cardId = e.dataTransfer.getData('text/plain');
    const sourceStatus = e.dataTransfer.getData('application/status');
    const sourceIndexStr = e.dataTransfer.getData('application/index');
    
    if (!cardId || !sourceStatus) return;

    const sourceIndex = parseInt(sourceIndexStr) || 0;
    let targetIndex = index;

    // Если перетаскиваем внутри той же колонки и целевой индекс больше исходного, уменьшаем на 1
    if (sourceStatus === status && sourceIndex < targetIndex) {
      targetIndex--;
    }

    // Создаем результат перетаскивания
    const result: DragDropResult = {
      source: {
        droppableId: sourceStatus,
        index: sourceIndex
      },
      destination: {
        droppableId: status,
        index: targetIndex
      },
      draggableId: cardId
    };

    onDragEnd(result);
  };

  const statusColorClass = getStatusColor(status);

  return (
    <div className="flex flex-col w-80 bg-gray-50 rounded-lg">
      {/* Заголовок колонки */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorClass}`}>
            {cards.length}
          </span>
        </div>
      </div>

      {/* Область для карточек */}
      <div
        className={`flex-1 p-4 min-h-[500px] transition-colors ${
          draggedOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-3">
          {cards.map((card, index) => (
            <div key={card.id} className="relative">
              {/* Drop zone перед карточкой */}
              <div
                className={`h-2 mb-1 transition-all ${
                  draggedOverIndex === index 
                    ? 'bg-blue-200 border-2 border-dashed border-blue-400 rounded' 
                    : 'hover:bg-blue-100'
                }`}
                onDragOver={(e) => handleDropZoneDragOver(e, index)}
                onDrop={(e) => handleDropZoneDrop(e, index)}
              />
              
              <KanbanCard
                card={card}
                index={index}
              />
            </div>
          ))}
          
          {/* Drop zone в конце списка */}
          <div
            className={`h-4 mt-2 transition-all ${
              draggedOverIndex === cards.length 
                ? 'bg-blue-200 border-2 border-dashed border-blue-400 rounded' 
                : 'hover:bg-blue-100'
            }`}
            onDragOver={(e) => handleDropZoneDragOver(e, cards.length)}
            onDrop={(e) => handleDropZoneDrop(e, cards.length)}
          />

          {cards.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <p className="text-sm">Перетащите карточки сюда</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}