// src/pages/HomeScreen.jsx
import React from 'react';
import { ICONS } from '../components/icons';
import TransactionItem from '../components/ui/TransactionItem';
import { motion } from 'framer-motion';
import { whileHover, whileTap, spring, zoomInOut } from '../utils/motion';
import { useAppContext } from '../context/AppContext';
import { useState } from 'react';
import AlertModal from '../components/modals/AlertModal'; // Импортируем модальное окно подтверждения

/**
 * Компонент главного экрана приложения с улучшенным дизайном и 8-point grid системой.
 * Отображает общие финансовые показатели и последние транзакции.
 * @returns {JSX.Element}
 */
const HomeScreen = () => {
  const {
    totalIncome,
    totalExpenses,
    totalBudget,
    totalSavingsBalance,
    transactions,
    setTransactions,
    currencySymbol,
    setActiveTab,
    navigateToScreen,
    navigateToTransactionHistory,
    setShowAddTransaction,
    setEditingTransaction,
    depositTransactions,
    setDepositTransactions,
    setLoans,
    loans,
    deposits,
    setDeposits,
    loanTransactions,
    setLoanTransactions
  } = useAppContext();

  // Состояние для модального окна подтверждения удаления
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // Расчет баланса для отображения
  const balance = totalIncome - totalExpenses;
  const isPositiveBalance = balance >= 0;

  /**
   * Обрабатывает удаление транзакции.
   */
  const handleDeleteTransaction = (transaction) => {
    // Проверяем, является ли транзакция связанной с кредитом или депозитом
    const isDepositTransaction = transaction.category === 'Пополнение депозита' || transaction.category === 'Снятие с депозита';
    const isLoanTransaction = transaction.category === 'Погашение кредита';

    // Удаляем из общего списка
    setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== transaction.id));

    // Обновляем связанные списки, если это необходимо
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
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      handleDeleteTransaction(transactionToDelete);
    }
    setShowConfirmDelete(false);
    setTransactionToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setTransactionToDelete(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      {/* Персонализированный header - 8pt grid: py-8 (32px), px-6 (24px) */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">П</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Добро пожаловать!
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date().toLocaleDateString('ru-RU', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Краткая сводка дня */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-left">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Операций сегодня</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {transactions.filter(t => {
                    const today = new Date();
                    const transactionDate = new Date(t.date);
                    return transactionDate.toDateString() === today.toDateString();
                  }).length}
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-600" />
              <div className="text-left">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Категорий</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {new Set(transactions.map(t => t.category)).size}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isPositiveBalance ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {isPositiveBalance ? 'Прибыль' : 'Убыток'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент - 8pt grid: px-6 (24px), py-6 (24px) */}
      <div className="px-6 py-6 space-y-6">
        
        {/* Статистические карточки - 8pt grid: gap-4 (16px) */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 px-2">
            Обзор финансов
          </h2>
          
          {/* Основные показатели - доходы и расходы */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              onClick={() => navigateToTransactionHistory('income')}
              className="relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-3xl p-6 text-white shadow-green-500/5 text-left"
              whileHover={whileHover}
              whileTap={whileTap}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              {/* Декоративный элемент */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <ICONS.ArrowUpCircle className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium opacity-90">Доходы</div>
                    <div className="text-xs opacity-70">за все время</div>
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {totalIncome.toLocaleString()} {currencySymbol}
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => navigateToTransactionHistory('expense')}
              className="relative overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-3xl p-6 text-white shadow-red-500/5 text-left"
              whileHover={whileHover}
              whileTap={whileTap}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              {/* Декоративный элемент */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <ICONS.ArrowDownCircle className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium opacity-90">Расходы</div>
                    <div className="text-xs opacity-70">за все время</div>
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {totalExpenses.toLocaleString()} {currencySymbol}
                </div>
              </div>
            </motion.button>
          </div>

          {/* Дополнительные показатели - бюджет и копилка */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              onClick={() => navigateToTransactionHistory('all')}
              className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl p-6 text-white shadow-blue-500/5 text-left"
              whileHover={whileHover}
              whileTap={whileTap}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              {/* Декоративный элемент */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <ICONS.Wallet className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium opacity-90">Бюджет</div>
                    <div className="text-xs opacity-70">доступно</div>
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {totalBudget.toLocaleString()} {currencySymbol}
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => {
                setActiveTab('savings');
                navigateToScreen('savings');
              }}
              className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-3xl p-6 text-white shadow-purple-500/5 text-left"
              whileHover={whileHover}
              whileTap={whileTap}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              {/* Декоративный элемент */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <ICONS.PiggyBank className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium opacity-90">Копилка</div>
                    <div className="text-xs opacity-70">накоплено</div>
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {totalSavingsBalance.toLocaleString()} {currencySymbol}
                </div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Секция последних транзакций - 8pt grid spacing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Последние операции
            </h2>
            <button 
              onClick={() => navigateToTransactionHistory('all')}
              className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              Все операции
            </button>
          </div>
          
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.slice(-5).reverse().map((transaction, index) => (
                <motion.div 
                  key={transaction.id}
                  variants={zoomInOut}
                  whileInView="whileInView"
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TransactionItem 
                    transaction={transaction}
                    onDelete={() => {
                      setTransactionToDelete(transaction);
                      setShowConfirmDelete(true);
                    }}
                    onEdit={() => {
                      setEditingTransaction(transaction);
                      setShowAddTransaction(true);
                    }}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
                variants={zoomInOut}
                whileInView="whileInView"
                viewport={{ once: false, amount: 0.2 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <ICONS.ArrowUpCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Пока нет операций
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Добавьте первую транзакцию, чтобы начать отслеживание финансов
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      <AlertModal
        isVisible={showConfirmDelete}
        title="Удалить транзакцию?"
        message={`Транзакция "${transactionToDelete?.category}" на сумму ${transactionToDelete?.amount.toLocaleString()} ${currencySymbol} будет удалена безвозвратно.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default HomeScreen;