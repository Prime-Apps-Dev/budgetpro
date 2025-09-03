// src/context/AppContext.jsx
import React, { createContext, useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { useSettings, SettingsProvider } from './useSettings';
import { useTransactions, TransactionsProvider } from './useTransactions';
import { useFinancialProducts, FinancialProductsProvider } from './useFinancialProducts';
import { useDebts, DebtsProvider } from './useDebts';
import { useBudgets, BudgetsProvider } from './useBudgets';
import { useGoals, GoalsProvider } from './useGoals';
import { useData } from './useData';

export const AppContext = createContext(null);

const AppContextInternal = ({ children, data, setData }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState('');
  const [screenHistory, setScreenHistory] = useState([]);
  
  // Settings
  const {
    isDarkMode, setIsDarkMode,
    currencyCode, setCurrencyCode,
    userProfile, setUserProfile,
    accounts, setAccounts,
    categories, setCategories,
    showEditProfileModal, setShowEditProfileModal,
    showAddAccountModal, setShowAddAccountModal,
    editingAccount, setEditingAccount,
    showAddCategoryModal, setShowAddCategoryModal,
    editingCategory, setEditingCategory,
    getAccountByName,
    currencySymbol,
    daysActive,
  } = useSettings();

  // Transactions
  const {
    transactions, setTransactions,
    loanTransactions, setLoanTransactions,
    depositTransactions, setDepositTransactions,
    showAddTransaction, setShowAddTransaction,
    editingTransaction, setEditingTransaction,
    newTransaction, setNewTransaction,
    prefilledTransaction, setPrefilledTransaction,
    transactionFilterType, setTransactionFilterType,
    selectedPeriod, setSelectedPeriod,
    dateRange, setDateRange,
    getFilteredTransactions,
    filteredTransactions,
    totalIncome,
    totalExpenses,
    totalBudget,
    getMonthlyTransactionsCount,
  } = useTransactions();
  
  // Financial Products
  const {
    loans, setLoans,
    deposits, setDeposits,
    showAddFinancialItemModal, setShowAddFinancialItemModal,
    editingFinancialItem, setEditingFinancialItem,
    selectedFinancialItem, setSelectedFinancialItem,
    loansWithBalance,
    depositsWithBalance,
    showLoanDepositTransactionModal, setShowLoanDepositTransactionModal,
    selectedLoanDepositForTransaction, setSelectedLoanDepositForTransaction,
  } = useFinancialProducts();
  
  // Debts
  const {
    debts, setDebts,
    showAddDebtModal, setShowAddDebtModal,
    editingDebt, setEditingDebt,
    selectedDebtToRepay, setSelectedDebtToRepay,
    showDebtTransactionsModal, setShowDebtTransactionsModal,
    selectedDebtForTransactions, setSelectedDebtForTransactions,
  } = useDebts();
  
  // Budgets
  const {
    budgets, setBudgets,
    showAddBudgetModal, setShowAddBudgetModal,
    editingBudget, setEditingBudget,
    showBudgetTransactionsModal, setShowBudgetTransactionsModal,
    selectedBudgetForTransactions, setSelectedBudgetForTransactions,
    totalPlannedBudget,
    addOrUpdateBudget
  } = useBudgets();
  
  // Goals
  const {
    financialGoals, setFinancialGoals,
    showAddGoalModal, setShowAddGoalModal,
    editingGoal, setEditingGoal,
    showGoalTransactionsModal, setShowGoalTransactionsModal,
    selectedGoal, setSelectedGoal,
    showConfirmDeleteGoal, setShowConfirmDeleteGoal,
    goalToDelete, setGoalToDelete,
  } = useGoals();

  const totalSavingsBalance = useMemo(() => {
    return financialGoals
      .filter(goal => goal.isSavings)
      .reduce((sum, goal) => sum + goal.current, 0);
  }, [financialGoals]);
  
  const totalSpentOnBudgets = useMemo(() => {
    return budgets.reduce((totalSpent, budget) => {
      const spentForCategory = transactions
        .filter(t => t.category === budget.category && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return totalSpent + spentForCategory;
    }, 0);
  }, [budgets, transactions]);
  
  const closeAllModals = useCallback(() => {
    setShowAddTransaction(false);
    setEditingTransaction(null);
    setSelectedFinancialItem(null);
    setShowAddFinancialItemModal(false);
    setEditingFinancialItem(null);
    setSelectedDebtToRepay(null);
    setShowAddDebtModal(false);
    setEditingDebt(null);
    setShowAddBudgetModal(false);
    setEditingBudget(null);
    setShowAddGoalModal(false);
    setEditingGoal(null);
    setShowAddCategoryModal(false);
    setEditingCategory(null);
    setShowEditProfileModal(false);
    setShowAddAccountModal(false);
    setEditingAccount(null);
    setShowGoalTransactionsModal(false);
    setSelectedGoal(null);
    setShowDebtTransactionsModal(false);
    setSelectedDebtForTransactions(null);
    setShowLoanDepositTransactionModal(false);
    setSelectedLoanDepositForTransaction(null);
    setShowBudgetTransactionsModal(false);
    setSelectedBudgetForTransactions(null);
    setPrefilledTransaction(null);
  }, [
    setShowAddTransaction, setEditingTransaction, setSelectedFinancialItem,
    setShowAddFinancialItemModal, setEditingFinancialItem, setSelectedDebtToRepay,
    setShowAddDebtModal, setEditingDebt, setShowAddBudgetModal, setEditingBudget,
    setShowAddGoalModal, setEditingGoal, setShowAddCategoryModal, setEditingCategory,
    setShowEditProfileModal, setShowAddAccountModal, setEditingAccount,
    setShowGoalTransactionsModal, setSelectedGoal, setShowDebtTransactionsModal,
    setSelectedDebtForTransactions, setShowLoanDepositTransactionModal, setSelectedLoanDepositForTransaction,
    setShowBudgetTransactionsModal, setSelectedBudgetForTransactions, setPrefilledTransaction
  ]);

  const navigateToScreen = useCallback((screenName) => {
    if (currentScreen) {
      setScreenHistory(prevHistory => [...prevHistory, currentScreen]);
    }
    setCurrentScreen(screenName);
  }, [currentScreen]);

  const navigateToTab = useCallback((tabName) => {
    setActiveTab(tabName);
    setCurrentScreen('');
    setScreenHistory([]);
  }, []);
  
  const goBack = useCallback(() => {
    if (screenHistory.length > 0) {
      const previousScreen = screenHistory[screenHistory.length - 1];
      setScreenHistory(prevHistory => prevHistory.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('');
    }
  }, [screenHistory]);

  const navigateToTransactionHistory = useCallback(() => {
    setCurrentScreen('transaction-history');
  }, []);

  const value = useMemo(() => ({
    // Навигация
    activeTab, setActiveTab,
    currentScreen, setCurrentScreen,
    screenHistory,
    navigateToTransactionHistory,
    navigateToScreen,
    navigateToTab,
    goBack,
    closeAllModals,
    
    // Хук настроек
    isDarkMode, setIsDarkMode: (value) => setData(prev => ({ ...prev, settings: { ...prev.settings, isDarkMode: value } })),
    currencyCode, setCurrencyCode: (value) => setData(prev => ({ ...prev, settings: { ...prev.settings, currencyCode: value } })),
    userProfile, setUserProfile: (value) => setData(prev => ({ ...prev, settings: { ...prev.settings, userProfile: value } })),
    accounts, setAccounts: (value) => setData(prev => ({ ...prev, settings: { ...prev.settings, accounts: value } })),
    categories, setCategories: (value) => setData(prev => ({ ...prev, settings: { ...prev.settings, categories: value } })),
    showEditProfileModal, setShowEditProfileModal,
    showAddAccountModal, setShowAddAccountModal,
    editingAccount, setEditingAccount,
    showAddCategoryModal, setShowAddCategoryModal,
    editingCategory, setEditingCategory,
    getAccountByName,
    currencySymbol,
    daysActive,
    
    // Хук транзакций
    transactions, setTransactions: (value) => setData(prev => ({ ...prev, transactions: { ...prev.transactions, transactions: value } })),
    loanTransactions, setLoanTransactions: (value) => setData(prev => ({ ...prev, transactions: { ...prev.transactions, loanTransactions: value } })),
    depositTransactions, setDepositTransactions: (value) => setData(prev => ({ ...prev, transactions: { ...prev.transactions, depositTransactions: value } })),
    showAddTransaction, setShowAddTransaction,
    editingTransaction, setEditingTransaction,
    newTransaction, setNewTransaction,
    prefilledTransaction, setPrefilledTransaction,
    transactionFilterType, setTransactionFilterType,
    selectedPeriod, setSelectedPeriod,
    dateRange, setDateRange,
    getFilteredTransactions,
    filteredTransactions,
    totalIncome,
    totalExpenses,
    totalBudget,
    getMonthlyTransactionsCount,
    
    // Хук финансовых продуктов
    loans, setLoans: (value) => setData(prev => ({ ...prev, financialProducts: { ...prev.financialProducts, loans: value } })),
    deposits, setDeposits: (value) => setData(prev => ({ ...prev, financialProducts: { ...prev.financialProducts, deposits: value } })),
    showAddFinancialItemModal, setShowAddFinancialItemModal,
    editingFinancialItem, setEditingFinancialItem,
    selectedFinancialItem, setSelectedFinancialItem,
    loansWithBalance,
    depositsWithBalance,
    showLoanDepositTransactionModal, setShowLoanDepositTransactionModal,
    selectedLoanDepositForTransaction, setSelectedLoanDepositForTransaction,

    // Хук долгов
    debts, setDebts: (value) => setData(prev => ({ ...prev, debts: value })),
    showAddDebtModal, setShowAddDebtModal,
    editingDebt, setEditingDebt,
    selectedDebtToRepay, setSelectedDebtToRepay,
    showDebtTransactionsModal, setShowDebtTransactionsModal,
    selectedDebtForTransactions, setSelectedDebtForTransactions,

    // Хук бюджетов
    budgets, setBudgets: (value) => setData(prev => ({ ...prev, budgets: value })),
    showAddBudgetModal, setShowAddBudgetModal,
    editingBudget, setEditingBudget,
    showBudgetTransactionsModal, setShowBudgetTransactionsModal,
    selectedBudgetForTransactions, setSelectedBudgetForTransactions,
    totalPlannedBudget,
    totalSpentOnBudgets,

    // Хук целей
    financialGoals, setFinancialGoals: (value) => setData(prev => ({ ...prev, goals: value })),
    showAddGoalModal, setShowAddGoalModal,
    editingGoal, setEditingGoal,
    showGoalTransactionsModal, setShowGoalTransactionsModal,
    selectedGoal, setSelectedGoal,
    showConfirmDeleteGoal, setShowConfirmDeleteGoal,
    goalToDelete, setGoalToDelete,
    totalSavingsBalance,
    
    addOrUpdateBudget: (newBudget) => {
      setData(prev => {
        const budgets = prev.budgets;
        if (newBudget.id) {
          return { ...prev, budgets: budgets.map(b => b.id === newBudget.id ? newBudget : b) };
        } else {
          return { ...prev, budgets: [...budgets, { ...newBudget, id: Date.now() }] };
        }
      });
    }

  }), [
    // Навигация
    activeTab, currentScreen, screenHistory,
    navigateToTransactionHistory, navigateToScreen, navigateToTab, goBack, closeAllModals,
    // Хук настроек
    isDarkMode, currencyCode, userProfile, accounts, categories, showEditProfileModal,
    showAddAccountModal, editingAccount, showAddCategoryModal, editingCategory,
    getAccountByName, currencySymbol, daysActive,
    // Хук транзакций
    transactions, loanTransactions, depositTransactions, showAddTransaction, editingTransaction,
    newTransaction, prefilledTransaction, transactionFilterType, selectedPeriod, dateRange, getFilteredTransactions,
    filteredTransactions, totalIncome, totalExpenses, totalBudget, getMonthlyTransactionsCount,
    // Хук фин. продуктов
    loans, deposits, showAddFinancialItemModal, editingFinancialItem, selectedFinancialItem,
    loansWithBalance, depositsWithBalance, showLoanDepositTransactionModal,
    selectedLoanDepositForTransaction,
    // Хук долгов
    debts, showAddDebtModal, editingDebt, selectedDebtToRepay, showDebtTransactionsModal,
    selectedDebtForTransactions,
    // Хук бюджетов
    budgets, showAddBudgetModal, editingBudget, showBudgetTransactionsModal,
    selectedBudgetForTransactions, totalPlannedBudget, totalSpentOnBudgets,
    // Хук целей
    financialGoals, showAddGoalModal, editingGoal, showGoalTransactionsModal,
    selectedGoal, showConfirmDeleteGoal, goalToDelete, totalSavingsBalance,
    setData
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContextProvider = ({ children }) => {
    const { data, setData, isDataLoaded } = useData();

    if (!isDataLoaded) {
      return (
        <div className={`max-w-md mx-auto min-h-screen relative flex items-center justify-center`}>
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Загрузка...
          </div>
        </div>
      );
    }
  
    return (
      <SettingsProvider settings={data.settings} setSettings={(setter) => setData(prev => ({...prev, settings: setter(prev.settings)}))}>
        <TransactionsProvider transactionsState={data.transactions} setTransactionsState={(setter) => setData(prev => ({...prev, transactions: setter(prev.transactions)}))}>
          <FinancialProductsProvider financialProducts={data.financialProducts} setFinancialProducts={(setter) => setData(prev => ({...prev, financialProducts: setter(prev.financialProducts)}))}>
            <DebtsProvider debts={data.debts} setDebts={(setter) => setData(prev => ({...prev, debts: setter(prev.debts)}))}>
              <BudgetsProvider budgets={data.budgets} setBudgets={(setter) => setData(prev => ({...prev, budgets: setter(prev.budgets)}))}>
                <GoalsProvider financialGoals={data.goals} setFinancialGoals={(setter) => setData(prev => ({...prev, goals: setter(prev.goals)}))}>
                  <AppContextInternal data={data} setData={setData}>{children}</AppContextInternal>
                </GoalsProvider>
              </BudgetsProvider>
            </DebtsProvider>
          </FinancialProductsProvider>
        </TransactionsProvider>
      </SettingsProvider>
    );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};