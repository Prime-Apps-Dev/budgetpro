// src/pages/AnalyticsScreen.jsx
import React, { useMemo } from 'react';
import PieChartComponent from '../components/ui/PieChartComponent';
import { ICONS } from '../components/icons';
import { motion } from 'framer-motion';
import { whileTap, whileHover, spring, zoomInOut } from '../utils/motion';
import { useAppContext } from '../context/AppContext';

/**
 * Переработанный компонент экрана аналитики в стиле главной страницы.
 * Предоставляет персонализированную аналитику с рекомендациями и insights.
 * @returns {JSX.Element}
 */
const AnalyticsScreen = () => {
  const {
    categories,
    getFilteredTransactions,
    totalIncome,
    totalExpenses,
    totalBudget,
    selectedPeriod,
    setSelectedPeriod,
    dateRange,
    setDateRange,
    currencySymbol,
    transactions,
    userProfile
  } = useAppContext();
  
  // Используем useMemo для кэширования результатов фильтрации.
  const filteredTransactions = useMemo(() => getFilteredTransactions(), [getFilteredTransactions]);

  // Используем useMemo для мемоизации расчетов расходов по категориям
  const expensesByCategory = useMemo(() => {
    return categories.expense.map(cat => ({
      name: cat.name,
      value: filteredTransactions.filter(t => t.type === 'expense' && t.category === cat.name)
        .reduce((sum, t) => sum + t.amount, 0)
    })).filter(item => item.value > 0);
  }, [categories.expense, filteredTransactions]);

  // Используем useMemo для мемоизации расчетов доходов по категориям
  const incomeByCategory = useMemo(() => {
    return categories.income.map(cat => ({
      name: cat.name,
      value: filteredTransactions.filter(t => t.type === 'income' && t.category === cat.name)
        .reduce((sum, t) => sum + t.amount, 0)
    })).filter(item => item.value > 0);
  }, [categories.income, filteredTransactions]);

  // Расчет персональных insights и рекомендаций
  const insights = useMemo(() => {
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;
    
    // Находим самую затратную категорию
    const topExpenseCategory = expensesByCategory.reduce((max, cat) => 
      cat.value > max.value ? cat : max, { name: '', value: 0 }
    );
    
    // Находим основной источник дохода
    const topIncomeCategory = incomeByCategory.reduce((max, cat) => 
      cat.value > max.value ? cat : max, { name: '', value: 0 }
    );

    // Анализ трендов (сравнение с предыдущим периодом - упрощенно)
    const avgTransaction = filteredTransactions.length > 0 
      ? (totalIncome + totalExpenses) / filteredTransactions.length 
      : 0;

    return {
      balance,
      savingsRate,
      topExpenseCategory,
      topIncomeCategory,
      avgTransaction,
      totalTransactions: filteredTransactions.length,
      expenseToIncomeRatio: totalIncome > 0 ? (totalExpenses / totalIncome * 100) : 0
    };
  }, [totalIncome, totalExpenses, expensesByCategory, incomeByCategory, filteredTransactions]);

  // Генерация персонализированных рекомендаций
  const recommendations = useMemo(() => {
    const recs = [];
    
    if (insights.savingsRate < 10) {
      recs.push({
        type: 'warning',
        icon: 'AlertTriangle',
        title: 'Низкий уровень сбережений',
        description: `Ваш уровень сбережений ${insights.savingsRate.toFixed(1)}%. Рекомендуем откладывать не менее 10% дохода.`,
        action: 'Создать цель сбережений'
      });
    } else if (insights.savingsRate > 30) {
      recs.push({
        type: 'success',
        icon: 'TrendingUp',
        title: 'Отличная финансовая дисциплина!',
        description: `Вы откладываете ${insights.savingsRate.toFixed(1)}% дохода. Это превосходный результат!`,
        action: 'Рассмотрите инвестиции'
      });
    }

    if (insights.topExpenseCategory.value > totalIncome * 0.3) {
      recs.push({
        type: 'warning',
        icon: 'AlertCircle',
        title: 'Высокие расходы на одну категорию',
        description: `${insights.topExpenseCategory.name} занимает ${((insights.topExpenseCategory.value / totalExpenses) * 100).toFixed(1)}% всех расходов.`,
        action: 'Оптимизировать расходы'
      });
    }

    if (insights.expenseToIncomeRatio > 90) {
      recs.push({
        type: 'danger',
        icon: 'AlertOctagon',
        title: 'Критический уровень расходов',
        description: 'Вы тратите более 90% дохода. Срочно необходимо сократить расходы.',
        action: 'Создать план экономии'
      });
    }

    if (recs.length === 0) {
      recs.push({
        type: 'success',
        icon: 'Check',
        title: 'Ваши финансы в порядке',
        description: 'Продолжайте следить за балансом доходов и расходов.',
        action: 'Установить новые цели'
      });
    }

    return recs;
  }, [insights, totalIncome, totalExpenses]);

  const expenseColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];
  const incomeColors = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'];

  // Получаем название периода
  const getPeriodName = () => {
    if (dateRange.start && dateRange.end) return 'Выбранный период';
    switch (selectedPeriod) {
      case 'week': return 'эту неделю';
      case 'month': return 'этот месяц';
      case 'quarter': return 'этот квартал';
      case 'year': return 'этот год';
      default: return 'выбранный период';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      {/* Персонализированный header */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                {ICONS.BarChart3 && <ICONS.BarChart3 className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Аналитика, {userProfile?.name?.split(' ')[0] || 'Пользователь'}!
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Анализ за {getPeriodName()}
                </p>
              </div>
            </div>
          </div>
          <motion.div
            className="text-right"
            variants={zoomInOut}
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Уровень сбережений</div>
            <div className={`text-2xl font-bold ${
              insights.savingsRate >= 20 ? 'text-green-600 dark:text-green-400' : 
              insights.savingsRate >= 10 ? 'text-yellow-600 dark:text-yellow-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {insights.savingsRate.toFixed(1)}%
            </div>
          </motion.div>
        </div>
        
        {/* Быстрая сводка */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 dark:border-gray-700/50">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Операций</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {insights.totalTransactions}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Средний чек</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {insights.avgTransaction.toLocaleString()} {currencySymbol}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Баланс</div>
              <div className={`text-lg font-semibold ${
                insights.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {insights.balance >= 0 ? '+' : ''}{insights.balance.toLocaleString()} {currencySymbol}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="px-6 py-6 space-y-6">
        
        {/* Персональные рекомендации */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 px-2">
            Персональные рекомендации
          </h2>
          
          <div className="space-y-3">
            {recommendations.map((rec, index) => {
              const IconComponent = ICONS[rec.icon];
              return (
                <motion.div
                  key={index}
                  className={`relative overflow-hidden p-4 rounded-3xl text-white shadow-lg ${
                    rec.type === 'success' ? 'bg-gradient-to-br from-green-500 via-green-600 to-green-700 shadow-green-500/20' :
                    rec.type === 'warning' ? 'bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 shadow-yellow-500/20' :
                    rec.type === 'danger' ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-red-500/20' :
                    'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-blue-500/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={whileTap}
                  transition={spring}
                  variants={zoomInOut}
                  whileInView="whileInView"
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm mr-3">
                          {IconComponent && <IconComponent className="w-5 h-5" />}
                        </div>
                        <div className="font-semibold">{rec.title}</div>
                      </div>
                      <p className="text-sm opacity-90 mb-3">{rec.description}</p>
                      <div className="text-xs font-medium opacity-80 bg-white/20 rounded-xl px-3 py-1 inline-block">
                        {rec.action}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Период анализа */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          variants={zoomInOut}
          whileInView="whileInView"
          viewport={{ once: false, amount: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Период анализа</h3>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {['week', 'month', 'quarter', 'year'].map(period => (
              <motion.button
                key={period}
                onClick={() => {
                  setSelectedPeriod(period);
                  setDateRange({ start: '', end: '' });
                }}
                className={`p-3 rounded-2xl text-sm font-medium transition-colors ${
                  selectedPeriod === period && !dateRange.start
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                whileTap={whileTap}
                whileHover={{ scale: 1.05 }}
                transition={spring}
              >
                {period === 'week' ? 'Неделя' : period === 'month' ? 'Месяц' : period === 'quarter' ? 'Квартал' : 'Год'}
              </motion.button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">От</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-2xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">До</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-2xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Аналитические диаграммы */}
        <div className="space-y-6">
          {expensesByCategory.length > 0 && (
            <motion.div variants={zoomInOut} whileInView="whileInView" viewport={{ once: false, amount: 0.2 }}>
              <PieChartComponent
                data={expensesByCategory}
                title="Структура расходов"
                colors={expenseColors}
                currencySymbol={currencySymbol}
              />
            </motion.div>
          )}

          {incomeByCategory.length > 0 && (
            <motion.div variants={zoomInOut} whileInView="whileInView" viewport={{ once: false, amount: 0.2 }}>
              <PieChartComponent
                data={incomeByCategory}
                title="Структура доходов"
                colors={incomeColors}
                currencySymbol={currencySymbol}
              />
            </motion.div>
          )}
        </div>

        {/* Детальная сводка */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          variants={zoomInOut}
          whileInView="whileInView"
          viewport={{ once: false, amount: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Детальная сводка</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Общий доход</span>
              </div>
              <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                +{totalIncome.toLocaleString()} {currencySymbol}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Общий расход</span>
              </div>
              <span className="font-bold text-red-600 dark:text-red-400 text-lg">
                -{totalExpenses.toLocaleString()} {currencySymbol}
              </span>
            </div>
            
            <div className="h-px bg-gray-200 dark:bg-gray-600 my-4"></div>
            
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  insights.balance >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Итоговый баланс</span>
              </div>
              <span className={`font-bold text-lg ${
                insights.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {insights.balance >= 0 ? '+' : ''}{insights.balance.toLocaleString()} {currencySymbol}
              </span>
            </div>

            {insights.topExpenseCategory.name && (
              <div className="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
                <div className="flex items-center">
                  {ICONS.TrendingDown && <ICONS.TrendingDown className="w-4 h-4 text-orange-500 mr-3" />}
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Топ расходов: {insights.topExpenseCategory.name}</span>
                </div>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {insights.topExpenseCategory.value.toLocaleString()} {currencySymbol}
                </span>
              </div>
            )}

            {insights.topIncomeCategory.name && (
              <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                <div className="flex items-center">
                  {ICONS.TrendingUp && <ICONS.TrendingUp className="w-4 h-4 text-blue-500 mr-3" />}
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Топ доходов: {insights.topIncomeCategory.name}</span>
                </div>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {insights.topIncomeCategory.value.toLocaleString()} {currencySymbol}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Пустое состояние */}
        {filteredTransactions.length === 0 && (
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
            variants={zoomInOut}
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              {ICONS.BarChart3 && <ICONS.BarChart3 className="w-8 h-8 text-gray-400" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Нет данных для анализа
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Добавьте транзакции или измените период для отображения аналитики
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsScreen;