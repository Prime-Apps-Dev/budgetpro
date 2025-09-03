// src/components/ui/BudgetCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { whileHover, zoomInOut } from '../../utils/motion';
import { ICONS } from '../icons';
import LongPressWrapper from './LongPressWrapper';

/**
 * Интерактивная карточка для бюджета с прогресс-баром и иконкой.
 * Использует принципы дизайна FinancialItemCard.
 * * @param {object} props - Свойства компонента.
 * @param {object} props.budget - Объект бюджета.
 * @param {number} props.spent - Потраченная сумма.
 * @param {number} props.progress - Прогресс в процентах.
 * @param {string} props.currencySymbol - Символ валюты.
 * @param {function} props.onEdit - Обработчик редактирования (долгое нажатие).
 * @param {function} props.onDelete - Обработчик удаления (свайп влево).
 * @param {function} props.onDoubleTap - Обработчик двойного нажатия.
 * @param {function} props.onTap - Обработчик короткого нажатия.
 * @returns {JSX.Element}
 */
const BudgetCard = ({ budget, spent, progress, currencySymbol, onEdit, onDelete, onDoubleTap, onTap }) => {
  const isOver = spent > budget.limit;
  const remaining = budget.limit - spent;
  const isWarning = progress > 100 && progress <= 125;
  const isCritical = progress > 125;
  
  const IconComponent = ICONS[budget.icon] || ICONS.LayoutGrid;

  const getGradient = () => {
    if (isCritical) {
      return 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-red-500/20';
    }
    if (isWarning) {
      return 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 shadow-orange-500/20';
    }
    // Используем запрошенный цвет #2785FF для обычного состояния
    return 'bg-gradient-to-br from-blue-500 to-[#2785FF] shadow-[#2785FF]/20';
  };
  
  const getIconColor = () => {
    if (isCritical) return 'text-red-500';
    if (isWarning) return 'text-orange-500';
    return 'text-white';
  };

  return (
    <motion.div 
      variants={zoomInOut}
      whileInView="whileInView"
      viewport={{ once: false, amount: 0.2 }}
    >
      <LongPressWrapper
        onTap={() => onTap(budget)}
        onLongPress={() => onEdit(budget)}
        onSwipeLeft={() => onDelete(budget)}
        onDoubleTap={() => onDoubleTap(budget)}
        swipeDeleteIcon={ICONS.Trash2}
        item={budget}
      >
        <motion.div
          className={`relative overflow-hidden rounded-3xl p-6 shadow-lg ${getGradient()}`}
          whileHover={whileHover}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Декоративный элемент */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm mr-3">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white opacity-95">
                  {budget.category}
                </div>
                <div className="text-sm text-white opacity-70">
                  {isOver 
                    ? `Превышение на ${(spent - budget.limit).toLocaleString()} ${currencySymbol}`
                    : `Осталось ${remaining.toLocaleString()} ${currencySymbol}`
                  }
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="text-2xl font-bold mb-1 text-white">
              {spent.toLocaleString()} {currencySymbol}
            </div>
            <div className="text-sm opacity-80 text-white">
              из {budget.limit.toLocaleString()} {currencySymbol}
            </div>
          </div>

          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 bg-white/80`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-white opacity-80 mt-3">
            <div>
              {Math.round(progress)}% выполнено
            </div>
            <div>
              {isOver ? 'Внимание' : 'В рамках бюджета'}
            </div>
          </div>

        </motion.div>
      </LongPressWrapper>
    </motion.div>
  );
};

export default BudgetCard;