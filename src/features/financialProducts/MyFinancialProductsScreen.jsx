// src/features/financialProducts/MyFinancialProductsScreen.jsx
import React, { useState, useRef } from 'react';
import { ICONS } from '../../components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { spring, whileTap, whileHover, slideUp, fadeIn, staggerContainer } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import FinancialItemCard from '../../components/ui/FinancialItemCard';
import TabSwitcher from '../../components/ui/TabSwitcher';
import NoItemsPlaceholder from '../../components/ui/NoItemsPlaceholder';
import LongPressWrapper from '../../components/ui/LongPressWrapper';
import AlertModal from '../../components/modals/AlertModal';

/**
 * Компонент статистики
 */
const StatsOverview = ({ loans, deposits, currencySymbol }) => {
  const totalDebt = loans.reduce((sum, loan) => sum + loan.currentBalance, 0);
  const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.currentAmount, 0);
  const totalInterest = deposits.reduce((sum, deposit) => sum + deposit.totalInterest, 0);
  
  return (
    <motion.div
      className="grid grid-cols-2 gap-4 mb-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 text-white"
        variants={slideUp}
      >
        <div className="flex items-center mb-2">
          <ICONS.MinusCircle className="w-5 h-5 mr-2" />
          <span className="text-sm opacity-90">Долги</span>
        </div>
        <p className="text-2xl font-bold">{totalDebt.toLocaleString()} {currencySymbol}</p>
        <p className="text-xs opacity-80">{loans.length} кредитов</p>
      </motion.div>

      <motion.div
        className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white"
        variants={slideUp}
      >
        <div className="flex items-center mb-2">
          <ICONS.Banknote className="w-5 h-5 mr-2" />
          <span className="text-sm opacity-90">Депозиты</span>
        </div>
        <p className="text-2xl font-bold">{totalDeposits.toLocaleString()} {currencySymbol}</p>
        <p className="text-xs opacity-80">+{totalInterest.toLocaleString()} доход</p>
      </motion.div>
    </motion.div>
  );
};

/**
 * Основной компонент экрана "Финансовые продукты".
 */
const MyFinancialProductsScreen = () => {
  const {
    loansWithBalance: loans = [],
    depositsWithBalance: deposits = [],
    setLoans,
    setDeposits,
    goBack,
    setSelectedFinancialItem,
    setShowAddFinancialItemModal,
    setEditingFinancialItem,
    currencySymbol,
    closeAllModals,
    setShowLoanDepositTransactionModal,
    setSelectedLoanDepositForTransaction
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('all');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  /**
   * Получает отфильтрованный список элементов
   */
  const getFilteredItems = () => {
    const allItems = [
      ...loans.map(loan => ({ ...loan, type: 'loan' })),
      ...deposits.map(deposit => ({ ...deposit, type: 'deposit' }))
    ];

    switch (activeTab) {
      case 'loans':
        return loans.map(loan => ({ ...loan, type: 'loan' }));
      case 'deposits':
        return deposits.map(deposit => ({ ...deposit, type: 'deposit' }));
      default:
        return allItems.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
  };

  /**
   * Обрабатывает клик по элементу списка, открывая детали.
   */
  const handleItemClick = (item) => {
    console.log('Нажат элемент:', item.name, item.type);
    setSelectedFinancialItem(item);
  };

  /**
   * Обрабатывает долгое нажатие для редактирования.
   * @param {object} item - Объект продукта для редактирования.
   */
  const handleLongPress = (item) => {
    closeAllModals();
    console.log('Долгое нажатие на продукт:', item.name);
    setEditingFinancialItem(item); // Устанавливаем редактируемый элемент
    setShowAddFinancialItemModal(true); // Открываем модальное окно редактирования
  };
  
  /**
   * Обрабатывает двойной клик для добавления транзакции.
   */
  const handleDoubleClick = (item) => {
    closeAllModals();
    console.log('Двойной клик на продукт:', item.name);
    setSelectedLoanDepositForTransaction(item);
    setShowLoanDepositTransactionModal(true);
  };

  /**
   * Обрабатывает удаление элемента
   */
  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmDelete(true);
  };
  
  const handleConfirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'loan') {
        setLoans(prevLoans => prevLoans.filter(loan => loan.id !== itemToDelete.id));
      } else {
        setDeposits(prevDeposits => prevDeposits.filter(deposit => deposit.id !== itemToDelete.id));
      }
    }
    setShowConfirmDelete(false);
    setItemToDelete(null);
  };
  
  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setItemToDelete(null);
  };


  /**
   * Обрабатывает добавление кредита
   */
  const handleAddLoan = () => {
    closeAllModals();
    console.log('Добавление кредита');
    setEditingFinancialItem({ type: 'loan' });
    setShowAddFinancialItemModal(true);
  };

  /**
   * Обрабатывает добавление депозита
   */
  const handleAddDeposit = () => {
    closeAllModals();
    console.log('Добавление депозита');
    setEditingFinancialItem({ type: 'deposit' });
    setShowAddFinancialItemModal(true);
  };

  const filteredItems = getFilteredItems();
  const tabs = [
    { id: 'all', label: 'Все', icon: ICONS.Layers },
    { id: 'loans', label: 'Кредиты', icon: ICONS.MinusCircle },
    { id: 'deposits', label: 'Депозиты', icon: ICONS.Banknote }
  ];

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Заголовок */}
      <div className="flex items-center mb-6">
        <motion.button
          onClick={goBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          whileTap={whileTap}
          transition={spring}
        >
          <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
        </motion.button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Финансовые продукты
        </h1>
      </div>

      {/* Статистика */}
      <StatsOverview loans={loans} deposits={deposits} currencySymbol={currencySymbol} />

      {/* Переключатель вкладок */}
      <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      {/* Список элементов */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="space-y-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <motion.div
                key={`${item.type}-${item.id}`}
                variants={slideUp}
              >
                <LongPressWrapper
                  onTap={() => handleItemClick(item)}
                  onLongPress={() => handleLongPress(item)}
                  onSwipeLeft={() => handleDelete(item)}
                  onDoubleTap={() => handleDoubleClick(item)}
                  swipeDeleteIcon={ICONS.Trash2}
                >
                  {item.type === 'loan' ? (
                    <FinancialItemCard
                      title={item.name}
                      subtitle={`${item.interestRate}% на ${item.term} мес.`}
                      amountText={`${item.currentBalance.toLocaleString()} ${currencySymbol}`}
                      infoText={`Осталось ${item.term - (item.paymentHistory?.length || 0)} мес.`}
                      progress={((item.amount - item.currentBalance) / item.amount) * 100}
                      gradient="bg-gradient-to-br from-red-500 via-red-600 to-red-700"
                      iconName={item.iconName || 'MinusCircle'}
                      type="loan"
                    />
                  ) : (
                    <FinancialItemCard
                      title={item.name}
                      subtitle={`Банк: ${item.bank}`}
                      amountText={`${item.currentAmount.toLocaleString()} ${currencySymbol}`}
                      infoText={`Доход: ${item.totalInterest.toLocaleString()} ${currencySymbol}`}
                      progress={(item.currentAmount / item.totalAmount) * 100}
                      gradient="bg-gradient-to-br from-green-500 via-green-600 to-green-700"
                      iconName={item.iconName || 'Banknote'}
                      type="deposit"
                    />
                  )}
                </LongPressWrapper>
              </motion.div>
            ))
          ) : (
            <NoItemsPlaceholder
              iconName="Layers"
              iconColor="#3b82f6"
              title={
                activeTab === 'loans' ? 'Пока нет кредитов' : 
                activeTab === 'deposits' ? 'Пока нет депозитов' : 
                'Пока нет финансовых продуктов'
              }
              description={
                activeTab === 'loans' ? 'Добавьте первый кредит для отслеживания' : 
                activeTab === 'deposits' ? 'Добавьте первый депозит для получения дохода' : 
                'Добавьте кредиты и депозиты для отслеживания'
              }
              actions={[
                { label: 'Добавить кредит', onClick: handleAddLoan, colorClass: 'bg-red-600 hover:bg-red-700' },
                { label: 'Добавить депозит', onClick: handleAddDeposit, colorClass: 'bg-green-600 hover:bg-green-700' }
              ]}
            />
          )}
        </motion.div>
      </AnimatePresence>
      
      <AlertModal
        isVisible={showConfirmDelete}
        title={`Удалить ${itemToDelete?.type === 'loan' ? 'кредит' : 'депозит'}?`}
        message={`${itemToDelete?.type === 'loan' ? 'Кредит' : 'Депозит'} "${itemToDelete?.name}" будет удален безвозвратно. Это также удалит все связанные операции.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default MyFinancialProductsScreen;