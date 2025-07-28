'use client';

import React, { useState } from 'react';
import { addCustomStatus } from '@/utils/custom-statuses';

interface AddColumnButtonProps {
  onColumnAdded?: () => void;
}

export function AddColumnButton({ onColumnAdded }: AddColumnButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columnName, setColumnName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!columnName.trim()) {
      setError('Название колонки обязательно');
      return;
    }

    if (columnName.trim().length < 2) {
      setError('Название должно содержать минимум 2 символа');
      return;
    }

    try {
      addCustomStatus(columnName.trim());
      setColumnName('');
      setError('');
      setIsModalOpen(false);
      onColumnAdded?.();
    } catch (error) {
      setError(`Ошибка при создании колонки - ${error}`);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setColumnName('');
    setError('');
  };

  return (
    <>
      {/* Кнопка добавления колонки */}
      <div className="flex flex-col w-80 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 min-h-[200px] items-center justify-center hover:border-gray-400 transition-colors">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center p-6 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg
            className="w-8 h-8 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span className="text-sm font-medium">Добавить колонку</span>
        </button>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div 
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Добавить новую колонку
                </h2>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 py-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название колонки *
                  </label>
                  <input
                    type="text"
                    value={columnName}
                    onChange={(e) => {
                      setColumnName(e.target.value);
                      setError('');
                    }}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Введите название колонки"
                    maxLength={50}
                    autoFocus
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                  )}
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Новая колонка будет добавлена в конец канбан-доски с автоматически выбранным цветом.
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Отмена
                  </button>
                  
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Создать
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}