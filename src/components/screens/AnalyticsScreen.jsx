import React from 'react';
import PieChartComponent from '../ui/PieChartComponent';
import { ICONS } from '../icons';

const AnalyticsScreen = ({
  transactions,
  categories,
  filteredTransactions,
  totalIncome,
  totalExpenses,
  totalBudget,
  selectedPeriod,
  setSelectedPeriod,
  dateRange,
  setDateRange
}) => {
  const expensesByCategory = categories.expense.map(cat => ({
    name: cat,
    value: filteredTransactions.filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0)
  })).filter(item => item.value > 0);

  const incomeByCategory = categories.income.map(cat => ({
    name: cat,
    value: filteredTransactions.filter(t => t.type === 'income' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0)
  })).filter(item => item.value > 0);

  const expenseColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];
  const incomeColors = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'];

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Аналитика</h2>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <h3 className="font-semibold mb-4">Период анализа</h3>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {['week', 'month', 'quarter', 'year'].map(period => (
            <button
              key={period}
              onClick={() => {
                setSelectedPeriod(period);
                setDateRange({ start: '', end: '' });
              }}
              className={`p-3 rounded-xl text-sm font-medium ${
                selectedPeriod === period && !dateRange.start
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {period === 'week' ? 'Неделя' : period === 'month' ? 'Месяц' : period === 'quarter' ? 'Квартал' : 'Год'}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-2">От</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-2">До</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <PieChartComponent
          data={expensesByCategory}
          title="Расходы по категориям"
          colors={expenseColors}
        />

        <PieChartComponent
          data={incomeByCategory}
          title="Доходы по категориям"
          colors={incomeColors}
        />

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Сводка за период</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Общий доход:</span>
              <span className="font-semibold text-green-600">+{totalIncome.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Общий расход:</span>
              <span className="font-semibold text-red-600">-{totalExpenses.toLocaleString()} ₽</span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Итого:</span>
              <span className={`font-semibold ${totalBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalBudget.toLocaleString()} ₽
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsScreen;