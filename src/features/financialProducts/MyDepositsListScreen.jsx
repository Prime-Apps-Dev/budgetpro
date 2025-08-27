// src/features/financialProducts/MyDepositsListScreen.jsx
import React, { useState, useRef } from 'react';
import { ICONS } from '../../components/icons';
import { motion } from 'framer-motion';
import { spring, whileTap, whileHover, zoomInOut } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';

const MyDepositsListScreen = () => {
  const {
    depositsWithBalance: deposits,
    setDeposits,
    setCurrentScreen,
    setSelectedFinancialItem,
    currencySymbol,
    setShowAddFinancialItemModal
  } = useAppContext();

  const [isLongPress, setIsLongPress] = useState(false);
  const pressTimer = useRef(null);

  const getIconComponent = (iconName) => {
    return ICONS[iconName] || ICONS.Banknote;
  };

  const handleItemClick = (item) => {
    if (isLongPress) return;
    setSelectedFinancialItem(item);
  };

  const handleDelete = (depositId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот депозит?')) {
      setDeposits(prevDeposits => prevDeposits.filter(deposit => deposit.id !== depositId));
    }
  };

  const handlePressStart = (e, deposit) => {
    if (e.button === 2) {
      return;
    }
    pressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      handleDelete(deposit.id);
    }, 500);
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
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Мои депозиты</h2>
        <motion.button
          onClick={() => {
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
          deposits.map(deposit => {
            const IconComponent = getIconComponent(deposit.iconName);
            return (
              <motion.div 
                key={deposit.id} 
                className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between dark:bg-gray-800 cursor-pointer"
                onMouseDown={(e) => handlePressStart(e, deposit)}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                onTouchStart={(e) => handlePressStart(e, deposit)}
                onTouchEnd={handlePressEnd}
                onClick={() => handleItemClick(deposit)}
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
                  <IconComponent className="w-8 h-8 text-green-500 mr-4" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">{deposit.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Доход: {deposit.totalInterest.toLocaleString()} {currencySymbol}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">Баланс: {deposit.currentAmount.toLocaleString()} {currencySymbol}</div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">У вас нет депозитов.</p>
        )}
      </div>
    </div>
  );
};

export default MyDepositsListScreen;