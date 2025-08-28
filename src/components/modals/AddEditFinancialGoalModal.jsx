// src/components/modals/AddEditFinancialGoalModal.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { spring, whileTap } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import ModalWrapper from './ModalWrapper';

const AddEditFinancialGoalModal = () => {
  const {
    financialGoals,
    setFinancialGoals,
    editingGoal,
    setEditingGoal,
    setShowAddGoalModal
  } = useAppContext();

  const [formData, setFormData] = useState({
    title: '',
    target: '',
    deadline: '',
    isSavings: false
  });

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        title: editingGoal.title,
        target: editingGoal.target.toString(),
        deadline: editingGoal.deadline,
        isSavings: editingGoal.isSavings
      });
    } else {
      setFormData({
        title: '',
        target: '',
        deadline: '',
        isSavings: false
      });
    }
  }, [editingGoal]);

  const handleSaveGoal = () => {
    if (formData.title.trim() && formData.target && formData.deadline) {
      const goal = {
        id: editingGoal ? editingGoal.id : Date.now(),
        title: formData.title.trim(),
        target: parseFloat(formData.target),
        current: editingGoal ? editingGoal.current : 0,
        deadline: formData.deadline,
        isSavings: formData.isSavings
      };

      if (editingGoal) {
        setFinancialGoals(financialGoals.map(g => g.id === goal.id ? goal : g));
      } else {
        setFinancialGoals([...financialGoals, goal]);
      }
      
      handleClose();
    }
  };

  const handleClose = () => {
    setShowAddGoalModal(false);
    setEditingGoal(null);
  };

  return (
    <ModalWrapper
      title={editingGoal ? 'Редактировать цель' : 'Новая цель'}
      handleClose={handleClose}
    >
      <div className="flex-grow overflow-y-auto pr-2">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Название цели</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Например: Отпуск в Европу"
              className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Целевая сумма</label>
            <input
              type="number"
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              placeholder="0"
              className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Крайний срок</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isSavings"
              checked={formData.isSavings}
              onChange={(e) => setFormData({ ...formData, isSavings: e.target.checked })}
              className="mr-3 w-5 h-5 text-blue-600 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="isSavings" className="text-sm font-medium text-gray-700 dark:text-gray-400">
              Это копилка (будет отображаться в разделе "Копилка")
            </label>
          </div>
          
          <motion.button
            onClick={handleSaveGoal}
            className="w-full bg-blue-600 text-white p-4 rounded-2xl font-semibold hover:bg-blue-700"
            whileTap={whileTap}
            transition={spring}
          >
            {editingGoal ? 'Сохранить изменения' : 'Создать цель'}
          </motion.button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AddEditFinancialGoalModal;