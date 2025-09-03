// src/components/modals/AddEditBudgetModal.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { spring, whileTap } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import ModalWrapper from './ModalWrapper';

const AddEditBudgetModal = () => {
  const {
    budgets,
    categories,
    setShowAddBudgetModal,
    editingBudget,
    setEditingBudget,
    addOrUpdateBudget
  } = useAppContext();

  const isEditing = !!editingBudget?.id;
  
  const [formData, setFormData] = useState({
    category: '',
    limit: ''
  });
  const [selectedDate, setSelectedDate] = useState(
    editingBudget?.monthKey
      ? new Date(editingBudget.monthKey.split('-')[0], editingBudget.monthKey.split('-')[1] - 1, 1)
      : new Date()
  );

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        category: editingBudget.category,
        limit: editingBudget.limit?.toString() || ''
      });
      if (editingBudget.monthKey) {
        const [year, month] = editingBudget.monthKey.split('-');
        setSelectedDate(new Date(year, month - 1, 1));
      }
    } else {
      setFormData({
        category: '',
        limit: ''
      });
      setSelectedDate(new Date());
    }
  }, [editingBudget]);

  const handleSaveBudget = () => {
    if (!formData.category || !formData.limit) return;
    
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const monthKey = `${year}-${month}`;

    const newBudget = {
      id: isEditing ? editingBudget.id : null,
      category: formData.category,
      limit: parseFloat(formData.limit),
      monthKey,
    };
    
    addOrUpdateBudget(newBudget);

    setFormData({ category: '', limit: '' });
    setShowAddBudgetModal(false);
    setEditingBudget(null);
  };
  
  const handleClose = () => {
    setShowAddBudgetModal(false);
    setEditingBudget(null);
    setFormData({ category: '', limit: '' });
  };
  
  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split('-');
    setSelectedDate(new Date(year, month - 1, 1));
  };


  return (
    <ModalWrapper
      title={isEditing ? 'Редактировать бюджет' : 'Создать бюджет'}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Месяц</label>
            <input
              type="month"
              value={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`}
              onChange={handleMonthChange}
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
    </ModalWrapper>
  );
};

export default AddEditBudgetModal;