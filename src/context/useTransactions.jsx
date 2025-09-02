// src/context/useTransactions.jsx
import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { useSettings } from './useSettings';

const TransactionsContext = createContext(null);

export const TransactionsProvider = ({ children }) => {
  const { currencySymbol, defaultState } = useSettings();
  const [transactions, setTransactions] = useState([]);
  const [loanTransactions, setLoanTransactions] = useState([]);
  const [depositTransactions, setDepositTransactions] = useState([]);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    category: '',
    account: 'Основной',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [transactionFilterType, setTransactionFilterType] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const getFilteredTransactions = useCallback((period = selectedPeriod) => {
    let filtered = [...transactions];
    const now = new Date();

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= new Date(dateRange.start) && transactionDate <= new Date(dateRange.end);
      });
    } else {
      switch (period) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
          break;
        case 'month':
          const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
          filtered = filtered.filter(t => new Date(t.date) >= monthAgo);
          break;
        case 'quarter':
          const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          filtered = filtered.filter(t => new Date(t.date) >= quarterAgo);
          break;
        case 'year':
          const yearAgo = new Date(now.getFullYear(), 0, 1);
          filtered = filtered.filter(t => new Date(t.date) >= yearAgo);
          break;
        default:
          break;
      }
    }
    return filtered;
  }, [transactions, dateRange, selectedPeriod]);

  const filteredTransactions = useMemo(() => getFilteredTransactions(), [getFilteredTransactions]);

  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const totalExpenses = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const totalBudget = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  const getMonthlyTransactionsCount = useCallback(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
    }).length;
  }, [transactions]);
  
  const value = useMemo(() => ({
    transactions, setTransactions,
    loanTransactions, setLoanTransactions,
    depositTransactions, setDepositTransactions,
    showAddTransaction, setShowAddTransaction,
    editingTransaction, setEditingTransaction,
    newTransaction, setNewTransaction,
    transactionFilterType, setTransactionFilterType,
    selectedPeriod, setSelectedPeriod,
    dateRange, setDateRange,
    getFilteredTransactions,
    filteredTransactions,
    totalIncome,
    totalExpenses,
    totalBudget,
    currencySymbol,
    getMonthlyTransactionsCount,
  }), [
    transactions, setTransactions,
    loanTransactions, setLoanTransactions,
    depositTransactions, setDepositTransactions,
    showAddTransaction, setShowAddTransaction,
    editingTransaction, setEditingTransaction,
    newTransaction, setNewTransaction,
    transactionFilterType, setTransactionFilterType,
    selectedPeriod, setSelectedPeriod,
    dateRange, setDateRange,
    getFilteredTransactions,
    filteredTransactions,
    totalIncome,
    totalExpenses,
    totalBudget,
    currencySymbol,
    getMonthlyTransactionsCount,
  ]);

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (context === null) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};