// src/components/screens/profile/SettingsScreen.jsx
import React from 'react';
import { ICONS } from '../../icons';
import { motion } from 'framer-motion';
import { whileTap, jiggle, spring } from '../../../utils/motion';

const SettingsScreen = ({ setCurrentScreen, isDarkMode, setIsDarkMode }) => {
  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="flex items-center mb-8">
        <motion.button
          onClick={() => setCurrentScreen('')}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          whileTap={whileTap}
          transition={spring}
        >
          <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
        </motion.button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Настройки</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm dark:bg-gray-800">
          <h3 className="font-semibold text-gray-800 mb-3 dark:text-gray-200">Тема оформления</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Темная тема</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
              />
              <motion.div
                className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                whileTap={{ scale: 1.1 }}
                onClick={() => {
                  if (!isDarkMode) {
                    // Анимация покачивания при включении
                  }
                }}
                variants={isDarkMode ? {} : jiggle}
                initial={false}
                animate={isDarkMode ? 'initial' : false}
              >
              </motion.div>
            </label>
          </div>
        </div>

        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-sm dark:bg-gray-800"
          whileTap={whileTap}
          transition={spring}
        >
          <h3 className="font-semibold text-gray-800 mb-3 dark:text-gray-200">Уведомления</h3>
          <p className="text-gray-600 text-sm dark:text-gray-400">Настройки уведомлений будут добавлены в следующих версиях</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-sm dark:bg-gray-800"
          whileTap={whileTap}
          transition={spring}
        >
          <h3 className="font-semibold text-gray-800 mb-3 dark:text-gray-200">Экспорт данных</h3>
          <p className="text-gray-600 text-sm dark:text-gray-400">Функция экспорта данных будет добавлена в следующих версиях</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-sm dark:bg-gray-800"
          whileTap={whileTap}
          transition={spring}
        >
          <h3 className="font-semibold text-gray-800 mb-3 dark:text-gray-200">О приложении</h3>
          <p className="text-gray-600 text-sm dark:text-gray-400">Версия 2.0.0</p>
          <p className="text-gray-600 text-sm mt-2 dark:text-gray-400">
            Новое: редактирование транзакций, интеграция копилки с целями, управление счетами, настройка профиля
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsScreen;