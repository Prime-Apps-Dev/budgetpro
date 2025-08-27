// src/context/AppContext.jsx
import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { ICONS } from '../components/icons';
import { CURRENCIES, getCurrencySymbolByCode } from '../constants/currencies';

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const defaultState = useMemo(() => ({
    transactions: [
      { id: 1, type: 'income', amount: 50000, category: 'Зарплата', date: '2025-08-15', account: 'Основной', description: 'Ежемесячная зарплата' },
      { id: 2, type: 'expense', amount: 15000, category: 'Продукты', date: '2025-08-15', account: 'Основной', description: 'Покупка продуктов на неделю' },
      { id: 3, type: 'expense', amount: 5000, category: 'Транспорт', date: '2025-08-14', account: 'Основной', description: 'Поездки на такси' },
      { id: 4, type: 'income', amount: 20000, category: 'Фриланс', date: '2025-08-13', account: 'Основной', description: 'Оплата за проект' },
    ],
    debts: [
      { id: 1, type: 'i-owe', amount: 5000, person: 'Алексей', description: 'За ужин', date: '2025-08-12' },
      { id: 2, type: 'owed-to-me', amount: 2500, person: 'Мария', description: 'За бензин', date: '2025-08-10' },
    ],
    budgets: [
      { id: 1, category: 'Продукты', limit: 20000 },
      { id: 2, category: 'Транспорт', limit: 10000 },
    ],
    categories: {
      income: [{ name: 'Зарплата', icon: 'DollarSign' }, { name: 'Фриланс', icon: 'Briefcase' }, { name: 'Инвестиции', icon: 'TrendingUp' }, { name: 'Подарки', icon: 'Gift' }, { name: 'С копилки', icon: 'PiggyBank' }, { name: 'Возврат долга', icon: 'Handshake' }, { name: 'Пополнение депозита', icon: 'Banknote' }, {name: 'Снятие с депозита', icon: 'Banknote'}],
      expense: [{ name: 'Продукты', icon: 'ShoppingBag' }, { name: 'Транспорт', icon: 'Car' }, { name: 'Развлечения', icon: 'Film' }, { name: 'Коммунальные услуги', icon: 'Building' }, { name: 'Одежда', icon: 'Shirt' }, { name: 'Здоровье', icon: 'Heart' }, { name: 'В копилку', icon: 'PiggyBank' }, { name: 'Отдача долга', icon: 'Handshake' }, { name: 'Погашение кредита', icon: 'MinusCircle' }, {name: 'Пополнение депозита', icon: 'Banknote'}]
    },
    accounts: [
      { id: 1, name: 'Основной', type: 'bank', iconName: 'CreditCard', color: '#3b82f6' },
      { id: 2, name: 'Карта Сбер', type: 'bank', iconName: 'CreditCard', color: '#22c55e' },
      { id: 3, name: 'Наличные', type: 'cash', iconName: 'DollarSign', color: '#f59e0b' }
    ],
    financialGoals: [
      { id: 1, title: 'Отпуск', target: 100000, current: 25000, deadline: '2025-12-31', isSavings: true },
      { id: 2, title: 'Новый телефон', target: 50000, current: 15000, deadline: '2025-10-15', isSavings: false }
    ],
    loans: [
      { id: 1, type: 'loan', name: 'Автокредит', amount: 500000, interestRate: 10, term: 60, monthlyPayment: 10623.53, totalPayment: 637411.8, totalInterest: 137411.8, currentBalance: 500000, paymentHistory: [], paymentSchedule: [], iconName: 'Car', loanPaymentType: 'annuity' }
    ],
    deposits: [
      { id: 1, type: 'deposit', name: 'Депозит на отпуск', amount: 100000, interestRate: 12, term: 12, totalAmount: 112682.5, totalInterest: 12682.5, currentAmount: 100000, contributionHistory: [], bank: 'Карта Сбер', depositType: 'compound', capitalization: 'monthly', iconName: 'Banknote'}
    ],
    loanTransactions: [
      { id: 100, financialItemId: 1, type: 'expense', amount: 10623.53, category: 'Погашение кредита', account: 'Основной', date: '2025-08-20', description: 'Плановый платеж по кредиту "Автокредит"' }
    ],
    depositTransactions: [
      { id: 200, financialItemId: 1, type: 'income', amount: 5000, category: 'Пополнение депозита', account: 'Основной', date: '2025-08-25', description: 'Пополнение депозита "Депозит на отпуск"' }
    ],
    currencyCode: 'RUB'
  }), []);

  const [activeTab, setActiveTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState('');
  const [selectedFinancialItem, setSelectedFinancialItem] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loanTransactions, setLoanTransactions] = useState([]);
  const [depositTransactions, setDepositTransactions] = useState([]);
  const [debts, setDebts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState({
    income: [],
    expense: []
  });
  const [accounts, setAccounts] = useState([]);
  const [financialGoals, setFinancialGoals] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
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
  const [userProfile, setUserProfile] = useState({});
  const [currencyCode, setCurrencyCode] = useState('RUB');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const [showAddFinancialItemModal, setShowAddFinancialItemModal] = useState(false);
  const [editingFinancialItem, setEditingFinancialItem] = useState(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const currencySymbol = useMemo(() => getCurrencySymbolByCode(currencyCode), [currencyCode]);

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
  }, [defaultState]);

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
  }, [transactions, loans, deposits, loanTransactions, depositTransactions, debts, budgets, categories, accounts, financialGoals, userProfile, isDarkMode, isDataLoaded, currencyCode]);

  const getAccountByName = (name) => {
    const account = accounts.find(acc => acc.name === name) || accounts[0];
    const iconComponent = ICONS[account?.iconName] || ICONS.CreditCard;
    return { ...account, icon: iconComponent };
  };

  const getLoanBalance = (loanId) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return 0;
    const repayments = loanTransactions
      .filter(t => t.financialItemId === loanId)
      .reduce((sum, t) => sum + t.amount, 0);
    return loan.amount - repayments;
  };

  const getDepositBalance = (depositId) => {
    const deposit = deposits.find(d => d.id === depositId);
    if (!deposit) return 0;
    const contributions = depositTransactions
      .filter(t => t.financialItemId === depositId && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const withdrawals = depositTransactions
      .filter(t => t.financialItemId === depositId && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return deposit.amount + contributions - withdrawals;
  };

  const loansWithBalance = useMemo(() => {
    return loans.map(loan => ({
      ...loan,
      currentBalance: getLoanBalance(loan.id)
    }));
  }, [loans, loanTransactions]);

  const depositsWithBalance = useMemo(() => {
    return deposits.map(deposit => ({
      ...deposit,
      currentAmount: getDepositBalance(deposit.id)
    }));
  }, [deposits, depositTransactions]);

  const getFilteredTransactions = () => {
    let filtered = [...transactions];
    const now = new Date();

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= new Date(dateRange.start) && transactionDate <= new Date(dateRange.end);
      });
    } else {
      switch (selectedPeriod) {
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
      }
    }

    return filtered;
  };

  const totalIncome = getFilteredTransactions()
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = getFilteredTransactions()
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBudget = totalIncome - totalExpenses;

  const totalSavingsBalance = financialGoals
    .filter(goal => goal.isSavings)
    .reduce((sum, goal) => sum + goal.current, 0);

  const totalPlannedBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);

  const totalSpentOnBudgets = budgets.reduce((totalSpent, budget) => {
    const spentForCategory = transactions
      .filter(t => t.category === budget.category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return totalSpent + spentForCategory;
  }, 0);

  const state = {
    activeTab, setActiveTab,
    currentScreen, setCurrentScreen,
    selectedFinancialItem, setSelectedFinancialItem,
    isDarkMode, setIsDarkMode,
    transactions, setTransactions,
    loans, setLoans,
    deposits, setDeposits,
    loanTransactions, setLoanTransactions,
    depositTransactions, setDepositTransactions,
    debts, setDebts,
    budgets, setBudgets,
    categories, setCategories,
    accounts, setAccounts,
    financialGoals, setFinancialGoals,
    selectedPeriod, setSelectedPeriod,
    dateRange, setDateRange,
    showAddTransaction, setShowAddTransaction,
    editingTransaction, setEditingTransaction,
    newTransaction, setNewTransaction,
    userProfile, setUserProfile,
    currencyCode, setCurrencyCode,
    isDataLoaded,
    currencySymbol,
    getAccountByName,
    loansWithBalance,
    depositsWithBalance,
    getFilteredTransactions,
    totalIncome,
    totalExpenses,
    totalBudget,
    totalSavingsBalance,
    totalPlannedBudget,
    totalSpentOnBudgets,
    showAddFinancialItemModal, setShowAddFinancialItemModal,
    editingFinancialItem, setEditingFinancialItem,
    showEditProfileModal, setShowEditProfileModal
  };

  return (
    <AppContext.Provider value={state}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};