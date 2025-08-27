// src/components/screens/BudgetPlanningScreen.jsx
import React, { useState } from 'react';
import { ICONS } from '../../components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { spring, whileTap, whileHover, zoomInOut, fadeInOut } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';

const BudgetPlanningScreen = () => {
  const {
    budgets,
    setBudgets,
    categories,
    getFilteredTransactions,
    setCurrentScreen,
    totalPlannedBudget,
    totalSpentOnBudgets,
    currencySymbol
  } = useAppContext();

  const [showAddBudget, setShowAddBudget] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    limit: ''
  });
  const [showRemaining, setShowRemaining] = useState(false);

  const filteredTransactions = getFilteredTransactions();

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

  const AddEditBudgetModal = ({ isEditing, editingBudget, setShowAddBudget, setEditingBudget, formData, setFormData, handleSaveBudget, categories }) => {
    const currentData = isEditing ? editingBudget : formData;
    return (
      <motion.div
        className="fixed inset-x-0 bottom-0 top-1/4 flex items-end justify-center z-50"
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-black opacity-50" onClick={() => { setShowAddBudget(false); setEditingBudget(null); }}></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-t-3xl p-6 shadow-xl w-full h-full flex flex-col">
          <div className="flex justify-center mb-4">
            <motion.div
              onClick={() => { setShowAddBudget(false); setEditingBudget(null); }}
              className="w-12 h-1 bg-gray-300 rounded-full cursor-pointer dark:bg-gray-600"
              whileTap={{ scale: 0.8 }}
              transition={spring}
            ></motion.div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {isEditing ? 'Редактировать бюджет' : 'Создать бюджет'}
          </h3>
          <div className="flex-grow overflow-y-auto pr-2">
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
              <motion.button
                onClick={handleSaveBudget}
                className="w-full bg-blue-600 text-white p-4 rounded-2xl font-semibold hover:bg-blue-700"
                whileTap={whileTap}
                transition={spring}
              >
                {isEditing ? 'Сохранить изменения' : 'Создать бюджет'}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };


  const remainingBudget = totalPlannedBudget - totalSpentOnBudgets;

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="flex items-center justify-between mb-8">
        <motion.button
          onClick={() => setCurrentScreen('profile')}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          whileTap={whileTap}
          transition={spring}
        >
          <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
        </motion.button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Планирование бюджета</h2>
        <motion.button
          onClick={() => setShowAddBudget(true)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 ml-auto"
          whileTap={{ scale: 0.8 }}
          transition={spring}
        >
          <ICONS.Plus className="w-6 h-6" />
        </motion.button>
      </div>

      <motion.div
        className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-8 cursor-pointer"
        onClick={handleCardClick}
        whileHover={whileHover}
        whileTap={whileTap}
        transition={spring}
        variants={zoomInOut}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex items-center mb-3">
          <ICONS.Wallet className="w-6 h-6 mr-3" />
          <span className="text-sm opacity-90">Спланировано</span>
        </div>
        <div className="text-2xl font-bold">
          {totalPlannedBudget !== undefined && totalPlannedBudget !== null ? totalPlannedBudget.toLocaleString() : '0'} {currencySymbol}
        </div>
        <div className="text-sm opacity-80 mt-1">
          {showRemaining ? (
            `Осталось потратить: ${remainingBudget.toLocaleString()} ${currencySymbol}`
          ) : (
            `Потрачено: ${totalSpentOnBudgets !== undefined && totalSpentOnBudgets !== null ? totalSpentOnBudgets.toLocaleString() : '0'} ${currencySymbol}`
          )}
        </div>
      </motion.div>

      <div className="space-y-4">
        {budgets.length > 0 ? (
          budgets.map(budget => {
            const spent = getSpentAmount(budget.category);
            const progress = (spent / budget.limit) * 100;
            const isOver = spent > budget.limit;
            const progressColor = isOver ? 'bg-red-500' : 'bg-green-500';

            return (
              <motion.div 
                key={budget.id} 
                className="bg-white rounded-2xl p-6 shadow-sm dark:bg-gray-800"
                whileTap={whileTap}
                whileHover={whileHover}
                transition={spring}
                variants={zoomInOut}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">{budget.category}</h3>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => {
                        setEditingBudget(budget);
                        setFormData({ category: budget.category, limit: budget.limit });
                      }}
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded-lg dark:hover:bg-gray-700"
                      whileTap={whileTap}
                      transition={spring}
                    >
                      <ICONS.Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-gray-700"
                      whileTap={whileTap}
                      transition={spring}
                    >
                      <ICONS.Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-2 dark:text-gray-400">
                    <span>{spent.toLocaleString()} {currencySymbol}</span>
                    <span>{budget.limit.toLocaleString()} {currencySymbol}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                    <div
                      className={`${progressColor} h-3 rounded-full transition-all duration-300`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className={`text-center text-sm font-medium ${isOver ? 'text-red-500' : 'text-green-500'}`}>
                  {isOver ? `Лимит превышен на ${(spent - budget.limit).toLocaleString()} ${currencySymbol}` : `${progress.toFixed(1)}% израсходовано`}
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">У вас нет бюджетов. Создайте первый!</p>
        )}
      </div>

      <AnimatePresence>
        {(showAddBudget || editingBudget) && (
          <AddEditBudgetModal
            isEditing={!!editingBudget}
            editingBudget={editingBudget}
            setShowAddBudget={setShowAddBudget}
            setEditingBudget={setEditingBudget}
            formData={formData}
            setFormData={setFormData}
            handleSaveBudget={handleSaveBudget}
            categories={categories}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BudgetPlanningScreen;