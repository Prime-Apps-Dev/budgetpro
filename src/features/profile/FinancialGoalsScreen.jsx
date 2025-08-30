// src/features/profile/FinancialGoalsScreen.jsx
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { spring, whileTap, whileHover, zoomInOut } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import {
  SavingsWidget,
  DepositsWidget,
  LoansWidget,
  DebtsWidget
} from '../../components/widgets/FinancialWidgets';

/**
 * Компонент экрана "Финансовые цели" с улучшенным дизайном в стиле HomeScreen.
 * Единый хаб для управления всеми долгосрочными финансовыми продуктами.
 * Показывает кредиты, депозиты, долги и цели-копилки в красивом dashboard формате.
 * @returns {JSX.Element}
 */
const FinancialGoalsScreen = () => {
  const {
    goBack,
    navigateToScreen,
    currencySymbol,
    depositsWithBalance,
    loansWithBalance,
    debts,
    financialGoals,
    setShowAddDebtModal,
    setShowAddFinancialItemModal,
    setEditingDebt,
    setSelectedFinancialItem
  } = useAppContext();

  const savingsGoals = financialGoals.filter(goal => goal.isSavings);

  // Состояние для переключения виджетов
  const [activeWidgetIndex, setActiveWidgetIndex] = useState(0);

  const getProgress = (current, target) => {
    return target > 0 ? (current / target) * 100 : 0;
  };

  // Создаем массив доступных виджетов на основе данных
  const availableWidgets = [];

  if (savingsGoals.length > 0) {
    availableWidgets.push({
      type: 'savings',
      component: (
        <SavingsWidget
          goals={savingsGoals}
          currencySymbol={currencySymbol}
          onClick={() => navigateToScreen('savings')}
        />
      ),
      color: 'bg-purple-500'
    });
  }

  if (depositsWithBalance.length > 0) {
    availableWidgets.push({
      type: 'deposits',
      component: (
        <DepositsWidget
          deposits={depositsWithBalance}
          currencySymbol={currencySymbol}
          onClick={() => setSelectedFinancialItem(depositsWithBalance[0])}
        />
      ),
      color: 'bg-green-500'
    });
  }

  if (loansWithBalance.length > 0) {
    availableWidgets.push({
      type: 'loans',
      component: (
        <LoansWidget
          loans={loansWithBalance}
          currencySymbol={currencySymbol}
          onClick={() => setSelectedFinancialItem(loansWithBalance[0])}
        />
      ),
      color: 'bg-red-500'
    });
  }

  if (debts.length > 0) {
    availableWidgets.push({
      type: 'debts',
      component: (
        <DebtsWidget
          debts={debts}
          currencySymbol={currencySymbol}
          onClick={() => navigateToScreen('debts')}
        />
      ),
      color: 'bg-blue-500'
    });
  }

  // Анимации для переключения виджетов
  const widgetVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    if (availableWidgets.length <= 1) return;
    const newIndex = (activeWidgetIndex + newDirection + availableWidgets.length) % availableWidgets.length;
    setActiveWidgetIndex(newIndex);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      {/* Персонализированный header в стиле HomeScreen */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 px-6 py-8">
        <div className="flex items-center mb-6">
          <motion.button
            onClick={goBack}
            className="mr-4 p-2 rounded-2xl hover:bg-white/50 dark:hover:bg-gray-700/50 backdrop-blur-sm"
            whileTap={whileTap}
            transition={spring}
          >
            <ICONS.ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Финансовые цели
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Управление долгосрочными планами
            </p>
          </div>
        </div>

        {/* iOS-стиль переключающихся виджетов */}
        {availableWidgets.length > 0 ? (
          <motion.div
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6"
            variants={zoomInOut}
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Обзор финансов
              </h3>
              {availableWidgets.length > 1 && (
                <div className="flex items-center space-x-2">
                  {availableWidgets.map((widget, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setActiveWidgetIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${widget.color} ${index !== activeWidgetIndex ? 'opacity-40' : ''}`}
                      whileTap={whileTap}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Контейнер для переключающихся виджетов */}
            <div className="relative">
              <AnimatePresence initial={false} mode="wait" custom={activeWidgetIndex}>
                <motion.div
                  key={activeWidgetIndex}
                  custom={activeWidgetIndex}
                  variants={widgetVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                  className="w-full"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.8}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);

                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                >
                  {availableWidgets[activeWidgetIndex]?.component}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 text-center"
            variants={zoomInOut}
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <ICONS.Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Нет активных финансовых целей
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Добавьте цели в соответствующих разделах приложения
            </p>
          </motion.div>
        )}
      </div>

      {/* Основной контент - детальные списки */}
      <div className="px-6 py-6 space-y-8">

        {/* Раздел Копилки */}
        {savingsGoals.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center px-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <ICONS.PiggyBank className="w-6 h-6 mr-2 text-purple-500" />
                Мои копилки
              </h2>
            </div>

            <div className="space-y-4">
              {savingsGoals.map((goal, index) => {
                const progress = getProgress(goal.current, goal.target);
                return (
                  <motion.button
                    key={goal.id}
                    onClick={() => navigateToScreen('savings')}
                    className="w-full text-left relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-3xl p-6 text-white shadow-purple-500/5"
                    whileTap={whileTap}
                    whileHover={whileHover}
                    transition={spring}
                    variants={zoomInOut}
                    whileInView="whileInView"
                    viewport={{ once: false, amount: 0.2 }}
                    style={{ transitionDelay: `${index * 0.05}s` }}
                  >
                    {/* Декоративный элемент */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm mr-3">
                            <ICONS.PiggyBank className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-lg font-semibold opacity-95">{goal.title}</div>
                            <div className="text-sm opacity-70">
                              {goal.current.toLocaleString()} из {goal.target.toLocaleString()} {currencySymbol}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{progress.toFixed(0)}%</div>
                          <div className="text-xs opacity-70">выполнено</div>
                        </div>
                      </div>

                      {/* Прогресс бар */}
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-white/80 transition-all duration-500"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Раздел Депозиты и Кредиты - в двух колонках */}
        {(depositsWithBalance.length > 0 || loansWithBalance.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Депозиты */}
            {depositsWithBalance.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center px-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <ICONS.Banknote className="w-5 h-5 mr-2 text-green-500" />
                    Депозиты
                  </h3>
                </div>

                <div className="space-y-3">
                  {depositsWithBalance.map((deposit, index) => (
                    <motion.button
                      key={deposit.id}
                      onClick={() => setSelectedFinancialItem(deposit)}
                      className="w-full text-left bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-green-100 dark:border-green-900/20 hover:shadow-md transition-all"
                      whileTap={whileTap}
                      whileHover={whileHover}
                      transition={spring}
                      variants={zoomInOut}
                      whileInView="whileInView"
                      viewport={{ once: false, amount: 0.2 }}
                      style={{ transitionDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mr-3">
                            <ICONS.Banknote className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 dark:text-gray-200">{deposit.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Активный депозит
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600 dark:text-green-400">
                            {deposit.currentAmount.toLocaleString()} {currencySymbol}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">баланс</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Кредиты */}
            {loansWithBalance.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center px-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <ICONS.MinusCircle className="w-5 h-5 mr-2 text-red-500" />
                    Кредиты
                  </h3>
                </div>

                <div className="space-y-3">
                  {loansWithBalance.map((loan, index) => (
                    <motion.button
                      key={loan.id}
                      onClick={() => setSelectedFinancialItem(loan)}
                      className="w-full text-left bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-red-100 dark:border-red-900/20 hover:shadow-md transition-all"
                      whileTap={whileTap}
                      whileHover={whileHover}
                      transition={spring}
                      variants={zoomInOut}
                      whileInView="whileInView"
                      viewport={{ once: false, amount: 0.2 }}
                      style={{ transitionDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center mr-3">
                            <ICONS.MinusCircle className="w-5 h-5 text-red-500" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 dark:text-gray-200">{loan.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Активный кредит
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-red-600 dark:text-red-400">
                            -{loan.currentBalance.toLocaleString()} {currencySymbol}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">остаток</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Раздел Долги */}
        {debts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center px-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <ICONS.Users className="w-5 h-5 mr-2 text-blue-500" />
                Долги и займы
              </h3>
            </div>

            <div className="space-y-3">
              {debts.map((debt, index) => (
                <motion.button
                  key={debt.id}
                  onClick={() => navigateToScreen('debts')}
                  className="w-full text-left bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-blue-100 dark:border-blue-900/20 hover:shadow-md transition-all"
                  whileTap={whileTap}
                  whileHover={whileHover}
                  transition={spring}
                  variants={zoomInOut}
                  whileInView="whileInView"
                  viewport={{ once: false, amount: 0.2 }}
                  style={{ transitionDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${
                        debt.type === 'i-owe'
                          ? 'bg-red-100 dark:bg-red-900/20'
                          : 'bg-green-100 dark:bg-green-900/20'
                      }`}>
                        {debt.type === 'i-owe' ? (
                          <ICONS.ArrowDownCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <ICONS.ArrowUpCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">{debt.person}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {debt.type === 'i-owe' ? 'Я должен' : 'Мне должны'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold text-lg ${
                        debt.type === 'i-owe'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {debt.type === 'i-owe' ? '-' : '+'}{debt.amount.toLocaleString()} {currencySymbol}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Если нет никаких целей */}
        {savingsGoals.length === 0 && depositsWithBalance.length === 0 && loansWithBalance.length === 0 && debts.length === 0 && (
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
            variants={zoomInOut}
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
              <ICONS.Target className="w-10 h-10 text-purple-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
              Начните планировать будущее
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-base max-w-md mx-auto leading-relaxed">
              Добавьте свои финансовые цели в соответствующих разделах приложения,
              чтобы отслеживать прогресс и достигать поставленных задач
            </p>

            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <button
                onClick={() => navigateToScreen('savings')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-2xl text-sm font-medium hover:bg-purple-600 transition-colors"
              >
                <ICONS.PiggyBank className="w-4 h-4" />
                <span>Копилки</span>
              </button>
              <button
                onClick={() => navigateToScreen('debts')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-2xl text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                <ICONS.Users className="w-4 h-4" />
                <span>Долги</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FinancialGoalsScreen;