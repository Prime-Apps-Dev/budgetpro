// src/components/modals/AddEditAccountModal.jsx
import React, { useState, useEffect } from 'react';
import { ICONS } from '../icons';
import { motion } from 'framer-motion';
import { spring, whileTap } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import ModalWrapper from './ModalWrapper';

const AddEditAccountModal = () => {
  const { accounts, setAccounts, showAddAccountModal, setShowAddAccountModal, editingAccount, setEditingAccount } = useAppContext();

  const [formData, setFormData] = useState({
    name: '',
    type: 'bank',
    iconName: 'CreditCard',
    color: '#3b82f6'
  });

  const accountTypes = [
    { id: 'bank', name: 'Банковская карта', iconName: 'CreditCard' },
    { id: 'cash', name: 'Наличные', iconName: 'DollarSign' },
    { id: 'crypto', name: 'Криптовалюта', iconName: 'Bitcoin' }
  ];

  const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4'];

  const isEditing = !!editingAccount;

  useEffect(() => {
    if (editingAccount) {
      setFormData({ ...editingAccount });
    } else {
      setFormData({
        name: '',
        type: 'bank',
        iconName: 'CreditCard',
        color: '#3b82f6'
      });
    }
  }, [editingAccount]);

  const handleSaveAccount = () => {
    if (formData.name.trim()) {
      const accountData = {
        id: isEditing ? editingAccount.id : Date.now(),
        ...formData,
        iconName: accountTypes.find(t => t.id === formData.type).iconName
      };

      if (isEditing) {
        setAccounts(accounts.map(acc => (acc.id === editingAccount.id ? accountData : acc)));
      } else {
        setAccounts([...accounts, accountData]);
      }
      handleClose();
    }
  };

  const handleClose = () => {
    setShowAddAccountModal(false);
    setEditingAccount(null);
  };

  const getIcon = (name) => {
    return ICONS[name] || ICONS.CreditCard;
  };
  
  return (
    <ModalWrapper
      title={isEditing ? 'Редактировать счёт' : 'Добавить счёт'}
      handleClose={handleClose}
    >
      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Название счёта</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Например: Основная карта"
            className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Тип счёта</label>
          <div className="space-y-3">
            {accountTypes.map(type => {
              const IconComponent = getIcon(type.iconName);
              return (
                <motion.button
                  key={type.id}
                  onClick={() => setFormData({ ...formData, type: type.id, iconName: type.iconName })}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center ${
                    formData.type === type.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                  }`}
                  whileTap={whileTap}
                  transition={spring}
                >
                  <IconComponent className="w-6 h-6 mr-4" style={{ color: formData.color }} />
                  <span className="font-medium text-gray-800 dark:text-gray-200">{type.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Цвет</label>
          <div className="grid grid-cols-6 gap-3">
            {colors.map(color => (
              <motion.button
                key={color}
                onClick={() => setFormData({ ...formData, color })}
                className={`w-12 h-12 rounded-full ${
                  formData.color === color ? 'ring-2 ring-gray-400' : ''
                }`}
                style={{ backgroundColor: color }}
                whileTap={whileTap}
                transition={spring}
              />
            ))}
          </div>
        </div>

        <motion.button
          onClick={handleSaveAccount}
          className="w-full bg-blue-600 text-white p-4 rounded-2xl font-semibold hover:bg-blue-700"
          whileTap={whileTap}
          transition={spring}
        >
          {isEditing ? 'Сохранить изменения' : 'Добавить счёт'}
        </motion.button>
      </div>
    </ModalWrapper>
  );
};

export default AddEditAccountModal;