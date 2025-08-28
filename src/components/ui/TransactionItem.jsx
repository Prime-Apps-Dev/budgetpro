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
  const longPressThreshold = 500;

  const isDepositTransaction = transaction.category === 'Пополнение депозита' || transaction.category === 'Снятие с депозита';
  const isLoanTransaction = transaction.category === 'Погашение кредита';

  // Форматирование даты - только для сегодня/вчера
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

  const handlePressStart = (e) => {
    if (e.button === 2) {
      e.preventDefault();
      return;
    }
    
    clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => {
      handleDelete();
      pressTimer.current = null;
    }, longPressThreshold);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
      setEditingTransaction(transaction);
      setShowAddTransaction(true);
    }
  };

  const handlePressCancel = () => {
    clearTimeout(pressTimer.current);
    pressTimer.current = null;
  };

  return (
    <motion.div
      style={style}
      className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressCancel}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressCancel}
      onContextMenu={(e) => e.preventDefault()}
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