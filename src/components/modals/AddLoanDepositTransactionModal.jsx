// src/components/modals/AddLoanDepositTransactionModal.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { spring, whileTap } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import ModalWrapper from './ModalWrapper';

/**
 * Модальное окно для добавления транзакции по кредиту или депозиту.
 * @returns {JSX.Element}
 */
const AddLoanDepositTransactionModal = () => {
  const {
    selectedLoanDepositForTransaction,
    setShowLoanDepositTransactionModal,
    loansWithBalance,
    depositsWithBalance,
    setTransactions,
    setLoans,
    setDeposits,
    setLoanTransactions,
    setDepositTransactions,
    transactions,
    loanTransactions,
    depositTransactions,
    accounts,
    currencySymbol
  } = useAppContext();

  const [formData, setFormData] = useState({
    financialItem: selectedLoanDepositForTransaction,
    amount: '',
    date: new Date().toISOString().split('T')[0],
    account: accounts[0]?.name || ''
  });

  useEffect(() => {
    if (selectedLoanDepositForTransaction) {
      setFormData(prev => ({
        ...prev,
        financialItem: selectedLoanDepositForTransaction,
        account: accounts[0]?.name || '',
        amount: selectedLoanDepositForTransaction.type === 'loan' ? selectedLoanDepositForTransaction.monthlyPayment?.toFixed(2) || '' : ''
      }));
    }
  }, [selectedLoanDepositForTransaction, accounts]);

  const handleClose = () => {
    setShowLoanDepositTransactionModal(false);
  };
  
  const handleSubmit = () => {
    if (!formData.financialItem || !formData.amount) return;

    const transactionAmount = parseFloat(formData.amount);
    if (isNaN(transactionAmount) || transactionAmount <= 0) return;

    const isLoan = formData.financialItem.type === 'loan';
    const transactionType = isLoan ? 'expense' : 'transfer'; // Depsoit transaction is a transfer
    const category = isLoan ? 'Погашение кредита' : 'Пополнение депозита';
    
    // Создаем транзакцию, которую добавляем в общий список
    const mainTransaction = {
      id: Date.now(),
      type: transactionType,
      amount: Math.abs(transactionAmount),
      category: category,
      account: formData.account,
      date: formData.date,
      description: isLoan ? `Платеж по кредиту "${formData.financialItem.name}"` : `Пополнение депозита "${formData.financialItem.name}"`,
      financialItemId: formData.financialItem.id,
    };

    // Создаем транзакцию для детализации кредита/депозита
    const financialTransaction = {
      ...mainTransaction,
      type: isLoan ? 'expense' : 'income',
      account: isLoan ? `Кредит: ${formData.financialItem.name}` : `Депозит: ${formData.financialItem.name}`,
    };
    
    // Обновляем состояния
    if (isLoan) {
        setLoans(loansWithBalance.map(loan => 
            loan.id === formData.financialItem.id
                ? { ...loan, currentBalance: loan.currentBalance - transactionAmount }
                : loan
        ));
        setLoanTransactions([...loanTransactions, financialTransaction]);
    } else {
        setDeposits(depositsWithBalance.map(deposit => 
            deposit.id === formData.financialItem.id
                ? { ...deposit, currentAmount: deposit.currentAmount + transactionAmount }
                : deposit
        ));
        setDepositTransactions([...depositTransactions, financialTransaction]);
    }
    
    setTransactions([...transactions, mainTransaction]);
    
    handleClose();
  };
  
  const isLoan = formData.financialItem?.type === 'loan';
  const filteredItems = isLoan ? loansWithBalance : depositsWithBalance;

  return (
    <ModalWrapper
      title={isLoan ? 'Внести платеж по кредиту' : 'Операция по депозиту'}
      handleClose={handleClose}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">
            Выберите {isLoan ? 'кредит' : 'депозит'}
          </label>
          <select
            value={formData.financialItem?.id || ''}
            onChange={(e) => {
              const selectedItem = filteredItems.find(item => item.id === parseInt(e.target.value));
              setFormData({ 
                ...formData, 
                financialItem: selectedItem, 
                amount: selectedItem?.type === 'loan' ? selectedItem.monthlyPayment?.toFixed(2) || '' : ''
              });
            }}
            className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          >
            <option value="">Выберите...</option>
            {filteredItems.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">
            Сумма ({currencySymbol})
          </label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0"
            className="w-full p-4 border border-gray-300 rounded-2xl text-xl font-semibold text-center dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">
            Счёт
          </label>
          <select
            value={formData.account}
            onChange={(e) => setFormData({ ...formData, account: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          >
            {accounts.map(account => (
              <option key={account.name} value={account.name}>
                {account.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-400">
            Дата
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          />
        </div>

        <motion.button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-4 rounded-2xl font-semibold hover:bg-blue-700"
          whileTap={whileTap}
          transition={spring}
          disabled={!formData.financialItem || !formData.amount}
        >
          Сохранить
        </motion.button>
      </div>
    </ModalWrapper>
  );
};

export default AddLoanDepositTransactionModal;