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
import AlertModal from './components/modals/AlertModal';

// Динамический импорт всех компонентов для Code Splitting
const HomeScreen = lazy(() => import('./pages/HomeScreen'));
const AnalyticsScreen = lazy(() => import('./pages/AnalyticsScreen'));
const SavingsScreen = lazy(() => import('./pages/SavingsScreen'));
const ProfileScreen = lazy(() => import('./pages/ProfileScreen'));
const FinancialGoalsScreen = lazy(() => import('./features/profile/FinancialGoalsScreen'));
const TransactionHistoryScreen = lazy(() => import('./features/profile/TransactionHistoryScreen'));
const AccountsScreen = lazy(() => import('./features/profile/AccountsScreen'));
const CategoriesScreen = lazy(() => import('./features/profile/CategoriesScreen'));
const SettingsScreen = lazy(() => import('./features/profile/SettingsScreen'));
const BudgetPlanningScreen = lazy(() => import('./features/profile/BudgetPlanningScreen'));
const DebtsScreen = lazy(() => import('./features/profile/DebtsScreen'));
import MyFinancialProductsScreen from './features/financialProducts/MyFinancialProductsScreen';
const CurrencyScreen = lazy(() => import('./features/profile/CurrencyScreen'));
// NEW: Import the new modal component
const AddEditAccountModal = lazy(() => import('./components/modals/AddEditAccountModal'));
const GoalTransactionsModal = lazy(() => import('./components/modals/GoalTransactionsModal'));
// NEW: Import the new DebtTransactionsModal
const DebtTransactionsModal = lazy(() => import('./components/modals/DebtTransactionsModal'));
// NEW: Import the new AddLoanDepositTransactionModal
const AddLoanDepositTransactionModal = lazy(() => import('./components/modals/AddLoanDepositTransactionModal'));

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
    editingCategory,
    // NEW: state for the new modal
    showAddAccountModal,
    selectedDebtToRepay,
    // NEW: state for savings goals
    showGoalTransactionsModal,
    selectedGoal,
    // NEW: state for debt transactions modal
    showDebtTransactionsModal,
    selectedDebtForTransactions,
    // NEW: state for loan/deposit transaction modal
    showLoanDepositTransactionModal,
    selectedLoanDepositForTransaction,
  } = useAppContext();

  /**
   * Определяет, какой экран должен быть отрендерен,
   * основываясь на текущей вкладке и вложенном экране.
   * @returns {JSX.Element|null}
   */
  const renderScreen = () => {
    switch (currentScreen) {
      case 'financial-goals':
        return <FinancialGoalsScreen />;
      case 'transaction-history':
        return <TransactionHistoryScreen />;
      case 'accounts':
        return <AccountsScreen />;
      case 'categories':
        return <CategoriesScreen />;
      case 'budget-planning':
        return <BudgetPlanningScreen />;
      case 'debts':
        return <DebtsScreen />;
      case 'my-financial-products':
        return <MyFinancialProductsScreen />;
      case 'loans-list':
        return <MyFinancialProductsScreen activeTab="loans" />;
      case 'deposits-list':
        return <MyFinancialProductsScreen activeTab="deposits" />;
      case 'settings':
        return <SettingsScreen />;
      case 'select-currency':
        return <CurrencyScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'add-financial-item':
      case 'edit-financial-item':
        // Эти экраны не рендерятся напрямую, а управляются модальным окном
        return null;
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

  return (
    <div className={`max-w-md mx-auto min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100'}`}>
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">Загрузка экрана...</div>
        </div>
      }>
        <motion.div
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
          {(showAddTransaction || editingTransaction || selectedDebtToRepay) && (
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
          {/* NEW: Render the new modal */}
          {showAddAccountModal && (
            <Suspense fallback={null}>
              <AddEditAccountModal key="add-edit-account-modal" />
            </Suspense>
          )}
          {showGoalTransactionsModal && selectedGoal && (
            <Suspense fallback={null}>
              <GoalTransactionsModal key="goal-transactions-modal" />
            </Suspense>
          )}
          {showDebtTransactionsModal && selectedDebtForTransactions && (
            <Suspense fallback={null}>
              <DebtTransactionsModal key="debt-transactions-modal" />
            </Suspense>
          )}
          {showLoanDepositTransactionModal && selectedLoanDepositForTransaction && (
            <Suspense fallback={null}>
              <AddLoanDepositTransactionModal key="add-loan-deposit-transaction-modal" />
            </Suspense>
          )}
        </AnimatePresence>
      </ModalPortal>
    </div>
  );
};

export default App;