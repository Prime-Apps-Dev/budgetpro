// src/components/ui/TransactionItem.jsx
import React, { useState, useRef, memo } from 'react';
import { ICONS } from '../icons';
import { motion } from 'framer-motion';
import { spring } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';

/**
 * Минималистичный компонент для отображения транзакции
 */
const TransactionItem = memo(({ transaction, style }) => {
  const {
    transactions,
    setTransactions,
    getAccountByName,
    setShowAddTransaction,
    setEditingTransaction,
    depositTransactions,
    setDepositTransactions,
    setLoans,
    loans,
    deposits,
    setDeposits,
    loanTransactions,
    setLoanTransactions,
    currencySymbol
  } = useAppContext();

  const account = getAccountByName(transaction.account);
  const IconComponent = account?.icon || ICONS.Wallet;

  const pressTimer = useRef(null);
  const isSwiping = useRef(false);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const longPressThreshold = 500; // ms
  const swipeThreshold = 50; // px

  const isDepositTransaction = transaction.category === 'Пополнение депозита' || transaction.category === 'Снятие с депозита';
  const isLoanTransaction = transaction.category === 'Погашение кредита';

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

  /**
   * Обрабатывает удаление транзакции.
   */
  const handleDelete = () => {
    if (window.confirm('Удалить транзакцию?')) {
      setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== transaction.id));

      if (isDepositTransaction && transaction.financialItemId) {
        setDeposits(prevDeposits => prevDeposits.map(d => {
          if (d.id === transaction.financialItemId) {
            const newAmount = transaction.category === 'Пополнение депозита'
              ? d.currentAmount - transaction.amount
              : d.currentAmount + transaction.amount;
            return { ...d, currentAmount: newAmount };
          }
          return d;
        }));
        setDepositTransactions(prevDepositTransactions => prevDepositTransactions.filter(t => t.id !== transaction.id));
      }
      else if (isLoanTransaction && transaction.financialItemId) {
        setLoans(prevLoans => prevLoans.map(l => {
          if (l.id === transaction.financialItemId) {
            return { ...l, currentBalance: l.currentBalance + transaction.amount };
          }
          return l;
        }));
        setLoanTransactions(prevLoanTransactions => prevLoanTransactions.filter(t => t.id !== transaction.id));
      }
    }
  };
  
  /**
   * Обрабатывает начало касания или нажатия мыши.
   * @param {object} e - Объект события.
   */
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
    
    // Запускаем таймер для обнаружения длинного нажатия
    clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => {
      // Это длинное нажатие, открываем редактирование
      setEditingTransaction(transaction);
      setShowAddTransaction(true);
      pressTimer.current = null;
    }, longPressThreshold);
  };
  
  /**
   * Обрабатывает движение пальца.
   * @param {object} e - Объект события.
   */
  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = touchStartX.current - currentX;
    const diffY = touchStartY.current - currentY;
    
    // Если движение больше по горизонтали, чем по вертикали, это свайп
    if (Math.abs(diffX) > Math.abs(diffY)) {
      isSwiping.current = true;
      clearTimeout(pressTimer.current);
      // Предотвращаем стандартное поведение (прокрутку) только если это свайп
      e.preventDefault();
      
      // Здесь можно добавить визуальный эффект сдвига
      e.target.style.transform = `translateX(${-diffX}px)`;
    } else {
        // Иначе это прокрутка, сбрасываем все, чтобы не мешать ей
        handleTouchCancel();
    }
  };
  
  /**
   * Обрабатывает окончание касания.
   */
  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - endX;
    
    // Если это был свайп и он был достаточно длинным
    if (isSwiping.current && Math.abs(diffX) > swipeThreshold) {
      handleDelete();
    }
    
    // Сбрасываем все состояния
    handleTouchCancel();
  };

  /**
   * Сбрасывает все состояния касания.
   */
  const handleTouchCancel = () => {
    clearTimeout(pressTimer.current);
    pressTimer.current = null;
    isSwiping.current = false;
    touchStartX.current = null;
    touchStartY.current = null;
    // Сбрасываем трансформацию, если она была
    if (event.target) {
        event.target.style.transform = 'translateX(0)';
    }
  };

  return (
    <motion.div
      style={style}
      className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onMouseDown={(e) => {
        // Имитируем длинное нажатие для десктопов
        clearTimeout(pressTimer.current);
        pressTimer.current = setTimeout(() => {
          setEditingTransaction(transaction);
          setShowAddTransaction(true);
          pressTimer.current = null;
        }, longPressThreshold);
      }}
      onMouseUp={() => clearTimeout(pressTimer.current)}
      onMouseLeave={() => clearTimeout(pressTimer.current)}
      onContextMenu={(e) => {
        // Обработка удаления по правому клику для десктопов
        e.preventDefault();
        handleDelete();
      }}
      whileTap={{ scale: 0.98 }}
      transition={spring}
    >
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
    </motion.div>
  );
});

export default TransactionItem;