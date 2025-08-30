// src/components/screens/profile/AccountsScreen.jsx
import React, { useState } from 'react';
import { ICONS } from '../../components/icons';
import { motion } from 'framer-motion';
import { spring, whileTap, whileHover, zoomInOut } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';

/**
 * Компонент экрана "Счета".
 * Позволяет пользователю управлять своими счетами: добавлять, редактировать и удалять.
 * @returns {JSX.Element}
 */
const AccountsScreen = () => {
  const { accounts, setAccounts, goBack, navigateToScreen, setShowAddAccountModal, setEditingAccount } = useAppContext();

  const accountTypes = [
    { id: 'bank', name: 'Банковская карта', iconName: 'CreditCard' },
    { id: 'cash', name: 'Наличные', iconName: 'DollarSign' },
    { id: 'crypto', name: 'Криптовалюта', iconName: 'Bitcoin' }
  ];

  const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4'];
  
  /**
   * Возвращает компонент иконки по имени.
   * @param {string} name - Имя иконки.
   * @returns {React.Component} - Компонент иконки.
   */
  const getIcon = (name) => {
    return ICONS[name] || ICONS.CreditCard;
  };

  /**
   * Обрабатывает удаление счета.
   * @param {number} accountId - ID счета для удаления.
   */
  const handleDeleteAccount = (accountId) => {
    if (accounts.length > 1) {
      setAccounts(accounts.filter(acc => acc.id !== accountId));
    }
  };

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <motion.button
            onClick={goBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-200"
            whileTap={whileTap}
            transition={spring}
          >
            <ICONS.ChevronLeft className="w-6 h-6" />
          </motion.button>
          <h2 className="text-2xl font-bold text-gray-800">Счета</h2>
        </div>
        <motion.button
          onClick={() => {
            setEditingAccount(null);
            setShowAddAccountModal(true);
          }}
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
                  onClick={() => {
                    setEditingAccount(account);
                    setShowAddAccountModal(true);
                  }}
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