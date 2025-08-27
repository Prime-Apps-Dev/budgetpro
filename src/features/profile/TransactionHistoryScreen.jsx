// src/components/screens/profile/TransactionHistoryScreen.jsx
import React, { useState } from 'react';
import { ICONS } from '../../components/icons';
import TransactionItem from '../../components/ui/TransactionItem';
import { motion } from 'framer-motion';
import { whileTap, spring, zoomInOut } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';

const TransactionHistoryScreen = () => {
  const {
    transactions,
    setCurrentScreen,
    getFilteredTransactions,
    getAccountByName,
    loans,
    deposits,
    loanTransactions,
    depositTransactions,
    currencySymbol
  } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredTransactions = transactions.slice().reverse().filter(transaction => {
    const matchesSearch = transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="flex items-center mb-8">
        <motion.button
          onClick={() => setCurrentScreen('profile')}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          whileTap={whileTap}
          transition={spring}
        >
          <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
        </motion.button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">История транзакций</h2>
      </div>

      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Поиск по категории, счёту или описанию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
        />
        <div className="grid grid-cols-3 gap-3">
          <motion.button
            onClick={() => setFilterType('all')}
            className={`p-3 rounded-xl font-medium ${
              filterType === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
            whileTap={whileTap}
            transition={spring}
          >
            Все
          </motion.button>
          <motion.button
            onClick={() => setFilterType('income')}
            className={`p-3 rounded-xl font-medium ${
              filterType === 'income'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
            whileTap={whileTap}
            transition={spring}
          >
            Доходы
          </motion.button>
          <motion.button
            onClick={() => setFilterType('expense')}
            className={`p-3 rounded-xl font-medium ${
              filterType === 'expense'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
            whileTap={whileTap}
            transition={spring}
          >
            Расходы
          </motion.button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
            <motion.div key={transaction.id} variants={zoomInOut} initial="initial" whileInView="whileInView" viewport={{ once: true, amount: 0.2 }}>
              <TransactionItem
                transaction={transaction}
              />
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Транзакций не найдено.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryScreen;