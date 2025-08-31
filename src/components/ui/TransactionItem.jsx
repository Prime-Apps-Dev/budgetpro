// src/components/ui/TransactionItem.jsx
import React, { memo } from 'react';
import { ICONS } from '../icons';
import { motion } from 'framer-motion';
import { spring } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import LongPressWrapper from './LongPressWrapper';
import { AnimatePresence } from 'framer-motion';

/**
 * Минималистичный компонент для отображения транзакции с поддержкой
 * свайпа для удаления и долгого нажатия для редактирования.
 * @param {object} props - Свойства компонента.
 * @param {object} props.transaction - Объект транзакции.
 * @param {function} props.onDelete - Функция для вызова удаления.
 * @param {function} props.onEdit - Функция для вызова редактирования.
 * @param {object} props.style - Стили для виртуализации.
 */
const TransactionItem = memo(({ transaction, onDelete, onEdit, style }) => {
  const {
    getAccountByName,
    currencySymbol
  } = useAppContext();

  const account = getAccountByName(transaction.account);
  const IconComponent = account?.icon || ICONS.Wallet;

  /**
   * Форматирует дату для отображения.
   * @param {string} dateString - Дата в формате строки.
   * @returns {string} Отформатированная дата.
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    }
  };

  const handleEdit = () => {
    if (onEdit) onEdit(transaction);
  };
  
  const handleDelete = () => {
    if (onDelete) onDelete(transaction);
  };
  
  return (
    <div style={style}>
        <LongPressWrapper
            onTap={() => {}} // Обычный клик ничего не делает
            onLongPress={handleEdit}
            onSwipeLeft={handleDelete}
            swipeDeleteIcon={ICONS.Trash2} // Добавляем иконку корзины
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
                <div className="flex items-center justify-between">
                    {/* Левая часть */}
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                        {/* Иконка аккаунта с цветом */}
                        <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${account?.color || '#6366f1'}20` }}
                        >
                            <IconComponent 
                                className="w-5 h-5" 
                                style={{ color: account?.color || '#6366f1' }} 
                            />
                        </div>
                        
                        {/* Основная информация */}
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {transaction.category}
                                </h3>
                            </div>
                            
                            {/* Описание только если есть и оно короткое */}
                            {transaction.description && transaction.description.length <= 30 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                    {transaction.description}
                                </p>
                            )}
                            
                            {/* Дата и аккаунт в одной строке */}
                            <div className="flex items-center space-x-3 text-xs text-gray-400 dark:text-gray-500 mt-1">
                                <span>{formatDate(transaction.date)}</span>
                                {account && (
                                    <>
                                        <span>•</span>
                                        <span className="truncate">{account.name}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Правая часть - сумма */}
                    <div className="text-right flex-shrink-0 ml-4">
                        <div className={`font-semibold ${
                            transaction.type === 'income' 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-gray-900 dark:text-gray-100'
                        }`}>
                            {transaction.type === 'income' ? '+' : '−'}{transaction.amount.toLocaleString()} {currencySymbol}
                        </div>
                    </div>
                </div>
            </div>
        </LongPressWrapper>
    </div>
  );
});

export default TransactionItem;