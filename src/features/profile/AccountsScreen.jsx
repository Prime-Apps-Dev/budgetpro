// src/components/screens/profile/AccountsScreen.jsx
import React, { useState } from 'react';
import { ICONS } from '../../components/icons';
import { motion } from 'framer-motion';
import { spring, whileTap, whileHover, zoomInOut } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';

const AccountsScreen = () => {
  const { accounts, setAccounts, setCurrentScreen } = useAppContext();
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({
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
  
  const getIcon = (name) => {
    return ICONS[name] || ICONS.CreditCard;
  };

  const handleAddAccount = () => {
    if (newAccount.name.trim()) {
      const account = {
        id: Date.now(),
        ...newAccount,
        iconName: accountTypes.find(t => t.id === newAccount.type).iconName
      };
      setAccounts([...accounts, account]);
      setNewAccount({ name: '', type: 'bank', iconName: 'CreditCard', color: '#3b82f6' });
      setShowAddAccount(false);
    }
  };

  const handleUpdateAccount = () => {
    if (editingAccount && editingAccount.name.trim()) {
      const updatedAccount = {
        ...editingAccount,
        iconName: accountTypes.find(t => t.id === editingAccount.type).iconName
      };
      setAccounts(accounts.map(acc =>
        acc.id === editingAccount.id ? updatedAccount : acc
      ));
      setEditingAccount(null);
    }
  };

  const handleDeleteAccount = (accountId) => {
    if (accounts.length > 1) {
      setAccounts(accounts.filter(acc => acc.id !== accountId));
    }
  };

  if (showAddAccount || editingAccount) {
    const formData = editingAccount || newAccount;
    const setFormData = editingAccount ? setEditingAccount : setNewAccount;
    const isEditing = !!editingAccount;

    return (
      <div className="p-6 pb-24 bg-gray-50 min-h-screen">
        <div className="flex items-center mb-8">
          <motion.button
            onClick={() => {
              setShowAddAccount(false);
              setEditingAccount(null);
            }}
            className="mr-4 p-2 rounded-full hover:bg-gray-200"
            whileTap={whileTap}
            transition={spring}
          >
            <ICONS.ChevronLeft className="w-6 h-6" />
          </motion.button>
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Редактировать счёт' : 'Добавить счёт'}
          </h2>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Название счёта</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Например: Основная карта"
              className="w-full p-4 border border-gray-300 rounded-2xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Тип счёта</label>
            <div className="space-y-3">
              {accountTypes.map(type => {
                const IconComponent = getIcon(type.iconName);
                return (
                  <motion.button
                    key={type.id}
                    onClick={() => setFormData({ ...formData, type: type.id, iconName: type.iconName })}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center ${
                      formData.type === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                    whileTap={whileTap}
                    transition={spring}
                  >
                    <IconComponent className="w-6 h-6 mr-4" />
                    <span className="font-medium">{type.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Цвет</label>
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
            onClick={isEditing ? handleUpdateAccount : handleAddAccount}
            className="w-full bg-blue-600 text-white p-4 rounded-2xl font-semibold hover:bg-blue-700"
            whileTap={whileTap}
            transition={spring}
          >
            {isEditing ? 'Сохранить изменения' : 'Добавить счёт'}
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <motion.button
            onClick={() => setCurrentScreen('profile')}
            className="mr-4 p-2 rounded-full hover:bg-gray-200"
            whileTap={whileTap}
            transition={spring}
          >
            <ICONS.ChevronLeft className="w-6 h-6" />
          </motion.button>
          <h2 className="text-2xl font-bold text-gray-800">Счета</h2>
        </div>
        <motion.button
          onClick={() => setShowAddAccount(true)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          whileTap={{ scale: 0.8 }}
          transition={spring}
        >
          <ICONS.Plus className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="space-y-4">
        {accounts.map(account => {
          const IconComponent = getIcon(account.iconName);
          const accountType = accountTypes.find(t => t.id === account.type);

          return (
            <motion.div 
              key={account.id} 
              className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between"
              whileTap={whileTap}
              whileHover={whileHover}
              transition={spring}
              variants={zoomInOut}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="flex items-center">
                <IconComponent className="w-8 h-8 mr-4" style={{ color: account.color }} />
                <div>
                  <div className="font-medium text-gray-800">{account.name}</div>
                  <div className="text-sm text-gray-500">{accountType.name}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setEditingAccount(account)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                  whileTap={whileTap}
                  transition={spring}
                >
                  <ICONS.Edit className="w-4 h-4" />
                </motion.button>
                {accounts.length > 1 && (
                  <motion.button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    whileTap={whileTap}
                    transition={spring}
                  >
                    <ICONS.Trash2 className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AccountsScreen;