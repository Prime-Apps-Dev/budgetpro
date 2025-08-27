// src/components/screens/DebtsScreen.jsx
import React, { useState } from 'react';
import { ICONS } from '../../components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { spring, whileTap, zoomInOut } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';

const DebtsScreen = () => {
  const {
    debts,
    setDebts,
    setCurrentScreen,
    setTransactions,
    currencySymbol
  } = useAppContext();

  const [showAddDebt, setShowAddDebt] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [newDebt, setNewDebt] = useState({
    type: 'i-owe',
    amount: '',
    person: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSaveDebt = () => {
    if (!newDebt.amount || !newDebt.person) return;
    const debtData = {
      ...newDebt,
      amount: parseFloat(newDebt.amount),
      id: editingDebt ? editingDebt.id : Date.now(),
    };

    if (editingDebt) {
      setDebts(debts.map(d => (d.id === editingDebt.id ? debtData : d)));
      setEditingDebt(null);
    } else {
      setDebts([...debts, debtData]);
    }

    setNewDebt({
      type: 'i-owe',
      amount: '',
      person: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setShowAddDebt(false);
  };

  const handleDeleteDebt = (id) => {
    if (debts.length > 1) {
      setDebts(debts.filter(debt => debt.id !== id));
    }
  };

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
          onClick={() => setShowAddDebt(true)}
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
                        setShowAddDebt(true);
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
                        setShowAddDebt(true);
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
      
      <AnimatePresence>
        {(showAddDebt || editingDebt) && (
            <motion.div
              className="fixed inset-x-0 bottom-0 top-1/4 flex items-end justify-center z-50"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-black opacity-50" onClick={() => { setShowAddDebt(false); setEditingDebt(null); }}></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-t-3xl p-6 shadow-xl w-full h-full flex flex-col">
                <div className="flex justify-center mb-4">
                  <motion.div
                    onClick={() => { setShowAddDebt(false); setEditingDebt(null); }}
                    className="w-12 h-1 bg-gray-300 rounded-full cursor-pointer dark:bg-gray-600"
                    whileTap={{ scale: 0.8 }}
                    transition={spring}
                  ></motion.div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  {editingDebt ? 'Редактировать долг' : 'Добавить долг'}
                </h3>

                <div className="flex-grow overflow-y-auto pr-2">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          onClick={() => setNewDebt({ ...newDebt, type: 'i-owe' })}
                          className={`p-4 rounded-2xl border-2 font-medium ${
                            newDebt.type === 'i-owe'
                              ? 'border-red-500 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-900 dark:text-red-300'
                              : 'border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}
                          whileTap={whileTap}
                          transition={spring}
                        >
                          Я должен
                        </motion.button>
                        <motion.button
                          onClick={() => setNewDebt({ ...newDebt, type: 'owed-to-me' })}
                          className={`p-4 rounded-2xl border-2 font-medium ${
                            newDebt.type === 'owed-to-me'
                              ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-900 dark:text-green-300'
                              : 'border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}
                          whileTap={whileTap}
                          transition={spring}
                        >
                          Мне должны
                        </motion.button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Сумма</label>
                        <input
                          type="number"
                          value={newDebt.amount}
                          onChange={(e) => setNewDebt({ ...newDebt, amount: e.target.value })}
                          placeholder="0"
                          className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Кому/Кто</label>
                        <input
                          type="text"
                          value={newDebt.person}
                          onChange={(e) => setNewDebt({ ...newDebt, person: e.target.value })}
                          placeholder="Имя человека"
                          className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Описание (необязательно)</label>
                        <input
                          type="text"
                          value={newDebt.description}
                          onChange={(e) => setNewDebt({ ...newDebt, description: e.target.value })}
                          placeholder="Например: За ужин"
                          className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Дата</label>
                        <input
                          type="date"
                          value={newDebt.date}
                          onChange={(e) => setNewDebt({ ...newDebt, date: e.target.value })}
                          className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                        />
                      </div>

                      <motion.button
                        onClick={handleSaveDebt}
                        className="w-full bg-blue-600 text-white p-4 rounded-2xl font-semibold hover:bg-blue-700"
                        whileTap={whileTap}
                        transition={spring}
                      >
                        {editingDebt ? 'Сохранить изменения' : 'Добавить долг'}
                      </motion.button>
                    </div>
                </div>
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DebtsScreen;