// src/App.jsx
import React, { lazy, Suspense } from 'react';
import MainNavigation from './components/ui/MainNavigation';
import AddEditTransactionModal from './components/modals/AddEditTransactionModal';
import AddFinancialItemModal from './components/modals/AddFinancialItemModal';
import LoanDepositDetailModal from './components/modals/LoanDepositDetailModal';
import EditProfileModal from './components/modals/EditProfileModal';
import AddEditDebtModal from './components/modals/AddEditDebtModal';
import AddEditBudgetModal from './components/modals/AddEditBudgetModal';
import AddEditFinancialGoalModal from './components/modals/AddEditFinancialGoalModal';
import AddEditCategoryModal from './components/modals/AddEditCategoryModal';
import ModalPortal from './components/modals/ModalPortal';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInOut } from './utils/motion';
import { useAppContext } from './context/AppContext';

// Динамический импорт компонентов для Code Splitting и Lazy Loading.
const HomeScreen = lazy(() => import('./pages/HomeScreen'));
const AnalyticsScreen = lazy(() => import('./pages/AnalyticsScreen'));
const SavingsScreen = lazy(() => import('./pages/SavingsScreen'));
const ProfileScreen = lazy(() => import('./pages/ProfileScreen'));

/**
 * Основной компонент-контейнер приложения, содержащий логику рендеринга
 * экранов и модальных окон.
 * @returns {JSX.Element}
 */
const App = () => {
  const {
    activeTab,
    currentScreen,
    isDarkMode,
    isDataLoaded,
    showAddTransaction,
    editingTransaction,
    selectedFinancialItem,
    showAddFinancialItemModal,
    showEditProfileModal,
    showAddDebtModal,
    editingDebt,
    showAddBudgetModal,
    editingBudget,
    showAddGoalModal,
    editingGoal,
    showAddCategoryModal,
    editingCategory
  } = useAppContext();

  /**
   * Определяет, какой экран должен быть отрендерен,
   * основываясь на текущей вкладке и вложенном экране.
   * @returns {JSX.Element|null}
   */
  const renderScreen = () => {
    switch (currentScreen) {
      case 'financial-goals':
      case 'transaction-history':
      case 'accounts':
      case 'categories':
      case 'budget-planning':
      case 'debts':
      case 'settings':
      case 'select-currency':
      case 'my-financial-products':
      case 'loans-list':
      case 'deposits-list':
        // Все вложенные экраны профиля рендерятся внутри ProfileScreen.
        return <ProfileScreen />;
      default:
        // Если нет вложенного экрана, рендерим компонент, соответствующий активной вкладке.
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

  return (
    <div className={`max-w-md mx-auto min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100'}`}>
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">Загрузка экрана...</div>
        </div>
      }>
        <motion.div
          key={activeTab + currentScreen}
          variants={fadeInOut}
          initial="initial"
          animate="animate"
        >
          {renderScreen()}
        </motion.div>
      </Suspense>

      <MainNavigation />
      
      <ModalPortal>
        <AnimatePresence>
          {(showAddTransaction || editingTransaction) && (
            <Suspense fallback={null}>
              <AddEditTransactionModal key="add-edit-transaction-modal" />
            </Suspense>
          )}
          {showAddFinancialItemModal && (
            <Suspense fallback={null}>
              <AddFinancialItemModal key="add-financial-item-modal" />
            </Suspense>
          )}
          {selectedFinancialItem && (
            <Suspense fallback={null}>
              <LoanDepositDetailModal key="loan-deposit-detail-modal" />
            </Suspense>
          )}
          {showEditProfileModal && (
            <Suspense fallback={null}>
              <EditProfileModal key="edit-profile-modal" />
            </Suspense>
          )}
          {(showAddDebtModal || editingDebt) && (
            <Suspense fallback={null}>
              <AddEditDebtModal key="add-edit-debt-modal" />
            </Suspense>
          )}
          {(showAddBudgetModal || editingBudget) && (
            <Suspense fallback={null}>
              <AddEditBudgetModal key="add-edit-budget-modal" />
            </Suspense>
          )}
          {(showAddGoalModal || editingGoal) && (
            <Suspense fallback={null}>
              <AddEditFinancialGoalModal key="add-edit-financial-goal-modal" />
            </Suspense>
          )}
          {(showAddCategoryModal || editingCategory) && (
            <Suspense fallback={null}>
              <AddEditCategoryModal key="add-edit-category-modal" />
            </Suspense>
          )}
        </AnimatePresence>
      </ModalPortal>
    </div>
  );
};

export default App;