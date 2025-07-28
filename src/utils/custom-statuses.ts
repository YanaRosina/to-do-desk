export interface CustomStatus {
  id: string;
  label: string;
  color: string;
  order: number;
}

// Дефолтные статусы
export const DEFAULT_STATUSES: CustomStatus[] = [
  { id: 'new', label: 'Новые', color: 'gray', order: 0 },
  { id: 'in-progress', label: 'В процессе', color: 'blue', order: 1 },
  { id: 'tested', label: 'Протестированы', color: 'yellow', order: 2 },
  { id: 'done', label: 'Завершены', color: 'green', order: 3 }
];

// Доступные цвета для новых статусов
export const AVAILABLE_COLORS = [
  'gray', 'blue', 'yellow', 'green', 'red', 'purple', 'pink', 'indigo', 
  'teal', 'orange', 'cyan', 'lime', 'emerald', 'violet', 'rose', 'sky'
];

// Маппинг цветов для Tailwind CSS
const COLOR_CLASSES = {
  gray: 'bg-gray-100 text-gray-800',
  blue: 'bg-blue-100 text-blue-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  purple: 'bg-purple-100 text-purple-800',
  pink: 'bg-pink-100 text-pink-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  teal: 'bg-teal-100 text-teal-800',
  orange: 'bg-orange-100 text-orange-800',
  cyan: 'bg-cyan-100 text-cyan-800',
  lime: 'bg-lime-100 text-lime-800',
  emerald: 'bg-emerald-100 text-emerald-800',
  violet: 'bg-violet-100 text-violet-800',
  rose: 'bg-rose-100 text-rose-800',
  sky: 'bg-sky-100 text-sky-800'
};

const STORAGE_KEY = 'kanban_custom_statuses';

// Функция для получения случайного цвета
export const getRandomColor = (excludeColors: string[] = []): string => {
  const availableColors = AVAILABLE_COLORS.filter(color => !excludeColors.includes(color));
  return availableColors[Math.floor(Math.random() * availableColors.length)] || 'gray';
};

// Загрузка кастомных статусов из localStorage
export const loadCustomStatuses = (): CustomStatus[] => {
  if (typeof window === 'undefined') return DEFAULT_STATUSES;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const customStatuses = JSON.parse(stored);
      // Объединяем дефолтные и кастомные статусы
      const mergedStatuses = [...DEFAULT_STATUSES];
      
      customStatuses.forEach((customStatus: CustomStatus) => {
        const existingIndex = mergedStatuses.findIndex(s => s.id === customStatus.id);
        if (existingIndex >= 0) {
          // Обновляем существующий статус
          mergedStatuses[existingIndex] = customStatus;
        } else {
          // Добавляем новый статус
          mergedStatuses.push(customStatus);
        }
      });
      
      return mergedStatuses.sort((a, b) => a.order - b.order);
    }
  } catch (error) {
    console.error('Error loading custom statuses:', error);
  }
  
  return DEFAULT_STATUSES;
};

// Сохранение кастомных статусов в localStorage
export const saveCustomStatuses = (statuses: CustomStatus[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
    // Уведомляем другие компоненты об изменении
    window.dispatchEvent(new Event('statusesUpdated'));
  } catch (error) {
    console.error('Error saving custom statuses:', error);
  }
};

// Добавление нового статуса
export const addCustomStatus = (label: string): CustomStatus => {
  const currentStatuses = loadCustomStatuses();
  const usedColors = currentStatuses.map(s => s.color);
  const newColor = getRandomColor(usedColors);
  const maxOrder = Math.max(...currentStatuses.map(s => s.order));
  
  const newStatus: CustomStatus = {
    id: `custom_${Date.now()}`,
    label,
    color: newColor,
    order: maxOrder + 1
  };
  
  const updatedStatuses = [...currentStatuses, newStatus];
  saveCustomStatuses(updatedStatuses);
  
  return newStatus;
};

// Удаление кастомного статуса
export const removeCustomStatus = (statusId: string): void => {
  // Нельзя удалять дефолтные статусы
  if (DEFAULT_STATUSES.some(s => s.id === statusId)) {
    return;
  }
  
  const currentStatuses = loadCustomStatuses();
  const updatedStatuses = currentStatuses.filter(s => s.id !== statusId);
  saveCustomStatuses(updatedStatuses);
};

// Обновление порядка статусов
export const updateStatusesOrder = (statuses: CustomStatus[]): void => {
  const updatedStatuses = statuses.map((status, index) => ({
    ...status,
    order: index
  }));
  saveCustomStatuses(updatedStatuses);
};

// Получение цвета для статуса 
export const getStatusColor = (status: string): string => {
  const statuses = loadCustomStatuses();
  const statusObj = statuses.find(s => s.id === status);
  const color = statusObj?.color || 'gray';
  
  return COLOR_CLASSES[color as keyof typeof COLOR_CLASSES] || COLOR_CLASSES.gray;
};

// Получение лейбла для статуса
export const getStatusLabel = (status: string): string => {
  const statuses = loadCustomStatuses();
  const statusObj = statuses.find(s => s.id === status);
  return statusObj?.label || status;
};