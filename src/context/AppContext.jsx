// src/context/AppContext.jsx
import React, { createContext, useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { CURRENCIES, getCurrencySymbolByCode } from '../constants/currencies';
import { TransactionsProvider, useTransactions } from './useTransactions';
import { FinancialProductsProvider, useFinancialProducts } from './useFinancialProducts';
import { DebtsProvider, useDebts } from './useDebts';
import { BudgetsProvider, useBudgets } from './useBudgets';
import { GoalsProvider, useGoals } from './useGoals';
import { SettingsProvider, useSettings } from './useSettings';

export const AppContext = createContext(null);

const AppContextInternal = ({ children }) => {
  const { 
    isDarkMode, setIsDarkMode,
    currencyCode, setCurrencyCode,
    userProfile, setUserProfile,
    accounts, setAccounts,
    categories, setCategories,
    defaultState
  } = useSettings();
  
  const {
    transactions, setTransactions,
    loanTransactions, setLoanTransactions,
    depositTransactions, setDepositTransactions,
  } = useTransactions();
  
  const {
    loans, setLoans,
    deposits, setDeposits,
  } = useFinancialProducts();
  
  const {
    debts, setDebts,
  } = useDebts();
  
  const {
    budgets, setBudgets,
  } = useBudgets();
  
  const {
    financialGoals, setFinancialGoals,
  } = useGoals();
  
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState('');
  const [screenHistory, setScreenHistory] = useState([]);

  useEffect(() => {
    try {
      const savedState = JSON.parse(localStorage.getItem('financialAppState'));
      if (savedState) {
        setTransactions(savedState.transactions || defaultState.transactions);
        setLoans(savedState.loans || defaultState.loans);
        setDeposits(savedState.deposits || defaultState.deposits);
        setLoanTransactions(savedState.loanTransactions || defaultState.loanTransactions);
        setDepositTransactions(savedState.depositTransactions || defaultState.depositTransactions);
        setDebts(savedState.debts || defaultState.debts);
        setBudgets(savedState.budgets || defaultState.budgets);
        setCategories(savedState.categories || defaultState.categories);
        setAccounts(savedState.accounts || defaultState.accounts);
        setFinancialGoals(savedState.financialGoals || defaultState.financialGoals);
        setUserProfile(savedState.userProfile || defaultState.userProfile);
        setIsDarkMode(savedState.isDarkMode || false);
        setCurrencyCode(savedState.currencyCode || 'RUB');
      } else {
        setTransactions(defaultState.transactions);
        setLoans(defaultState.loans);
        setDeposits(defaultState.deposits);
        setLoanTransactions(defaultState.loanTransactions);
        setDepositTransactions(defaultState.depositTransactions);
        setDebts(defaultState.debts);
        setBudgets(defaultState.budgets);
        setCategories(defaultState.categories);
        setAccounts(defaultState.accounts);
        setFinancialGoals(defaultState.financialGoals);
        setUserProfile(defaultState.userProfile);
        setCurrencyCode(defaultState.currencyCode);
      }
    } catch (error) {
      console.error("Failed to load state from localStorage:", error);
      setTransactions(defaultState.transactions);
      setLoans(defaultState.loans);
      setDeposits(defaultState.deposits);
      setLoanTransactions(defaultState.loanTransactions);
      setDepositTransactions(defaultState.depositTransactions);
      setDebts(defaultState.debts);
      setBudgets(defaultState.budgets);
      setCategories(defaultState.categories);
      setAccounts(defaultState.accounts);
      setFinancialGoals(defaultState.financialGoals);
      setUserProfile(defaultState.userProfile);
      setCurrencyCode(defaultState.currencyCode);
    } finally {
      setIsDataLoaded(true);
    }
  }, [
    defaultState,
    setTransactions, setLoans, setDeposits, setLoanTransactions, setDepositTransactions,
    setDebts, setBudgets, setCategories, setAccounts, setFinancialGoals,
    setUserProfile, setIsDarkMode, setCurrencyCode
  ]);

  useEffect(() => {
    if (!isDataLoaded) return;
    const stateToSave = {
      transactions,
      loans,
      deposits,
      loanTransactions,
      depositTransactions,
      debts,
      budgets,
      categories,
      accounts,
      financialGoals,
      userProfile,
      isDarkMode,
      currencyCode
    };
    try {
      localStorage.setItem('financialAppState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Failed to save state to localStorage:", error);
    }
  }, [
    transactions, loans, deposits, loanTransactions, depositTransactions,
    debts, budgets, categories, accounts, financialGoals, userProfile,
    isDarkMode, isDataLoaded, currencyCode
  ]);

  const closeAllModals = useCallback(() => {
    // This function will need to be updated to use the new hooks' state setters
    // For now, it is a placeholder. We will fix this in a later step.
  }, []);

  const navigateToTransactionHistory = useCallback((type) => {
    setCurrentScreen('transaction-history');
  }, []);

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

  const value = useMemo(() => ({
    isDataLoaded,
    activeTab, setActiveTab,
    currentScreen, setCurrentScreen,
    screenHistory,
    navigateToTransactionHistory,
    navigateToScreen,
    navigateToTab,
    goBack,
    closeAllModals,
    defaultState,
  }), [
    isDataLoaded,
    activeTab, setActiveTab,
    currentScreen, setCurrentScreen,
    screenHistory,
    navigateToTransactionHistory,
    navigateToScreen,
    navigateToTab,
    goBack,
    closeAllModals,
    defaultState,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContextProvider = ({ children }) => {
    return (
      <SettingsProvider>
        <TransactionsProvider>
          <FinancialProductsProvider>
            <DebtsProvider>
              <BudgetsProvider>
                <GoalsProvider>
                  <AppContextInternal>{children}</AppContextInternal>
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
  return {
    ...context,
    ...useTransactions(),
    ...useFinancialProducts(),
    ...useDebts(),
    ...useBudgets(),
    ...useGoals(),
    ...useSettings(),
  };
};