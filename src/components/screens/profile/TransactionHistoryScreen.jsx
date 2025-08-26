import React, { useState } from 'react';
import { ICONS } from '../../icons';
import TransactionItem from '../../ui/TransactionItem';

const TransactionHistoryScreen = ({ transactions, setTransactions, setEditingTransaction, setCurrentScreen, getAccountByName, depositTransactions, setDepositTransactions, loans, setLoans, deposits, setDeposits, loanTransactions, setLoanTransactions, setShowAddTransaction }) => {
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
        <button
          onClick={() => setCurrentScreen('')}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
        </button>
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
          <button
            onClick={() => setFilterType('all')}
            className={`p-3 rounded-xl font-medium ${
              filterType === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`p-3 rounded-xl font-medium ${
              filterType === 'income'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Доходы
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`p-3 rounded-xl font-medium ${
              filterType === 'expense'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Расходы
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              setEditingTransaction={setEditingTransaction}
              setTransactions={setTransactions}
              transactions={transactions}
              getAccountByName={getAccountByName}
              setDepositTransactions={setDepositTransactions}
              depositTransactions={depositTransactions}
              setLoans={setLoans}
              loans={loans}
              setDeposits={setDeposits}
              deposits={deposits}
              setLoanTransactions={setLoanTransactions}
              loanTransactions={loanTransactions}
              setShowAddTransaction={setShowAddTransaction}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Транзакций не найдено.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryScreen;