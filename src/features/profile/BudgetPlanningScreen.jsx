// src/features/profile/BudgetPlanningScreen.jsx
import React, { useState } from 'react';
import { ICONS } from '../../components/icons';
import { motion } from 'framer-motion';
import { spring, whileTap, whileHover, zoomInOut } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';

/**
 * Компонент экрана "Планирование бюджета" с улучшенным дизайном.
 * Позволяет пользователю создавать, редактировать и удалять бюджеты по категориям.
 * @returns {JSX.Element}
 */
const BudgetPlanningScreen = () => {
  const {
    budgets,
    setBudgets,
    getFilteredTransactions,
    goBack,
    totalPlannedBudget,
    totalSpentOnBudgets,
    currencySymbol,
    setShowAddBudgetModal,
    setEditingBudget
  } = useAppContext();

  const [showDetails, setShowDetails] = useState(false);

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

  const remainingBudget = totalPlannedBudget - totalSpentOnBudgets;
  const budgetUsagePercent = totalPlannedBudget > 0 ? (totalSpentOnBudgets / totalPlannedBudget) * 100 : 0;
  const isOverBudget = totalSpentOnBudgets > totalPlannedBudget;

  // Сортировка бюджетов: сначала превышенные, потом по проценту использования
  const sortedBudgets = [...budgets].sort((a, b) => {
    const spentA = getSpentAmount(a.category);
    const spentB = getSpentAmount(b.category);
    const progressA = (spentA / a.limit) * 100;
    const progressB = (spentB / b.limit) * 100;
    
    const isOverA = spentA > a.limit;
    const isOverB = spentB > b.limit;
    
    if (isOverA && !isOverB) return -1;
    if (!isOverA && isOverB) return 1;
    if (isOverA && isOverB) return progressB - progressA;
    
    return progressB - progressA;
  });

  // Получаем критические бюджеты (>80% или превышены)
  const criticalBudgets = budgets.filter(budget => {
    const spent = getSpentAmount(budget.category);
    const progress = (spent / budget.limit) * 100;
    return progress > 80;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      {/* Персонализированный header */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={goBack}
            className="mr-4 p-3 rounded-2xl hover:bg-white/50 dark:hover:bg-gray-700/50 backdrop-blur-sm"
            whileTap={whileTap}
            transition={spring}
          >
            <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
          </motion.button>
          
          <div className="flex-1">
            <h1 className="text-2xl leading-7 font-bold text-gray-900 dark:text-gray-100">
              Планирование бюджета
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {new Date().toLocaleDateString('ru-RU', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>

          <motion.button
            onClick={() => {
              setShowAddBudgetModal(true);
              setEditingBudget(null);
            }}
            className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            transition={spring}
          >
            <ICONS.Plus className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Главная карточка с общим состоянием бюджета */}
        <motion.div
          className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-xl ${
            isOverBudget 
              ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-red-500/20' 
              : remainingBudget < totalPlannedBudget * 0.2
                ? 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 shadow-orange-500/20'
                : 'bg-gradient-to-br from-green-500 via-green-600 to-green-700 shadow-green-500/20'
          } cursor-pointer`}
          onClick={() => setShowDetails(!showDetails)}
          whileHover={whileHover}
          whileTap={whileTap}
          transition={spring}
          variants={zoomInOut}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: false, amount: 0.2 }}
        >
          {/* Декоративные элементы */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <ICONS.Wallet className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-medium opacity-90">Общий бюджет</div>
                  <div className="text-xs opacity-70">
                    {budgets.length} {budgets.length === 1 ? 'категория' : budgets.length < 5 ? 'категории' : 'категорий'}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold mb-1">
                  {totalPlannedBudget.toLocaleString()} {currencySymbol}
                </div>
                <div className="text-sm opacity-80">
                  {totalSpentOnBudgets.toLocaleString()} {currencySymbol} потрачено
                </div>
              </div>
            </div>

            {/* Прогресс бар */}
            <div className="mb-4">
              <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
                <div
                  className="bg-white/80 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
                />
              </div>
            </div>

            {/* Детальная информация */}
            <div className={`transition-all duration-300 ${showDetails ? 'opacity-100 max-h-20' : 'opacity-80 max-h-6'}`}>
              {showDetails ? (
                <div className="flex justify-between text-sm">
                  <div>
                    <div className="opacity-80">Потрачено</div>
                    <div className="font-semibold">{totalSpentOnBudgets.toLocaleString()} {currencySymbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="opacity-80">Осталось</div>
                    <div className="font-semibold">
                      {isOverBudget ? '0' : remainingBudget.toLocaleString()} {currencySymbol}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    Потрачено: {totalSpentOnBudgets.toLocaleString()} {currencySymbol}
                  </div>
                  <div className="text-sm">
                    Осталось: {isOverBudget ? '0' : remainingBudget.toLocaleString()} {currencySymbol}
                  </div>
                  <ICONS.ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Основной контент */}
      <div className="px-6 py-6 space-y-6">
        
        {/* Предупреждения о критических бюджетах */}
        {criticalBudgets.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 px-2">
              <ICONS.AlertTriangle className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Требуют внимания
              </h2>
            </div>
            {criticalBudgets.slice(0, 2).map(budget => {
              const spent = getSpentAmount(budget.category);
              const progress = (spent / budget.limit) * 100;
              const isOver = spent > budget.limit;

              return (
                <motion.div 
                  key={`critical-${budget.id}`} 
                  className={`p-4 rounded-2xl border-2 ${
                    isOver 
                      ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
                      : 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
                  }`}
                  variants={zoomInOut}
                  whileInView="whileInView"
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${isOver ? 'bg-red-500' : 'bg-orange-500'}`} />
                      <span className="font-medium text-gray-900 dark:text-gray-100">{budget.category}</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${
                        isOver ? 'text-red-700 dark:text-red-400' : 'text-orange-700 dark:text-orange-400'
                      }`}>
                        {progress.toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {spent.toLocaleString()} / {budget.limit.toLocaleString()} {currencySymbol}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Список всех бюджетов */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Все категории
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {budgets.length} из ∞
            </div>
          </div>

          <div className="space-y-4">
            {budgets.length > 0 ? (
              sortedBudgets.map((budget, index) => {
                const spent = getSpentAmount(budget.category);
                const progress = (spent / budget.limit) * 100;
                const isOver = spent > budget.limit;
                const remaining = budget.limit - spent;

                return (
                  <motion.div 
                    key={budget.id} 
                    className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                    whileTap={whileTap}
                    whileHover={whileHover}
                    transition={spring}
                    variants={zoomInOut}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: false, amount: 0.2 }}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          isOver 
                            ? 'bg-red-100 dark:bg-red-900/30' 
                            : progress > 80 
                              ? 'bg-orange-100 dark:bg-orange-900/30'
                              : 'bg-blue-100 dark:bg-blue-900/30'
                        }`}>
                          <ICONS.TrendingUp className={`w-6 h-6 ${
                            isOver 
                              ? 'text-red-600 dark:text-red-400' 
                              : progress > 80 
                                ? 'text-orange-600 dark:text-orange-400'
                                : 'text-blue-600 dark:text-blue-400'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{budget.category}</h3>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {isOver 
                              ? `Превышение на ${(spent - budget.limit).toLocaleString()} ${currencySymbol}`
                              : `Осталось ${remaining.toLocaleString()} ${currencySymbol}`
                            }
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => {
                            setEditingBudget(budget);
                            setShowAddBudgetModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
                          whileTap={whileTap}
                          transition={spring}
                        >
                          <ICONS.Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteBudget(budget.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                          whileTap={whileTap}
                          transition={spring}
                        >
                          <ICONS.Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Прогресс и суммы */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {spent.toLocaleString()} {currencySymbol}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            из {budget.limit.toLocaleString()} {currencySymbol}
                          </div>
                        </div>
                        <div className={`text-right ${
                          isOver 
                            ? 'text-red-500' 
                            : progress > 80 
                              ? 'text-orange-500'
                              : 'text-green-500'
                        }`}>
                          <div className="text-lg font-semibold">
                            {progress.toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            isOver 
                              ? 'bg-gradient-to-r from-red-500 to-red-600' 
                              : progress > 80 
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                                : 'bg-gradient-to-r from-green-500 to-green-600'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
                variants={zoomInOut}
                whileInView="whileInView"
                viewport={{ once: false, amount: 0.2 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                  <ICONS.Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Создайте первый бюджет
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  Планируйте расходы по категориям и контролируйте свои финансы
                </p>
                <motion.button
                  onClick={() => {
                    setShowAddBudgetModal(true);
                    setEditingBudget(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-medium shadow-lg shadow-blue-500/20"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  transition={spring}
                >
                  Добавить бюджет
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanningScreen;