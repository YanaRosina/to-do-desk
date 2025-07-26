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

