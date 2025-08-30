// src/features/profile/DebtsScreen.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../../components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { spring, whileTap, zoomInOut, whileHover } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';

/**
 * Виджет для отображения долгов "Я должен"
 */
const IOweWidget = ({ totalAmount, debtsCount, currencySymbol }) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-3xl p-6 text-white shadow-lg shadow-red-500/20 min-h-[160px] flex flex-col justify-between">
    {/* Декоративный элемент */}
    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
          <ICONS.ArrowDownCircle className="w-6 h-6" />
        </div>
        <div className="text-right">
          <div className="text-sm font-medium opacity-90">Я должен</div>
          <div className="text-xs opacity-70">{debtsCount} долг{debtsCount > 1 ? 'а' : ''}</div>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="text-2xl font-bold mb-1">
          {totalAmount.toLocaleString()} {currencySymbol}
        </div>
        <div className="text-sm opacity-80">
          к возврату
        </div>
      </div>
      
      <div className="flex items-center text-sm opacity-80">
        <div className="w-1 h-1 bg-white rounded-full mr-2" />
        {debtsCount > 0 ? 'Требует погашения' : 'Нет долгов'}
      </div>
    </div>
  </div>
);

/**
 * Виджет для отображения долгов "Мне должны"
 */
const OweMeWidget = ({ totalAmount, debtsCount, currencySymbol }) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-3xl p-6 text-white shadow-lg shadow-green-500/20 min-h-[160px] flex flex-col justify-between">
    {/* Декоративный элемент */}
    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
          <ICONS.ArrowUpCircle className="w-6 h-6" />
        </div>
        <div className="text-right">
          <div className="text-sm font-medium opacity-90">Мне должны</div>
          <div className="text-xs opacity-70">{debtsCount} долг{debtsCount > 1 ? 'а' : ''}</div>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="text-2xl font-bold mb-1">
          {totalAmount.toLocaleString()} {currencySymbol}
        </div>
        <div className="text-sm opacity-80">
          к получению
        </div>
      </div>
      
      <div className="flex items-center text-sm opacity-80">
        <div className="w-1 h-1 bg-white rounded-full mr-2" />
        {debtsCount > 0 ? 'Ожидается возврат' : 'Нет долгов'}
      </div>
    </div>
  </div>
);

/**
 * Виджет общего баланса долгов
 */
const BalanceWidget = ({ netBalance, totalDebts, currencySymbol }) => {
  const isPositive = netBalance >= 0;
  
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${
      isPositive 
        ? 'from-blue-500 via-blue-600 to-blue-700 shadow-blue-500/20' 
        : 'from-orange-500 via-orange-600 to-orange-700 shadow-orange-500/20'
    } rounded-3xl p-6 text-white shadow-lg min-h-[160px] flex flex-col justify-between`}>
      {/* Декоративный элемент */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
            <ICONS.Scale className="w-6 h-6" />
          </div>
          <div className="text-right">
            <div className="text-sm font-medium opacity-90">Баланс</div>
            <div className="text-xs opacity-70">{totalDebts} всего</div>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="text-2xl font-bold mb-1">
            {isPositive ? '+' : ''}{Math.abs(netBalance).toLocaleString()} {currencySymbol}
          </div>
          <div className="text-sm opacity-80">
            {isPositive ? 'в вашу пользу' : 'к доплате'}
          </div>
        </div>
        
        <div className="flex items-center text-sm opacity-80">
          <div className={`w-1 h-1 rounded-full mr-2 ${isPositive ? 'bg-green-200' : 'bg-red-200'}`} />
          {isPositive ? 'Положительный баланс' : 'Отрицательный баланс'}
        </div>
      </div>
    </div>
  );
};

/**
 * Компонент свайпера виджетов в стиле iOS
 */
const WidgetSwiper = ({ widgets, activeIndex, onIndexChange }) => {
  const [startX, setStartX] = useState(null);
  const [currentTranslateX, setCurrentTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const threshold = 50; // Минимальное расстояние для смены виджета

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || startX === null) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setCurrentTranslateX(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    if (Math.abs(currentTranslateX) > threshold) {
      if (currentTranslateX > 0 && activeIndex > 0) {
        onIndexChange(activeIndex - 1);
      } else if (currentTranslateX < 0 && activeIndex < widgets.length - 1) {
        onIndexChange(activeIndex + 1);
      }
    }
    
    setCurrentTranslateX(0);
    setStartX(null);
    setIsDragging(false);
  };

  useEffect(() => {
    setCurrentTranslateX(0);
  }, [activeIndex]);

  return (
    <div className="relative overflow-hidden">
      <motion.div
        ref={containerRef}
        className="flex"
        style={{
          transform: `translateX(${-activeIndex * 100 + (currentTranslateX / (containerRef.current?.offsetWidth || 1)) * 100}%)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {widgets.map((widget, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {widget}
          </div>
        ))}
      </motion.div>
      
      {/* Индикаторы */}
      <div className="flex justify-center mt-4 space-x-2">
        {widgets.map((_, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === activeIndex 
                ? 'bg-blue-500 w-4' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Компонент экрана "Долги" с переработанным дизайном.
 */
const DebtsScreen = () => {
  const {
    debts,
    setDebts,
    goBack,
    setTransactions,
    currencySymbol,
    setShowAddDebtModal,
    setEditingDebt
  } = useAppContext();

  const [activeWidgetIndex, setActiveWidgetIndex] = useState(0);

  /**
   * Обрабатывает удаление долга.
   */
  const handleDeleteDebt = (id) => {
    if (debts.length > 1) {
      setDebts(debts.filter(debt => debt.id !== id));
    }
  };

  /**
   * Обрабатывает погашение долга, который пользователь должен.
   */
  const handlePayBackDebt = (debt) => {
    const newTransaction = {
      id: Date.now(),
      type: 'expense',
      amount: debt.amount,
      category: 'Отдача долга',
      account: 'Основной',
      date: new Date().toISOString().split('T')[0],
      description: `Отдача долга ${debt.person}`
    };
    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
    handleDeleteDebt(debt.id);
  };

  /**
   * Обрабатывает возврат долга, который должны пользователю.
   */
  const handleWriteOffDebt = (debt) => {
    const newTransaction = {
      id: Date.now(),
      type: 'income',
      amount: debt.amount,
      category: 'Возврат долга',
      account: 'Основной',
      date: new Date().toISOString().split('T')[0],
      description: `Возврат долга от ${debt.person}`
    };
    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
    handleDeleteDebt(debt.id);
  };

  /**
   * Обрабатывает прощение долга, который должны пользователю.
   */
  const handleForgiveDebt = (id) => {
    handleDeleteDebt(id);
  };

  // Расчеты для виджетов
  const owedToMe = debts.filter(debt => debt.type === 'owed-to-me');
  const iOwe = debts.filter(debt => debt.type === 'i-owe');
  
  const totalOwedToMe = owedToMe.reduce((sum, debt) => sum + debt.amount, 0);
  const totalIOwe = iOwe.reduce((sum, debt) => sum + debt.amount, 0);
  const netBalance = totalOwedToMe - totalIOwe;

  // Виджеты для свайпера
  const widgets = [
    <IOweWidget 
      key="iowe"
      totalAmount={totalIOwe} 
      debtsCount={iOwe.length} 
      currencySymbol={currencySymbol} 
    />,
    <OweMeWidget 
      key="oweme"
      totalAmount={totalOwedToMe} 
      debtsCount={owedToMe.length} 
      currencySymbol={currencySymbol} 
    />,
    <BalanceWidget 
      key="balance"
      netBalance={netBalance} 
      totalDebts={debts.length} 
      currencySymbol={currencySymbol} 
    />
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      {/* Header в стиле HomeScreen */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <motion.button
              onClick={goBack}
              className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              whileTap={whileTap}
              transition={spring}
            >
              <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Долги
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Управление долговыми обязательствами
              </p>
            </div>
          </div>
          
          <motion.div
            className="text-right"
            variants={zoomInOut}
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Баланс</div>
            <div className={`text-xl font-bold ${
              netBalance >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {netBalance >= 0 ? '+' : ''}{netBalance.toLocaleString()} {currencySymbol}
            </div>
          </motion.div>
        </div>
        
        {/* Краткая сводка */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Всего долгов</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {debts.length}
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-600" />
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Активных</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {debts.length}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                netBalance >= 0 ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {netBalance >= 0 ? 'В плюсе' : 'В минусе'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="px-6 py-6 space-y-6">
        
        {/* Виджеты с свайпером */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 px-2">
            Обзор долгов
          </h2>
          
          <motion.div
            variants={zoomInOut}
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.2 }}
          >
            <WidgetSwiper 
              widgets={widgets}
              activeIndex={activeWidgetIndex}
              onIndexChange={setActiveWidgetIndex}
            />
          </motion.div>
        </div>

        {/* Детализированные списки долгов */}
        <div className="space-y-8">
          
          {/* Секция "Я должен" */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Я должен
              </h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {iOwe.length} долг{iOwe.length !== 1 ? 'а' : ''}
              </div>
            </div>
            
            <div className="space-y-3">
              {iOwe.length > 0 ? (
                iOwe.map((debt, index) => (
                  <motion.div 
                    key={debt.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                    variants={zoomInOut}
                    whileInView="whileInView"
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mr-4">
                          <ICONS.ArrowDownCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">{debt.person}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{debt.description}</div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">{debt.date}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-bold text-red-600 text-lg">
                            {debt.amount.toLocaleString()} {currencySymbol}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <motion.button
                            onClick={() => handlePayBackDebt(debt)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-colors"
                            whileTap={whileTap}
                            whileHover={whileHover}
                            transition={spring}
                            title="Погасить долг"
                          >
                            <ICONS.Check className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            onClick={() => {
                              setEditingDebt(debt);
                              setShowAddDebtModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
                            whileTap={whileTap}
                            whileHover={whileHover}
                            transition={spring}
                            title="Редактировать"
                          >
                            <ICONS.Edit className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteDebt(debt.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                            whileTap={whileTap}
                            whileHover={whileHover}
                            transition={spring}
                            title="Удалить"
                          >
                            <ICONS.Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
                  variants={zoomInOut}
                  whileInView="whileInView"
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <ICONS.ArrowDownCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    У вас нет долгов
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Отличная финансовая дисциплина!
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Секция "Мне должны" */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Мне должны
              </h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {owedToMe.length} долг{owedToMe.length !== 1 ? 'а' : ''}
              </div>
            </div>
            
            <div className="space-y-3">
              {owedToMe.length > 0 ? (
                owedToMe.map((debt, index) => (
                  <motion.div 
                    key={debt.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                    variants={zoomInOut}
                    whileInView="whileInView"
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mr-4">
                          <ICONS.ArrowUpCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">{debt.person}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{debt.description}</div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">{debt.date}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-bold text-green-600 text-lg">
                            +{debt.amount.toLocaleString()} {currencySymbol}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <motion.button
                            onClick={() => handleWriteOffDebt(debt)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-colors"
                            whileTap={whileTap}
                            whileHover={whileHover}
                            transition={spring}
                            title="Получить возврат"
                          >
                            <ICONS.Check className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleForgiveDebt(debt.id)}
                            className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-xl transition-colors"
                            whileTap={whileTap}
                            whileHover={whileHover}
                            transition={spring}
                            title="Простить долг"
                          >
                            <ICONS.X className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            onClick={() => {
                              setEditingDebt(debt);
                              setShowAddDebtModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
                            whileTap={whileTap}
                            whileHover={whileHover}
                            transition={spring}
                            title="Редактировать"
                          >
                            <ICONS.Edit className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteDebt(debt.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                            whileTap={whileTap}
                            whileHover={whileHover}
                            transition={spring}
                            title="Удалить"
                          >
                            <ICONS.Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
                  variants={zoomInOut}
                  whileInView="whileInView"
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <ICONS.ArrowUpCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Вам никто не должен
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Все долги возвращены или вы пока никому не одалживали
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtsScreen;