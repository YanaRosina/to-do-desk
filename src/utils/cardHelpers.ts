import { TCardItemProps } from '@/types/cards';
import { getStatusColor as getCustomStatusColor, getStatusLabel as getCustomStatusLabel } from '@/utils/custom-statuses';

export const getStatusColor = (status: string) => {
  return getCustomStatusColor(status);
};

export const getStatusLabel = (status: string) => {
  return getCustomStatusLabel(status);
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