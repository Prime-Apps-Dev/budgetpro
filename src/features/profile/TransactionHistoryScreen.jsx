// src/features/profile/TransactionHistoryScreen.jsx
import React, { useState, useMemo } from 'react';
import { ICONS } from '../../components/icons';
import TransactionItem from '../../components/ui/TransactionItem';
import { motion } from 'framer-motion';
import { whileTap, spring } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import { FixedSizeList as List } from 'react-window';

/**
 * Компонент, который будет рендерить одну строку в виртуализированном списке.
 * React Window передает ему props `index` и `style`.
 * @param {object} props - Свойства компонента.
 * @param {number} props.index - Индекс элемента в списке.
 * @param {object} props.style - Стили, необходимые для виртуализации.
 * @param {array} props.data - Массив данных для списка.
 * @returns {JSX.Element}
 */
const TransactionRow = ({ index, style, data }) => {
  const transaction = data[index];
  return (
    <div style={style}>
      <TransactionItem transaction={transaction} />
    </div>
  );
};

const TransactionHistoryScreen = () => {
  const {
    transactions,
    goBack,
    currencySymbol,
    transactionFilterType,
    setTransactionFilterType
  } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');

  // Используем useMemo для мемоизации результатов фильтрации.
  // Фильтрация будет происходить только при изменении `transactions`, `searchTerm` или `transactionFilterType`.
  const filteredTransactions = useMemo(() => {
    return transactions.slice().reverse().filter(transaction => {
      const matchesSearch = transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            transaction.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = transactionFilterType === 'all' || transaction.type === transactionFilterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, transactionFilterType]);

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="flex items-center mb-8">
        <motion.button
          onClick={goBack}
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
            onClick={() => setTransactionFilterType('all')}
            className={`p-3 rounded-xl font-medium ${
              transactionFilterType === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
            whileTap={whileTap}
            transition={spring}
          >
            Все
          </motion.button>
          <motion.button
            onClick={() => setTransactionFilterType('income')}
            className={`p-3 rounded-xl font-medium ${
              transactionFilterType === 'income'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
            whileTap={whileTap}
            transition={spring}
          >
            Доходы
          </motion.button>
          <motion.button
            onClick={() => setTransactionFilterType('expense')}
            className={`p-3 rounded-xl font-medium ${
              transactionFilterType === 'expense'
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
          <List
            height={window.innerHeight - 250} // Динамическая высота списка
            itemCount={filteredTransactions.length}
            itemSize={100} // Средняя высота элемента списка
            width={'100%'}
            itemData={filteredTransactions}
            className="styled-scrollbars"
          >
            {TransactionRow}
          </List>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Транзакций не найдено.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryScreen;