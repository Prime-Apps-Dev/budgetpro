// src/features/financialProducts/MyDepositsListScreen.jsx
import React, { useRef } from 'react';
import { ICONS } from '../../components/icons';
import { motion } from 'framer-motion';
import { spring, whileTap, whileHover, zoomInOut } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import FinancialItemCard from '../../components/ui/FinancialItemCard';

/**
 * Компонент-обертка для обработки долгого нажатия.
 * @param {object} props - Свойства компонента.
 * @param {object} props.item - Элемент данных.
 * @param {function} props.onClick - Обработчик обычного клика.
 * @param {function} props.onLongPress - Обработчик долгого нажатия.
 * @param {React.ReactNode} props.children - Дочерние элементы.
 */
const LongPressWrapper = ({ item, onClick, onLongPress, children }) => {
  const pressTimer = useRef(null);

  const handlePressStart = (e) => {
    if (e.button === 2) return;
    
    pressTimer.current = setTimeout(() => {
      onLongPress(item.id);
    }, 500);
  };

  const handlePressEnd = () => {
    clearTimeout(pressTimer.current);
    pressTimer.current = null;
  };

  const handleClick = (e) => {
    if (pressTimer.current) {
      onClick(item);
    }
  }

  return (
    <motion.div
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onClick={handleClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </motion.div>
  );
};

/**
 * Компонент экрана "Мои депозиты".
 * Позволяет пользователю просматривать свои депозиты, добавлять новые и удалять существующие.
 * @returns {JSX.Element}
 */
const MyDepositsListScreen = () => {
  const {
    depositsWithBalance: deposits,
    setDeposits,
    goBack,
    setSelectedFinancialItem,
    currencySymbol,
    setShowAddFinancialItemModal
  } = useAppContext();

  /**
   * Обрабатывает клик по элементу списка, открывая детали.
   * @param {object} item - Объект депозита.
   */
  const handleItemClick = (item) => {
    console.log('Нажат элемент списка депозитов:', item.name);
    setSelectedFinancialItem(item);
  };

  /**
   * Обрабатывает удаление депозита.
   * @param {number} depositId - ID депозита для удаления.
   */
  const handleDelete = (depositId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот депозит?')) {
      console.log('Депозит удален:', depositId);
      setDeposits(prevDeposits => prevDeposits.filter(deposit => deposit.id !== depositId));
    }
  };

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="flex items-center mb-8">
        <motion.button
          onClick={goBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          whileTap={whileTap}
          transition={spring}
        >
          <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
        </motion.button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Мои депозиты</h2>
        <motion.button
          onClick={() => {
            console.log('Нажата кнопка "Добавить депозит"');
            setSelectedFinancialItem(null);
            setShowAddFinancialItemModal(true);
          }}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 ml-auto"
          whileTap={{ scale: 0.8 }}
          transition={spring}
        >
          <ICONS.Plus className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="space-y-4">
        {deposits.length > 0 ? (
          deposits.map((deposit) => {
            const progress = (deposit.currentAmount / deposit.totalAmount) * 100;
            return (
              <LongPressWrapper key={deposit.id} item={deposit} onClick={handleItemClick} onLongPress={handleDelete}>
                <FinancialItemCard
                  title={deposit.name}
                  subtitle={`Банк: ${deposit.bank}`}
                  amountText={`${deposit.currentAmount.toLocaleString()} ${currencySymbol}`}
                  infoText={`Доход: ${deposit.totalInterest.toLocaleString()} ${currencySymbol}`}
                  progress={progress}
                  gradient="bg-gradient-to-br from-green-500 via-green-600 to-green-700"
                  iconName={deposit.iconName || 'Banknote'}
                  type="deposit"
                />
              </LongPressWrapper>
            );
          })
        ) : (
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
            variants={zoomInOut}
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <ICONS.Banknote className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Пока нет депозитов
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Добавьте первый депозит, чтобы начать получать доход
            </p>
            <motion.button
              onClick={() => {
                setSelectedFinancialItem(null);
                setShowAddFinancialItemModal(true);
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
              whileTap={whileTap}
              transition={spring}
            >
              Добавить депозит
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyDepositsListScreen;