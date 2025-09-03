// src/context/useSettings.jsx
import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { ICONS } from '../components/icons';
import { getCurrencySymbolByCode } from '../constants/currencies';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children, settings, setSettings }) => {
  const isDarkMode = settings.isDarkMode;
  const setIsDarkMode = useCallback((value) => setSettings(prev => ({ ...prev, isDarkMode: value })), [setSettings]);
  
  const currencyCode = settings.currencyCode;
  const setCurrencyCode = useCallback((value) => setSettings(prev => ({ ...prev, currencyCode: value })), [setSettings]);
  
  const userProfile = settings.userProfile;
  const setUserProfile = useCallback((value) => setSettings(prev => ({ ...prev, userProfile: value })), [setSettings]);
  
  const accounts = settings.accounts;
  const setAccounts = useCallback((value) => setSettings(prev => ({ ...prev, accounts: value })), [setSettings]);
  
  const categories = settings.categories;
  const setCategories = useCallback((value) => setSettings(prev => ({ ...prev, categories: value })), [setSettings]);
  
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
  }), [
    isDarkMode, currencyCode, userProfile, accounts, categories,
    showEditProfileModal, showAddAccountModal, editingAccount,
    showAddCategoryModal, editingCategory, getAccountByName, currencySymbol, daysActive,
    setIsDarkMode, setCurrencyCode, setUserProfile, setAccounts, setCategories
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