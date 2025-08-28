// src/pages/ProfileScreen.jsx
import React from 'react';
import { ICONS } from '../components/icons';
import { motion } from 'framer-motion';
import { whileTap, whileHover, spring, zoomInOut } from '../utils/motion';
import { useAppContext } from '../context/AppContext';

const ProfileScreen = () => {
  const {
    setCurrentScreen,
    userProfile,
    setShowEditProfileModal,
  } = useAppContext();
  
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
          onClick={() => setShowEditProfileModal(true)}
          className="w-full bg-blue-500 text-white p-4 rounded-xl font-medium hover:bg-blue-600"
          whileTap={whileTap}
          transition={spring}
        >
          Редактировать профиль
        </motion.button>
      </motion.div>

      <div className="space-y-4">
        <motion.button
          onClick={() => setCurrentScreen('financial-goals')}
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
          onClick={() => setCurrentScreen('budget-planning')}
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
          onClick={() => setCurrentScreen('debts')}
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
          onClick={() => setCurrentScreen('my-financial-products')}
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
          onClick={() => setCurrentScreen('transaction-history')}
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
          onClick={() => setCurrentScreen('accounts')}
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
          onClick={() => setCurrentScreen('categories')}
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
          onClick={() => setCurrentScreen('settings')}
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
};

export default ProfileScreen;