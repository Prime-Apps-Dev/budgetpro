// src/components/modals/AddFinancialItemModal.jsx
import React, { useState, useEffect } from 'react';
import { ICONS } from '../icons';
import { usefulIconOptions } from '../icons/usefulIcons';
import { motion } from 'framer-motion';
import { spring, whileTap, jiggle } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import ModalWrapper from './ModalWrapper';

// Создаем экземпляр Web Worker для вынесения тяжелых расчетов в фоновый поток.
// Это предотвращает блокировку основного потока UI.
const financialWorker = new Worker(new URL('../../workers/financialCalculator.js', import.meta.url), {
  type: 'module'
});

/**
 * Модальное окно для добавления или редактирования финансового продукта (кредита или депозита).
 * Использует Web Worker для выполнения расчетов.
 * @returns {JSX.Element}
 */
const AddFinancialItemModal = () => {
  const { 
    loans,
    setLoans,
    deposits,
    setDeposits,
    setCurrentScreen,
    editingFinancialItem, // Исправлено: изменено с editingItem на editingFinancialItem
    accounts,
    currencySymbol,
    setShowAddFinancialItemModal,
    setEditingFinancialItem // Добавлено: для сброса состояния
  } = useAppContext();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [term, setTerm] = useState('');
  const [type, setType] = useState('loan');
  const [bank, setBank] = useState('');
  const [capitalization, setCapitalization] = useState('monthly');
  const [depositType, setDepositType] = useState('compound');
  const [selectedIcon, setSelectedIcon] = useState('MinusCircle');
  const [loanPaymentType, setLoanPaymentType] = useState('annuity');
  const [calculationResult, setCalculationResult] = useState(null);

  useEffect(() => {
    if (editingFinancialItem) {
      setName(editingFinancialItem.name);
      setAmount(editingFinancialItem.amount.toString());
      setInterestRate(editingFinancialItem.interestRate.toString());
      setTerm(editingFinancialItem.term.toString());
      setType(editingFinancialItem.type);
      setBank(editingFinancialItem.bank || '');
      setCapitalization(editingFinancialItem.capitalization || 'monthly');
      setDepositType(editingFinancialItem.depositType || 'compound');
      setSelectedIcon(editingFinancialItem.iconName || (editingFinancialItem.type === 'loan' ? 'MinusCircle' : 'Banknote'));
      setLoanPaymentType(editingFinancialItem.loanPaymentType || 'annuity');
      setCalculationResult(null);
    } else {
      setName('');
      setAmount('');
      setInterestRate('');
      setTerm('');
      setType('loan');
      setBank('');
      setCapitalization('monthly');
      setDepositType('compound');
      setSelectedIcon('MinusCircle');
      setLoanPaymentType('annuity');
      setCalculationResult(null);
    }
  }, [editingFinancialItem]);

  useEffect(() => {
    const handleWorkerMessage = (e) => {
      setCalculationResult(e.data.result);
    };

    financialWorker.onmessage = handleWorkerMessage;

    return () => {
      financialWorker.onmessage = null;
    };
  }, []);

  /**
   * Отправляет данные в Web Worker для выполнения расчетов.
   */
  const calculate = () => {
    financialWorker.postMessage({
      type,
      amount,
      interestRate,
      term,
      depositType,
      capitalization,
      loanPaymentType
    });
  };

  /**
   * Обрабатывает сохранение нового или отредактированного финансового продукта.
   */
  const handleSave = () => {
    if (!calculationResult) return;
    const { monthlyPayment, totalPayment, totalInterest, paymentSchedule } = calculationResult;

    if (type === 'loan') {
      const loanData = {
        id: editingFinancialItem ? editingFinancialItem.id : Date.now(),
        type,
        name,
        amount: parseFloat(amount),
        interestRate: parseFloat(interestRate),
        term: parseFloat(term),
        monthlyPayment,
        totalPayment,
        totalInterest,
        currentBalance: editingFinancialItem ? editingFinancialItem.currentBalance : parseFloat(amount),
        paymentHistory: editingFinancialItem ? editingFinancialItem.paymentHistory : [],
        paymentSchedule,
        iconName: selectedIcon,
        loanPaymentType: loanPaymentType
      };
      if (editingFinancialItem) {
        setLoans(loans.map(loan => loan.id === loanData.id ? loanData : loan));
      } else {
        setLoans(prevLoans => [...prevLoans, loanData]);
      }
    } else {
      const depositData = {
        id: editingFinancialItem ? editingFinancialItem.id : Date.now(),
        type,
        name,
        amount: parseFloat(amount),
        interestRate: parseFloat(interestRate),
        term: parseFloat(term),
        totalAmount: totalPayment,
        totalInterest,
        currentAmount: editingFinancialItem ? editingFinancialItem.currentAmount : parseFloat(amount),
        contributionHistory: editingFinancialItem ? editingFinancialItem.contributionHistory : [],
        bank,
        depositType,
        capitalization,
        iconName: selectedIcon,
      };
      if (editingFinancialItem) {
        setDeposits(deposits.map(deposit => deposit.id === depositData.id ? depositData : deposit));
      } else {
        setDeposits(prevDeposits => [...prevDeposits, depositData]);
      }
    }
    setShowAddFinancialItemModal(false);
    setEditingFinancialItem(null); // Сбрасываем состояние редактирования
  };

  /**
   * Функция для закрытия модального окна.
   */
  const handleClose = () => {
    setShowAddFinancialItemModal(false);
    setEditingFinancialItem(null); // Сбрасываем состояние редактирования
  };
  
  /**
   * Возвращает компонент иконки по имени.
   * @param {string} iconName - Имя иконки.
   * @returns {React.Component} - Компонент иконки.
   */
  const getIconComponent = (iconName) => {
    return ICONS[iconName] || ICONS.MinusCircle;
  };

  return (
    <ModalWrapper
      title={editingFinancialItem ? `Редактировать ${editingFinancialItem.type === 'loan' ? 'кредит' : 'депозит'}` : `Новый финансовый продукт`}
      handleClose={handleClose}
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 dark:bg-gray-800 flex-grow overflow-y-auto">
        {!editingFinancialItem && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.button
              onClick={() => {
                setType('loan');
                setSelectedIcon('MinusCircle');
                setCalculationResult(null);
              }}
              className={`p-3 rounded-xl font-medium ${
                type === 'loan'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
              whileTap={whileTap}
              transition={spring}
            >
              Кредит
            </motion.button>
            <motion.button
              onClick={() => {
                setType('deposit');
                setSelectedIcon('Banknote');
                setCalculationResult(null);
              }}
              className={`p-3 rounded-xl font-medium ${
                type === 'deposit'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
              whileTap={whileTap}
              transition={spring}
            >
              Депозит
            </motion.button>
          </div>
        )}
        <h3 className="font-semibold text-gray-800 mb-4 dark:text-gray-200">
          Параметры {type === 'loan' ? 'кредита' : 'депозита'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">Иконка</label>
            <div className="grid grid-cols-6 gap-3 max-h-60 overflow-y-auto pr-2">
                {usefulIconOptions.map(iconName => {
                    const IconComponent = getIconComponent(iconName);
                    return (
                        <motion.button
                            key={iconName}
                            onClick={() => setSelectedIcon(iconName)}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 ${selectedIcon === iconName ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}
                            whileTap={whileTap}
                            transition={spring}
                        >
                            <IconComponent className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </motion.button>
                    );
                })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">Название</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ипотека, автокредит и т.д."
              className="w-full p-3 border border-gray-300 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">Сумма ({currencySymbol})</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100000"
              className="w-full p-3 border border-gray-300 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          {type === 'loan' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">Тип платежа</label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={() => setLoanPaymentType('annuity')}
                  className={`p-3 rounded-xl font-medium ${
                    loanPaymentType === 'annuity'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                  whileTap={whileTap}
                  transition={spring}
                >
                  Аннуитетный
                </motion.button>
                <motion.button
                  onClick={() => setLoanPaymentType('differentiated')}
                  className={`p-3 rounded-xl font-medium ${
                    loanPaymentType === 'differentiated'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                  whileTap={whileTap}
                  transition={spring}
                >
                  Дифференцированный
                </motion.button>
              </div>
            </div>
          )}
          {type === 'deposit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">Банк</label>
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              >
                <option value="">Выберите банк</option>
                {accounts.filter(acc => acc.type === 'bank').map(account => (
                  <option key={account.id} value={account.name}>{account.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">Процентная ставка (%)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="10"
              className="w-full p-3 border border-gray-300 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">Срок (месяцев)</label>
            <input
              type="number"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="60"
              className="w-full p-3 border border-gray-300 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          {type === 'deposit' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">Тип начисления процентов</label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => setDepositType('simple')}
                    className={`p-3 rounded-xl font-medium ${
                      depositType === 'simple'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                    whileTap={whileTap}
                    transition={spring}
                  >
                    Простой
                  </motion.button>
                  <motion.button
                    onClick={() => setDepositType('compound')}
                    className={`p-3 rounded-xl font-medium ${
                      depositType === 'compound'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                    whileTap={whileTap}
                    transition={spring}
                  >
                    Сложный (Капитализация)
                  </motion.button>
                </div>
              </div>
              {depositType === 'compound' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">Период капитализации</label>
                  <div className="grid grid-cols-3 gap-3">
                    <motion.button
                      onClick={() => setCapitalization('daily')}
                      className={`p-3 rounded-xl font-medium ${
                        capitalization === 'daily'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                      whileTap={whileTap}
                      transition={spring}
                    >
                      Ежедневно
                    </motion.button>
                    <motion.button
                      onClick={() => setCapitalization('monthly')}
                      className={`p-3 rounded-xl font-medium ${
                        capitalization === 'monthly'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                      whileTap={whileTap}
                      transition={spring}
                    >
                      Ежемесячно
                    </motion.button>
                    <motion.button
                      onClick={() => setCapitalization('quarterly')}
                      className={`p-3 rounded-xl font-medium ${
                        capitalization === 'quarterly'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                      whileTap={whileTap}
                      transition={spring}
                    >
                      Ежеквартально
                    </motion.button>
                  </div>
                </div>
              )}
            </>
          )}
          <motion.button
            onClick={calculate}
            className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:bg-blue-700"
            whileTap={whileTap}
            transition={spring}
          >
            Рассчитать
          </motion.button>
        </div>
      </div>
      {calculationResult && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 dark:bg-gray-800">
          <h3 className="font-semibold text-gray-800 mb-4 dark:text-gray-200">Результат</h3>
          <div className="space-y-3 mb-6">
            {type === 'loan' && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {loanPaymentType === 'annuity' ? 'Ежемесячный платеж:' : 'Первый платеж:'}
                </span>
                <span className="font-semibold text-lg text-blue-600">
                  {calculationResult.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })} {currencySymbol}
                </span>
              </div>
            )}
            {calculationResult.totalPayment && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Общая сумма {type === 'loan' ? 'выплат' : 'на конец срока'}:</span>
                <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                  {calculationResult.totalPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })} {currencySymbol}
                </span>
              </div>
            )}
            {calculationResult.totalInterest !== null && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {type === 'loan' ? 'Переплата' : 'Доход'}:
                </span>
                <span className={`font-semibold text-lg ${type === 'loan' ? 'text-red-600' : 'text-green-600'}`}>
                  {calculationResult.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })} {currencySymbol}
                </span>
              </div>
            )}
          </div>
          <motion.button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white p-4 rounded-2xl font-semibold hover:bg-blue-700"
            whileTap={whileTap}
            transition={spring}
          >
            {editingFinancialItem ? 'Сохранить изменения' : 'Сохранить'}
          </motion.button>
        </div>
      )}
      
      {type === 'loan' && calculationResult && calculationResult.paymentSchedule.length > 0 && (
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm mt-4 dark:bg-gray-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <h3 className="font-semibold text-gray-800 mb-4 dark:text-gray-200">График платежей</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-3 py-2">Месяц</th>
                  <th scope="col" className="px-3 py-2">Дата</th>
                  <th scope="col" className="px-3 py-2">Платеж</th>
                  <th scope="col" className="px-3 py-2">Проценты</th>
                  <th scope="col" className="px-3 py-2">Основной долг</th>
                  <th scope="col" className="px-3 py-2">Остаток</th>
                </tr>
              </thead>
              <tbody>
                {calculationResult.paymentSchedule.map((payment, index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-3 py-2">{payment.month}</td>
                    <td className="px-3 py-2">{payment.date}</td>
                    <td className="px-3 py-2">
                      {payment.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })} {currencySymbol}
                    </td>
                    <td className="px-3 py-2">
                      {payment.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })} {currencySymbol}
                    </td>
                    <td className="px-3 py-2">
                      {payment.principal.toLocaleString(undefined, { maximumFractionDigits: 2 })} {currencySymbol}
                    </td>
                    <td className="px-3 py-2">
                      {payment.remainingBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} {currencySymbol}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </ModalWrapper>
  );
};

export default AddFinancialItemModal;