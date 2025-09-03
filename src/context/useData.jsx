// src/context/useData.jsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import { CURRENCIES } from '../constants/currencies';
import { ICONS } from '../components/icons';

const LS_PREFIX = 'financialAppState_';

const getDefaultState = () => ({
  settings: {
    categories: {
      income: [{ name: 'Зарплата', icon: 'DollarSign' }, { name: 'Фриланс', icon: 'Briefcase' }, { name: 'Инвестиции', icon: 'TrendingUp' }, { name: 'Подарки', icon: 'Gift' }, { name: 'С копилки', icon: 'PiggyBank' }, { name: 'Возврат долга', icon: 'Handshake' }, { name: 'Снятие с депозита', icon: 'Banknote'}],
      expense: [{ name: 'Продукты', icon: 'ShoppingBag' }, { name: 'Транспорт', icon: 'Car' }, { name: 'Развлечения', icon: 'Film' }, { name: 'Коммунальные услуги', icon: 'Building' }, { name: 'Одежда', icon: 'Shirt' }, { name: 'Здоровье', icon: 'Heart' }, { name: 'В копилку', icon: 'PiggyBank' }, { name: 'Отдача долга', icon: 'Handshake' }, { name: 'Погашение кредита', icon: 'MinusCircle' }, {name: 'Пополнение депозита', icon: 'Banknote'}]
    },
    accounts: [
      { id: 1, name: 'Основной', type: 'bank', iconName: 'CreditCard', color: '#3b82f6' },
      { id: 2, name: 'Карта Сбер', type: 'bank', iconName: 'CreditCard', color: '#22c55e' },
      { id: 3, name: 'Наличные', type: 'cash', iconName: 'DollarSign', color: '#f59e0b' }
    ],
    userProfile: {
      name: 'Пользователь',
      email: 'user@example.com',
      avatar: '👤',
      avatarColor: '#3b82f6',
      creationDate: new Date().toISOString().split('T')[0],
    },
    isDarkMode: false,
    currencyCode: 'RUB',
  },
  transactions: {
    transactions: [],
    loanTransactions: [],
    depositTransactions: []
  },
  financialProducts: {
    loans: [],
    deposits: []
  },
  debts: [],
  budgets: [],
  goals: []
});

export const useData = () => {
  const [data, setData] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const savedSettings = JSON.parse(localStorage.getItem(LS_PREFIX + 'settings'));
      const savedTransactions = JSON.parse(localStorage.getItem(LS_PREFIX + 'transactions'));
      const savedProducts = JSON.parse(localStorage.getItem(LS_PREFIX + 'products'));
      const savedDebts = JSON.parse(localStorage.getItem(LS_PREFIX + 'debts'));
      const savedBudgets = JSON.parse(localStorage.getItem(LS_PREFIX + 'budgets'));
      const savedGoals = JSON.parse(localStorage.getItem(LS_PREFIX + 'goals'));
      
      const defaultState = getDefaultState();

      setData({
        settings: savedSettings || defaultState.settings,
        transactions: savedTransactions || defaultState.transactions,
        financialProducts: savedProducts || defaultState.financialProducts,
        debts: savedDebts || defaultState.debts,
        budgets: savedBudgets || defaultState.budgets,
        goals: savedGoals || defaultState.goals,
      });
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      setData(getDefaultState());
    } finally {
      setIsDataLoaded(true);
    }
  }, []);

  // Sync data with localStorage whenever it changes
  useEffect(() => {
    if (data) {
      try {
        localStorage.setItem(LS_PREFIX + 'settings', JSON.stringify(data.settings));
        localStorage.setItem(LS_PREFIX + 'transactions', JSON.stringify(data.transactions));
        localStorage.setItem(LS_PREFIX + 'products', JSON.stringify(data.financialProducts));
        localStorage.setItem(LS_PREFIX + 'debts', JSON.stringify(data.debts));
        localStorage.setItem(LS_PREFIX + 'budgets', JSON.stringify(data.budgets));
        localStorage.setItem(LS_PREFIX + 'goals', JSON.stringify(data.goals));
      } catch (error) {
        console.error("Failed to save data to localStorage:", error);
      }
    }
  }, [data]);
  
  return { 
    data, 
    setData,
    isDataLoaded,
  };
};