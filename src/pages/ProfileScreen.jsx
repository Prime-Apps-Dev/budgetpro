// src/pages/ProfileScreen.jsx
import React from 'react';
import { ICONS } from '../components/icons';
import { motion } from 'framer-motion';
import { whileTap, whileHover, spring, zoomInOut } from '../utils/motion';
import { useAppContext } from '../context/AppContext';

/**
 * Переработанный компонент экрана профиля в стиле главной страницы.
 * @returns {JSX.Element}
 */
const ProfileScreen = () => {
  const {
    navigateToScreen,
    userProfile,
    setShowEditProfileModal,
    closeAllModals,
    transactions,
    accounts,
    totalIncome,
    totalExpenses
  } = useAppContext();

  /**
   * Обновленная функция для смены экрана, которая также закрывает модальные окна.
   * @param {string} screenName - Имя экрана для перехода.
   */
  const handleScreenChange = (screenName) => {
    closeAllModals();
    navigateToScreen(screenName);
  };

  // Статистика пользователя
  const userStats = {
    totalTransactions: transactions.length,
    activeAccounts: accounts.filter(acc => acc.balance > 0).length,
    categoriesUsed: new Set(transactions.map(t => t.category)).size,
    daysActive: Math.ceil((new Date() - new Date('2024-01-01')) / (1000 * 60 * 60 * 24))
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      {/* Header секция с профилем пользователя */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 px-6 py-8">
        <motion.div
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50 shadow-lg"
          variants={zoomInOut}
          whileInView="whileInView"
          viewport={{ once: false, amount: 0.2 }}
        >
          <div className="flex items-center mb-6">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-white text-3xl font-bold mr-6 shadow-lg"
              style={{ backgroundColor: userProfile?.avatarColor }}
            >
              {userProfile?.avatar}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {userProfile?.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{userProfile?.email}</p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                Активен {userStats.daysActive} дней
              </div>
            </div>
          </div>

          {/* Краткая статистика пользователя */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {userStats.totalTransactions}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Операций</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {userStats.activeAccounts}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Счетов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {userStats.categoriesUsed}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Категорий</div>
            </div>
          </div>

          <motion.button
            onClick={() => {
              console.log('Нажата кнопка "Редактировать профиль"');
              setShowEditProfileModal(true);
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
            whileTap={whileTap}
            whileHover={{ scale: 1.02 }}
            transition={spring}
          >
            Редактировать профиль
          </motion.button>
        </motion.div>
      </div>

      {/* Основной контент */}
      <div className="px-6 py-6 space-y-6">
        
        {/* Финансовое управление */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 px-2">
            Финансовое управление
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              onClick={() => handleScreenChange('financial-goals')}
              className="relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-3xl p-6 text-white shadow-lg shadow-green-500/20"
              whileTap={whileTap}
              whileHover={whileHover}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <ICONS.Target className="w-6 h-6" />
                  </div>
                  <ICONS.ChevronLeft className="w-5 h-5 opacity-70 transform rotate-180" />
                </div>
                <div className="text-lg font-semibold mb-1">Финансовые цели</div>
                <div className="text-sm opacity-80">Планируйте будущее</div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => handleScreenChange('budget-planning')}
              className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20"
              whileTap={whileTap}
              whileHover={whileHover}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <ICONS.Wallet className="w-6 h-6" />
                  </div>
                  <ICONS.ChevronLeft className="w-5 h-5 opacity-70 transform rotate-180" />
                </div>
                <div className="text-lg font-semibold mb-1">Планирование бюджета</div>
                <div className="text-sm opacity-80">Контролируйте расходы</div>
              </div>
            </motion.button>
          </div>

          <motion.button
            onClick={() => handleScreenChange('debts')}
            className="relative overflow-hidden w-full bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-3xl p-6 text-white shadow-lg shadow-red-500/20"
            whileTap={whileTap}
            whileHover={whileHover}
            transition={spring}
            variants={zoomInOut}
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm mr-4">
                  <ICONS.Handshake className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-lg font-semibold mb-1">Долги</div>
                  <div className="text-sm opacity-80">Управление обязательствами</div>
                </div>
              </div>
              <ICONS.ChevronLeft className="w-5 h-5 opacity-70 transform rotate-180" />
            </div>
          </motion.button>
        </div>

        {/* Мои продукты и данные */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 px-2">
            Мои продукты и данные
          </h2>
          
          <div className="space-y-3">
            <motion.button
              onClick={() => handleScreenChange('my-financial-products')}
              className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              whileTap={whileTap}
              whileHover={{ x: 5 }}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mr-3">
                  <ICONS.Banknote className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-gray-100">Кредиты и депозиты</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Финансовые продукты</div>
                </div>
              </div>
              <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </motion.button>

            <motion.button
              onClick={() => handleScreenChange('transaction-history')}
              className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              whileTap={whileTap}
              whileHover={{ x: 5 }}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mr-3">
                  <ICONS.Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-gray-100">История транзакций</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{userStats.totalTransactions} операций</div>
                </div>
              </div>
              <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </motion.button>

            <motion.button
              onClick={() => handleScreenChange('accounts')}
              className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              whileTap={whileTap}
              whileHover={{ x: 5 }}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mr-3">
                  <ICONS.CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-gray-100">Счета</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{userStats.activeAccounts} активных</div>
                </div>
              </div>
              <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </motion.button>

            <motion.button
              onClick={() => handleScreenChange('categories')}
              className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              whileTap={whileTap}
              whileHover={{ x: 5 }}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mr-3">
                  <ICONS.LayoutGrid className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-gray-100">Категории</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{userStats.categoriesUsed} используется</div>
                </div>
              </div>
              <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </motion.button>
          </div>
        </div>

        {/* Настройки */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 px-2">
            Настройки
          </h2>
          
          <motion.button
            onClick={() => handleScreenChange('settings')}
            className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            whileTap={whileTap}
            whileHover={{ x: 5 }}
            transition={spring}
            variants={zoomInOut}
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mr-3">
                <ICONS.Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-gray-100">Настройки приложения</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Персонализация и безопасность</div>
              </div>
            </div>
            <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;