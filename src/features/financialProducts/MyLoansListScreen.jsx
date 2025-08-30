// src/features/financialProducts/MyLoansListScreen.jsx
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
    // Если таймер не сработал (быстрый клик), вызываем onClick
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
 * Компонент экрана "Мои кредиты".
 * Позволяет пользователю просматривать свои кредиты, добавлять новые и удалять существующие.
 * @returns {JSX.Element}
 */
const MyLoansListScreen = () => {
  const {
    loansWithBalance: loans,
    setLoans,
    goBack,
    setSelectedFinancialItem,
    currencySymbol,
    setShowAddFinancialItemModal
  } = useAppContext();

  /**
   * Обрабатывает клик по элементу списка, открывая детали.
   * @param {object} item - Объект кредита.
   */
  const handleItemClick = (item) => {
    console.log('Нажат элемент списка кредитов:', item.name);
    setSelectedFinancialItem(item);
  };

  /**
   * Обрабатывает удаление кредита.
   * @param {number} loanId - ID кредита для удаления.
   */
  const handleDelete = (loanId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот кредит?')) {
      console.log('Кредит удален:', loanId);
      setLoans(prevLoans => prevLoans.filter(loan => loan.id !== loanId));
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
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Мои кредиты</h2>
        <motion.button
          onClick={() => {
            console.log('Нажата кнопка "Добавить кредит"');
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
        {loans?.length > 0 ? (
          loans.map((loan) => {
            const progress = ((loan.amount - loan.currentBalance) / loan.amount) * 100;
            const remainingMonths = loan.term - (loan.paymentHistory ? loan.paymentHistory.length : 0);

            return (
              <LongPressWrapper key={loan.id} item={loan} onClick={handleItemClick} onLongPress={handleDelete}>
                <FinancialItemCard
                  title={loan.name}
                  subtitle={`${loan.interestRate}% на ${loan.term} мес.`}
                  amountText={`${loan.currentBalance.toLocaleString()} ${currencySymbol}`}
                  infoText={`Осталось ${remainingMonths} мес.`}
                  progress={progress}
                  gradient="bg-gradient-to-br from-red-500 via-red-600 to-red-700"
                  iconName={loan.iconName || 'MinusCircle'}
                  type="loan"
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
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <ICONS.MinusCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Пока нет кредитов
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Добавьте первый кредит, чтобы начать отслеживание
            </p>
            <motion.button
              onClick={() => {
                setSelectedFinancialItem(null);
                setShowAddFinancialItemModal(true);
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              whileTap={whileTap}
              transition={spring}
            >
              Добавить кредит
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyLoansListScreen;