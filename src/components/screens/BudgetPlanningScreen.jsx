import React, { useState } from 'react';
import { ICONS } from '../icons';

const BudgetPlanningScreen = ({ budgets, setBudgets, categories, filteredTransactions, setCurrentScreen, totalPlannedBudget, totalSpentOnBudgets }) => {
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    limit: ''
  });
  const [showRemaining, setShowRemaining] = useState(false);

  const handleSaveBudget = () => {
    if (!formData.category || !formData.limit) return;
    const newBudget = {
      id: editingBudget ? editingBudget.id : Date.now(),
      category: formData.category,
      limit: parseFloat(formData.limit),
      spent: 0
    };

    if (editingBudget) {
      setBudgets(budgets.map(b => b.id === newBudget.id ? newBudget : b));
    } else {
      setBudgets([...budgets, newBudget]);
    }

    setFormData({ category: '', limit: '' });
    setShowAddBudget(false);
    setEditingBudget(null);
  };

  const handleDeleteBudget = (id) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  const getSpentAmount = (category) => {
    return filteredTransactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };
  
  const handleCardClick = () => {
    setShowRemaining(!showRemaining);
  };

  if (showAddBudget || editingBudget) {
    const currentData = editingBudget || formData;
    return (
      <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
        <div className="flex items-center mb-8">
          <button
            onClick={() => {
              setShowAddBudget(false);
              setEditingBudget(null);
            }}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {editingBudget ? 'Редактировать бюджет' : 'Создать бюджет'}
          </h2>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Категория</label>
            <select
              value={currentData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            >
              <option value="">Выберите категорию</option>
              {categories.expense.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Лимит</label>
            <input
              type="number"
              value={currentData.limit}
              onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
              placeholder="0"
              className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>
          <button
            onClick={handleSaveBudget}
            className="w-full bg-blue-600 text-white p-4 rounded-2xl font-semibold hover:bg-blue-700"
          >
            {editingBudget ? 'Сохранить изменения' : 'Создать бюджет'}
          </button>
        </div>
      </div>
    );
  }
  
  const remainingBudget = totalPlannedBudget - totalSpentOnBudgets;

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setCurrentScreen('')}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Планирование бюджета</h2>
        <button
          onClick={() => setShowAddBudget(true)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 ml-auto"
        >
          <ICONS.Plus className="w-6 h-6" />
        </button>
      </div>

      <div
        className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-8 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex items-center mb-3">
          <ICONS.Wallet className="w-6 h-6 mr-3" />
          <span className="text-sm opacity-90">Спланировано</span>
        </div>
        <div className="text-2xl font-bold">
          {totalPlannedBudget !== undefined && totalPlannedBudget !== null ? totalPlannedBudget.toLocaleString() : '0'} ₽
        </div>
        <div className="text-sm opacity-80 mt-1">
          {showRemaining ? (
            `Осталось потратить: ${remainingBudget.toLocaleString()} ₽`
          ) : (
            `Потрачено: ${totalSpentOnBudgets !== undefined && totalSpentOnBudgets !== null ? totalSpentOnBudgets.toLocaleString() : '0'} ₽`
          )}
        </div>
      </div>

      <div className="space-y-4">
        {budgets.length > 0 ? (
          budgets.map(budget => {
            const spent = getSpentAmount(budget.category);
            const progress = (spent / budget.limit) * 100;
            const isOver = spent > budget.limit;
            const progressColor = isOver ? 'bg-red-500' : 'bg-green-500';

            return (
              <div key={budget.id} className="bg-white rounded-2xl p-6 shadow-sm dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">{budget.category}</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingBudget(budget);
                        setFormData({ category: budget.category, limit: budget.limit });
                      }}
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded-lg dark:hover:bg-gray-700"
                    >
                      <ICONS.Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-gray-700"
                    >
                      <ICONS.Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-2 dark:text-gray-400">
                    <span>{spent.toLocaleString()} ₽</span>
                    <span>{budget.limit.toLocaleString()} ₽</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                    <div
                      className={`${progressColor} h-3 rounded-full transition-all duration-300`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className={`text-center text-sm font-medium ${isOver ? 'text-red-500' : 'text-green-500'}`}>
                  {isOver ? `Лимит превышен на ${(spent - budget.limit).toLocaleString()} ₽` : `${progress.toFixed(1)}% израсходовано`}
                </div>
              </div>
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