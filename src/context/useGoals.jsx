// src/context/useGoals.jsx
import React, { createContext, useState, useContext, useMemo } from 'react';

const GoalsContext = createContext(null);

export const GoalsProvider = ({ children, financialGoals, setFinancialGoals }) => {
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showGoalTransactionsModal, setShowGoalTransactionsModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showConfirmDeleteGoal, setShowConfirmDeleteGoal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);

  const value = useMemo(() => ({
    financialGoals, setFinancialGoals,
    showAddGoalModal, setShowAddGoalModal,
    editingGoal, setEditingGoal,
    showGoalTransactionsModal, setShowGoalTransactionsModal,
    selectedGoal, setSelectedGoal,
    showConfirmDeleteGoal, setShowConfirmDeleteGoal,
    goalToDelete, setGoalToDelete,
  }), [
    financialGoals, showAddGoalModal, editingGoal,
    showGoalTransactionsModal, selectedGoal, showConfirmDeleteGoal,
    goalToDelete, setFinancialGoals
  ]);

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
};

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (context === null) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};