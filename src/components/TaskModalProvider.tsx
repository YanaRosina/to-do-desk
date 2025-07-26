'use client';

import { TaskFormModal } from './TaskFormModal';
import { useTaskModal } from '@/hooks/useTaskModal';

interface TaskModalProviderProps {
  children: React.ReactNode;
}

export function TaskModalProvider({ children }: TaskModalProviderProps) {
  const {
    isModalOpen,
    currentTaskId,
    isEditMode,
    closeModal,
    handleSave
  } = useTaskModal();

  return (
    <>
      {children}
      <TaskFormModal
        taskId={currentTaskId}
        isOpen={isModalOpen}
        isEditMode={isEditMode}
        onClose={closeModal}
        onSave={handleSave}
      />
    </>
  );
}