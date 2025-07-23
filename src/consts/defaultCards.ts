// Данные по умолчанию
import {  TCardData  } from '@/types/cards';
const defaultCards:  TCardData [] = [
  {
    id: '1',
    title: 'Исправить баг в авторизации',
    description: 'Пользователи не могут войти в систему через Google OAuth. Необходимо проверить настройки API ключей.',
    date: '2025-07-20',
    priority: 'high',
    status: 'new'
  },
  {
    id: '2',
    title: 'Добавить темную тему',
    description: 'Реализовать переключатель темной темы для улучшения пользовательского опыта в ночное время.',
    date: '2025-07-18',
    priority: 'medium',
    status: 'in-progress'
  },
  {
    id: '3',
    title: 'Оптимизировать загрузку изображений',
    description: 'Внедрить lazy loading для изображений в галерее для улучшения производительности.',
    date: '2025-07-15',
    priority: 'low',
    status: 'tested'
  }
];
export default defaultCards;