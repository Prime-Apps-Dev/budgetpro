import React, { useState, useEffect, useMemo } from 'react';
import { ICONS } from './components/icons';
import MainNavigation from './components/ui/MainNavigation';
import HomeScreen from './components/screens/HomeScreen';
import AnalyticsScreen from './components/screens/AnalyticsScreen';
import SavingsScreen from './components/screens/SavingsScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import AddEditTransactionScreen from './components/screens/AddEditTransactionScreen';
import DebtsScreen from './components/screens/DebtsScreen';
import MyLoansScreen from './components/screens/MyLoansScreen';
import MyLoansListScreen from './components/screens/MyLoansListScreen';
import MyDepositsListScreen from './components/screens/MyDepositsListScreen';
import LoanDepositDetailScreen from './components/screens/LoanDepositDetailScreen';
import AddFinancialItemScreen from './components/screens/AddFinancialItemScreen';
import MyFinancialProductsScreen from './components/screens/MyFinancialProductsScreen';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInOut } from './utils/motion';

const App = () => {
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
  const [isDataLoaded, setIsDataLoaded] = useState(false);

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
    loans: [],
    deposits: [],
    loanTransactions: [],
    depositTransactions: [],
  }), []);

  // Load state from localStorage on initial render
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
      } else {
        // Initialize with default state if nothing is found in localStorage
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
      }
    } catch (error) {
      console.error("Failed to load state from localStorage:", error);
      // Fallback to default state on error
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
    } finally {
      setIsDataLoaded(true);
    }
  }, [defaultState]);

  // Save state to localStorage whenever any of these state variables change
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
      isDarkMode
    };
    try {
      localStorage.setItem('financialAppState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Failed to save state to localStorage:", error);
    }
  }, [transactions, loans, deposits, loanTransactions, depositTransactions, debts, budgets, categories, accounts, financialGoals, userProfile, isDarkMode, isDataLoaded]);

  const getAccountByName = (name) => {
    const account = accounts.find(acc => acc.name === name) || accounts[0];
    const iconComponent = ICONS[account.iconName] || ICONS.CreditCard;
    return { ...account, icon: iconComponent };
  };

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

  const handleSetTransactions = (newTransactions) => {
    setTransactions(newTransactions);
  };
  
  const handleSetLoans = (newLoans) => {
    setLoans(newLoans);
  };
  
  const handleSetDeposits = (newDeposits) => {
    setDeposits(newDeposits);
  };

  const handleSetDebts = (newDebts) => {
    setDebts(newDebts);
  };

  const handleSetBudgets = (newBudgets) => {
    setBudgets(newBudgets);
  };

  const handleSetCategories = (newCategories) => {
    setCategories(newCategories);
  };

  const handleSetEditingTransaction = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleSetShowAddTransaction = (bool) => {
    setShowAddTransaction(bool);
  };

  const handleSetNewTransaction = (transaction) => {
    setNewTransaction(transaction);
  };

  const handleSetFinancialGoals = (newGoals) => {
    setFinancialGoals(newGoals);
  };

  const handleSetAccounts = (newAccounts) => {
    setAccounts(newAccounts);
  };

  const handleSetUserProfile = (profile) => {
    setUserProfile(profile);
  };

  const handleSetSelectedPeriod = (period) => {
    setSelectedPeriod(period);
  };

  const handleSetDateRange = (range) => {
    setDateRange(range);
  };

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
  };

  const handleSetCurrentScreen = (screen) => {
    setCurrentScreen(screen);
  };
  
  const handleSetIsDarkMode = (bool) => {
    setIsDarkMode(bool);
  };

  const handleSetSelectedFinancialItem = (item) => {
    setSelectedFinancialItem(item);
  };

  const handleSetLoanTransactions = (newLoanTransactions) => {
    setLoanTransactions(newLoanTransactions);
  };

  const handleSetDepositTransactions = (newDepositTransactions) => {
    setDepositTransactions(newDepositTransactions);
  };


  const renderScreen = () => {
    if (showAddTransaction || editingTransaction) {
      return (
        <AddEditTransactionScreen
          key="add-edit-transaction"
          transactions={transactions}
          setTransactions={handleSetTransactions}
          editingTransaction={editingTransaction}
          setEditingTransaction={handleSetEditingTransaction}
          setShowAddTransaction={handleSetShowAddTransaction}
          newTransaction={newTransaction}
          setNewTransaction={handleSetNewTransaction}
          categories={categories}
          accounts={accounts}
          setActiveTab={handleSetActiveTab}
          loans={loansWithBalance}
          setLoans={handleSetLoans}
          deposits={depositsWithBalance}
          setDeposits={handleSetDeposits}
          selectedFinancialItem={selectedFinancialItem}
          setSelectedFinancialItem={handleSetSelectedFinancialItem}
          loanTransactions={loanTransactions}
          setLoanTransactions={handleSetLoanTransactions}
          depositTransactions={depositTransactions}
          setDepositTransactions={handleSetDepositTransactions}
        />
      );
    }
    
    if (currentScreen === 'add-financial-item' || currentScreen === 'edit-financial-item') {
      return (
        <AddFinancialItemScreen
          key="add-financial-item"
          loans={loansWithBalance}
          setLoans={handleSetLoans}
          deposits={depositsWithBalance}
          setDeposits={handleSetDeposits}
          setCurrentScreen={handleSetCurrentScreen}
          editingItem={selectedFinancialItem}
          accounts={accounts}
        />
      );
    }
    if (currentScreen === 'loan-detail' || currentScreen === 'deposit-detail') {
      return (
        <LoanDepositDetailScreen
          key="loan-deposit-detail"
          item={selectedFinancialItem}
          setCurrentScreen={handleSetCurrentScreen}
          setLoans={handleSetLoans}
          setDeposits={handleSetDeposits}
          loans={loansWithBalance}
          deposits={depositsWithBalance}
          setSelectedFinancialItem={handleSetSelectedFinancialItem}
          setTransactions={handleSetTransactions}
          transactions={transactions}
          loanTransactions={loanTransactions}
          setLoanTransactions={handleSetLoanTransactions}
          depositTransactions={depositTransactions}
          setDepositTransactions={handleSetDepositTransactions}
          setShowAddTransaction={handleSetShowAddTransaction}
          setEditingTransaction={handleSetEditingTransaction}
          getAccountByName={getAccountByName}
          accounts={accounts}
        />
      );
    }
    if (currentScreen === 'loans-list') {
      return (
        <MyLoansListScreen
          key="loans-list"
          loans={loansWithBalance}
          setLoans={handleSetLoans}
          setTransactions={handleSetTransactions}
          loanTransactions={loanTransactions}
          setLoanTransactions={handleSetLoanTransactions}
          setCurrentScreen={handleSetCurrentScreen}
          setSelectedFinancialItem={handleSetSelectedFinancialItem}
        />
      );
    }
    if (currentScreen === 'deposits-list') {
      return (
        <MyDepositsListScreen
          key="deposits-list"
          deposits={depositsWithBalance}
          setDeposits={handleSetDeposits}
          setTransactions={handleSetTransactions}
          depositTransactions={depositTransactions}
          setDepositTransactions={handleSetDepositTransactions}
          setCurrentScreen={handleSetCurrentScreen}
          setSelectedFinancialItem={handleSetSelectedFinancialItem}
        />
      );
    }
    
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            key="home"
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            totalBudget={totalBudget}
            totalSavingsBalance={totalSavingsBalance}
            transactions={transactions}
            getAccountByName={getAccountByName}
            setEditingTransaction={handleSetEditingTransaction}
            setShowAddTransaction={handleSetShowAddTransaction}
            setTransactions={handleSetTransactions}
            deposits={depositsWithBalance}
            setDeposits={handleSetDeposits}
            loans={loansWithBalance}
            setLoans={handleSetLoans}
            depositTransactions={depositTransactions}
            setDepositTransactions={handleSetDepositTransactions}
            loanTransactions={loanTransactions}
            setLoanTransactions={handleSetLoanTransactions}
          />
        );
      case 'analytics':
        return (
          <AnalyticsScreen
            key="analytics"
            transactions={transactions}
            categories={categories}
            filteredTransactions={getFilteredTransactions()}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            totalBudget={totalBudget}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={handleSetSelectedPeriod}
            dateRange={dateRange}
            setDateRange={handleSetDateRange}
          />
        );
      case 'savings':
        return (
          <SavingsScreen
            key="savings"
            financialGoals={financialGoals}
            setFinancialGoals={handleSetFinancialGoals}
            transactions={transactions}
            setTransactions={handleSetTransactions}
            totalSavingsBalance={totalSavingsBalance}
          />
        );
      case 'profile':
        if (!isDataLoaded) {
          return null; // Don't render until data is loaded
        }
        return (
          <ProfileScreen
            key="profile"
            userProfile={userProfile}
            setUserProfile={handleSetUserProfile}
            financialGoals={financialGoals}
            setFinancialGoals={handleSetFinancialGoals}
            transactions={transactions}
            setTransactions={handleSetTransactions}
            accounts={accounts}
            setAccounts={handleSetAccounts}
            currentScreen={currentScreen}
            setCurrentScreen={handleSetCurrentScreen}
            getAccountByName={getAccountByName}
            categories={categories}
            setCategories={handleSetCategories}
            isDarkMode={isDarkMode}
            setIsDarkMode={handleSetIsDarkMode}
            budgets={budgets}
            setBudgets={handleSetBudgets}
            filteredTransactions={getFilteredTransactions()}
            debts={debts}
            setDebts={handleSetDebts}
            loans={loansWithBalance}
            setLoans={handleSetLoans}
            deposits={depositsWithBalance}
            setDeposits={handleSetDeposits}
            selectedFinancialItem={selectedFinancialItem}
            setSelectedFinancialItem={handleSetSelectedFinancialItem}
            loanTransactions={loanTransactions}
            setLoanTransactions={handleSetLoanTransactions}
            depositTransactions={depositTransactions}
            setDepositTransactions={handleSetDepositTransactions}
            setShowAddTransaction={handleSetShowAddTransaction}
            setEditingTransaction={handleSetEditingTransaction}
            totalPlannedBudget={totalPlannedBudget}
            totalSpentOnBudgets={totalSpentOnBudgets}
          />
        );
      default:
        return <HomeScreen key="home-default" />;
    }
  };

  if (!isDataLoaded) {
    return (
      <div className={`max-w-md mx-auto min-h-screen relative flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100'}`}>
        <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Загрузка...
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-md mx-auto min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100'}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + currentScreen}
          variants={fadeInOut}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      <MainNavigation
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        setShowAddTransaction={handleSetShowAddTransaction}
        setEditingTransaction={handleSetEditingTransaction}
        setCurrentScreen={handleSetCurrentScreen}
        showAddTransaction={showAddTransaction}
        editingTransaction={editingTransaction}
        currentScreen={currentScreen}
      />
      
      <AnimatePresence>
        {(showAddTransaction || editingTransaction) && (
          <AddEditTransactionScreen
            key="add-edit-transaction-modal"
            transactions={transactions}
            setTransactions={handleSetTransactions}
            editingTransaction={editingTransaction}
            setEditingTransaction={handleSetEditingTransaction}
            setShowAddTransaction={handleSetShowAddTransaction}
            newTransaction={newTransaction}
            setNewTransaction={handleSetNewTransaction}
            categories={categories}
            accounts={accounts}
            setActiveTab={handleSetActiveTab}
            loans={loansWithBalance}
            setLoans={handleSetLoans}
            deposits={depositsWithBalance}
            setDeposits={handleSetDeposits}
            selectedFinancialItem={selectedFinancialItem}
            setSelectedFinancialItem={handleSetSelectedFinancialItem}
            loanTransactions={loanTransactions}
            setLoanTransactions={handleSetLoanTransactions}
            depositTransactions={depositTransactions}
            setDepositTransactions={handleSetDepositTransactions}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;