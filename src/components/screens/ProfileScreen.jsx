import React from 'react';
import { ICONS } from '../icons';
import EditProfileScreen from './profile/EditProfileScreen';
import FinancialGoalsScreen from './profile/FinancialGoalsScreen';
import TransactionHistoryScreen from './profile/TransactionHistoryScreen';
import AccountsScreen from './profile/AccountsScreen';
import CategoriesScreen from './profile/CategoriesScreen';
import SettingsScreen from './profile/SettingsScreen';
import BudgetPlanningScreen from './BudgetPlanningScreen';
import DebtsScreen from './DebtsScreen';
import MyLoansScreen from './MyLoansScreen';
import MyLoansListScreen from './MyLoansListScreen';
import MyDepositsListScreen from './MyDepositsListScreen';
import LoanDepositDetailScreen from './LoanDepositDetailScreen';
import AddFinancialItemScreen from './AddFinancialItemScreen';
import MyFinancialProductsScreen from './MyFinancialProductsScreen';
import { motion } from 'framer-motion';
import { whileTap, whileHover, spring } from '../../utils/motion';

const ProfileScreen = ({
  userProfile,
  setUserProfile,
  financialGoals,
  setFinancialGoals,
  transactions,
  setTransactions,
  accounts,
  setAccounts,
  currentScreen,
  setCurrentScreen,
  getAccountByName,
  categories,
  setCategories,
  isDarkMode,
  setIsDarkMode,
  budgets,
  setBudgets,
  filteredTransactions,
  debts,
  setDebts,
  loans,
  setLoans,
  deposits,
  setDeposits,
  selectedFinancialItem,
  setSelectedFinancialItem,
  loanTransactions,
  setLoanTransactions,
  depositTransactions,
  setDepositTransactions,
  setShowAddTransaction,
  setEditingTransaction,
  totalPlannedBudget,
  totalSpentOnBudgets
}) => {
  if (currentScreen === 'edit-profile') {
    return <EditProfileScreen userProfile={userProfile} setUserProfile={setUserProfile} setCurrentScreen={setCurrentScreen} />;
  }
  if (currentScreen === 'financial-goals') {
    return <FinancialGoalsScreen financialGoals={financialGoals} setFinancialGoals={setFinancialGoals} setCurrentScreen={setCurrentScreen} />;
  }
  if (currentScreen === 'transaction-history') {
    return <TransactionHistoryScreen transactions={transactions} setTransactions={setTransactions} setEditingTransaction={() => {}} setCurrentScreen={setCurrentScreen} getAccountByName={getAccountByName} />;
  }
  if (currentScreen === 'accounts') {
    return <AccountsScreen accounts={accounts} setAccounts={setAccounts} setCurrentScreen={setCurrentScreen} />;
  }
  if (currentScreen === 'categories') {
    return <CategoriesScreen categories={categories} setCategories={setCategories} setCurrentScreen={setCurrentScreen} />;
  }
  if (currentScreen === 'budget-planning') {
    return (
      <BudgetPlanningScreen
        budgets={budgets}
        setBudgets={setBudgets}
        categories={categories}
        filteredTransactions={filteredTransactions}
        setCurrentScreen={setCurrentScreen}
        totalPlannedBudget={totalPlannedBudget}
        totalSpentOnBudgets={totalSpentOnBudgets}
      />
    );
  }
  if (currentScreen === 'debts') {
    return (
      <DebtsScreen
        debts={debts}
        setDebts={setDebts}
        setCurrentScreen={setCurrentScreen}
        setTransactions={setTransactions}
      />
    );
  }
  if (currentScreen === 'my-financial-products') {
    return (
      <MyFinancialProductsScreen
        setCurrentScreen={setCurrentScreen}
      />
    );
  }
  if (currentScreen === 'loans-list') {
    return (
      <MyLoansListScreen
        loans={loans}
        setCurrentScreen={setCurrentScreen}
        setSelectedFinancialItem={setSelectedFinancialItem}
      />
    );
  }
  if (currentScreen === 'deposits-list') {
    return (
      <MyDepositsListScreen
        deposits={deposits}
        setCurrentScreen={setCurrentScreen}
        setSelectedFinancialItem={setSelectedFinancialItem}
      />
    );
  }
  if (currentScreen === 'loan-detail') {
    return (
      <LoanDepositDetailScreen
        item={selectedFinancialItem}
        setCurrentScreen={setCurrentScreen}
        setLoans={setLoans}
        setDeposits={setDeposits}
        loans={loans}
        deposits={deposits}
        setSelectedFinancialItem={setSelectedFinancialItem}
        setTransactions={setTransactions}
        loanTransactions={loanTransactions}
        setLoanTransactions={setLoanTransactions}
        depositTransactions={depositTransactions}
        setDepositTransactions={setDepositTransactions}
        setShowAddTransaction={setShowAddTransaction}
        setEditingTransaction={setEditingTransaction}
        getAccountByName={getAccountByName}
        accounts={accounts}
      />
    );
  }
  if (currentScreen === 'deposit-detail') {
    return (
      <LoanDepositDetailScreen
        item={selectedFinancialItem}
        setCurrentScreen={setCurrentScreen}
        setLoans={setLoans}
        setDeposits={setDeposits}
        loans={loans}
        deposits={deposits}
        setSelectedFinancialItem={setSelectedFinancialItem}
        setTransactions={setTransactions}
        loanTransactions={loanTransactions}
        setLoanTransactions={setLoanTransactions}
        depositTransactions={depositTransactions}
        setDepositTransactions={setDepositTransactions}
        setShowAddTransaction={setShowAddTransaction}
        setEditingTransaction={setEditingTransaction}
        getAccountByName={getAccountByName}
        accounts={accounts}
      />
    );
  }
  if (currentScreen === 'settings') {
    return (
      <SettingsScreen
        setCurrentScreen={setCurrentScreen}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    );
  }
  if (currentScreen === 'add-financial-item') {
    return (
        <AddFinancialItemScreen
            loans={loans}
            setLoans={setLoans}
            deposits={deposits}
            setDeposits={setDeposits}
            setCurrentScreen={setCurrentScreen}
            accounts={accounts}
        />
    );
  }
  if (currentScreen === 'edit-financial-item') {
    return (
        <AddFinancialItemScreen
            loans={loans}
            setLoans={setLoans}
            deposits={deposits}
            setDeposits={setDeposits}
            setCurrentScreen={setCurrentScreen}
            editingItem={selectedFinancialItem}
            accounts={accounts}
        />
    );
  }

  return (
    <div className="p-6 pb-24 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 dark:text-gray-200">Профиль</h2>

      <div className="bg-white rounded-2xl p-8 shadow-sm mb-8 dark:bg-gray-800">
        <div className="flex items-center mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4"
            style={{ backgroundColor: userProfile?.avatarColor }}
          >
            {userProfile?.avatar}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{userProfile?.name}</h3>
            <p className="text-gray-500 dark:text-gray-400">{userProfile?.email}</p>
          </div>
        </div>
        <motion.button
          onClick={() => setCurrentScreen('edit-profile')}
          className="w-full bg-blue-500 text-white p-4 rounded-xl font-medium hover:bg-blue-600"
          whileTap={whileTap}
          transition={spring}
        >
          Редактировать профиль
        </motion.button>
      </div>

      <div className="space-y-4">
        <motion.button
          onClick={() => setCurrentScreen('financial-goals')}
          className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          whileTap={whileTap}
          whileHover={{ x: 5 }}
          transition={spring}
        >
          <div className="flex items-center">
            <ICONS.Target className="w-6 h-6 text-blue-500 mr-4" />
            <span className="font-medium text-gray-800 dark:text-gray-200">Финансовые цели</span>
          </div>
          <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
        </motion.button>
        
        <motion.button
          onClick={() => setCurrentScreen('budget-planning')}
          className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          whileTap={whileTap}
          whileHover={{ x: 5 }}
          transition={spring}
        >
          <div className="flex items-center">
            <ICONS.Wallet className="w-6 h-6 text-blue-500 mr-4" />
            <span className="font-medium text-gray-800 dark:text-gray-200">Планирование бюджета</span>
          </div>
          <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
        </motion.button>

        <motion.button
          onClick={() => setCurrentScreen('debts')}
          className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          whileTap={whileTap}
          whileHover={{ x: 5 }}
          transition={spring}
        >
          <div className="flex items-center">
            <ICONS.Handshake className="w-6 h-6 text-blue-500 mr-4" />
            <span className="font-medium text-gray-800 dark:text-gray-200">Долги</span>
          </div>
          <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
        </motion.button>

        <motion.button
          onClick={() => setCurrentScreen('my-financial-products')}
          className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          whileTap={whileTap}
          whileHover={{ x: 5 }}
          transition={spring}
        >
          <div className="flex items-center">
            <ICONS.Banknote className="w-6 h-6 text-blue-500 mr-4" />
            <span className="font-medium text-gray-800 dark:text-gray-200">Мои кредиты и депозиты</span>
          </div>
          <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
        </motion.button>

        <motion.button
          onClick={() => setCurrentScreen('transaction-history')}
          className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          whileTap={whileTap}
          whileHover={{ x: 5 }}
          transition={spring}
        >
          <div className="flex items-center">
            <ICONS.Calendar className="w-6 h-6 text-blue-500 mr-4" />
            <span className="font-medium text-gray-800 dark:text-gray-200">История транзакций</span>
          </div>
          <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
        </motion.button>

        <motion.button
          onClick={() => setCurrentScreen('accounts')}
          className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          whileTap={whileTap}
          whileHover={{ x: 5 }}
          transition={spring}
        >
          <div className="flex items-center">
            <ICONS.CreditCard className="w-6 h-6 text-blue-500 mr-4" />
            <span className="font-medium text-gray-800 dark:text-gray-200">Счета</span>
          </div>
          <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
        </motion.button>

        <motion.button
          onClick={() => setCurrentScreen('categories')}
          className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          whileTap={whileTap}
          whileHover={{ x: 5 }}
          transition={spring}
        >
          <div className="flex items-center">
            <ICONS.LayoutGrid className="w-6 h-6 text-blue-500 mr-4" />
            <span className="font-medium text-gray-800 dark:text-gray-200">Категории</span>
          </div>
          <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
        </motion.button>

        <motion.button
          onClick={() => setCurrentScreen('settings')}
          className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          whileTap={whileTap}
          whileHover={{ x: 5 }}
          transition={spring}
        >
          <div className="flex items-center">
            <ICONS.Settings className="w-6 h-6 text-blue-500 mr-4" />
            <span className="font-medium text-gray-800 dark:text-gray-200">Настройки</span>
          </div>
          <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
        </motion.button>
      </div>
    </div>
  );
};

export default ProfileScreen;