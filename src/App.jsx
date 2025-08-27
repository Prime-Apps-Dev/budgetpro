// src/App.jsx
import React from 'react';
import MainNavigation from './components/ui/MainNavigation';
import HomeScreen from './pages/HomeScreen';
import AnalyticsScreen from './pages/AnalyticsScreen';
import SavingsScreen from './pages/SavingsScreen';
import ProfileScreen from './pages/ProfileScreen';
import AddEditTransactionModal from './components/modals/AddEditTransactionModal';
import AddFinancialItemModal from './components/modals/AddFinancialItemModal';
import LoanDepositDetailModal from './components/modals/LoanDepositDetailModal';
import EditProfileModal from './components/modals/EditProfileModal';
import MyLoansListScreen from './features/financialProducts/MyLoansListScreen';
import MyDepositsListScreen from './features/financialProducts/MyDepositsListScreen';
import MyFinancialProductsScreen from './features/financialProducts/MyFinancialProductsScreen';
import DebtsScreen from './features/profile/DebtsScreen';
import BudgetPlanningScreen from './features/profile/BudgetPlanningScreen';
import AccountsScreen from './features/profile/AccountsScreen';
import CategoriesScreen from './features/profile/CategoriesScreen';
import CurrencyScreen from './features/profile/CurrencyScreen';
import FinancialGoalsScreen from './features/profile/FinancialGoalsScreen';
import SettingsScreen from './features/profile/SettingsScreen';
import TransactionHistoryScreen from './features/profile/TransactionHistoryScreen';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInOut } from './utils/motion';
import { useAppContext } from './context/AppContext';

const AppContent = () => {
  const {
    activeTab,
    currentScreen,
    isDarkMode,
    showAddTransaction,
    editingTransaction,
    isDataLoaded,
    selectedFinancialItem,
    showAddFinancialItemModal,
    showEditProfileModal,
  } = useAppContext();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'loans-list':
        return <MyLoansListScreen />;
      case 'deposits-list':
        return <MyDepositsListScreen />;
      case 'debts':
        return <DebtsScreen />;
      case 'my-financial-products':
        return <MyFinancialProductsScreen />;
      case 'budget-planning':
        return <BudgetPlanningScreen />;
      case 'financial-goals':
        return <FinancialGoalsScreen />;
      case 'transaction-history':
        return <TransactionHistoryScreen />;
      case 'accounts':
        return <AccountsScreen />;
      case 'categories':
        return <CategoriesScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'select-currency':
        return <CurrencyScreen />;
      default:
        switch (activeTab) {
          case 'home':
            return <HomeScreen />;
          case 'analytics':
            return <AnalyticsScreen />;
          case 'savings':
            return <SavingsScreen />;
          case 'profile':
            return <ProfileScreen />;
          default:
            return <HomeScreen />;
        }
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
  
  // Определяем, активно ли какое-либо модальное окно
  const isAnyModalOpen = (
    showAddTransaction ||
    editingTransaction ||
    showAddFinancialItemModal ||
    showEditProfileModal ||
    selectedFinancialItem
  );

  return (
    <div className={`max-w-md mx-auto min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100'}`}>
      {/* Затемняющий оверлей с размытием */}
      <AnimatePresence>
        {isAnyModalOpen && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ type: "tween", duration: 0.3 }}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
          />
        )}
      </AnimatePresence>

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

      <MainNavigation />
      
      <AnimatePresence>
        {(showAddTransaction || editingTransaction) && (
          <AddEditTransactionModal key="add-edit-transaction-modal" />
        )}
        {showAddFinancialItemModal && (
          <AddFinancialItemModal key="add-financial-item-modal" />
        )}
        {selectedFinancialItem && (
          <LoanDepositDetailModal key="loan-deposit-detail-modal" />
        )}
        {showEditProfileModal && (
          <EditProfileModal key="edit-profile-modal" />
        )}
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  return (
    <AppContent />
  );
};

export default App;