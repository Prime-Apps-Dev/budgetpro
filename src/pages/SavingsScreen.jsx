// src/pages/SavingsScreen.jsx
import React, { useState } from 'react';
import { ICONS } from '../components/icons';
import { motion } from 'framer-motion';
import { whileTap, whileHover, spring, zoomInOut } from '../utils/motion';
import { useAppContext } from '../context/AppContext';

/**
 * Переработанный компонент экрана "Копилка" в стиле HomeScreen и ProfileScreen.
 * @returns {JSX.Element}
 */
const SavingsScreen = () => {
  const {
    financialGoals,
    setFinancialGoals,
    transactions,
    setTransactions,
    totalSavingsBalance,
    currencySymbol,
    setShowAddFinancialGoalModal
  } = useAppContext();
  
  const [savingsAction, setSavingsAction] = useState(null);
  const [savingsAmount, setSavingsAmount] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(null);

  const savingsGoals = financialGoals.filter(goal => goal.isSavings);

  /**
   * Обрабатывает транзакцию пополнения или снятия средств с копилки.
   */
  const handleSavingsTransaction = (type) => {
    if (!savingsAmount || parseFloat(savingsAmount) <= 0 || !selectedGoal) return;

    const amount = parseFloat(savingsAmount);
    const updatedGoals = financialGoals.map(goal => {
      if (goal.id === selectedGoal.id) {
        const newCurrent = type === 'deposit'
          ? goal.current + amount
          : Math.max(0, goal.current - amount);
        return { ...goal, current: newCurrent };
      }
      return goal;
    });

    setFinancialGoals(updatedGoals);

    const mainTransaction = {
      id: Date.now(),
      type: type === 'deposit' ? 'expense' : 'income',
      amount: amount,
      category: type === 'deposit' ? 'В копилку' : 'С копилки',
      account: 'Основной',
      date: new Date().toISOString(),
      description: type === 'deposit' ? `Пополнение копилки "${selectedGoal.title}"` : `Снятие с копилки "${selectedGoal.title}"`
    };

    setTransactions([...transactions, mainTransaction]);
    setSavingsAmount('');
    setSavingsAction(null);
    setSelectedGoal(null);
  };

  // Находим ближайшую к завершению копилку
  const nearestGoal = savingsGoals
    .filter(g => g.current < g.target)
    .sort((a, b) => (b.current / b.target) - (a.current / a.target))[0];

  // Вычисляем недостающую сумму до ближайшей цели
  const nextMilestone = nearestGoal ? nearestGoal.target - nearestGoal.current : 0;

  if (savingsAction) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 px-6 py-8">
          <div className="flex items-center mb-4">
            <motion.button
              onClick={() => setSavingsAction(null)}
              className="mr-4 p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50"
              whileTap={whileTap}
              transition={spring}
            >
              <ICONS.ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </motion.button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {savingsAction === 'deposit' ? 'Пополнить копилку' : 'Снять с копилки'}
            </h1>
          </div>
        </div>

        {/* Форма */}
        <div className="px-6 py-6 space-y-6">
          <motion.div
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50"
            variants={zoomInOut}
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-300">
                  Выберите копилку
                </label>
                <div className="space-y-3">
                  {savingsGoals.map(goal => {
                    const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                    return (
                      <motion.button
                        key={goal.id}
                        onClick={() => setSelectedGoal(goal)}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                          selectedGoal?.id === goal.id
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        whileTap={whileTap}
                        transition={spring}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900 dark:text-gray-100">{goal.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{progress.toFixed(0)}%</div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {goal.current.toLocaleString()} из {goal.target.toLocaleString()} {currencySymbol}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-300">
                  Сумма
                </label>
                <input
                  type="number"
                  value={savingsAmount}
                  onChange={(e) => setSavingsAmount(e.target.value)}
                  placeholder="0"
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl text-xl font-semibold text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <motion.button
                onClick={() => handleSavingsTransaction(savingsAction)}
                disabled={!selectedGoal || !savingsAmount}
                className={`w-full p-4 rounded-2xl font-semibold text-white transition-all ${
                  !selectedGoal || !savingsAmount
                    ? 'bg-gray-400 cursor-not-allowed'
                    : savingsAction === 'deposit'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                }`}
                whileTap={whileTap}
                whileHover={!selectedGoal || !savingsAmount ? {} : { scale: 1.02 }}
                transition={spring}
              >
                {savingsAction === 'deposit' ? 'Пополнить копилку' : 'Снять средства'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      {/* Header секция */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Копилка
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {totalSavingsBalance.toLocaleString()} {currencySymbol} накоплено
          </p>
        </div>

        {/* Персонализированная карточка */}
        {nearestGoal ? (
          <motion.div
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50"
            variants={zoomInOut}
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-3 bg-purple-500/20 rounded-2xl mr-4">
                  <ICONS.Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Ближайшая цель</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {nearestGoal.title}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">Осталось</div>
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {nextMilestone.toLocaleString()} {currencySymbol}
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>{nearestGoal.current.toLocaleString()} {currencySymbol}</span>
                <span>{nearestGoal.target.toLocaleString()} {currencySymbol}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-purple-500 transition-all duration-300"
                  style={{ width: `${Math.min((nearestGoal.current / nearestGoal.target) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {((nearestGoal.current / nearestGoal.target) * 100).toFixed(1)}% выполнено
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50 text-center"
            variants={zoomInOut}
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <ICONS.PiggyBank className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Создайте свою первую копилку
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Начните копить на важные цели уже сегодня
            </p>
          </motion.div>
        )}
      </div>

      {/* Основной контент */}
      <div className="px-6 py-6 space-y-6">
        
        {/* Список копилок */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Все копилки
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {savingsGoals.length} активных
            </span>
          </div>
          
          <div className="space-y-3">
            {savingsGoals.length > 0 ? (
              savingsGoals.map((goal, index) => {
                const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                const isCompleted = progress >= 100;
                
                return (
                  <motion.div 
                    key={goal.id} 
                    className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700"
                    variants={zoomInOut}
                    whileInView="whileInView"
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mr-3 ${
                          isCompleted ? 'bg-green-100 dark:bg-green-900/30' : 'bg-purple-100 dark:bg-purple-900/30'
                        }`}>
                          <ICONS.PiggyBank className={`w-5 h-5 ${
                            isCompleted ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{goal.title}</h4>
                          {goal.deadline && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">до {goal.deadline}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {goal.current.toLocaleString()} {currencySymbol}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          из {goal.target.toLocaleString()} {currencySymbol}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isCompleted ? 'bg-green-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {progress.toFixed(1)}% достигнуто
                      </span>
                      {isCompleted && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-xs font-medium text-green-600 dark:text-green-400">
                          Выполнено
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 text-center"
                variants={zoomInOut}
                whileInView="whileInView"
                viewport={{ once: false, amount: 0.2 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <ICONS.PiggyBank className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Пока нет копилок
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  Создайте первую копилку для достижения ваших целей
                </p>
                <motion.button
                  onClick={() => setShowAddFinancialGoalModal(true)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                  whileTap={whileTap}
                  transition={spring}
                >
                  Добавить копилку
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Плавающая кнопка добавления */}
      <motion.button
        onClick={() => setShowAddFinancialGoalModal(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors z-10"
        whileTap={whileTap}
        whileHover={{ scale: 1.05 }}
        transition={spring}
      >
        <ICONS.Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default SavingsScreen;