// src/components/ui/TransactionItem.jsx
import React, { useState, useRef } from 'react';
import { ICONS } from '../icons';
import { motion } from 'framer-motion';
import { spring } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';

const TransactionItem = ({ transaction }) => {
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
  const IconComponent = getAccountByName(transaction.account).icon;

  const pressTimer = useRef(null);
  const longPressThreshold = 500; // 500ms для долгого нажатия

  const isDepositTransaction = transaction.category === 'Пополнение депозита' || transaction.category === 'Снятие с депозита';
  const isLoanTransaction = transaction.category === 'Погашение кредита';

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
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
    if (e.button === 2) { // Запрещаем контекстное меню на ПК
      e.preventDefault();
      return;
    }
    
    // Очищаем предыдущий таймер, если он есть
    clearTimeout(pressTimer.current);

    pressTimer.current = setTimeout(() => {
      handleDelete();
      pressTimer.current = null; // Очищаем таймер после выполнения
    }, longPressThreshold);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
      // Если таймер был очищен до срабатывания, это был клик/короткое касание
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
      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl dark:bg-gray-800 cursor-pointer"
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressCancel}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressCancel}
      onContextMenu={(e) => e.preventDefault()}
      whileTap={{ scale: 0.95 }}
      transition={spring}
    >
      <div className="flex items-center">
        {transaction.type === 'income' ? (
          <ICONS.ArrowUpCircle className="w-8 h-8 text-green-500 mr-4" />
        ) : (
          <ICONS.ArrowDownCircle className="w-8 h-8 text-red-500 mr-4" />
        )}
        <div>
          <div className="font-medium text-gray-800 dark:text-gray-200">{transaction.category}</div>
          <div className="text-sm text-gray-500 flex items-center dark:text-gray-400">
            {transaction.date} •
            <IconComponent className="w-4 h-4 mx-1" style={{ color: account.color }} />
            {account.name}
          </div>
          {transaction.description && (
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {transaction.description}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <div className={`font-semibold mr-4 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
          {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} {currencySymbol}
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionItem;