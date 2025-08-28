// src/components/modals/AddEditBudgetModal.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { spring, whileTap } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import ModalWrapper from './ModalWrapper';

const AddEditBudgetModal = () => {
  const {
    budgets,
    setBudgets,
    categories,
    setShowAddBudgetModal,
    editingBudget,
    setEditingBudget
  } = useAppContext();

  const [formData, setFormData] = useState({
    category: '',
    limit: ''
  });

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        category: editingBudget.category,
        limit: editingBudget.limit.toString()
      });
    } else {
      setFormData({
        category: '',
        limit: ''
      });
    }
  }, [editingBudget]);

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
    setShowAddBudgetModal(false);
    setEditingBudget(null);
  };
  
  const handleClose = () => {
    setShowAddBudgetModal(false);
    setEditingBudget(null);
    setFormData({ category: '', limit: '' });
  };

  return (
    <ModalWrapper
      title={editingBudget ? 'Редактировать бюджет' : 'Создать бюджет'}
      handleClose={handleClose}
    >
      <div className="flex-grow overflow-y-auto pr-2">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Категория</label>
            <select
              value={formData.category}
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
              value={formData.limit}
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
            {editingBudget ? 'Сохранить изменения' : 'Создать бюджет'}
          </motion.button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AddEditBudgetModal;