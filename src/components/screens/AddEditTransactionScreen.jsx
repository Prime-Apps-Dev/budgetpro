// src/components/screens/AddEditTransactionScreen.jsx
import React, { useState, useEffect } from 'react';
import { ICONS } from '../icons';
import { motion, AnimatePresence } from 'framer-motion';
import { spring, whileTap } from '../../utils/motion';

const AddEditTransactionScreen = ({
  transactions,
  setTransactions,
  editingTransaction,
  setEditingTransaction,
  setShowAddTransaction,
  newTransaction,
  setNewTransaction,
  categories,
  accounts,
  setActiveTab,
  loans,
  setLoans,
  deposits,
  setDeposits,
  selectedFinancialItem,
  setSelectedFinancialItem,
  loanTransactions,
  setLoanTransactions,
  depositTransactions,
  setDepositTransactions
}) => {
  const isEditing = !!editingTransaction;
  const isFinancialTransaction = selectedFinancialItem && (selectedFinancialItem.type === 'loan' || selectedFinancialItem.type === 'deposit');

  const [formData, setFormData] = useState(
    isEditing ? { ...editingTransaction } : newTransaction
  );
  const [selectedLoan, setSelectedLoan] = useState(editingTransaction?.category === 'Погашение кредита' ? editingTransaction.financialItemId : '');
  const [selectedDeposit, setSelectedDeposit] = useState(editingTransaction?.category === 'Пополнение депозита' || editingTransaction?.category === 'Снятие с депозита' ? editingTransaction.financialItemId : '');

  useEffect(() => {
    if (editingTransaction) {
      setFormData({ ...editingTransaction, description: editingTransaction.description || '' });
      setSelectedLoan(editingTransaction.category === 'Погашение кредита' ? editingTransaction.financialItemId : '');
      setSelectedDeposit(editingTransaction.category === 'Пополнение депозита' || editingTransaction.category === 'Снятие с депозита' ? editingTransaction.financialItemId : '');
    } else if (selectedFinancialItem) {
      if (selectedFinancialItem.type === 'loan') {
        const nextPaymentAmount = selectedFinancialItem.monthlyPayment;
        setFormData({
          type: 'expense',
          amount: nextPaymentAmount.toFixed(2),
          category: 'Погашение кредита',
          account: 'Основной',
          date: new Date().toISOString().split('T')[0],
          description: `Плановый платеж по кредиту "${selectedFinancialItem.name}"`,
          financialItemId: selectedFinancialItem.id
        });
        setSelectedLoan(selectedFinancialItem.id);
      } else if (selectedFinancialItem.type === 'deposit') {
        setFormData({
          type: 'expense',
          amount: '',
          category: 'Пополнение депозита',
          account: 'Основной',
          date: new Date().toISOString().split('T')[0],
          description: `Пополнение депозита "${selectedFinancialItem.name}"`,
          financialItemId: selectedFinancialItem.id
        });
        setSelectedDeposit(selectedFinancialItem.id);
      }
    } else {
      setFormData(newTransaction);
      setSelectedLoan('');
      setSelectedDeposit('');
    }
  }, [editingTransaction, newTransaction, selectedFinancialItem]);
  
  const handleSubmit = () => {
    if (formData.amount && formData.category && formData.account) {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        financialItemId: formData.category === 'Погашение кредита' ? selectedLoan : (formData.category === 'Пополнение депозита' || formData.category === 'Снятие с депозита' ? selectedDeposit : null),
        id: isEditing ? editingTransaction.id : Date.now()
      };

      if (isEditing) {
        // Find the old transaction
        const oldTransaction = transactions.find(t => t.id === editingTransaction.id);

        // Update main transactions list
        setTransactions(transactions.map(t =>
          t.id === editingTransaction.id ? transactionData : t
        ));

        if (oldTransaction.category === 'Погашение кредита') {
          setLoans(loans.map(loan => {
            if (loan.id === oldTransaction.financialItemId) {
              const oldAmount = oldTransaction.amount;
              const newAmount = transactionData.amount;
              return { ...loan, currentBalance: loan.currentBalance + oldAmount - newAmount };
            }
            return loan;
          }));
          setLoanTransactions(loanTransactions.map(t => t.id === oldTransaction.id ? transactionData : t));

        } else if (oldTransaction.category === 'Пополнение депозита' || oldTransaction.category === 'Снятие с депозита') {
          // Reverse old transaction effect
          let updatedDeposits = deposits.map(d => {
            if (d.id === oldTransaction.financialItemId) {
              const oldAmount = oldTransaction.amount;
              const newAmount = transactionData.amount;
              let newCurrentAmount;
              if (oldTransaction.category === 'Пополнение депозита') {
                newCurrentAmount = d.currentAmount - oldAmount;
              } else {
                newCurrentAmount = d.currentAmount + oldAmount;
              }
              if (transactionData.category === 'Пополнение депозита') {
                newCurrentAmount += newAmount;
              } else {
                newCurrentAmount -= newAmount;
              }
              return { ...d, currentAmount: newCurrentAmount };
            }
            return d;
          });
          setDeposits(updatedDeposits);

          // Update deposit transactions list
          const updatedDepositTransaction = {
            ...transactionData,
            type: transactionData.category === 'Пополнение депозита' ? 'income' : 'expense'
          };
          setDepositTransactions(depositTransactions.map(t => t.id === oldTransaction.id ? updatedDepositTransaction : t));
        }

        setEditingTransaction(null);
      } else {
        if (selectedFinancialItem && selectedFinancialItem.type === 'loan') {
          setLoanTransactions([...loanTransactions, transactionData]);
          setTransactions([...transactions, transactionData]);
          setLoans(loans.map(loan => loan.id === selectedFinancialItem.id ? { ...loan, currentBalance: loan.currentBalance - transactionData.amount } : loan));

        } else if (selectedFinancialItem && selectedFinancialItem.type === 'deposit') {
          const mainTransaction = {
            ...transactionData,
            type: formData.category === 'Пополнение депозита' ? 'expense' : 'income',
          };
          const depositTransaction = {
            ...transactionData,
            type: formData.category === 'Пополнение депозита' ? 'income' : 'expense',
          };
          setTransactions([...transactions, mainTransaction]);
          setDepositTransactions([...depositTransactions, depositTransaction]);
          setDeposits(deposits.map(deposit => {
            if (deposit.id === selectedFinancialItem.id) {
              const amount = depositTransaction.type === 'income' ? depositTransaction.amount : -depositTransaction.amount;
              return { ...deposit, currentAmount: deposit.currentAmount + amount };
            }
            return deposit;
          }));

        } else {
          setTransactions([...transactions, transactionData]);
        }

        setNewTransaction({
          type: 'expense',
          amount: '',
          category: '',
          account: 'Основной',
          date: new Date().toISOString().split('T')[0],
          description: ''
        });
      }
      
      setShowAddTransaction(false);
      
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      setEditingTransaction(null);
    }
    setSelectedFinancialItem(null);
    setShowAddTransaction(false);
  };

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 top-1/4 flex items-end justify-center z-50"
      initial={{ y: "100%" }}
      animate={{ y: "0%" }}
      exit={{ y: "100%" }}
      transition={{ type: "tween", duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-black opacity-50" onClick={handleCancel}></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-t-3xl p-6 shadow-xl w-full h-full flex flex-col">
        <div className="flex justify-center mb-4">
          <motion.div
            onClick={handleCancel}
            className="w-12 h-1 bg-gray-300 rounded-full cursor-pointer dark:bg-gray-600"
            whileTap={{ scale: 0.8 }}
            transition={spring}
          ></motion.div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {isEditing ? 'Редактировать транзакцию' : 'Добавить транзакцию'}
        </h3>
        
        <div className="flex-grow overflow-y-auto pr-2">
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                onClick={() => !isFinancialTransaction && setFormData({ ...formData, type: 'expense', category: '', description: '' })}
                className={`p-4 rounded-2xl border-2 font-medium ${
                  formData.type === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-900 dark:text-red-300'
                    : 'border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                } ${isFinancialTransaction ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={isFinancialTransaction}
                whileTap={whileTap}
                transition={spring}
              >
                Расход
              </motion.button>
              <motion.button
                onClick={() => !isFinancialTransaction && setFormData({ ...formData, type: 'income', category: '', description: '' })}
                className={`p-4 rounded-2xl border-2 font-medium ${
                  formData.type === 'income'
                    ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-900 dark:text-green-300'
                    : 'border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                } ${isFinancialTransaction ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={isFinancialTransaction}
                whileTap={whileTap}
                transition={spring}
              >
                Доход
              </motion.button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Сумма</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0"
                className="w-full p-4 border border-gray-300 rounded-2xl text-xl font-semibold text-center dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Категория</label>
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  setSelectedLoan('');
                  setSelectedDeposit('');
                }}
                className={`w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 ${isFinancialTransaction ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={isFinancialTransaction}
              >
                <option value="">Выберите категорию</option>
                {categories[formData.type].map(category => (
                  <option key={category.name} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
            
            {formData.category === 'Погашение кредита' && loans.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Выберите кредит</label>
                <select
                  value={selectedLoan}
                  onChange={(e) => setSelectedLoan(parseInt(e.target.value))}
                  className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                >
                  <option value="">Выберите кредит</option>
                  {loans.map(loan => (
                    <option key={loan.id} value={loan.id}>{loan.name}</option>
                  ))}
                </select>
              </div>
            )}

            {formData.category === 'Пополнение депозита' || formData.category === 'Снятие с депозита' ? deposits.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Выберите депозит</label>
                <select
                  value={selectedDeposit}
                  onChange={(e) => setSelectedDeposit(parseInt(e.target.value))}
                  className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                >
                  <option value="">Выберите депозит</option>
                  {deposits.map(deposit => (
                    <option key={deposit.id} value={deposit.id}>{deposit.name}</option>
                  ))}
                </select>
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Счёт</label>
              <select
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              >
                {accounts.map(account => (
                  <option key={account.name} value={account.name}>{account.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">Описание (необязательно)</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Описание транзакции"
                className={`w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 ${isFinancialTransaction ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={isFinancialTransaction}
              />
            </div>

            <motion.button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white p-4 rounded-2xl font-semibold hover:bg-blue-700"
              whileTap={whileTap}
              transition={spring}
            >
              {isEditing ? 'Сохранить изменения' : 'Добавить транзакцию'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddEditTransactionScreen;