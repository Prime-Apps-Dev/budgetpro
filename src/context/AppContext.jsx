// src/context/AppContext.jsx
import React, { createContext, useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { useSettings, SettingsProvider } from './useSettings';
import { useTransactions, TransactionsProvider } from './useTransactions';
import { useFinancialProducts, FinancialProductsProvider } from './useFinancialProducts';
import { useDebts, DebtsProvider } from './useDebts';
import { useBudgets, BudgetsProvider } from './useBudgets';
import { useGoals, GoalsProvider } from './useGoals';
import { useData } from './useData';
import { useAuth } from './AuthContext';

export const AppContext = createContext(null);

const AppContextInternal = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState('');
  const [screenHistory, setScreenHistory] = useState([]);

  const { session, user, loading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const {
    data,
    setData,
    isDataLoaded,
    showSyncConflictModal,
    setShowSyncConflictModal,
    syncConflictData,
    handleResolveConflict
  } = useData({ user, session });
  
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
  
  const {
    debts, setDebts,
    showAddDebtModal, setShowAddDebtModal,
    editingDebt, setEditingDebt,
    selectedDebtToRepay, setSelectedDebtToRepay,
    showDebtTransactionsModal, setShowDebtTransactionsModal,
    selectedDebtForTransactions, setSelectedDebtForTransactions,
  } = useDebts();
  
  const {
    budgets, setBudgets,
    showAddBudgetModal, setShowAddBudgetModal,
    editingBudget, setEditingBudget,
    showBudgetTransactionsModal, setShowBudgetTransactionsModal,
    selectedBudgetForTransactions, setSelectedBudgetForTransactions,
    totalPlannedBudget,
    addOrUpdateBudget
  } = useBudgets();
  
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
    if (!financialGoals) return 0;
    return financialGoals
      .filter(goal => goal.isSavings)
      .reduce((sum, goal) => sum + goal.current, 0);
  }, [financialGoals]);
  
  const totalSpentOnBudgets = useMemo(() => {
    if (!budgets || !transactions) return 0;
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
    setShowAuthModal(false);
    setShowSyncConflictModal(false);
  }, [
    setShowAddTransaction, setEditingTransaction, setSelectedFinancialItem,
    setShowAddFinancialItemModal, setEditingFinancialItem, setSelectedDebtToRepay,
    setShowAddDebtModal, setEditingDebt, setShowAddBudgetModal, setEditingBudget,
    setShowAddGoalModal, setEditingGoal, setShowAddCategoryModal, setEditingCategory,
    setShowEditProfileModal, setShowAddAccountModal, setEditingAccount,
    setShowGoalTransactionsModal, setSelectedGoal, setShowDebtTransactionsModal,
    setSelectedDebtForTransactions, setShowLoanDepositTransactionModal, setSelectedLoanDepositForTransaction,
    setShowBudgetTransactionsModal, setSelectedBudgetForTransactions, setPrefilledTransaction,
    setShowAuthModal, setShowSyncConflictModal,
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
    // Navigation
    activeTab, setActiveTab,
    currentScreen, setCurrentScreen,
    screenHistory,
    navigateToTransactionHistory,
    navigateToScreen,
    navigateToTab,
    goBack,
    closeAllModals,
    
    // Settings Hook
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
    
    // Transactions Hook
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
    
    // Financial Products Hook
    loans, setLoans,
    deposits, setDeposits,
    showAddFinancialItemModal, setShowAddFinancialItemModal,
    editingFinancialItem, setEditingFinancialItem,
    selectedFinancialItem, setSelectedFinancialItem,
    loansWithBalance,
    depositsWithBalance,
    showLoanDepositTransactionModal, setShowLoanDepositTransactionModal,
    selectedLoanDepositForTransaction, setSelectedLoanDepositForTransaction,

    // Debts Hook
    debts, setDebts,
    showAddDebtModal, setShowAddDebtModal,
    editingDebt, setEditingDebt,
    selectedDebtToRepay, setSelectedDebtToRepay,
    showDebtTransactionsModal, setShowDebtTransactionsModal,
    selectedDebtForTransactions, setSelectedDebtForTransactions,

    // Budgets Hook
    budgets, setBudgets,
    showAddBudgetModal, setShowAddBudgetModal,
    editingBudget, setEditingBudget,
    showBudgetTransactionsModal, setShowBudgetTransactionsModal,
    selectedBudgetForTransactions, setSelectedBudgetForTransactions,
    totalPlannedBudget,
    totalSpentOnBudgets,

    // Goals Hook
    financialGoals, setFinancialGoals,
    showAddGoalModal, setShowAddGoalModal,
    editingGoal, setEditingGoal,
    showGoalTransactionsModal, setShowGoalTransactionsModal,
    selectedGoal, setSelectedGoal,
    showConfirmDeleteGoal, setShowConfirmDeleteGoal,
    goalToDelete, setGoalToDelete,
    totalSavingsBalance,
    
    addOrUpdateBudget,

    // Auth state
    session,
    user,
    authLoading,
    showAuthModal, setShowAuthModal,
    
    // Sync state (NEW)
    showSyncConflictModal,
    setShowSyncConflictModal,
    syncConflictData,
    handleResolveConflict,
    
  }), [
    // Navigation
    activeTab, currentScreen, screenHistory,
    navigateToTransactionHistory, navigateToScreen, navigateToTab, goBack, closeAllModals,
    // Settings Hook
    isDarkMode, currencyCode, userProfile, accounts, categories, showEditProfileModal,
    showAddAccountModal, editingAccount, showAddCategoryModal, editingCategory,
    getAccountByName, currencySymbol, daysActive,
    // Transactions Hook
    transactions, loanTransactions, depositTransactions, showAddTransaction, editingTransaction,
    newTransaction, prefilledTransaction, transactionFilterType, selectedPeriod, dateRange, getFilteredTransactions,
    filteredTransactions, totalIncome, totalExpenses, totalBudget, getMonthlyTransactionsCount,
    // Financial Products Hook
    loans, deposits, showAddFinancialItemModal, editingFinancialItem, selectedFinancialItem,
    loansWithBalance, depositsWithBalance, showLoanDepositTransactionModal,
    selectedLoanDepositForTransaction,
    // Debts Hook
    debts, showAddDebtModal, editingDebt, selectedDebtToRepay, showDebtTransactionsModal,
    selectedDebtForTransactions,
    // Budgets Hook
    budgets, showAddBudgetModal, editingBudget, showBudgetTransactionsModal,
    selectedBudgetForTransactions, totalPlannedBudget, totalSpentOnBudgets,
    // Goals Hook
    financialGoals, showAddGoalModal, editingGoal, showGoalTransactionsModal,
    selectedGoal, showConfirmDeleteGoal, goalToDelete, totalSavingsBalance,
    // Data & Auth
    data, isDataLoaded, session, user, authLoading, showAuthModal,
    showSyncConflictModal, syncConflictData, handleResolveConflict,
    // Setters
    setIsDarkMode, setCurrencyCode, setUserProfile, setAccounts, setCategories,
    setShowEditProfileModal, setShowAddAccountModal, setEditingAccount,
    setShowAddCategoryModal, setEditingCategory, setTransactions, setLoanTransactions,
    setDepositTransactions, setShowAddTransaction, setEditingTransaction, setNewTransaction,
    setPrefilledTransaction, setTransactionFilterType, setSelectedPeriod, setDateRange,
    setLoans, setDeposits, setShowAddFinancialItemModal, setEditingFinancialItem, setSelectedFinancialItem,
    setDebts, setShowAddDebtModal, setEditingDebt, setSelectedDebtToRepay,
    setShowDebtTransactionsModal, setSelectedDebtForTransactions, setBudgets,
    setShowAddBudgetModal, setEditingBudget, setShowBudgetTransactionsModal,
    setSelectedBudgetForTransactions, setFinancialGoals, setShowAddGoalModal,
    setEditingGoal, setShowGoalTransactionsModal, setSelectedGoal,
    setShowConfirmDeleteGoal, setGoalToDelete, setShowAuthModal,
    setShowSyncConflictModal, addOrUpdateBudget,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};


export const AppContextProvider = ({ children }) => {
    const { session, user, loading: authLoading } = useAuth();
    const { data, setData, isDataLoaded } = useData({ user, session });
    
    if (!isDataLoaded || authLoading) {
        return (
          <div className={`max-w-md mx-auto min-h-screen relative flex items-center justify-center`}>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Загрузка...
            </div>
          </div>
        );
    }
    
    return (
      <SettingsProvider settings={data?.settings} setSettings={(setter) => setData(prev => ({...prev, settings: setter(prev.settings)}))}>
        <TransactionsProvider transactionsState={data?.transactions} setTransactionsState={(setter) => setData(prev => ({...prev, transactions: setter(prev.transactions)}))}>
          <FinancialProductsProvider financialProducts={data?.financialProducts} setFinancialProducts={(setter) => setData(prev => ({...prev, financialProducts: setter(prev.financialProducts)}))}>
            <DebtsProvider debts={data?.debts} setDebts={(setter) => setData(prev => ({...prev, debts: setter(prev.debts)}))}>
              <BudgetsProvider budgets={data?.budgets} setBudgets={(setter) => setData(prev => ({...prev, budgets: setter(prev.budgets)}))}>
                <GoalsProvider financialGoals={data?.goals} setFinancialGoals={(setter) => setData(prev => ({...prev, goals: setter(prev.goals)}))}>
                  <AppContextInternal>
                    {children}
                  </AppContextInternal>
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