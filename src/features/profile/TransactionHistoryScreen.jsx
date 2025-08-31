// src/features/profile/TransactionHistoryScreen.jsx
import React, { useState, useMemo } from 'react';
import { ICONS } from '../../components/icons';
import TransactionItem from '../../components/ui/TransactionItem';
import { motion } from 'framer-motion';
import { whileTap, spring } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import { FixedSizeList as List } from 'react-window';
import TabSwitcher from '../../components/ui/TabSwitcher';
import AlertModal from '../../components/modals/AlertModal';

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
  const { filteredTransactions, handleEditTransaction, setTransactionToDelete, setShowConfirmDelete } = data;
  const transaction = filteredTransactions[index];

  const handleDelete = () => {
    setTransactionToDelete(transaction);
    setShowConfirmDelete(true);
  };

  const handleEdit = () => {
    handleEditTransaction(transaction);
  };

  return (
    <div style={style}>
      <TransactionItem
        transaction={transaction}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
};

const TransactionHistoryScreen = () => {
  const {
    transactions,
    goBack,
    currencySymbol,
    transactionFilterType,
    setTransactionFilterType,
    setTransactions,
    setLoans,
    loans,
    deposits,
    setDeposits,
    loanTransactions,
    setLoanTransactions,
    depositTransactions,
    setDepositTransactions,
    setShowAddTransaction,
    setEditingTransaction,
  } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

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

  /**
   * Обрабатывает подтверждение удаления.
   */
  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      handleDeleteTransaction(transactionToDelete);
    }
    setShowConfirmDelete(false);
    setTransactionToDelete(null);
  };

  /**
   * Отменяет удаление.
   */
  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setTransactionToDelete(null);
  };
  
  /**
   * Обрабатывает редактирование транзакции.
   */
  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowAddTransaction(true);
  };

  // Используем useMemo для мемоизации результатов фильтрации.
  const filteredTransactions = useMemo(() => {
    return transactions.slice().reverse().filter(transaction => {
      const matchesSearch = transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            transaction.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = transactionFilterType === 'all' || transaction.type === transactionFilterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, transactionFilterType]);

  const tabs = [
    { id: 'all', label: 'Все', icon: ICONS.Layers },
    { id: 'income', label: 'Доходы', icon: ICONS.ArrowUpCircle },
    { id: 'expense', label: 'Расходы', icon: ICONS.ArrowDownCircle }
  ];

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
        <TabSwitcher activeTab={transactionFilterType} onTabChange={setTransactionFilterType} tabs={tabs} />
      </div>

      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          <List
            height={window.innerHeight - 250} // Динамическая высота списка
            itemCount={filteredTransactions.length}
            itemSize={100} // Средняя высота элемента списка
            width={'100%'}
            itemData={{
              filteredTransactions,
              handleEditTransaction,
              setTransactionToDelete,
              setShowConfirmDelete
            }}
            className="styled-scrollbars"
          >
            {TransactionRow}
          </List>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Транзакций не найдено.</p>
        )}
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

export default TransactionHistoryScreen;