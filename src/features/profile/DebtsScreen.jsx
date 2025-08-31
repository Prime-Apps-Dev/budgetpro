// src/features/profile/DebtsScreen.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../../components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { spring, whileTap, zoomInOut, whileHover } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import FinancialItemCard from '../../components/ui/FinancialItemCard';
import AlertModal from '../../components/modals/AlertModal';
import TabSwitcher from '../../components/ui/TabSwitcher';
import NoItemsPlaceholder from '../../components/ui/NoItemsPlaceholder';
import LongPressWrapper from '../../components/ui/LongPressWrapper';

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
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
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
 * Интерактивная карточка долга с жестами
 */
const InteractiveDebtCard = ({ 
  debt, 
  currencySymbol,
  onEdit, 
  onDelete,
  onClick,
  onDoubleClick
}) => {
  const isIOwe = debt.type === 'i-owe';
  const gradient = isIOwe 
    ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700' 
    : 'bg-gradient-to-br from-green-500 via-green-600 to-green-700';
  const iconName = isIOwe ? 'ArrowDownCircle' : 'ArrowUpCircle';
  
  return (
    <LongPressWrapper
      onTap={() => onClick(debt)}
      onLongPress={() => onEdit(debt)}
      onSwipeLeft={() => onDelete(debt)}
      onDoubleTap={() => onDoubleClick(debt)}
      swipeDeleteIcon={ICONS.Trash2} // Добавляем иконку корзины
    >
      <FinancialItemCard
        title={debt.person}
        subtitle={debt.description}
        amountText={`${isIOwe ? '' : '+'}${debt.amount.toLocaleString()} ${currencySymbol}`}
        infoText={debt.date}
        gradient={gradient}
        iconName={iconName}
        type={debt.type}
      />
    </LongPressWrapper>
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
    currencySymbol,
    setShowAddDebtModal,
    setEditingDebt,
    setShowAddTransaction,
    setSelectedDebtToRepay,
    setSelectedDebtForTransactions,
    setShowDebtTransactionsModal,
  } = useAppContext();
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState(null);

  const [activeWidgetIndex, setActiveWidgetIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('all');

  /**
   * Обрабатывает удаление долга.
   */
  const handleDeleteDebt = (debt) => {
    setDebtToDelete(debt);
    setShowConfirmDelete(true);
  };
  
  const handleConfirmDelete = () => {
    if (debtToDelete) {
      setDebts(debts.filter(debt => debt.id !== debtToDelete.id));
    }
    setShowConfirmDelete(false);
    setDebtToDelete(null);
  };
  
  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setDebtToDelete(null);
  };

  /**
   * Обрабатывает редактирование долга (долгое нажатие).
   */
  const handleEditDebt = (debt) => {
    setEditingDebt(debt);
    setShowAddDebtModal(true);
  };

  /**
   * Обрабатывает одиночный клик по карточке, открывая модальное окно с транзакциями.
   */
  const handleDebtCardClick = (debt) => {
    setSelectedDebtForTransactions(debt);
    setShowDebtTransactionsModal(true);
  };

  /**
   * Обрабатывает двойной клик по карточке, открывая модальное окно добавления транзакции.
   */
  const handleDebtCardDoubleClick = (debt) => {
    setSelectedDebtToRepay(debt);
    setShowAddTransaction(true);
  };
  
  const tabs = [
    { id: 'all', label: 'Все', icon: ICONS.Layers },
    { id: 'i-owe', label: 'Я должен', icon: ICONS.ArrowDownCircle },
    { id: 'owed-to-me', label: 'Мне должны', icon: ICONS.ArrowUpCircle }
  ];
  
  const getFilteredDebts = () => {
    if (activeTab === 'i-owe') return debts.filter(debt => debt.type === 'i-owe');
    if (activeTab === 'owed-to-me') return debts.filter(debt => debt.type === 'owed-to-me');
    return debts;
  };
  
  const filteredDebts = getFilteredDebts();

  // Расчеты для виджетов
  const owedToMe = debts.filter(debt => debt.type === 'owed-to-me');
  const iOwe = debts.filter(debt => debt.type === 'i-owe');
  
  const totalOwedToMe = owedToMe.reduce((sum, debt) => sum + debt.amount, 0);
  const totalIOwe = iOwe.reduce((sum, debt) => sum + debt.amount, 0);
  const netBalance = totalOwedToMe - totalIOwe;

  // Виджеты для свайпера
  const widgets = [
    <BalanceWidget 
      key="balance"
      netBalance={netBalance} 
      totalDebts={debts.length} 
      currencySymbol={currencySymbol} 
    />,
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
    />
  ];

  const renderDebtList = (debtList) => {
    return (
      <motion.div
        key={activeTab}
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {debtList.map((debt, index) => (
          <motion.div 
            key={debt.id}
            variants={zoomInOut}
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: index * 0.05 }}
          >
            <InteractiveDebtCard
              debt={debt}
              currencySymbol={currencySymbol}
              onEdit={handleEditDebt}
              onDelete={handleDeleteDebt}
              onClick={handleDebtCardClick}
              onDoubleClick={handleDebtCardDoubleClick}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  };

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
          </motion.div>
        </div>
        
        {/* Краткая сводка */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-left">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Всего долгов</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {debts.length}
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-600" />
              <div className="text-left">
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
      <div className="px-6 py-6 space-y-16">
        
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

        {/* Переключатель вкладок */}
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

        {/* Детализированные списки долгов */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'all' ? (
              <motion.div key="all-debts" className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {iOwe.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Я должен
                      </h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {iOwe.length} долг{iOwe.length !== 1 ? 'а' : ''}
                      </div>
                    </div>
                    {renderDebtList(iOwe)}
                  </div>
                )}
                {owedToMe.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Мне должны
                      </h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {owedToMe.length} долг{owedToMe.length !== 1 ? 'а' : ''}
                      </div>
                    </div>
                    {renderDebtList(owedToMe)}
                  </div>
                )}
                {debts.length === 0 && (
                  <NoItemsPlaceholder
                    iconName="Layers"
                    iconColor="#3b82f6"
                    title="У вас нет долгов"
                    description="Отличная финансовая дисциплина!"
                    actions={[
                      { label: 'Добавить долг', onClick: () => setShowAddDebtModal(true), colorClass: 'bg-blue-600 hover:bg-blue-700' }
                    ]}
                  />
                )}
              </motion.div>
            ) : (
              <motion.div key={activeTab} className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {filteredDebts.length > 0 ? (
                  filteredDebts.map((debt, index) => (
                    <motion.div 
                      key={debt.id}
                      variants={zoomInOut}
                      whileInView="whileInView"
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <InteractiveDebtCard
                        debt={debt}
                        currencySymbol={currencySymbol}
                        onEdit={handleEditDebt}
                        onDelete={handleDeleteDebt}
                        onClick={handleDebtCardClick}
                        onDoubleClick={handleDebtCardDoubleClick}
                      />
                    </motion.div>
                  ))
                ) : (
                  <NoItemsPlaceholder
                    iconName={activeTab === 'i-owe' ? 'ArrowDownCircle' : 'ArrowUpCircle'}
                    iconColor={activeTab === 'i-owe' ? '#ef4444' : '#22c55e'}
                    title={activeTab === 'i-owe' ? 'У вас нет долгов' : 'Вам никто не должен'}
                    description={activeTab === 'i-owe' ? 'Отличная финансовая дисциплина!' : 'Все долги возвращены или вы пока никому не одалживали'}
                    actions={[
                      { label: 'Добавить долг', onClick: () => setShowAddDebtModal(true), colorClass: 'bg-blue-600 hover:bg-blue-700' }
                    ]}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <AlertModal
        isVisible={showConfirmDelete}
        title="Удалить долг?"
        message={`Долг "${debtToDelete?.person}" на сумму ${debtToDelete?.amount.toLocaleString()} ${currencySymbol} будет удален безвозвратно. Это действие нельзя отменить.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default DebtsScreen;