import React from 'react';
import { TCardData } from '@/types/cards';
import { CardActions } from './CardActions';
import { getStatusColor, getPriorityColor, getStatusLabel, getPriorityLabel } from '@/utils/cardHelpers';

interface CardItemProps {
  card: TCardData;
}

export function CardItem({ card }: CardItemProps) {
  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Кнопка редактирования в правом верхнем углу */}
      <div className="absolute top-2 right-2">
        <CardActions taskId={card.id} />
      </div>

      {/* Заголовок */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-8">
        {card.title}
      </h3>

      {/* Описание */}
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {card.description}
      </p>

      {/* Метаинформация */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Статус */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(card.status)}`}>
            {getStatusLabel(card.status)}
          </span>

          {/* Приоритет */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(card.priority)}`}>
            {getPriorityLabel(card.priority)}
          </span>
        </div>

        {/* Дата */}
        <span className="text-xs text-gray-500">
          {card.date}
        </span>
      </div>
    </div>
  );
}