// src/pages/ProfileScreen.jsx
import React, { lazy, Suspense } from 'react';
import { ICONS } from '../components/icons';
import { motion } from 'framer-motion';
import { whileTap, whileHover, spring, zoomInOut } from '../utils/motion';
import { useAppContext } from '../context/AppContext';

// Динамический импорт вложенных экранов для Code Splitting
const FinancialGoalsScreen = lazy(() => import('../features/profile/FinancialGoalsScreen'));
const TransactionHistoryScreen = lazy(() => import('../features/profile/TransactionHistoryScreen'));
const AccountsScreen = lazy(() => import('../features/profile/AccountsScreen'));
const CategoriesScreen = lazy(() => import('../features/profile/CategoriesScreen'));
const SettingsScreen = lazy(() => import('../features/profile/SettingsScreen'));
const BudgetPlanningScreen = lazy(() => import('../features/profile/BudgetPlanningScreen'));
const DebtsScreen = lazy(() => import('../features/profile/DebtsScreen'));
const MyLoansListScreen = lazy(() => import('../features/financialProducts/MyLoansListScreen'));
const MyDepositsListScreen = lazy(() => import('../features/financialProducts/MyDepositsListScreen'));
const MyFinancialProductsScreen = lazy(() => import('../features/financialProducts/MyFinancialProductsScreen'));
const CurrencyScreen = lazy(() => import('../features/profile/CurrencyScreen'));

/**
 * Главный компонент экрана профиля.
 * Использует `Suspense` для отложенной загрузки вложенных экранов.
 * @returns {JSX.Element}
 */
const ProfileScreen = () => {
  const {
    currentScreen,
    setCurrentScreen,
    userProfile,
    setShowEditProfileModal,
    closeAllModals // Получаем новую функцию из контекста
  } = useAppContext();

  /**
   * Обновленная функция для смены экрана, которая также закрывает модальные окна.
   * @param {string} screenName - Имя экрана для перехода.
   */
  const handleScreenChange = (screenName) => {
    closeAllModals();
    setCurrentScreen(screenName);
  };

  switch (currentScreen) {
    case 'financial-goals':
      return <Suspense fallback={<div>Загрузка...</div>}><FinancialGoalsScreen /></Suspense>;
    case 'transaction-history':
      return <Suspense fallback={<div>Загрузка...</div>}><TransactionHistoryScreen /></Suspense>;
    case 'accounts':
      return <Suspense fallback={<div>Загрузка...</div>}><AccountsScreen /></Suspense>;
    case 'categories':
      return <Suspense fallback={<div>Загрузка...</div>}><CategoriesScreen /></Suspense>;
    case 'budget-planning':
      return <Suspense fallback={<div>Загрузка...</div>}><BudgetPlanningScreen /></Suspense>;
    case 'debts':
      return <Suspense fallback={<div>Загрузка...</div>}><DebtsScreen /></Suspense>;
    case 'my-financial-products':
      return <Suspense fallback={<div>Загрузка...</div>}><MyFinancialProductsScreen /></Suspense>;
    case 'loans-list':
      return <Suspense fallback={<div>Загрузка...</div>}><MyLoansListScreen /></Suspense>;
    case 'deposits-list':
      return <Suspense fallback={<div>Загрузка...</div>}><MyDepositsListScreen /></Suspense>;
    case 'settings':
      return <Suspense fallback={<div>Загрузка...</div>}><SettingsScreen /></Suspense>;
    case 'select-currency':
      return <Suspense fallback={<div>Загрузка...</div>}><CurrencyScreen /></Suspense>;
    default:
      return (
        <div className="p-6 pb-24 min-h-screen">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 dark:text-gray-200">Профиль</h2>

          <motion.div
            className="bg-white rounded-2xl p-8 shadow-sm mb-8 dark:bg-gray-800"
            variants={zoomInOut}
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.2 }}
          >
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
              onClick={() => {
                console.log('Нажата кнопка "Редактировать профиль"');
                setShowEditProfileModal(true);
              }}
              className="w-full bg-blue-500 text-white p-4 rounded-xl font-medium hover:bg-blue-600"
              whileTap={whileTap}
              transition={spring}
            >
              Редактировать профиль
            </motion.button>
          </motion.div>

          <div className="space-y-4">
            <motion.button
              onClick={() => handleScreenChange('financial-goals')}
              className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              whileTap={whileTap}
              whileHover={{ x: 5 }}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="flex items-center">
                <ICONS.Target className="w-6 h-6 text-blue-500 mr-4" />
                <span className="font-medium text-gray-800 dark:text-gray-200">Финансовые цели</span>
              </div>
              <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </motion.button>
            
            <motion.button
              onClick={() => handleScreenChange('budget-planning')}
              className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              whileTap={whileTap}
              whileHover={{ x: 5 }}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="flex items-center">
                <ICONS.Wallet className="w-6 h-6 text-blue-500 mr-4" />
                <span className="font-medium text-gray-800 dark:text-gray-200">Планирование бюджета</span>
              </div>
              <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </motion.button>

            <motion.button
              onClick={() => handleScreenChange('debts')}
              className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              whileTap={whileTap}
              whileHover={{ x: 5 }}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="flex items-center">
                <ICONS.Handshake className="w-6 h-6 text-blue-500 mr-4" />
                <span className="font-medium text-gray-800 dark:text-gray-200">Долги</span>
              </div>
              <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </motion.button>

            <motion.button
              onClick={() => handleScreenChange('my-financial-products')}
              className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              whileTap={whileTap}
              whileHover={{ x: 5 }}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="flex items-center">
                <ICONS.Banknote className="w-6 h-6 text-blue-500 mr-4" />
                <span className="font-medium text-gray-800 dark:text-gray-200">Мои кредиты и депозиты</span>
              </div>
              <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </motion.button>

            <motion.button
              onClick={() => handleScreenChange('transaction-history')}
              className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              whileTap={whileTap}
              whileHover={{ x: 5 }}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="flex items-center">
                <ICONS.Calendar className="w-6 h-6 text-blue-500 mr-4" />
                <span className="font-medium text-gray-800 dark:text-gray-200">История транзакций</span>
              </div>
              <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </motion.button>

            <motion.button
              onClick={() => handleScreenChange('accounts')}
              className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              whileTap={whileTap}
              whileHover={{ x: 5 }}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="flex items-center">
                <ICONS.CreditCard className="w-6 h-6 text-blue-500 mr-4" />
                <span className="font-medium text-gray-800 dark:text-gray-200">Счета</span>
              </div>
              <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </motion.button>

            <motion.button
              onClick={() => handleScreenChange('categories')}
              className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              whileTap={whileTap}
              whileHover={{ x: 5 }}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="flex items-center">
                <ICONS.LayoutGrid className="w-6 h-6 text-blue-500 mr-4" />
                <span className="font-medium text-gray-800 dark:text-gray-200">Категории</span>
              </div>
              <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </motion.button>
            
            <motion.button
              onClick={() => handleScreenChange('settings')}
              className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              whileTap={whileTap}
              whileHover={{ x: 5 }}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
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
  }
};

export default ProfileScreen;