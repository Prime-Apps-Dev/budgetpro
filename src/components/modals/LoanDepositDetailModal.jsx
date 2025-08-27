// src/components/modals/LoanDepositDetailModal.jsx
import React, { useState } from 'react';
import { ICONS } from '../icons';
import TransactionItem from '../ui/TransactionItem';
import { motion, AnimatePresence } from 'framer-motion';
import { spring, whileTap, zoomInOut } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import ModalWrapper from './ModalWrapper';

const LoanDepositDetailModal = () => {
  const {
    selectedFinancialItem: item,
    setCurrentScreen,
    setLoans,
    setDeposits,
    loansWithBalance: loans,
    depositsWithBalance: deposits,
    setSelectedFinancialItem,
    setTransactions,
    transactions,
    loanTransactions,
    setLoanTransactions,
    depositTransactions,
    setDepositTransactions,
    getAccountByName,
    setShowAddTransaction,
    setEditingTransaction,
    accounts,
    currencySymbol
  } = useAppContext();
  
  const [showEarlyRepaymentModal, setShowEarlyRepaymentModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [earlyRepaymentAmount, setEarlyRepaymentAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalAccount, setWithdrawalAccount] = useState(accounts[0]?.name || '');
  const [withdrawalDate, setWithdrawalDate] = useState(new Date().toISOString().split('T')[0]);

  if (!item) {
    return null;
  }

  const currentItem = (item.type === 'loan' ? loans.find(l => l.id === item.id) : deposits.find(d => d.id === item.id));

  if (!currentItem) {
    setSelectedFinancialItem(null);
    return null;
  }
  
  const isLoan = currentItem.type === 'loan';
  const goBackScreen = isLoan ? 'loans-list' : 'deposits-list';
  const IconComponent = ICONS[currentItem.iconName] || (isLoan ? ICONS.MinusCircle : ICONS.Banknote);

  const getLoanProgress = () => {
    if (!isLoan || !currentItem.amount) return 0;
    const paid = currentItem.amount - currentItem.currentBalance;
    return (paid / currentItem.amount) * 100;
  };
  
  const getDepositProgress = () => {
    if (isLoan || !currentItem.amount) return 0;
    const initialAmount = currentItem.amount;
    const currentAmount = currentItem.currentAmount;
    if (initialAmount <= 0) return 0;
    return (currentAmount / currentItem.totalAmount) * 100;
  };
  
  const getLoanRemainingTime = () => {
    if (!isLoan) return null;
    const paidMonths = currentItem.paymentHistory ? currentItem.paymentHistory.length : 0;
    const totalMonths = currentItem.term;
    const remaining = totalMonths - paidMonths;
    return remaining > 0 ? remaining : 0;
  };
  
  const getTransactionForDetail = () => {
    return isLoan
      ? loanTransactions.filter(t => t.financialItemId === currentItem.id).reverse()
      : depositTransactions.filter(t => t.financialItemId === currentItem.id).reverse();
  };

  const handleAddPayment = () => {
    setSelectedFinancialItem({
      ...currentItem,
      prefilledAmount: currentItem.loanPaymentType === 'annuity' ? currentItem.monthlyPayment : currentItem.paymentSchedule[currentItem.paymentHistory.length]?.monthlyPayment,
      type: 'loan',
      description: `Плановый платеж по кредиту "${currentItem.name}"`
    });
    setShowAddTransaction(true);
  };

  const handleEarlyRepayment = () => {
    const amount = parseFloat(earlyRepaymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    const newTransaction = {
      id: Date.now(),
      type: 'expense',
      amount: amount,
      category: 'Погашение кредита',
      account: 'Основной',
      date: new Date().toISOString().split('T')[0],
      financialItemId: currentItem.id,
      description: `Досрочное погашение кредита "${currentItem.name}"`
    };
    setLoanTransactions(prevTransactions => [...prevTransactions, newTransaction]);
    setLoans(loans.map(loan => loan.id === currentItem.id ? { ...loan, currentBalance: loan.currentBalance - amount } : loan));
    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
    setShowEarlyRepaymentModal(false);
    setEarlyRepaymentAmount('');
  };

  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0 || amount > currentItem.currentAmount) return;

    const mainTransaction = {
      id: Date.now(),
      type: 'income',
      amount: amount,
      category: 'Снятие с депозита',
      account: withdrawalAccount,
      date: withdrawalDate,
      description: `Снятие с депозита "${currentItem.name}"`
    };

    const depositTransaction = {
      ...mainTransaction,
      id: Date.now() + 1,
      type: 'expense',
      financialItemId: currentItem.id,
      account: currentItem.bank,
      description: `Снятие с депозита "${currentItem.name}"`
    }

    setTransactions(prevTransactions => [...prevTransactions, mainTransaction]);
    setDepositTransactions(prevTransactions => [...prevTransactions, depositTransaction]);
    setDeposits(prevDeposits => prevDeposits.map(d => d.id === currentItem.id ? { ...d, currentAmount: d.currentAmount - amount } : d));
    setShowWithdrawalModal(false);
    setWithdrawalAmount('');
    setWithdrawalAccount(accounts[0]?.name || '');
    setWithdrawalDate(new Date().toISOString().split('T')[0]);
  };
  
  const handleEdit = () => {
    setSelectedFinancialItem(currentItem);
    setCurrentScreen('edit-financial-item');
  };

  const handleDelete = () => {
    if (window.confirm(`Вы уверены, что хотите удалить ${isLoan ? 'кредит' : 'депозит'} "${currentItem.name}"? Это также удалит все связанные транзакции.`)) {
      if (isLoan) {
        setLoans(loans.filter(loan => loan.id !== currentItem.id));
        setLoanTransactions(loanTransactions.filter(t => t.financialItemId !== currentItem.id));
        setTransactions(transactions.filter(t => t.financialItemId !== currentItem.id));
      } else {
        setDeposits(deposits.filter(deposit => deposit.id !== currentItem.id));
        setDepositTransactions(depositTransactions.filter(t => t.financialItemId !== currentItem.id));
        setTransactions(transactions.filter(t => t.financialItemId !== currentItem.id));
      }
      setSelectedFinancialItem(null);
      setCurrentScreen('my-financial-products');
    }
  };

  const handleClose = () => {
    setSelectedFinancialItem(null);
  };
  
  const formattedMonthlyPayment = isLoan && currentItem.loanPaymentType === 'annuity'
    ? currentItem.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : isLoan && currentItem.loanPaymentType === 'differentiated'
    ? `${currentItem.paymentSchedule[0]?.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })} - ${currentItem.paymentSchedule[currentItem.paymentSchedule.length - 1]?.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : null;

  const actions = (
    <>
      <motion.button onClick={handleEdit} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg dark:hover:bg-gray-700" whileTap={whileTap} transition={spring}>
        <ICONS.Edit className="w-5 h-5" />
      </motion.button>
      <motion.button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-gray-700" whileTap={whileTap} transition={spring}>
        <ICONS.Trash2 className="w-5 h-5" />
      </motion.button>
    </>
  );

  return (
    <ModalWrapper
      title={currentItem.name}
      handleClose={handleClose}
      actions={actions}
    >
      <div className="flex-grow overflow-y-auto pr-2">
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm mb-8 dark:bg-gray-800"
          variants={zoomInOut}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: false, amount: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Статистика</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Начальная сумма:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{currentItem.amount?.toLocaleString() || 0} {currencySymbol}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                {isLoan ? 'Остаток долга:' : 'Текущий баланс:'}
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{isLoan ? (currentItem.currentBalance?.toLocaleString() || 0) : (currentItem.currentAmount?.toLocaleString() || 0)} {currencySymbol}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                {isLoan ? 'Переплата:' : 'Доход:'}
              </span>
              <span className={`font-semibold ${isLoan ? 'text-red-600' : 'text-green-600'}`}>
                {currentItem.totalInterest?.toLocaleString() || 0} {currencySymbol}
              </span>
            </div>
            {isLoan && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Тип платежа:
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {currentItem.loanPaymentType === 'annuity' ? 'Аннуитетный' : 'Дифференцированный'}
                  </span>
                </div>
                {formattedMonthlyPayment && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      {currentItem.loanPaymentType === 'annuity' ? 'Ежемесячный платеж:' : 'Платеж (мин-макс):'}
                    </span>
                    <span className="font-semibold text-blue-600">
                      {formattedMonthlyPayment} {currencySymbol}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Осталось месяцев:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{getLoanRemainingTime()}</span>
                </div>
              </>
            )}
            {!isLoan && currentItem.bank && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Банк:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{currentItem.bank}</span>
              </div>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-6 dark:bg-gray-700">
            <div
              className={`${isLoan ? 'bg-red-500' : 'bg-green-500'} h-3 rounded-full transition-all duration-300`}
              style={{ width: `${Math.min(isLoan ? getLoanProgress() : getDepositProgress(), 100)}%` }}
            ></div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {isLoan ? (
            <>
              <motion.button
                onClick={() => handleAddPayment()}
                className="w-full bg-blue-500 text-white p-4 rounded-2xl font-semibold hover:bg-blue-600 flex items-center justify-center"
                whileTap={whileTap}
                transition={spring}
                variants={zoomInOut}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: false, amount: 0.2 }}
              >
                <ICONS.Plus className="w-5 h-5 mr-2" />
                Внести платеж
              </motion.button>
              <motion.button
                onClick={() => setShowEarlyRepaymentModal(true)}
                className="w-full bg-red-500 text-white p-4 rounded-2xl font-semibold hover:bg-red-600 flex items-center justify-center"
                whileTap={whileTap}
                transition={spring}
                variants={zoomInOut}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: false, amount: 0.2 }}
              >
                <ICONS.MinusCircle className="w-5 h-5 mr-2" />
                Досрочное погашение
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                onClick={() => {
                  setSelectedFinancialItem({ ...currentItem, type: 'deposit', description: `Пополнение депозита "${currentItem.name}"` });
                  setShowAddTransaction(true);
                }}
                className="w-full bg-green-500 text-white p-4 rounded-2xl font-semibold hover:bg-green-600 flex items-center justify-center"
                whileTap={whileTap}
                transition={spring}
                variants={zoomInOut}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: false, amount: 0.2 }}
              >
                <ICONS.Plus className="w-5 h-5 mr-2" />
                Пополнить
              </motion.button>
              <motion.button
                onClick={() => setShowWithdrawalModal(true)}
                className="w-full bg-red-500 text-white p-4 rounded-2xl font-semibold hover:bg-red-600 flex items-center justify-center"
                whileTap={whileTap}
                transition={spring}
                variants={zoomInOut}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: false, amount: 0.2 }}
              >
                <ICONS.MinusCircle className="w-5 h-5 mr-2" />
                Снять
              </motion.button>
            </>
          )}
        </div>

        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm mt-4 dark:bg-gray-800"
          variants={zoomInOut}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: false, amount: 0.2 }}
        >
          <h3 className="font-semibold text-gray-800 mb-4 dark:text-gray-200">История операций</h3>
          <div className="space-y-4">
            {getTransactionForDetail().length > 0 ? (
              getTransactionForDetail().map(transaction => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">Операций не найдено.</p>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {showEarlyRepaymentModal && (
            <motion.div
              className="fixed inset-x-0 bottom-0 top-1/4 flex items-end justify-center z-50"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <motion.div 
                className="absolute inset-0 bg-black opacity-50"
                onClick={() => setShowEarlyRepaymentModal(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              ></motion.div>
              <div className="relative bg-white dark:bg-gray-800 rounded-t-3xl p-6 shadow-xl w-full h-full flex flex-col">
                <div className="flex justify-center mb-4">
                  <motion.div
                    onClick={() => setShowEarlyRepaymentModal(false)}
                    className="w-12 h-1 bg-gray-300 rounded-full cursor-pointer dark:bg-gray-600"
                    whileTap={{ scale: 0.8 }}
                    transition={spring}
                  ></motion.div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Досрочное погашение</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Остаток долга на сегодня: <span className="font-semibold">{currentItem.currentBalance?.toLocaleString() || 0} {currencySymbol}</span>
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                  Сумма для полного погашения: <span className="font-semibold">{(currentItem.currentBalance + (currentItem.currentBalance * currentItem.interestRate / 100 / 12)).toLocaleString(undefined, { maximumFractionDigits: 2 })} {currencySymbol}</span>
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Сумма к погашению</label>
                  <input
                    type="number"
                    value={earlyRepaymentAmount}
                    onChange={(e) => setEarlyRepaymentAmount(e.target.value)}
                    placeholder="0"
                    className="w-full p-3 border border-gray-300 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-auto">
                  <motion.button
                    onClick={() => { setShowEarlyRepaymentModal(false); setEarlyRepaymentAmount(''); }}
                    className="p-3 bg-gray-200 text-gray-700 rounded-xl font-medium"
                    whileTap={whileTap}
                    transition={spring}
                  >
                    Отмена
                  </motion.button>
                  <motion.button
                    onClick={handleEarlyRepayment}
                    className="p-3 bg-red-600 text-white rounded-xl font-medium"
                    whileTap={whileTap}
                    transition={spring}
                  >
                    Погасить
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {showWithdrawalModal && (
            <motion.div
              className="fixed inset-x-0 bottom-0 top-1/4 flex items-end justify-center z-50"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <motion.div 
                className="absolute inset-0 bg-black opacity-50"
                onClick={() => setShowWithdrawalModal(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              ></motion.div>
              <div className="relative bg-white dark:bg-gray-800 rounded-t-3xl p-6 shadow-xl w-full h-full flex flex-col">
                <div className="flex justify-center mb-4">
                  <motion.div
                    onClick={() => setShowWithdrawalModal(false)}
                    className="w-12 h-1 bg-gray-300 rounded-full cursor-pointer dark:bg-gray-600"
                    whileTap={{ scale: 0.8 }}
                    transition={spring}
                  ></motion.div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Снятие с депозита</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Текущий баланс: <span className="font-semibold">{currentItem.currentAmount?.toLocaleString() || 0} {currencySymbol}</span>
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Сумма снятия</label>
                    <input
                      type="number"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      placeholder="0"
                      className="w-full p-3 border border-gray-300 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Счёт</label>
                    <select
                      value={withdrawalAccount}
                      onChange={(e) => setWithdrawalAccount(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    >
                      {accounts.map(account => (
                        <option key={account.name} value={account.name}>{account.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Дата</label>
                    <input
                      type="date"
                      value={withdrawalDate}
                      onChange={(e) => setWithdrawalDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-auto">
                  <motion.button
                    onClick={() => { setShowWithdrawalModal(false); setWithdrawalAmount(''); setWithdrawalAccount(accounts[0]?.name || ''); setWithdrawalDate(new Date().toISOString().split('T')[0]); }}
                    className="p-3 bg-gray-200 text-gray-700 rounded-xl font-medium"
                    whileTap={whileTap}
                    transition={spring}
                  >
                    Отмена
                  </motion.button>
                  <motion.button
                    onClick={handleWithdrawal}
                    className="p-3 bg-red-600 text-white rounded-xl font-medium"
                    whileTap={whileTap}
                    transition={spring}
                  >
                    Снять
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ModalWrapper>
  );
};

export default LoanDepositDetailModal;