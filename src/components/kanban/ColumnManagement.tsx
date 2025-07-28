'use client';

import React, { useState } from 'react';
import { removeCustomStatus, DEFAULT_STATUSES, CustomStatus } from '@/utils/custom-statuses';
import { loadCardsFromStorage, saveCardsToStorage } from '@/utils/cards-storage';

interface ColumnManagementProps {
  status: CustomStatus;
  onColumnRemoved?: () => void;
}

export function ColumnManagement({ status, onColumnRemoved }: ColumnManagementProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Проверяем, можно ли удалить колонку (нельзя удалять дефолтные)
  const canDelete = !DEFAULT_STATUSES.some(s => s.id === status.id);

  const handleDelete = () => {
    if (!canDelete) return;

    // Перемещаем все карточки из удаляемой колонки в "Новые"
    const cards = loadCardsFromStorage();
    const updatedCards = cards.map(card => 
      card.status === status.id 
        ? { ...card, status: 'new', order: 0 } 
        : card
    );

    // Пересчитываем order для колонки "Новые"
    const newStatusCards = updatedCards
      .filter(card => card.status === 'new')
      .map((card, index) => ({ ...card, order: index }));

    const finalCards = updatedCards.map(card => {
      const reorderedCard = newStatusCards.find(nc => nc.id === card.id);
      return reorderedCard || card;
    });

    // Сохраняем карточки и удаляем статус
    saveCardsToStorage(finalCards);
    removeCustomStatus(status.id);

    setShowDeleteConfirm(false);
    onColumnRemoved?.();
  };

  if (!canDelete) {
    return null; // Не показываем кнопку для дефолтных колонок
  }

  return (
    <>
      {/* Кнопка удаления */}
      <button
        onClick={() => setShowDeleteConfirm(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
        title="Удалить колонку"
      >
        <svg
          className="w-4 h-4 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>

      {/* Модальное окно подтверждения */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50" />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Удалить колонку {status.label}?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Все карточки из этой колонки будут перемещены в колонку Новые. 
                  Это действие нельзя отменить.
                </p>
                <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                  ⚠️ Дефолтные колонки нельзя удалить
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}