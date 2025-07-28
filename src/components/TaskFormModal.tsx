'use client';
import { useState, useEffect } from 'react';
import { TCardData, TCardItemProps } from '@/types/cards';
import { loadCardsFromStorage, saveCardsToStorage } from '@/utils/cards-storage';
import { loadCustomStatuses } from '@/utils/custom-statuses'; // Импортируем функцию загрузки статусов

interface TaskFormModalProps {
  taskId: string | null;
  isOpen: boolean;
  isEditMode: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function TaskFormModal({ taskId, isOpen, isEditMode, onClose, onSave }: TaskFormModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [availableStatuses, setAvailableStatuses] = useState<Array<{value: string, label: string}>>([]);
  
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: TCardItemProps['priority'];
    status: string;
  }>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'new'
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Приоритеты остаются статичными
  const priorities = [
    { value: 'low', label: 'Низкий' },
    { value: 'medium', label: 'Средний' },
    { value: 'high', label: 'Высокий' }
  ];

  // Загружаем статусы при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      const customStatuses = loadCustomStatuses();
      const statusOptions = customStatuses.map(status => ({
        value: status.id,
        label: status.label
      }));
      setAvailableStatuses(statusOptions);
      
      // Устанавливаем первый статус по умолчанию, если formData.status не установлен
      if (!isEditMode && statusOptions.length > 0) {
        setFormData(prev => ({
          ...prev,
          status: statusOptions[0].value
        }));
      }
    }
  }, [isOpen, isEditMode]);

  // Слушаем изменения статусов (если они обновляются в другом месте)
  useEffect(() => {
    const handleStatusesUpdate = () => {
      if (isOpen) {
        const customStatuses = loadCustomStatuses();
        const statusOptions = customStatuses.map(status => ({
          value: status.id,
          label: status.label
        }));
        setAvailableStatuses(statusOptions);
      }
    };

    window.addEventListener('statusesUpdated', handleStatusesUpdate);
    return () => window.removeEventListener('statusesUpdated', handleStatusesUpdate);
  }, [isOpen]);

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
      // Для создания новой карточки устанавливаем первый доступный статус
      const customStatuses = loadCustomStatuses();
      const firstStatus = customStatuses.length > 0 ? customStatuses[0].id : 'new';
      
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: firstStatus
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
      
      // Вычисляем order для новой карточки (последняя в колонке)
      const cardsInStatus = cards.filter(card => card.status === formData.status);
      const maxOrder = cardsInStatus.length > 0 
        ? Math.max(...cardsInStatus.map(card => card.order || 0)) 
        : -1;
      
      const newCard: TCardData = {
        id: newId,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        date: new Date().toISOString().split('T')[0],
        order: maxOrder + 1
      };
      cards.push(newCard);
    }
    
    saveCardsToStorage(cards);
    onSave();
    handleClose();
  };

  const handleDelete = () => {
    if (!taskId || taskId === 'new') return;
    
    const cards = loadCardsFromStorage();
    const filteredCards = cards.filter((c: TCardData) => c.id !== taskId);
    saveCardsToStorage(filteredCards);
    
    setShowDeleteConfirm(false);
    onSave();
    handleClose();
  };

  const handleClose = () => {
    const firstAvailableStatus = availableStatuses.length > 0 ? availableStatuses[0].value : 'new';
    setFormData({ 
      title: '', 
      description: '', 
      priority: 'medium', 
      status: firstAvailableStatus 
    });
    setErrors({});
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 bg-opacity-50 z-40"
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

            {/* Status - теперь динамический */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={availableStatuses.length === 0}
              >
                {availableStatuses.length === 0 ? (
                  <option value="">Загрузка статусов...</option>
                ) : (
                  availableStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Дата создания - только для редактирования */}   
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
                disabled={availableStatuses.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50" />
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