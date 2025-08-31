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
import FinancialItemCard from '../../components/ui/FinancialItemCard';
import LongPressWrapper from '../../components/ui/LongPressWrapper';
import InteractiveSavingGoalCard from '../../components/ui/InteractiveSavingGoalCard';

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
    setSelectedFinancialItem,
    setShowLoanDepositTransactionModal,
    setSelectedLoanDepositForTransaction,
    setSelectedDebtForTransactions,
    setShowDebtTransactionsModal,
    setEditingFinancialItem,
    setEditingGoal,
    setActiveTab,
    navigateToTab, // Добавлено: новая функция для навигации
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
          onClick={() => navigateToTab('savings')} // Исправлено на navigateToTab
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
          onClick={() => navigateToScreen('my-financial-products')}
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
          onClick={() => navigateToScreen('my-financial-products')}
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
              {savingsGoals.map((goal, index) => (
                <InteractiveSavingGoalCard
                  key={goal.id}
                  goal={goal}
                  currencySymbol={currencySymbol}
                  onClick={() => navigateToTab('savings')} // Исправлено на navigateToTab
                  onEdit={() => {
                    setEditingGoal(goal);
                    setShowAddGoalModal(true);
                  }}
                  onDelete={() => {}} // Placeholder for delete
                  onDoubleClick={() => {}} // Placeholder for double-click
                />
              ))}
            </div>
          </div>
        )}

        {/* Раздел Депозиты и Кредиты - в одну колонку */}
        {(depositsWithBalance.length > 0 || loansWithBalance.length > 0) && (
          <div className="space-y-4">
            <div className="flex items-center px-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <ICONS.Banknote className="w-5 h-5 mr-2 text-green-500" />
                Кредиты и депозиты
              </h3>
            </div>
            
            <div className="space-y-3">
              {depositsWithBalance.map((deposit, index) => (
                <motion.button
                  key={deposit.id}
                  onClick={() => navigateToScreen('my-financial-products')}
                  className="w-full text-left"
                  whileTap={whileTap}
                  whileHover={{ scale: 1.02 }}
                  transition={spring}
                  variants={zoomInOut}
                  whileInView="whileInView"
                  viewport={{ once: false, amount: 0.2 }}
                  style={{ transitionDelay: `${index * 0.05}s` }}
                >
                  <LongPressWrapper
                    onTap={() => setSelectedFinancialItem(deposit)}
                    onLongPress={() => {
                      setEditingFinancialItem(deposit);
                      setShowAddFinancialItemModal(true);
                    }}
                    onDoubleTap={() => {
                      setSelectedLoanDepositForTransaction(deposit);
                      setShowLoanDepositTransactionModal(true);
                    }}
                  >
                    <FinancialItemCard
                      title={deposit.name}
                      subtitle={`Банк: ${deposit.bank}`}
                      amountText={`${deposit.currentAmount.toLocaleString()} ${currencySymbol}`}
                      infoText={`Доход: ${deposit.totalInterest.toLocaleString()} ${currencySymbol}`}
                      progress={(deposit.currentAmount / deposit.totalAmount) * 100}
                      gradient="bg-gradient-to-br from-green-500 via-green-600 to-green-700"
                      iconName={deposit.iconName || 'Banknote'}
                      type="deposit"
                    />
                  </LongPressWrapper>
                </motion.button>
              ))}
              {loansWithBalance.map((loan, index) => (
                <motion.button
                  key={loan.id}
                  onClick={() => navigateToScreen('my-financial-products')}
                  className="w-full text-left"
                  whileTap={whileTap}
                  whileHover={{ scale: 1.02 }}
                  transition={spring}
                  variants={zoomInOut}
                  whileInView="whileInView"
                  viewport={{ once: false, amount: 0.2 }}
                  style={{ transitionDelay: `${index * 0.05}s` }}
                >
                  <LongPressWrapper
                    onTap={() => setSelectedFinancialItem(loan)}
                    onLongPress={() => {
                      setEditingFinancialItem(loan);
                      setShowAddFinancialItemModal(true);
                    }}
                    onDoubleTap={() => {
                      setSelectedLoanDepositForTransaction(loan);
                      setShowLoanDepositTransactionModal(true);
                    }}
                  >
                    <FinancialItemCard
                      title={loan.name}
                      subtitle={`${loan.interestRate}% на ${loan.term} мес.`}
                      amountText={`${loan.currentBalance.toLocaleString()} ${currencySymbol}`}
                      infoText={`Осталось ${loan.term - (loan.paymentHistory?.length || 0)} мес.`}
                      progress={((loan.amount - loan.currentBalance) / loan.amount) * 100}
                      gradient="bg-gradient-to-br from-red-500 via-red-600 to-red-700"
                      iconName={loan.iconName || 'MinusCircle'}
                      type="loan"
                    />
                  </LongPressWrapper>
                </motion.button>
              ))}
            </div>
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
              {debts.map((debt, index) => {
                const isIOwe = debt.type === 'i-owe';
                const gradient = isIOwe
                  ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700'
                  : 'bg-gradient-to-br from-green-500 via-green-600 to-green-700';
                const iconName = isIOwe ? 'ArrowDownCircle' : 'ArrowUpCircle';
                
                return (
                  <motion.button
                    key={debt.id}
                    onClick={() => navigateToScreen('debts')}
                    className="w-full text-left"
                    whileTap={whileTap}
                    whileHover={{ scale: 1.02 }}
                    transition={spring}
                    variants={zoomInOut}
                    whileInView="whileInView"
                    viewport={{ once: false, amount: 0.2 }}
                    style={{ transitionDelay: `${index * 0.05}s` }}
                  >
                    <LongPressWrapper
                        onTap={() => {
                          setSelectedDebtForTransactions(debt);
                          setShowDebtTransactionsModal(true);
                        }}
                        onLongPress={() => {
                          setEditingDebt(debt);
                          setShowAddDebtModal(true);
                        }}
                        onDoubleTap={() => {
                          setSelectedDebtToRepay(debt);
                          setShowAddTransaction(true);
                        }}
                      >
                      <FinancialItemCard
                        title={debt.person}
                        subtitle={debt.description || ''}
                        amountText={`${isIOwe ? '' : '+'}${debt.amount.toLocaleString()} ${currencySymbol}`}
                        infoText={debt.date}
                        gradient={gradient}
                        iconName={iconName}
                        type={debt.type}
                      />
                    </LongPressWrapper>
                  </motion.button>
                );
              })}
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
                onClick={() => navigateToTab('savings')} // Исправлено на navigateToTab
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