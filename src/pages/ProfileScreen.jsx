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
    totalExpenses,
    getMonthlyTransactionsCount,
    daysActive
  } = useAppContext();

  /**
   * Обновленная функция для смены экрана, которая также закрывает модальные окна.
   * @param {string} screenName - Имя экрана для перехода.
   */
  const handleScreenChange = (screenName) => {
    closeAllModals();
    navigateToScreen(screenName);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      {/* Header секция с профилем пользователя */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 px-6 py-8">
        <motion.div
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50 shadow-lg shadow-gray-900/2"
          variants={zoomInOut}
          whileInView="whileInView"
          viewport={{ once: false, amount: 0.2 }}
        >
          <div className="flex items-center mb-6">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-white text-3xl font-bold mr-6"
              style={{ backgroundColor: userProfile?.avatarColor }}
            >
              {userProfile?.avatar}
            </div>
            <div className="flex-1">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl leading-5 font-bold text-gray-900 dark:text-gray-100">
                  {userProfile?.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{userProfile?.email}</p>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                Активен {daysActive} дней
              </div>
            </div>
          </div>

          <motion.button
            onClick={() => {
              console.log('Нажата кнопка "Редактировать профиль"');
              setShowEditProfileModal(true);
            }}
            className="w-full bg-gray-100 text-gray-800 p-4 rounded-2xl font-medium hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
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
              className="relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-3xl p-6 text-white shadow-lg shadow-green-500/20 text-left"
              whileTap={whileTap}
              whileHover={whileHover}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <ICONS.Target className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-lg leading-5 font-semibold">Финансовые цели</div>
                    <div className="text-sm opacity-80">Планируйте будущее</div>
                  </div>
                </div>
                <ICONS.ChevronLeft className="w-5 h-5 opacity-70 transform rotate-180" />
              </div>
            </motion.button>

            <motion.button
              onClick={() => handleScreenChange('budget-planning')}
              className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20 text-left"
              whileTap={whileTap}
              whileHover={whileHover}
              transition={spring}
              variants={zoomInOut}
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <ICONS.Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-lg leading-5 font-semibold">Планирование бюджета</div>
                    <div className="text-sm opacity-80">Контролируйте расходы</div>
                  </div>
                </div>
                <ICONS.ChevronLeft className="w-5 h-5 opacity-70 transform rotate-180" />
              </div>
            </motion.button>
          </div>

          <motion.button
            onClick={() => handleScreenChange('debts')}
            className="relative overflow-hidden w-full bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-3xl p-6 text-white shadow-lg shadow-red-500/20 text-left"
            whileTap={whileTap}
            whileHover={whileHover}
            transition={spring}
            variants={zoomInOut}
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <ICONS.Handshake className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-lg leading-5 font-semibold">Долги</div>
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
              className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm shadow-black/2 border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
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
                  <div className="font-medium leading-5 text-gray-900 dark:text-gray-100">Кредиты и депозиты</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Финансовые продукты</div>
                </div>
              </div>
              <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </motion.button>

            <motion.button
              onClick={() => handleScreenChange('transaction-history')}
              className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm shadow-black/2 border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
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
                  <div className="font-medium leading-5 text-gray-900 dark:text-gray-100">История транзакций</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Все операции</div>
                </div>
              </div>
              <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </motion.button>

            <motion.button
              onClick={() => handleScreenChange('accounts')}
              className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm shadow-black/2 border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
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
                  <div className="font-medium leading-5 text-gray-900 dark:text-gray-100">Счета</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Управление счетами</div>
                </div>
              </div>
              <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </motion.button>

            <motion.button
              onClick={() => handleScreenChange('categories')}
              className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm shadow-black/2 border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
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
                  <div className="font-medium leading-5 text-gray-900 dark:text-gray-100">Категории</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Управление категориями</div>
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
            className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm shadow-black/2 border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
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
                <div className="font-medium leading-5 text-gray-900 dark:text-gray-100">Настройки приложения</div>
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