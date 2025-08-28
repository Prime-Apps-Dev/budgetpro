// src/components/screens/DebtsScreen.jsx
import React from 'react';
import { ICONS } from '../../components/icons';
import { motion } from 'framer-motion';
import { spring, whileTap, zoomInOut } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';

/**
 * Компонент экрана "Долги".
 * Позволяет пользователю управлять своими долгами: добавлять, погашать и списывать.
 * @returns {JSX.Element}
 */
const DebtsScreen = () => {
  const {
    debts,
    setDebts,
    setCurrentScreen,
    setTransactions,
    currencySymbol,
    setShowAddDebtModal, // Новая переменная из контекста
    setEditingDebt // Новая переменная из контекста
  } = useAppContext();

  /**
   * Обрабатывает удаление долга.
   * @param {number} id - ID долга для удаления.
   */
  const handleDeleteDebt = (id) => {
    if (debts.length > 1) {
      setDebts(debts.filter(debt => debt.id !== id));
    }
  };

  /**
   * Обрабатывает погашение долга, который пользователь должен.
   * Создает транзакцию расхода.
   * @param {object} debt - Объект долга.
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
   * Создает транзакцию дохода.
   * @param {object} debt - Объект долга.
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
   * Удаляет долг без создания транзакции.
   * @param {number} id - ID долга.
   */
  const handleForgiveDebt = (id) => {
    handleDeleteDebt(id);
  };

  const owedToMe = debts.filter(debt => debt.type === 'owed-to-me');
  const iOwe = debts.filter(debt => debt.type === 'i-owe');
  
  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="flex items-center mb-8">
        <motion.button
          onClick={() => setCurrentScreen('profile')}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          whileTap={whileTap}
          transition={spring}
        >
          <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
        </motion.button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Долги</h2>
        <motion.button
          onClick={() => {
            setShowAddDebtModal(true); // Обновляем вызов
            setEditingDebt(null); // Сбрасываем редактируемый долг
          }}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 ml-auto"
          whileTap={{ scale: 0.8 }}
          transition={spring}
        >
          <ICONS.Plus className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-200">Я должен</h3>
          <div className="space-y-4">
            {iOwe.length > 0 ? (
              iOwe.map(debt => (
                <motion.div 
                  key={debt.id} 
                  className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between dark:bg-gray-800"
                  whileTap={whileTap}
                  transition={spring}
                  variants={zoomInOut}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <div className="flex items-center">
                    <ICONS.ArrowDownCircle className="w-8 h-8 text-red-500 mr-4" />
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">{debt.person}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{debt.description}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">{debt.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="font-semibold text-red-600">
                      {debt.amount.toLocaleString()} {currencySymbol}
                    </div>
                    <motion.button
                      onClick={() => handlePayBackDebt(debt)}
                      className="p-2 text-green-500 hover:bg-green-50 rounded-lg dark:hover:bg-gray-700"
                      whileTap={whileTap}
                      transition={spring}
                    >
                      <ICONS.Check className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setEditingDebt(debt);
                        setShowAddDebtModal(true);
                      }}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg dark:hover:bg-gray-700"
                      whileTap={whileTap}
                      transition={spring}
                    >
                      <ICONS.Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteDebt(debt.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-gray-700"
                      whileTap={whileTap}
                      transition={spring}
                    >
                      <ICONS.Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">У вас нет долгов.</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-200">Мне должны</h3>
          <div className="space-y-4">
            {owedToMe.length > 0 ? (
              owedToMe.map(debt => (
                <motion.div 
                  key={debt.id} 
                  className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between dark:bg-gray-800"
                  whileTap={whileTap}
                  transition={spring}
                  variants={zoomInOut}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <div className="flex items-center">
                    <ICONS.ArrowUpCircle className="w-8 h-8 text-green-500 mr-4" />
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">{debt.person}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{debt.description}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">{debt.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="font-semibold text-green-600">
                      {debt.amount.toLocaleString()} {currencySymbol}
                    </div>
                    <motion.button
                      onClick={() => handleWriteOffDebt(debt)}
                      className="p-2 text-green-500 hover:bg-green-50 rounded-lg dark:hover:bg-gray-700"
                      whileTap={whileTap}
                      transition={spring}
                    >
                      <ICONS.Check className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleForgiveDebt(debt.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-gray-700"
                      whileTap={whileTap}
                      transition={spring}
                    >
                      <ICONS.X className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setEditingDebt(debt);
                        setShowAddDebtModal(true);
                      }}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg dark:hover:bg-gray-700"
                      whileTap={whileTap}
                      transition={spring}
                    >
                      <ICONS.Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteDebt(debt.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-gray-700"
                      whileTap={whileTap}
                      transition={spring}
                    >
                      <ICONS.Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">Вам никто не должен.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtsScreen;