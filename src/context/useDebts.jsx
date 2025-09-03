// src/context/useDebts.jsx
import React, { createContext, useState, useContext, useMemo } from 'react';

const DebtsContext = createContext(null);

export const DebtsProvider = ({ children, debts, setDebts }) => {
  const [showAddDebtModal, setShowAddDebtModal] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [selectedDebtToRepay, setSelectedDebtToRepay] = useState(null);
  const [showDebtTransactionsModal, setShowDebtTransactionsModal] = useState(false);
  const [selectedDebtForTransactions, setSelectedDebtForTransactions] = useState(null);
  
  const value = useMemo(() => ({
    debts, setDebts,
    showAddDebtModal, setShowAddDebtModal,
    editingDebt, setEditingDebt,
    selectedDebtToRepay, setSelectedDebtToRepay,
    showDebtTransactionsModal, setShowDebtTransactionsModal,
    selectedDebtForTransactions, setSelectedDebtForTransactions,
  }), [
    debts, showAddDebtModal, editingDebt, selectedDebtToRepay,
    showDebtTransactionsModal, selectedDebtForTransactions, setDebts
  ]);

  return <DebtsContext.Provider value={value}>{children}</DebtsContext.Provider>;
};

export const useDebts = () => {
  const context = useContext(DebtsContext);
  if (context === null) {
    throw new Error('useDebts must be used within a DebtsProvider');
  }
  return context;
};