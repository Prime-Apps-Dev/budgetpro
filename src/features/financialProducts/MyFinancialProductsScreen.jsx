// src/features/financialProducts/MyFinancialProductsScreen.jsx
import React from 'react';
import { ICONS } from '../../components/icons';
import { motion } from 'framer-motion';
import { spring, whileTap, whileHover } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';

/**
 * Компонент экрана "Мои финансовые продукты".
 * Предоставляет навигацию к спискам кредитов и депозитов.
 * @returns {JSX.Element}
 */
const MyFinancialProductsScreen = () => {
  const { navigateToScreen, goBack } = useAppContext();

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="flex items-center mb-8">
        <motion.button
          onClick={goBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          whileTap={whileTap}
          transition={spring}
        >
          <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
        </motion.button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Финансовые продукты</h2>
      </div>

      <div className="space-y-4">
        <motion.button
          onClick={() => navigateToScreen('loans-list')}
          className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          whileTap={whileTap}
          whileHover={whileHover}
          transition={spring}
        >
          <div className="flex items-center">
            <ICONS.MinusCircle className="w-6 h-6 mr-4 text-gray-800 dark:text-gray-200" />
            <span className="font-medium text-gray-800 dark:text-gray-200">Мои кредиты</span>
          </div>
          <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
        </motion.button>
        
        <motion.button
          onClick={() => navigateToScreen('deposits-list')}
          className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          whileTap={whileTap}
          whileHover={whileHover}
          transition={spring}
        >
          <div className="flex items-center">
            <ICONS.Banknote className="w-6 h-6 mr-4 text-gray-800 dark:text-gray-200" />
            <span className="font-medium text-gray-800 dark:text-gray-200">Мои депозиты</span>
          </div>
          <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
        </motion.button>
      </div>
    </div>
  );
};

export default MyFinancialProductsScreen;