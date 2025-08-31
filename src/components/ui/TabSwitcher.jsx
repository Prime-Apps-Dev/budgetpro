// src/components/ui/TabSwitcher.jsx
import React from 'react';
import { ICONS } from '../icons';
import { motion } from 'framer-motion';
import { spring, whileTap } from '../../utils/motion';

/**
 * Универсальный компонент переключателя вкладок.
 * @param {object} props - Свойства компонента.
 * @param {string} props.activeTab - ID активной вкладки.
 * @param {function} props.onTabChange - Обработчик смены вкладки.
 * @param {Array<object>} props.tabs - Массив объектов с вкладками: [{id, label, icon}].
 * @returns {JSX.Element}
 */
const TabSwitcher = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
            whileTap={whileTap}
            transition={spring}
          >
            {Icon && <Icon className="w-4 h-4 mr-2" />}
            <span className="text-sm leading-3">{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default TabSwitcher;