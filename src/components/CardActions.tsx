'use client';

import { useTaskModal } from '@/hooks/useTaskModal';

interface CardActionsProps {
  taskId: string;
  className?: string;
}

export function CardActions({ taskId, className = '' }: CardActionsProps) {
  const { openEditModal } = useTaskModal();

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openEditModal(taskId);
  };

  return (
    <button
      onClick={handleEdit}
      className={`p-1 text-gray-400 hover:text-gray-600 transition-colors ${className}`}
      title="Редактировать карточку"
    >
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
        />
      </svg>
    </button>
  );
}

// src/utils/cardHelpers.ts
import { TCardItemProps } from '@/types/cards';

export const getStatusColor = (status: TCardItemProps['status']) => {
  switch (status) {
    case 'new':
      return 'bg-gray-100 text-gray-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'tested':
      return 'bg-yellow-100 text-yellow-800';
    case 'done':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getPriorityColor = (priority: TCardItemProps['priority']) => {
  switch (priority) {
    case 'low':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status: TCardItemProps['status']) => {
  switch (status) {
    case 'new':
      return 'Новая';
    case 'in-progress':
      return 'В процессе';
    case 'tested':
      return 'Протестирована';
    case 'done':
      return 'Завершена';
    default:
      return status;
  }
};

export const getPriorityLabel = (priority: TCardItemProps['priority']) => {
  switch (priority) {
    case 'low':
      return 'Низкий';
    case 'medium':
      return 'Средний';
    case 'high':
      return 'Высокий';
    default:
      return priority;
  }
};