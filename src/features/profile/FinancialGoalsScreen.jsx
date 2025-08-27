// src/components/screens/profile/FinancialGoalsScreen.jsx
import React, { useState } from 'react';
import { ICONS } from '../../components/icons';
import { motion } from 'framer-motion';
import { whileTap, whileHover, spring, zoomInOut } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';

const FinancialGoalsScreen = () => {
  const { financialGoals, setFinancialGoals, setCurrentScreen, currencySymbol } = useAppContext();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', deadline: '', isSavings: false });

  const handleAddGoal = () => {
    if (newGoal.title.trim() && newGoal.target && newGoal.deadline) {
      const goal = {
        id: Date.now(),
        title: newGoal.title.trim(),
        target: parseFloat(newGoal.target),
        current: 0,
        deadline: newGoal.deadline,
        isSavings: newGoal.isSavings
      };
      setFinancialGoals([...financialGoals, goal]);
      setNewGoal({ title: '', target: '', deadline: '', isSavings: false });
      setShowAddGoal(false);
    }
  };

  const handleDeleteGoal = (goalId) => {
    setFinancialGoals(financialGoals.filter(goal => goal.id !== goalId));
  };

  if (showAddGoal) {
    return (
      <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
        <div className="flex items-center mb-8">
          <motion.button
            onClick={() => setShowAddGoal(false)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            whileTap={whileTap}
            transition={spring}
          >
            <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
          </motion.button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Новая цель</h2>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Название цели</label>
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              placeholder="Например: Отпуск в Европу"
              className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Целевая сумма</label>
            <input
              type="number"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              placeholder="0"
              className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Крайний срок</label>
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isSavings"
              checked={newGoal.isSavings}
              onChange={(e) => setNewGoal({ ...newGoal, isSavings: e.target.checked })}
              className="mr-3 w-5 h-5 text-blue-600 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="isSavings" className="text-sm font-medium text-gray-700 dark:text-gray-400">
              Это копилка (будет отображаться в разделе "Копилка")
            </label>
          </div>

          <motion.button
            onClick={handleAddGoal}
            className="w-full bg-blue-600 text-white p-4 rounded-2xl font-semibold hover:bg-blue-700"
            whileTap={whileTap}
            transition={spring}
          >
            Создать цель
          </motion.button>
        </div>
      </div>
    );
  }

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
          onClick={() => setShowAddGoal(true)}
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