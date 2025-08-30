// src/context/AppContext.jsx
import React, { createContext, useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { ICONS } from '../components/icons';
import { CURRENCIES, getCurrencySymbolByCode } from '../constants/currencies';

export const AppContext = createContext(null);

/**
 * Провайдер контекста приложения, содержащий все глобальные состояния и функции.
 * Использует `useState` для управления состояниями, `useEffect` для сохранения
 * данных в `localStorage` и `useMemo`/`useCallback` для оптимизации производительности.
 * @param {object} props - Свойства компонента.
 * @param {React.ReactNode} props.children - Дочерние элементы, которые будут иметь доступ к контексту.
 * @returns {JSX.Element}
 */
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
    currencyCode: 'RUB',
    userProfile: {
      name: 'Пользователь',
      email: 'user@example.com',
      avatar: '👤',
      avatarColor: '#3b82f6',
      creationDate: new Date().toISOString().split('T')[0],
    }
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
  
  // Добавляем новые переменные состояния для модальных окон
  const [showAddDebtModal, setShowAddDebtModal] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  // Новые переменные для управления модальным окном категорий
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  // Новая переменная для фильтрации на экране истории транзакций
  const [transactionFilterType, setTransactionFilterType] = useState('all');
  
  // Стек для истории экранов
  const [screenHistory, setScreenHistory] = useState([]);

  // Мемоизируем символ валюты, чтобы он пересчитывался только при изменении кода валюты.
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

  /**
   * Возвращает объект счета по его имени, включая компонент иконки.
   * Мемоизировано с помощью `useCallback` для стабильности.
   * @param {string} name - Имя счета.
   * @returns {object} - Объект счета с компонентом иконки.
   */
  const getAccountByName = useCallback((name) => {
    const account = accounts.find(acc => acc.name === name) || accounts[0];
    const iconComponent = ICONS[account?.iconName] || ICONS.CreditCard;
    return { ...account, icon: iconComponent };
  }, [accounts]);

  /**
   * Рассчитывает текущий остаток по кредиту.
   * Мемоизировано с помощью `useCallback`.
   * @param {number} loanId - ID кредита.
   * @returns {number} - Текущий баланс.
   */
  const getLoanBalance = useCallback((loanId) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return 0;
    const repayments = loanTransactions
      .filter(t => t.financialItemId === loanId)
      .reduce((sum, t) => sum + t.amount, 0);
    return loan.amount - repayments;
  }, [loans, loanTransactions]);

  /**
   * Рассчитывает текущий баланс по депозиту.
   * Мемоизировано с помощью `useCallback`.
   * @param {number} depositId - ID депозита.
   * @returns {number} - Текущий баланс.
   */
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

  // Мемоизируем список кредитов с актуальным балансом.
  const loansWithBalance = useMemo(() => {
    return loans.map(loan => ({
      ...loan,
      currentBalance: getLoanBalance(loan.id)
    }));
  }, [loans, getLoanBalance]);

  // Мемоизируем список депозитов с актуальным балансом.
  const depositsWithBalance = useMemo(() => {
    return deposits.map(deposit => ({
      ...deposit,
      currentAmount: getDepositBalance(deposit.id)
    }));
  }, [deposits, getDepositBalance]);

  /**
   * Фильтрует транзакции на основе выбранного периода или диапазона дат.
   * Мемоизировано с помощью `useCallback`.
   * @returns {Array} - Отфильтрованный массив транзакций.
   */
  const getFilteredTransactions = useCallback((period = 'month') => {
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
  }, [transactions, dateRange]);

  // Мемоизируем результаты фильтрации транзакций.
  const filteredTransactions = useMemo(() => getFilteredTransactions(selectedPeriod), [getFilteredTransactions, selectedPeriod]);

  // Мемоизируем общие суммы для производительности.
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

  const totalBudget = useMemo(() => {
    return totalIncome - totalExpenses;
  }, [totalIncome, totalExpenses]);

  const totalSavingsBalance = useMemo(() => {
    return financialGoals
      .filter(goal => goal.isSavings)
      .reduce((sum, goal) => sum + goal.current, 0);
  }, [financialGoals]);

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
  
  /**
   * Сбрасывает все состояния, связанные с модальными окнами.
   * @function
   */
  const closeAllModals = useCallback(() => {
    setShowAddTransaction(false);
    setEditingTransaction(null);
    setSelectedFinancialItem(null);
    setShowAddFinancialItemModal(false);
    setShowEditProfileModal(false);
    setShowAddDebtModal(false);
    setEditingDebt(null);
    setShowAddBudgetModal(false);
    setEditingBudget(null);
    setShowAddGoalModal(false);
    setEditingGoal(null);
    setShowAddCategoryModal(false);
    setEditingCategory(null);
  }, []);

  /**
   * Переходит на экран истории транзакций с заданным фильтром.
   * @param {'all' | 'income' | 'expense'} type - Тип транзакции для фильтрации.
   */
  const navigateToTransactionHistory = useCallback((type) => {
    setTransactionFilterType(type);
    setCurrentScreen('transaction-history');
  }, []);

  /**
   * Управляет переходом между экранами, сохраняя историю.
   * @param {string} screenName - Имя экрана для перехода.
   */
  const navigateToScreen = useCallback((screenName) => {
    if (currentScreen) {
      setScreenHistory(prevHistory => [...prevHistory, currentScreen]);
    }
    setCurrentScreen(screenName);
  }, [currentScreen]);

  /**
   * Возвращается на предыдущий экран из истории.
   */
  const goBack = useCallback(() => {
    if (screenHistory.length > 0) {
      const previousScreen = screenHistory[screenHistory.length - 1];
      setScreenHistory(prevHistory => prevHistory.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      // Если истории нет, возвращаемся на главный экран вкладки
      setCurrentScreen('');
    }
  }, [screenHistory]);

  const getMonthlyTransactionsCount = useCallback(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
    }).length;
  }, [transactions]);

  const daysActive = useMemo(() => {
    if (!userProfile.creationDate) return 0;
    const now = new Date();
    const creationDate = new Date(userProfile.creationDate);
    const diffTime = Math.abs(now - creationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  }, [userProfile.creationDate]);

  // Мемоизируем весь объект состояния для передачи в провайдер.
  const state = useMemo(() => ({
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
    showEditProfileModal, setShowEditProfileModal,
    // Добавляем новые переменные в контекст
    showAddDebtModal, setShowAddDebtModal,
    editingDebt, setEditingDebt,
    showAddBudgetModal, setShowAddBudgetModal,
    editingBudget, setEditingBudget,
    showAddGoalModal, setShowAddGoalModal,
    editingGoal, setEditingGoal,
    // Добавляем новые функции
    closeAllModals,
    showAddCategoryModal, setShowAddCategoryModal,
    editingCategory, setEditingCategory,
    // Добавляем новое состояние и функции
    transactionFilterType, setTransactionFilterType,
    navigateToTransactionHistory,
    navigateToScreen,
    goBack,
    screenHistory,
    getMonthlyTransactionsCount,
    daysActive
  }), [
    activeTab, currentScreen, selectedFinancialItem, isDarkMode, transactions, loans, deposits, loanTransactions, depositTransactions, debts, budgets, categories, accounts, financialGoals, selectedPeriod, dateRange, showAddTransaction, editingTransaction, newTransaction, userProfile, currencyCode, isDataLoaded, currencySymbol, getAccountByName, loansWithBalance, depositsWithBalance, getFilteredTransactions, totalIncome, totalExpenses, totalBudget, totalSavingsBalance, totalPlannedBudget, totalSpentOnBudgets, showAddFinancialItemModal, editingFinancialItem, showEditProfileModal, showAddDebtModal, editingDebt, showAddBudgetModal, editingBudget, showAddGoalModal, editingGoal, closeAllModals, showAddCategoryModal, editingCategory, transactionFilterType, navigateToTransactionHistory, navigateToScreen, goBack, screenHistory, getMonthlyTransactionsCount, daysActive
  ]);

  return (
    <AppContext.Provider value={state}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Хук для удобного доступа к контексту приложения.
 * @returns {object} - Объект контекста.
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};