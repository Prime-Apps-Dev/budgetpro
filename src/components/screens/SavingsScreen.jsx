// src/components/screens/SavingsScreen.jsx
import React, { useState } from 'react';
import { ICONS } from '../icons';
import { motion } from 'framer-motion';
import { whileTap, whileHover, spring, zoomInOut } from '../../utils/motion';

const SavingsScreen = ({ financialGoals, setFinancialGoals, transactions, setTransactions, totalSavingsBalance }) => {
  const [savingsAction, setSavingsAction] = useState(null);
  const [savingsAmount, setSavingsAmount] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(null);

  const savingsGoals = financialGoals.filter(goal => goal.isSavings);

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
      date: new Date().toISOString().split('T')[0],
      description: type === 'deposit' ? `Пополнение копилки "${selectedGoal.title}"` : `Снятие с копилки "${selectedGoal.title}"`
    };

    setTransactions([...transactions, mainTransaction]);

    setSavingsAmount('');
    setSavingsAction(null);
    setSelectedGoal(null);
  };

  if (savingsAction) {
    return (
      <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
        <div className="flex items-center mb-8">
          <motion.button
            onClick={() => setSavingsAction(null)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            whileTap={whileTap}
            transition={spring}
          >
            <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
          </motion.button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {savingsAction === 'deposit' ? 'Пополнить копилку' : 'Снять с копилки'}
          </h2>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Выберите цель</label>
            <div className="space-y-3">
              {savingsGoals.map(goal => (
                <motion.button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal)}
                  className={`w-full p-4 rounded-xl border-2 text-left ${
                    selectedGoal?.id === goal.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 bg-white dark:bg-gray-800'
                  }`}
                  whileTap={whileTap}
                  transition={spring}
                >
                  <div className="font-medium">{goal.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{goal.current.toLocaleString()} ₽ из {goal.target.toLocaleString()} ₽</div>
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Сумма</label>
            <input
              type="number"
              value={savingsAmount}
              onChange={(e) => setSavingsAmount(e.target.value)}
              placeholder="0"
              className="w-full p-4 border border-gray-300 rounded-2xl text-xl font-semibold text-center dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          <motion.button
            onClick={() => handleSavingsTransaction(savingsAction)}
            disabled={!selectedGoal || !savingsAmount}
            className={`w-full p-4 rounded-2xl font-semibold text-white ${
              !selectedGoal || !savingsAmount
                ? 'bg-gray-400'
                : savingsAction === 'deposit'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
            }`}
            whileTap={whileTap}
            transition={spring}
          >
            {savingsAction === 'deposit' ? 'Пополнить' : 'Снять'}
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 dark:text-gray-200">Копилка</h2>

      <motion.div
        className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 text-white mb-8"
        whileHover={whileHover}
        whileTap={whileTap}
        transition={spring}
        variants={zoomInOut}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <ICONS.PiggyBank className="w-8 h-8 mr-4" />
            <span className="text-lg">Общий баланс копилок</span>
          </div>
        </div>
        <div className="text-3xl font-bold">{totalSavingsBalance.toLocaleString()} ₽</div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.button
          onClick={() => setSavingsAction('deposit')}
          className="bg-green-500 text-white p-4 rounded-2xl font-semibold hover:bg-green-600 flex items-center justify-center"
          whileTap={whileTap}
          transition={spring}
        >
          <ICONS.Plus className="w-5 h-5 mr-2" />
          Пополнить
        </motion.button>
        <motion.button
          onClick={() => setSavingsAction('withdrawal')}
          className="bg-red-500 text-white p-4 rounded-2xl font-semibold hover:bg-red-600 flex items-center justify-center"
          whileTap={whileTap}
          transition={spring}
        >
          <ICONS.ArrowUpCircle className="w-5 h-5 mr-2" />
          Снять
        </motion.button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Ваши копилки</h3>
        {savingsGoals.map(goal => {
          const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
          return (
            <motion.div 
              key={goal.id} 
              className="bg-white rounded-2xl p-6 shadow-sm dark:bg-gray-800"
              variants={zoomInOut}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">{goal.title}</h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">{goal.deadline}</span>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-2 dark:text-gray-400">
                  <span>{goal.current.toLocaleString()} ₽</span>
                  <span>{goal.target.toLocaleString()} ₽</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div
                    className="bg-purple-500 h-3 rounded-full"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {progress.toFixed(1)}% достигнуто
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SavingsScreen;