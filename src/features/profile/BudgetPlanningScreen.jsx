// src/features/profile/BudgetPlanningScreen.jsx
import React, { useState } from 'react';
import { ICONS } from '../../components/icons';
import { motion } from 'framer-motion';
import { spring, whileTap, whileHover, zoomInOut } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';

/**
 * Компонент экрана "Планирование бюджета".
 * Позволяет пользователю создавать, редактировать и удалять бюджеты по категориям.
 * @returns {JSX.Element}
 */
const BudgetPlanningScreen = () => {
  const {
    budgets,
    setBudgets,
    getFilteredTransactions,
    setCurrentScreen,
    totalPlannedBudget,
    totalSpentOnBudgets,
    currencySymbol,
    setShowAddBudgetModal, // Новая переменная из контекста
    setEditingBudget // Новая переменная из контекста
  } = useAppContext();

  const [showRemaining, setShowRemaining] = useState(false);

  const filteredTransactions = getFilteredTransactions();

  /**
   * Обрабатывает удаление бюджета.
   * @param {number} id - ID бюджета для удаления.
   */
  const handleDeleteBudget = (id) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  /**
   * Рассчитывает потраченную сумму по заданной категории.
   * @param {string} category - Имя категории.
   * @returns {number} - Сумма расходов.
   */
  const getSpentAmount = (category) => {
    return filteredTransactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };
  
  /**
   * Переключает отображение оставшегося или потраченного бюджета.
   */
  const handleCardClick = () => {
    setShowRemaining(!showRemaining);
  };

  const remainingBudget = totalPlannedBudget - totalSpentOnBudgets;

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="flex items-center justify-between mb-8">
        <motion.button
          onClick={() => setCurrentScreen('profile')}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          whileTap={whileTap}
          transition={spring}
        >
          <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
        </motion.button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Планирование бюджета</h2>
        <motion.button
          onClick={() => {
            setShowAddBudgetModal(true); // Обновляем вызов
            setEditingBudget(null); // Сбрасываем редактируемый бюджет
          }}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 ml-auto"
          whileTap={{ scale: 0.8 }}
          transition={spring}
        >
          <ICONS.Plus className="w-6 h-6" />
        </motion.button>
      </div>

      <motion.div
        className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-8 cursor-pointer"
        onClick={handleCardClick}
        whileHover={whileHover}
        whileTap={whileTap}
        transition={spring}
        variants={zoomInOut}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="flex items-center mb-3">
          <ICONS.Wallet className="w-6 h-6 mr-3" />
          <span className="text-sm opacity-90">Спланировано</span>
        </div>
        <div className="text-2xl font-bold">
          {totalPlannedBudget !== undefined && totalPlannedBudget !== null ? totalPlannedBudget.toLocaleString() : '0'} {currencySymbol}
        </div>
        <div className="text-sm opacity-80 mt-1">
          {showRemaining ? (
            `Осталось потратить: ${remainingBudget.toLocaleString()} ${currencySymbol}`
          ) : (
            `Потрачено: ${totalSpentOnBudgets !== undefined && totalSpentOnBudgets !== null ? totalSpentOnBudgets.toLocaleString() : '0'} ${currencySymbol}`
          )}
        </div>
      </motion.div>

      <div className="space-y-4">
        {budgets.length > 0 ? (
          budgets.map(budget => {
            const spent = getSpentAmount(budget.category);
            const progress = (spent / budget.limit) * 100;
            const isOver = spent > budget.limit;
            const progressColor = isOver ? 'bg-red-500' : 'bg-green-500';

            return (
              <motion.div 
                key={budget.id} 
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
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">{budget.category}</h3>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => {
                        setEditingBudget(budget);
                        setShowAddBudgetModal(true);
                      }}
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded-lg dark:hover:bg-gray-700"
                      whileTap={whileTap}
                      transition={spring}
                    >
                      <ICONS.Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-gray-700"
                      whileTap={whileTap}
                      transition={spring}
                    >
                      <ICONS.Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-2 dark:text-gray-400">
                    <span>{spent.toLocaleString()} {currencySymbol}</span>
                    <span>{budget.limit.toLocaleString()} {currencySymbol}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                    <div
                      className={`${progressColor} h-3 rounded-full transition-all duration-300`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className={`text-center text-sm font-medium ${isOver ? 'text-red-500' : 'text-green-500'}`}>
                  {isOver ? `Лимит превышен на ${(spent - budget.limit).toLocaleString()} ${currencySymbol}` : `${progress.toFixed(1)}% израсходовано`}
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">У вас нет бюджетов. Создайте первый!</p>
        )}
      </div>
    </div>
  );
};

export default BudgetPlanningScreen;