// src/components/screens/profile/FinancialGoalsScreen.jsx
import React from 'react';
import { ICONS } from '../../components/icons';
import { motion } from 'framer-motion';
import { whileTap, whileHover, spring, zoomInOut } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';

/**
 * Компонент экрана "Финансовые цели".
 * Позволяет пользователю создавать, удалять и просматривать свои финансовые цели.
 * @returns {JSX.Element}
 */
const FinancialGoalsScreen = () => {
  const { 
    financialGoals, 
    setFinancialGoals, 
    setCurrentScreen, 
    currencySymbol,
    setShowAddGoalModal, // Добавляем новую переменную состояния
    setEditingGoal
  } = useAppContext();

  /**
   * Обрабатывает удаление цели.
   * @param {number} goalId - ID цели для удаления.
   */
  const handleDeleteGoal = (goalId) => {
    setFinancialGoals(financialGoals.filter(goal => goal.id !== goalId));
  };
  
  /**
   * Обрабатывает редактирование цели.
   * @param {object} goal - Цель для редактирования.
   */
  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowAddGoalModal(true);
  };

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <motion.button
            onClick={() => setCurrentScreen('profile')}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            whileTap={whileTap}
            transition={spring}
          >
            <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
          </motion.button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Финансовые цели</h2>
        </div>
        <motion.button
          onClick={() => setShowAddGoalModal(true)} // Обновляем вызов, чтобы использовать глобальное состояние
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          whileTap={{ scale: 0.8 }}
          transition={spring}
        >
          <ICONS.Plus className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="space-y-4">
        {financialGoals.length > 0 ? (
          financialGoals.map(goal => {
            const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
            return (
              <motion.div 
                key={goal.id} 
                className="bg-white rounded-2xl p-6 shadow-sm dark:bg-gray-800"
                whileTap={whileTap}
                whileHover={whileHover}
                transition={spring}
                variants={zoomInOut}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: false, amount: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{goal.title}</h3>
                    {goal.isSavings && (
                      <ICONS.PiggyBank className="w-5 h-5 text-purple-500 ml-2" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{goal.deadline}</span>
                    <motion.button
                      onClick={() => handleEditGoal(goal)} // Добавляем кнопку редактирования
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded-lg dark:hover:bg-gray-700"
                      whileTap={whileTap}
                      transition={spring}
                    >
                      <ICONS.Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded dark:hover:bg-gray-700"
                      whileTap={whileTap}
                      transition={spring}
                    >
                      <ICONS.Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-2 dark:text-gray-400">
                    <span>{goal.current.toLocaleString()} {currencySymbol}</span>
                    <span>{goal.target.toLocaleString()} {currencySymbol}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                    <div
                      className={`h-3 rounded-full ${goal.isSavings ? 'bg-purple-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  {progress.toFixed(1)}% достигнуто
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">У вас нет финансовых целей. Создайте первую!</p>
        )}
      </div>
    </div>
  );
};

export default FinancialGoalsScreen;