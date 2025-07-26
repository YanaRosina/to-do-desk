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