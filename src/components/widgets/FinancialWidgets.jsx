// src/components/widgets/FinancialWidgets.jsx
import React from 'react';
import { ICONS } from '../icons';
import { motion } from 'framer-motion';

/**
 * Базовый компонент виджета
 */
const WidgetBase = ({ children, gradient, onClick }) => (
  <motion.div
    onClick={onClick}
    className={`relative overflow-hidden ${gradient} rounded-3xl p-6 text-white shadow-lg cursor-pointer min-h-[160px] flex flex-col justify-between`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    {/* Декоративный элемент */}
    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
    <div className="relative z-10">
      {children}
    </div>
  </motion.div>
);

/**
 * Виджет Копилки - показывает общий прогресс накоплений
 */
export const SavingsWidget = ({ goals, currencySymbol, onClick }) => {
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const progress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
  const completedGoals = goals.filter(goal => goal.current >= goal.target).length;

  return (
    <WidgetBase 
      gradient="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700" 
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
          <ICONS.PiggyBank className="w-6 h-6" />
        </div>
        <div className="text-right">
          <div className="text-sm font-medium opacity-90">Копилки</div>
          <div className="text-xs opacity-70">{goals.length} активн{goals.length > 1 ? 'ых' : 'ая'}</div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-2xl font-bold mb-1">
          {totalCurrent.toLocaleString()} {currencySymbol}
        </div>
        <div className="text-sm opacity-80">
          из {totalTarget.toLocaleString()} {currencySymbol}
        </div>
      </div>

      {/* Прогресс бар */}
      <div className="mb-3">
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-white/80 transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm opacity-80">
        <div>{progress.toFixed(0)}% выполнено</div>
        <div>{completedGoals} из {goals.length} достигнуто</div>
      </div>
    </WidgetBase>
  );
};

/**
 * Виджет Депозитов - показывает общую сумму и доходность
 */
export const DepositsWidget = ({ deposits, currencySymbol, onClick }) => {
  const totalAmount = deposits.reduce((sum, deposit) => sum + deposit.currentAmount, 0);
  const totalInitial = deposits.reduce((sum, deposit) => sum + deposit.initialAmount, 0);
  const totalProfit = totalAmount - totalInitial;
  const profitPercentage = totalInitial > 0 ? ((totalProfit / totalInitial) * 100) : 0;

  return (
    <WidgetBase 
      gradient="bg-gradient-to-br from-green-500 via-green-600 to-green-700" 
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
          <ICONS.Banknote className="w-6 h-6" />
        </div>
        <div className="text-right">
          <div className="text-sm font-medium opacity-90">Депозиты</div>
          <div className="text-xs opacity-70">{deposits.length} размещен{deposits.length > 1 ? 'о' : ''}</div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-2xl font-bold mb-1">
          {totalAmount.toLocaleString()} {currencySymbol}
        </div>
        <div className="text-sm opacity-80">
          общий баланс
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-80">Доход:</span>
          <span className={`text-sm font-semibold ${totalProfit >= 0 ? 'text-white' : 'text-red-200'}`}>
            {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString()} {currencySymbol}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm opacity-80">
        <div>Доходность: {profitPercentage >= 0 ? '+' : ''}{profitPercentage.toFixed(1)}%</div>
        <div className="flex items-center">
          <div className="w-1 h-1 bg-white rounded-full mr-2" />
          Растет
        </div>
      </div>
    </WidgetBase>
  );
};

/**
 * Виджет Кредитов - показывает остаток к выплате и прогресс погашения
 */
export const LoansWidget = ({ loans, currencySymbol, onClick }) => {
  const totalRemaining = loans.reduce((sum, loan) => sum + loan.currentBalance, 0);
  const totalInitial = loans.reduce((sum, loan) => sum + loan.initialAmount, 0);
  const totalPaid = totalInitial - totalRemaining;
  const paymentProgress = totalInitial > 0 ? ((totalPaid / totalInitial) * 100) : 0;

  // Подсчет ближайшего платежа (условно)
  const nearestPaymentDays = 30; // Можно вычислять из данных

  return (
    <WidgetBase 
      gradient="bg-gradient-to-br from-red-500 via-red-600 to-red-700" 
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
          <ICONS.MinusCircle className="w-6 h-6" />
        </div>
        <div className="text-right">
          <div className="text-sm font-medium opacity-90">Кредиты</div>
          <div className="text-xs opacity-70">{loans.length} активн{loans.length > 1 ? 'ых' : 'ый'}</div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-2xl font-bold mb-1">
          {totalRemaining.toLocaleString()} {currencySymbol}
        </div>
        <div className="text-sm opacity-80">
          осталось выплатить
        </div>
      </div>

      {/* Прогресс погашения */}
      <div className="mb-3">
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-white/80 transition-all duration-500"
            style={{ width: `${Math.min(paymentProgress, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm opacity-80">
        <div>{paymentProgress.toFixed(0)}% выплачено</div>
        <div>Платеж через {nearestPaymentDays} дн.</div>
      </div>
    </WidgetBase>
  );
};

/**
 * Виджет Долгов - показывает общую сумму и баланс долгов
 */
export const DebtsWidget = ({ debts, currencySymbol, onClick }) => {
  const iOweDebts = debts.filter(debt => debt.type === 'i-owe');
  const oweMeDebts = debts.filter(debt => debt.type === 'owe-me');
  
  const totalIOwe = iOweDebts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalOweMe = oweMeDebts.reduce((sum, debt) => sum + debt.amount, 0);
  const netBalance = totalOweMe - totalIOwe;

  return (
    <WidgetBase 
      gradient="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700" 
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
          <ICONS.Users className="w-6 h-6" />
        </div>
        <div className="text-right">
          <div className="text-sm font-medium opacity-90">Долги</div>
          <div className="text-xs opacity-70">{debts.length} операци{debts.length > 1 ? 'й' : 'я'}</div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-2xl font-bold mb-1">
          {Math.abs(netBalance).toLocaleString()} {currencySymbol}
        </div>
        <div className="text-sm opacity-80">
          {netBalance >= 0 ? 'мне должны больше' : 'я должен больше'}
        </div>
      </div>

      <div className="mb-3 space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="opacity-80">Я должен:</span>
          <span className="text-red-200 font-medium">
            {totalIOwe.toLocaleString()} {currencySymbol}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="opacity-80">Мне должны:</span>
          <span className="text-green-200 font-medium">
            {totalOweMe.toLocaleString()} {currencySymbol}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm opacity-80">
        <div>Баланс: {netBalance >= 0 ? '+' : ''}{netBalance.toLocaleString()}</div>
        <div className="flex items-center">
          <div className={`w-1 h-1 rounded-full mr-2 ${netBalance >= 0 ? 'bg-green-200' : 'bg-red-200'}`} />
          {netBalance >= 0 ? 'В плюсе' : 'В минусе'}
        </div>
      </div>
    </WidgetBase>
  );
};