'use client';

import { useState, useEffect } from 'react';
import { TCardData, TCardItemProps } from '@/types/cards';
import { loadCardsFromStorage, saveCardsToStorage } from '@/utils/cards-storage';

interface TaskFormModalProps {
  taskId: string | null;
  isOpen: boolean;
  isEditMode: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function TaskFormModal({ taskId, isOpen, isEditMode, onClose, onSave }: TaskFormModalProps) {

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: TCardItemProps['priority'];
    status: TCardItemProps['status'];
  }>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'new'
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Статусы и приоритеты
  const statuses = [
    { value: 'new', label: 'Новая' },
    { value: 'in-progress', label: 'В процессе' },
    { value: 'tested', label: 'Протестирована' },
    { value: 'done', label: 'Завершена' }
  ];

  const priorities = [
    { value: 'low', label: 'Низкий' },
    { value: 'medium', label: 'Средний' },
    { value: 'high', label: 'Высокий' }
  ];

  // Загрузка данных при редактировании
  useEffect(() => {
    if (isEditMode && taskId && isOpen && taskId !== 'new') {
      const cards = loadCardsFromStorage();
      const card = cards.find((c: TCardData) => c.id === taskId);
      
      if (card) {
        setFormData({
          title: card.title,
          description: card.description,
          priority: card.priority,
          status: card.status
        });
      }
    } else if (!isEditMode && isOpen) {
      // Сброс формы для создания
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'new'
      });
    }
    
    setErrors({});
  }, [isEditMode, taskId, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Заголовок обязателен для заполнения';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно для заполнения';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const cards = loadCardsFromStorage();
    
    if (isEditMode && taskId && taskId !== 'new') {
      // Редактирование существующей карточки
      const cardIndex = cards.findIndex((c: TCardData) => c.id === taskId);
      if (cardIndex !== -1) {
        cards[cardIndex] = {
          ...cards[cardIndex],
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          status: formData.status
        };
      }
    } else {
      // Создание новой карточки
      const newId = cards.length > 0 
        ? (Math.max(...cards.map((c: TCardData) => parseInt(c.id))) + 1).toString() 
        : '1';
      
      const newCard: TCardData = {
        id: newId,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        date: new Date().toISOString().split('T')[0]
      };
      cards.push(newCard);
    }
    
    saveCardsToStorage(cards); // Используем функцию из utils
    onSave(); // Вызываем callback для обновления списка
    handleClose();
  };

  const handleDelete = () => {
    if (!taskId || taskId === 'new') return;
    
    const cards = loadCardsFromStorage();
    const filteredCards = cards.filter((c: TCardData) => c.id !== taskId);
    saveCardsToStorage(filteredCards);
    
    setShowDeleteConfirm(false);
    onSave(); // Вызываем callback для обновления списка
    handleClose();
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', priority: 'medium', status: 'new' });
    setErrors({});
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
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
              {isEditMode ? 'Редактировать задачу' : 'Создать задачу'}
            </h2>
          </div>

          {/* Form */}
          <div className="px-6 py-4 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Заголовок *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введите заголовок задачи"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введите описание задачи"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Приоритет
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TCardItemProps['priority'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status/Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TCardItemProps['status'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date (only show in edit mode, read-only) */}
            {isEditMode && taskId !== 'new' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата создания
                </label>
                <input
                  type="text"
                  value={(() => {
                    const cards = loadCardsFromStorage();
                    const card = cards.find((c: TCardData) => c.id === taskId);
                    return card?.date || '';
                  })()}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Отмена
            </button>
            
            <div className="flex space-x-2">
              {isEditMode && taskId !== 'new' && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Удалить
                </button>
              )}
              
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isEditMode ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Подтвердите удаление
                </h3>
                <p className="text-sm text-gray-600">
                  Вы уверены, что хотите удалить эту карточку? Это действие нельзя отменить.
                </p>
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