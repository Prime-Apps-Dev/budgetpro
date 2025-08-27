// src/components/screens/MyLoansListScreen.jsx
import React, { useState, useRef } from 'react';
import { ICONS } from '../icons';
import { motion } from 'framer-motion';
import { spring, whileTap, whileHover, zoomInOut } from '../../utils/motion';

const MyLoansListScreen = ({ loans, setCurrentScreen, setSelectedFinancialItem, setLoans, setTransactions, loanTransactions, setLoanTransactions, currencySymbol }) => {
  const [isLongPress, setIsLongPress] = useState(false);
  const pressTimer = useRef(null);

  const getIconComponent = (iconName) => {
    return ICONS[iconName] || ICONS.MinusCircle; // Default to MinusCircle
  };

  const handleItemClick = (item) => {
    if (isLongPress) return;
    setSelectedFinancialItem(item);
    setCurrentScreen('loan-detail');
  };

  const handleDelete = (loanId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот кредит?')) {
      // Удаляем кредит из списка
      setLoans(prevLoans => prevLoans.filter(loan => loan.id !== loanId));
    }
  };

  const handlePressStart = (e, loan) => {
    // Prevent context menu on right click
    if (e.button === 2) {
      return;
    }
    pressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      handleDelete(loan.id);
    }, 500); // 500ms for long press
  };

  const handlePressEnd = () => {
    clearTimeout(pressTimer.current);
    pressTimer.current = null;
    setIsLongPress(false);
  };

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="flex items-center mb-8">
        <motion.button
          onClick={() => setCurrentScreen('my-financial-products')}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          whileTap={whileTap}
          transition={spring}
        >
          <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
        </motion.button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Мои кредиты</h2>
        <motion.button
          onClick={() => {
            setSelectedFinancialItem(null);
            setCurrentScreen('add-financial-item');
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
          loans.map(loan => {
            const IconComponent = getIconComponent(loan.iconName);
            let monthlyPaymentText = '';
            if (loan.loanPaymentType === 'annuity') {
              monthlyPaymentText = `${loan.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currencySymbol}/мес.`;
            } else if (loan.paymentSchedule && loan.paymentSchedule.length > 0) {
              const firstPayment = loan.paymentSchedule[0].monthlyPayment;
              const lastPayment = loan.paymentSchedule[loan.paymentSchedule.length - 1].monthlyPayment;
              monthlyPaymentText = `${firstPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })} - ${lastPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currencySymbol}`;
            }

            return (
              <motion.div 
                key={loan.id} 
                className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between dark:bg-gray-800 cursor-pointer"
                onMouseDown={(e) => handlePressStart(e, loan)}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                onTouchStart={(e) => handlePressStart(e, loan)}
                onTouchEnd={handlePressEnd}
                onClick={() => handleItemClick(loan)}
                onContextMenu={(e) => e.preventDefault()}
                whileTap={whileTap}
                whileHover={whileHover}
                transition={spring}
                variants={zoomInOut}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="flex items-center">
                  <IconComponent className="w-8 h-8 text-red-500 mr-4" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">{loan.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{monthlyPaymentText}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">Остаток: {loan.currentBalance.toLocaleString()} {currencySymbol}</div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">У вас нет кредитов.</p>
        )}
      </div>
    </div>
  );
};

export default MyLoansListScreen;