// src/context/useSettings.jsx
import React, { createContext, useState, useContext, useMemo, useCallback, useEffect } from 'react';
import { ICONS } from '../components/icons';
import { CURRENCIES, getCurrencySymbolByCode } from '../constants/currencies';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const defaultState = useMemo(() => ({
    categories: {
      income: [{ name: 'Зарплата', icon: 'DollarSign' }, { name: 'Фриланс', icon: 'Briefcase' }, { name: 'Инвестиции', icon: 'TrendingUp' }, { name: 'Подарки', icon: 'Gift' }, { name: 'С копилки', icon: 'PiggyBank' }, { name: 'Возврат долга', icon: 'Handshake' }, { name: 'Пополнение депозита', icon: 'Banknote' }, {name: 'Снятие с депозита', icon: 'Banknote'}],
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
  }), []);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currencyCode, setCurrencyCode] = useState('RUB');
  const [userProfile, setUserProfile] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState({
    income: [],
    expense: []
  });
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const getAccountByName = useCallback((name) => {
    const account = accounts.find(acc => acc.name === name) || accounts[0];
    const iconComponent = ICONS[account?.iconName] || ICONS.CreditCard;
    return { ...account, icon: iconComponent };
  }, [accounts]);
  
  const currencySymbol = useMemo(() => getCurrencySymbolByCode(currencyCode), [currencyCode]);

  const daysActive = useMemo(() => {
    if (!userProfile.creationDate) return 0;
    const now = new Date();
    const creationDate = new Date(userProfile.creationDate);
    const diffTime = Math.abs(now - creationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  }, [userProfile.creationDate]);

  const value = useMemo(() => ({
    isDarkMode, setIsDarkMode,
    currencyCode, setCurrencyCode,
    userProfile, setUserProfile,
    accounts, setAccounts,
    categories, setCategories,
    showEditProfileModal, setShowEditProfileModal,
    showAddAccountModal, setShowAddAccountModal,
    editingAccount, setEditingAccount,
    showAddCategoryModal, setShowAddCategoryModal,
    editingCategory, setEditingCategory,
    getAccountByName,
    currencySymbol,
    daysActive,
    defaultState,
  }), [
    isDarkMode, setIsDarkMode,
    currencyCode, setCurrencyCode,
    userProfile, setUserProfile,
    accounts, setAccounts,
    categories, setCategories,
    showEditProfileModal, setShowEditProfileModal,
    showAddAccountModal, setShowAddAccountModal,
    editingAccount, setEditingAccount,
    showAddCategoryModal, setShowAddCategoryModal,
    editingCategory, setEditingCategory,
    getAccountByName,
    currencySymbol,
    daysActive,
    defaultState
  ]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === null) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};