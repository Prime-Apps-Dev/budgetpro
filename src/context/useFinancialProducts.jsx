// src/context/useFinancialProducts.jsx
import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { useTransactions } from './useTransactions';

const FinancialProductsContext = createContext(null);

export const FinancialProductsProvider = ({ children }) => {
  const { loanTransactions, depositTransactions } = useTransactions();
  const [loans, setLoans] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [showAddFinancialItemModal, setShowAddFinancialItemModal] = useState(false);
  const [editingFinancialItem, setEditingFinancialItem] = useState(null);
  const [selectedFinancialItem, setSelectedFinancialItem] = useState(null);
  const [showLoanDepositTransactionModal, setShowLoanDepositTransactionModal] = useState(false);
  const [selectedLoanDepositForTransaction, setSelectedLoanDepositForTransaction] = useState(null);

  const getLoanBalance = useCallback((loanId) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return 0;
    const repayments = loanTransactions
      .filter(t => t.financialItemId === loanId)
      .reduce((sum, t) => sum + t.amount, 0);
    return loan.amount - repayments;
  }, [loans, loanTransactions]);

  const getDepositBalance = useCallback((depositId) => {
    const deposit = deposits.find(d => d.id === depositId);
    if (!deposit) return 0;
    const contributions = depositTransactions
      .filter(t => t.financialItemId === depositId && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const withdrawals = depositTransactions
      .filter(t => t.financialItemId === depositId && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return deposit.amount + contributions - withdrawals;
  }, [deposits, depositTransactions]);

  const loansWithBalance = useMemo(() => {
    return loans.map(loan => ({
      ...loan,
      currentBalance: getLoanBalance(loan.id)
    }));
  }, [loans, getLoanBalance]);

  const depositsWithBalance = useMemo(() => {
    return deposits.map(deposit => ({
      ...deposit,
      currentAmount: getDepositBalance(deposit.id)
    }));
  }, [deposits, getDepositBalance]);

  const value = useMemo(() => ({
    loans, setLoans,
    deposits, setDeposits,
    showAddFinancialItemModal, setShowAddFinancialItemModal,
    editingFinancialItem, setEditingFinancialItem,
    selectedFinancialItem, setSelectedFinancialItem,
    loansWithBalance,
    depositsWithBalance,
    showLoanDepositTransactionModal, setShowLoanDepositTransactionModal,
    selectedLoanDepositForTransaction, setSelectedLoanDepositForTransaction,
  }), [
    loans, setLoans,
    deposits, setDeposits,
    showAddFinancialItemModal, setShowAddFinancialItemModal,
    editingFinancialItem, setEditingFinancialItem,
    selectedFinancialItem, setSelectedFinancialItem,
    loansWithBalance,
    depositsWithBalance,
    showLoanDepositTransactionModal, setShowLoanDepositTransactionModal,
    selectedLoanDepositForTransaction, setSelectedLoanDepositForTransaction,
  ]);

  return <FinancialProductsContext.Provider value={value}>{children}</FinancialProductsContext.Provider>;
};

export const useFinancialProducts = () => {
  const context = useContext(FinancialProductsContext);
  if (context === null) {
    throw new Error('useFinancialProducts must be used within a FinancialProductsProvider');
  }
  return context;
};