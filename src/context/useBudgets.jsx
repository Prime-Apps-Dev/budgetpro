// src/context/useBudgets.jsx
import React, { createContext, useState, useContext, useMemo } from 'react';
import { useTransactions } from './useTransactions';

const BudgetsContext = createContext(null);

export const BudgetsProvider = ({ children }) => {
  const { transactions } = useTransactions();
  const [budgets, setBudgets] = useState([]);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const totalPlannedBudget = useMemo(() => {
    return budgets.reduce((sum, budget) => sum + budget.limit, 0);
  }, [budgets]);

  const totalSpentOnBudgets = useMemo(() => {
    return budgets.reduce((totalSpent, budget) => {
      const spentForCategory = transactions
        .filter(t => t.category === budget.category && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return totalSpent + spentForCategory;
    }, 0);
  }, [budgets, transactions]);
  
  const value = useMemo(() => ({
    budgets, setBudgets,
    showAddBudgetModal, setShowAddBudgetModal,
    editingBudget, setEditingBudget,
    totalPlannedBudget,
    totalSpentOnBudgets,
  }), [
    budgets, setBudgets,
    showAddBudgetModal, setShowAddBudgetModal,
    editingBudget, setEditingBudget,
    totalPlannedBudget,
    totalSpentOnBudgets,
  ]);

  return <BudgetsContext.Provider value={value}>{children}</BudgetsContext.Provider>;
};

export const useBudgets = () => {
  const context = useContext(BudgetsContext);
  if (context === null) {
    throw new Error('useBudgets must be used within a BudgetsProvider');
  }
  return context;
};