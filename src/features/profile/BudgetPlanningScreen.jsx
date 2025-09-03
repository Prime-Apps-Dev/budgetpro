// src/features/profile/BudgetPlanningScreen.jsx
import React, { useState, useMemo } from 'react';
import { ICONS } from '../../components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { spring, whileTap, whileHover, zoomInOut } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import BudgetCard from '../../components/ui/BudgetCard'; // Импортируем новый компонент
import AlertModal from '../../components/modals/AlertModal'; // Импортируем модальное окно

/**
 * Компонент экрана "Планирование бюджета" с месячной фильтрацией и улучшенным дизайном.
 * Позволяет пользователю создавать, редактировать и удалять бюджеты по категориям для каждого месяца.
 * @returns {JSX.Element}
 */
const BudgetPlanningScreen = () => {
  const {
    budgets,
    setBudgets,
    getFilteredTransactions,
    goBack,
    currencySymbol,
    setShowAddBudgetModal,
    setEditingBudget,
    transactions,
    categories,
    setShowBudgetTransactionsModal,
    setSelectedBudgetForTransactions,
    setShowAddTransaction,
    setPrefilledTransaction
  } = useAppContext();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWidgetIndex, setCurrentWidgetIndex] = useState(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);

  // Получаем ключ для текущего месяца
  const currentMonthKey = useMemo(() => `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`, [selectedDate]);

  // Лог: Текущий выбранный месяц
  console.log('🗓️ BudgetPlanningScreen: Текущий месяц:', currentMonthKey);

  // Фильтруем бюджеты для текущего месяца
  const monthlyBudgets = useMemo(() => {
    const filtered = budgets.filter(budget => budget.monthKey === currentMonthKey);
    console.log('📊 BudgetPlanningScreen: Отфильтрованные бюджеты для текущего месяца:', filtered);
    return filtered;
  }, [budgets, currentMonthKey]);

  // Фильтруем транзакции для текущего месяца
  const monthlyTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear() === selectedDate.getFullYear() &&
             transactionDate.getMonth() === selectedDate.getMonth();
    });
  }, [transactions, selectedDate]);

  /**
   * Рассчитывает потраченную сумму по заданной категории за выбранный месяц.
   * @param {string} category - Имя категории.
   * @returns {number} - Сумма расходов.
   */
  const getSpentAmount = (category) => {
    return monthlyTransactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  /**
   * Переключает месяц
   * @param {number} direction - Направление: -1 для предыдущего, 1 для следующего месяца
   */
  const changeMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  // Расчеты для текущего месяца
  const totalPlannedBudget = monthlyBudgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpentOnBudgets = monthlyBudgets.reduce((sum, budget) => sum + getSpentAmount(budget.category), 0);
  const remainingBudget = totalPlannedBudget - totalSpentOnBudgets;
  const budgetUsagePercent = totalPlannedBudget > 0 ? (totalSpentOnBudgets / totalPlannedBudget) * 100 : 0;
  const isOverBudget = totalSpentOnBudgets > totalPlannedBudget;

  // Сортировка бюджетов: критические сверху
  const sortedBudgets = useMemo(() => {
    return [...monthlyBudgets].sort((a, b) => {
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
  }, [monthlyBudgets, monthlyTransactions]);

  // Виджеты для свайпа
  const widgets = [
    {
      id: 'overview',
      title: 'Обзор бюджета',
      component: () => (
        <div className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-xl ${
          isOverBudget
            ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-red-500/20'
            : remainingBudget < totalPlannedBudget * 0.2
              ? 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 shadow-orange-500/20'
              : 'bg-gradient-to-br from-green-500 via-green-600 to-green-700 shadow-green-500/20'
        }`}>
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
                    {monthlyBudgets.length} {monthlyBudgets.length === 1 ? 'категория' : monthlyBudgets.length < 5 ? 'категории' : 'категорий'}
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

            <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm mb-4">
              <div
                className="bg-white/80 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-sm">
              <div>
                <div className="opacity-80">Использовано</div>
                <div className="font-semibold">{Math.round(budgetUsagePercent)}%</div>
              </div>
              <div className="text-right">
                <div className="opacity-80">Осталось</div>
                <div className="font-semibold">
                  {isOverBudget ? '0' : remainingBudget.toLocaleString()} {currencySymbol}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'categories',
      title: 'По категориям',
      component: () => (
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <ICONS.BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-medium opacity-90">Активные категории</div>
                  <div className="text-xs opacity-70">в этом месяце</div>
                </div>
              </div>
              <div className="text-2xl font-bold">
                {monthlyBudgets.length}
              </div>
            </div>

            <div className="space-y-2">
              {monthlyBudgets.slice(0, 3).map(budget => {
                const spent = getSpentAmount(budget.category);
                const progress = (spent / budget.limit) * 100;

                return (
                  <div key={budget.id} className="flex items-center justify-between text-sm">
                    <span className="opacity-90">{budget.category}</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                );
              })}
              {monthlyBudgets.length > 3 && (
                <div className="text-xs opacity-70 text-center pt-2">
                  и ещё {monthlyBudgets.length - 3} категорий
                </div>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'progress',
      title: 'Прогресс',
      component: () => (
        <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl shadow-purple-500/20">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <ICONS.Target className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-medium opacity-90">Достижения</div>
                  <div className="text-xs opacity-70">за месяц</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Выполнено целей</span>
                <span className="font-bold">
                  {monthlyBudgets.filter(b => {
                    const spent = getSpentAmount(b.category);
                    const progress = (spent / b.limit) * 100;
                    return progress >= 90 && progress <= 100;
                  }).length} / {monthlyBudgets.length}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Средний прогресс</span>
                <span className="font-bold">
                  {monthlyBudgets.length > 0
                    ? Math.round(monthlyBudgets.reduce((sum, b) => {
                        const spent = getSpentAmount(b.category);
                        return sum + (spent / b.limit) * 100;
                      }, 0) / monthlyBudgets.length)
                    : 0
                  }%
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextWidget = () => {
    setCurrentWidgetIndex((prev) => (prev + 1) % widgets.length);
  };

  const prevWidget = () => {
    setCurrentWidgetIndex((prev) => (prev - 1 + widgets.length) % widgets.length);
  };

  /**
   * Обрабатывает удаление бюджета.
   */
  const handleDeleteBudget = (budget) => {
    setBudgetToDelete(budget);
    setShowConfirmDelete(true);
  };

  /**
   * Обрабатывает подтверждение удаления.
   */
  const handleConfirmDelete = () => {
    if (budgetToDelete) {
      setBudgets(budgets.filter(b => b.id !== budgetToDelete.id));
    }
    setShowConfirmDelete(false);
    setBudgetToDelete(null);
  };

  /**
   * Отменяет удаление.
   */
  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setBudgetToDelete(null);
  };
  
  /**
   * Обрабатывает двойное нажатие на карточку бюджета.
   */
  const handleBudgetDoubleTap = (budget) => {
    setSelectedBudgetForTransactions(budget);
    setShowBudgetTransactionsModal(true);
  };
  
  /**
   * Обрабатывает короткое нажатие на карточку бюджета.
   * @param {object} budget - Объект бюджета, на который нажали.
   */
  const handleBudgetTap = (budget) => {
    const prefilled = {
      type: 'expense',
      amount: '',
      category: budget.category,
      account: 'Основной',
      date: new Date().toISOString().split('T')[0],
      description: `Расход по бюджету: ${budget.category}`
    };
    setPrefilledTransaction(prefilled);
    setShowAddTransaction(true);
  };


  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
        {/* Header в стиле HomeScreen */}
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
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <ICONS.Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Планирование бюджета
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Контролируйте расходы по категориям
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Навигация по месяцам */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 dark:border-gray-700/50 mb-6">
            <div className="flex items-center justify-between">
              <motion.button
                onClick={() => changeMonth(-1)}
                className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                whileTap={whileTap}
                transition={spring}
              >
                <ICONS.ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>

              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {selectedDate.toLocaleDateString('ru-RU', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {monthlyBudgets.length} категорий запланировано
                </div>
              </div>

              <motion.button
                onClick={() => changeMonth(1)}
                className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                whileTap={whileTap}
                transition={spring}
              >
                <ICONS.ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>
          </div>

          {/* Свайповые виджеты в стиле iOS */}
          <div className="relative">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentWidgetIndex * 100}%)` }}
            >
              {widgets.map((widget, index) => (
                <div key={widget.id} className="w-full flex-shrink-0 pr-4 last:pr-0">
                  <motion.div
                    className="relative"
                    variants={zoomInOut}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: false, amount: 0.2 }}
                  >
                    {widget.component()}
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Индикаторы виджетов */}
            <div className="flex justify-center space-x-2 mt-4">
              {widgets.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentWidgetIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentWidgetIndex
                      ? 'bg-blue-500 w-6'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
            </div>

            {/* Невидимые области для свайпа */}
            <div
              className="absolute left-0 top-0 w-16 h-full cursor-pointer"
              onClick={prevWidget}
            />
            <div
              className="absolute right-0 top-0 w-16 h-full cursor-pointer"
              onClick={nextWidget}
            />
          </div>
        </div>

        {/* Основной контент */}
        <div className="px-6 py-6 space-y-6">

          {/* Критические предупреждения */}
          {sortedBudgets.some(budget => {
            const spent = getSpentAmount(budget.category);
            const progress = (spent / budget.limit) * 100;
            return progress > 100;
          }) && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 px-2">
                <ICONS.AlertTriangle className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Превышение бюджета
                </h2>
              </div>
              {sortedBudgets
                .filter(budget => {
                  const spent = getSpentAmount(budget.category);
                  return (spent / budget.limit) * 100 > 100;
                })
                .slice(0, 3)
                .map(budget => {
                  const spent = getSpentAmount(budget.category);
                  const progress = (spent / budget.limit) * 100;
                  const excess = spent - budget.limit;

                  return (
                    <motion.div
                      key={`critical-${budget.id}`}
                      className={`p-4 rounded-2xl border-2 ${
                        progress > 125
                          ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                          : 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
                      }`}
                      variants={zoomInOut}
                      whileInView="whileInView"
                      viewport={{ once: false, amount: 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            progress > 125 ? 'bg-red-500' : 'bg-orange-500'
                          }`} />
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {budget.category}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-semibold ${
                            progress > 125
                              ? 'text-red-700 dark:text-red-400'
                              : 'text-orange-700 dark:text-orange-400'
                          }`}>
                            +{excess.toLocaleString()} {currencySymbol}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {Math.round(progress)}% от лимита
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
                Категории бюджета
              </h2>
              <motion.button
                onClick={() => {
                  console.log('➡️ BudgetPlanningScreen: Нажата кнопка "Добавить". Открываем модальное окно. Передаем monthKey:', currentMonthKey);
                  setShowAddBudgetModal(true);
                  setEditingBudget({ monthKey: currentMonthKey });
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/20"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                transition={spring}
              >
                Добавить
              </motion.button>
            </div>

            <div className="space-y-3">
              {monthlyBudgets.length > 0 ? (
                sortedBudgets.map((budget, index) => {
                  const spent = getSpentAmount(budget.category);
                  const progress = (spent / budget.limit) * 100;
                  return (
                    <BudgetCard
                      key={budget.id}
                      budget={budget}
                      spent={spent}
                      progress={progress}
                      currencySymbol={currencySymbol}
                      onEdit={() => {
                        console.log('➡️ BudgetPlanningScreen: Нажата кнопка "Редактировать". Открываем модальное окно. Передаем бюджет:', budget);
                        setEditingBudget({ ...budget, monthKey: currentMonthKey });
                        setShowAddBudgetModal(true);
                      }}
                      onDelete={handleDeleteBudget}
                      onDoubleTap={handleBudgetDoubleTap}
                      onTap={handleBudgetTap}
                    />
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
                    <ICONS.Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Создайте бюджет для {selectedDate.toLocaleDateString('ru-RU', { month: 'long' })}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    Планируйте расходы по категориям и достигайте финансовых целей
                  </p>
                  <motion.button
                    onClick={() => {
                      console.log('➡️ BudgetPlanningScreen: Нажата кнопка "Создать бюджет". Открываем модальное окно. Передаем monthKey:', currentMonthKey);
                      setShowAddBudgetModal(true);
                      setEditingBudget({ monthKey: currentMonthKey });
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-medium shadow-lg shadow-blue-500/20"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    transition={spring}
                  >
                    Создать бюджет
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Быстрая статистика за месяц */}
          {monthlyBudgets.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 px-2">
                Статистика месяца
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                  variants={zoomInOut}
                  whileInView="whileInView"
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <ICONS.Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Выполнено</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {monthlyBudgets.filter(b => {
                          const spent = getSpentAmount(b.category);
                          const progress = (spent / b.limit) * 100;
                          return progress >= 90 && progress <= 100;
                        }).length}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    целей достигнуто
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                  variants={zoomInOut}
                  whileInView="whileInView"
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <ICONS.TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Средний</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {monthlyBudgets.length > 0
                          ? Math.round(monthlyBudgets.reduce((sum, b) => {
                              const spent = getSpentAmount(b.category);
                              return sum + (spent / b.limit) * 100;
                            }, 0) / monthlyBudgets.length)
                          : 0
                        }%
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    прогресс по целям
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Топ категории по расходам */}
          {monthlyTransactions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 px-2">
                Топ расходов
              </h2>

              <div className="space-y-3">
                {Object.entries(
                  monthlyTransactions
                    .filter(t => t.type === 'expense')
                    .reduce((acc, t) => {
                      acc[t.category] = (acc[t.category] || 0) + t.amount;
                      return acc;
                    }, {})
                )
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([category, amount], index) => {
                    const budget = monthlyBudgets.find(b => b.category === category);
                    const hasLimitReached = budget && (amount / budget.limit) * 100 >= 90;

                    return (
                      <motion.div
                        key={category}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                        variants={zoomInOut}
                        whileInView="whileInView"
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              hasLimitReached ? 'bg-orange-500' : 'bg-blue-500'
                            }`} />
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {category}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                              {amount.toLocaleString()} {currencySymbol}
                            </div>
                            {budget && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {Math.round((amount / budget.limit) * 100)}% от бюджета
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
      <AlertModal
        isVisible={showConfirmDelete}
        title="Удалить бюджет?"
        message={`Бюджет на категорию "${budgetToDelete?.category}" будет удален безвозвратно. Это действие нельзя отменить.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default BudgetPlanningScreen;