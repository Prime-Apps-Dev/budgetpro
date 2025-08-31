// src/components/ui/FinancialItemCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { whileHover, zoomInOut } from '../../utils/motion';
import { ICONS } from '../icons';

/**
 * Универсальный компонент для отображения карточки финансового продукта
 * (кредита, депозита или долга) с прогресс-баром и иконкой.
 * @param {object} props - Свойства компонента.
 * @param {string} props.title - Заголовок карточки.
 * @param {string} props.subtitle - Подзаголовок карточки.
 * @param {string} props.amountText - Основная сумма (например, остаток долга).
 * @param {string} props.infoText - Дополнительная информационная строка.
 * @param {number} props.progress - Прогресс в процентах для заполнения прогресс-бара.
 * @param {string} props.gradient - Классы Tailwind для градиента.
 * @param {string} props.iconName - Имя иконки.
 * @param {string} props.type - Тип элемента ('loan', 'deposit', 'i-owe', 'owed-to-me', 'savings').
 * @returns {JSX.Element}
 */
const FinancialItemCard = ({
  title,
  subtitle,
  amountText,
  infoText,
  progress,
  gradient,
  iconName,
  type
}) => {
  const IconComponent = ICONS[iconName] || ICONS.MinusCircle;

  const gradientClass = gradient || 'bg-white dark:bg-gray-800';

  return (
    <motion.div
      className={`relative overflow-hidden rounded-3xl p-6 shadow-lg ${gradientClass}`}
    >
      {/* Декоративный элемент */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />

      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm mr-3">
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-lg font-semibold text-white opacity-95">{title}</div>
            {subtitle && <div className="text-sm text-white opacity-70">{subtitle}</div>}
          </div>
        </div>
      </div>
      
      {amountText && (
        <div className="mb-3">
          <div className="text-2xl font-bold mb-1 text-white">{amountText}</div>
          {infoText && <div className="text-sm opacity-80 text-white">{infoText}</div>}
        </div>
      )}

      {/* Прогресс-бар */}
      {(progress || progress === 0) && (
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 bg-white/80`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      )}
    </motion.div>
  );
};

export default FinancialItemCard;