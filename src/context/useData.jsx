// src/context/useData.jsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { fetchAllUserData, saveItem, deleteItem } from '../services/supabaseService';
import deepEqual from 'deep-equal';

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

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export const useData = ({ user, session }) => {
  const [data, setData] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [cloudData, setCloudData] = useState(null);
  const [showSyncConflictModal, setShowSyncConflictModal] = useState(false);
  const [syncConflictData, setSyncConflictData] = useState(null);

  const syncCategories = useMemo(() => ['settings', 'transactions', 'financialProducts', 'debts', 'budgets', 'goals'], []);
  
  const handleResolveConflict = useCallback((category, version) => {
    if (!syncConflictData) return;
    
    let resolvedData = { ...data };

    if (category === 'all') {
      resolvedData = version === 'local' ? syncConflictData.local : syncConflictData.cloud;
    } else {
      resolvedData[category] = version === 'local' ? syncConflictData.local[category] : syncConflictData.cloud[category];
    }
    
    setData(resolvedData);
    setShowSyncConflictModal(false);
    setSyncConflictData(null);
    
    const syncData = async () => {
        if (user && resolvedData) {
            await saveToSupabase(resolvedData);
        }
    };
    syncData();
    
  }, [syncConflictData, data, user]);

  const saveToSupabase = useCallback(async (currentData) => {
    if (!user) return;
    
    console.log('☁️ Синхронизация данных с Supabase...');
    
    const saveData = async (table, items) => {
        for (const item of items) {
            await saveItem(table, item);
        }
    };
    
    try {
        await saveItem('settings', { id: user.id, data: currentData.settings });
        await saveData('transactions', currentData.transactions.transactions);
        await saveData('financialProducts', [...currentData.financialProducts.loans, ...currentData.financialProducts.deposits]);
        await saveData('debts', currentData.debts);
        await saveData('budgets', currentData.budgets);
        await saveData('goals', currentData.goals);
        setLastSync(new Date());
        console.log('☁️ Синхронизация завершена!');
    } catch (error) {
        console.error('Ошибка синхронизации с Supabase:', error);
    }
    
  }, [user]);

  const loadData = useCallback(async () => {
    let loadedData = {};
    if (user) {
      try {
        console.log('🔄 Загрузка данных из Supabase...');
        const fetchedData = await fetchAllUserData(user.id);
        
        const settingsRecord = fetchedData.settings.records[0];
        const settingsData = settingsRecord ? settingsRecord.data : getDefaultState().settings;

        loadedData = {
          settings: settingsData,
          transactions: {
            transactions: fetchedData.transactions.records,
            loanTransactions: [],
            depositTransactions: []
          },
          financialProducts: {
            loans: fetchedData.financialProducts.records.filter(item => item.data.type === 'loan'),
            deposits: fetchedData.financialProducts.records.filter(item => item.data.type === 'deposit')
          },
          debts: fetchedData.debts.records,
          budgets: fetchedData.budgets.records,
          goals: fetchedData.goals.records
        };
        
        setCloudData(loadedData);
        
        const localData = JSON.parse(localStorage.getItem(LS_PREFIX + 'data'));
        if (localData) {
          const conflicts = {};
          syncCategories.forEach(key => {
            if (!deepEqual(localData[key], loadedData[key])) {
              conflicts[key] = true;
            }
          });
          if (Object.keys(conflicts).length > 0) {
            setSyncConflictData({
              local: localData,
              cloud: loadedData,
              conflicts: conflicts,
            });
            setShowSyncConflictModal(true);
            return;
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки данных из Supabase:', error);
        loadedData = JSON.parse(localStorage.getItem(LS_PREFIX + 'data')) || getDefaultState();
      }
    } else {
      console.log('🔄 Загрузка данных из localStorage...');
      loadedData = JSON.parse(localStorage.getItem(LS_PREFIX + 'data')) || getDefaultState();
    }
    
    setData(loadedData);
    setIsDataLoaded(true);
    setLastSync(new Date());
  }, [user, syncCategories]);

  useEffect(() => {
    if (session) {
      loadData();
    } else {
      setData(JSON.parse(localStorage.getItem(LS_PREFIX + 'data')) || getDefaultState());
      setIsDataLoaded(true);
    }
  }, [session, loadData]);

  const debouncedSaveToSupabase = useMemo(() => debounce(saveToSupabase, 2000), [saveToSupabase]);

  useEffect(() => {
    if (data) {
      try {
        localStorage.setItem(LS_PREFIX + 'data', JSON.stringify(data));
        if (user && !showSyncConflictModal) {
            debouncedSaveToSupabase(data);
        }
      } catch (error) {
        console.error("Failed to save data to localStorage:", error);
      }
    }
  }, [data, user, debouncedSaveToSupabase, showSyncConflictModal]);
  
  return { 
    data, 
    setData,
    isDataLoaded,
    showSyncConflictModal,
    setShowSyncConflictModal,
    syncConflictData,
    handleResolveConflict
  };
};