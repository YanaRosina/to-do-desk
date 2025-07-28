import { TCardData } from '@/types/cards';
import defaultCards from '@/consts/defaultCards';

const STORAGE_KEY = 'todo-cards'; 

export const loadCardsFromStorage = (): TCardData[] => {
  if (typeof window === 'undefined') return []; // SSR guard
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Ошибка при чтении cards из localStorage', e);
    }
  }
  
  // Если нет данных — сохраняем дефолтные
  saveCardsToStorage(defaultCards);
  return defaultCards;
};

export const saveCardsToStorage = (cards: TCardData[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }
};

