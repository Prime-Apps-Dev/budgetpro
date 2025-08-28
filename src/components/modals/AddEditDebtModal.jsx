// src/components/modals/AddEditDebtModal.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { spring, whileTap } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import ModalWrapper from './ModalWrapper';

const AddEditDebtModal = () => {
  const {
    debts,
    setDebts,
    editingDebt,
    setEditingDebt,
    setTransactions,
    currencySymbol,
    setShowAddDebtModal
  } = useAppContext();

  const [newDebt, setNewDebt] = useState({
    type: 'i-owe',
    amount: '',
    person: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editingDebt) {
      setNewDebt({ ...editingDebt });
    } else {
      setNewDebt({
        type: 'i-owe',
        amount: '',
        person: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingDebt]);

  const handleSaveDebt = () => {
    if (!newDebt.amount || !newDebt.person) return;

    const debtData = {
      ...newDebt,
      amount: parseFloat(newDebt.amount),
      id: editingDebt ? editingDebt.id : Date.now(),
    };

    if (editingDebt) {
      setDebts(debts.map(d => (d.id === editingDebt.id ? debtData : d)));
      setEditingDebt(null);
    } else {
      setDebts([...debts, debtData]);
    }

    setNewDebt({
      type: 'i-owe',
      amount: '',
      person: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setShowAddDebtModal(false);
  };
  
  const handleClose = () => {
    setShowAddDebtModal(false);
    setEditingDebt(null);
  };

  return (
    <ModalWrapper
      title={editingDebt ? 'Редактировать долг' : 'Добавить долг'}
      handleClose={handleClose}
    >
      <div className="flex-grow overflow-y-auto pr-2">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                onClick={() => setNewDebt({ ...newDebt, type: 'i-owe' })}
                className={`p-4 rounded-2xl border-2 font-medium ${
                  newDebt.type === 'i-owe'
                    ? 'border-red-500 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-900 dark:text-red-300'
                    : 'border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
                whileTap={whileTap}
                transition={spring}
              >
                Я должен
              </motion.button>
              <motion.button
                onClick={() => setNewDebt({ ...newDebt, type: 'owed-to-me' })}
                className={`p-4 rounded-2xl border-2 font-medium ${
                  newDebt.type === 'owed-to-me'
                    ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-900 dark:text-green-300'
                    : 'border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
                whileTap={whileTap}
                transition={spring}
              >
                Мне должны
              </motion.button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Сумма</label>
              <input
                type="number"
                value={newDebt.amount}
                onChange={(e) => setNewDebt({ ...newDebt, amount: e.target.value })}
                placeholder="0"
                className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Кому/Кто</label>
              <input
                type="text"
                value={newDebt.person}
                onChange={(e) => setNewDebt({ ...newDebt, person: e.target.value })}
                placeholder="Имя человека"
                className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Описание (необязательно)</label>
              <input
                type="text"
                value={newDebt.description}
                onChange={(e) => setNewDebt({ ...newDebt, description: e.target.value })}
                placeholder="Например: За ужин"
                className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Дата</label>
              <input
                type="date"
                value={newDebt.date}
                onChange={(e) => setNewDebt({ ...newDebt, date: e.target.value })}
                className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>

            <motion.button
              onClick={handleSaveDebt}
              className="w-full bg-blue-600 text-white p-4 rounded-2xl font-semibold hover:bg-blue-700"
              whileTap={whileTap}
              transition={spring}
            >
              {editingDebt ? 'Сохранить изменения' : 'Добавить долг'}
            </motion.button>
          </div>
      </div>
    </ModalWrapper>
  );
};

export default AddEditDebtModal;