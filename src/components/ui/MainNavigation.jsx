// src/components/ui/MainNavigation.jsx
import React from 'react';
import { ICONS } from '../icons';
import { useAppContext } from '../../context/AppContext';

const MainNavigation = () => {
  const {
    activeTab,
    setActiveTab,
    setShowAddTransaction,
    setEditingTransaction,
    setCurrentScreen,
    showAddTransaction,
    editingTransaction
  } = useAppContext();

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setCurrentScreen('');
    setShowAddTransaction(false);
    setEditingTransaction(null);
  };

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 z-10 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-around items-center py-2">
        <button
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center p-2 ${
            activeTab === 'home' && !showAddTransaction && !editingTransaction ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <ICONS.Home className="w-6 h-6" />
          <span className="text-xs mt-1">Главная</span>
        </button>

        <button
          onClick={() => handleTabClick('analytics')}
          className={`flex flex-col items-center p-2 ${
            activeTab === 'analytics' && !showAddTransaction && !editingTransaction ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <ICONS.PieChart className="w-6 h-6" />
          <span className="text-xs mt-1">Аналитика</span>
        </button>

        <button
          onClick={() => {
            setShowAddTransaction(true);
            setEditingTransaction(null);
          }}
          className="flex flex-col items-center p-2 bg-blue-600 rounded-full text-white mx-2"
        >
          <ICONS.PlusCircle className="w-8 h-8" />
        </button>

        <button
          onClick={() => handleTabClick('savings')}
          className={`flex flex-col items-center p-2 ${
            activeTab === 'savings' && !showAddTransaction && !editingTransaction ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <ICONS.PiggyBank className="w-6 h-6" />
          <span className="text-xs mt-1">Копилка</span>
        </button>

        <button
          onClick={() => handleTabClick('profile')}
          className={`flex flex-col items-center p-2 ${
            activeTab === 'profile' && !showAddTransaction && !editingTransaction ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <ICONS.User className="w-6 h-6" />
          <span className="text-xs mt-1">Профиль</span>
        </button>
      </div>
    </div>
  );
};

export default MainNavigation;