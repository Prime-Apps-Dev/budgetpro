// src/components/screens/HomeScreen.jsx
import React from 'react';
import { ICONS } from '../icons';
import TransactionItem from '../ui/TransactionItem';
import { motion } from 'framer-motion';
import { whileHover, whileTap, spring, zoomInOut } from '../../utils/motion';

const HomeScreen = ({ totalIncome, totalExpenses, totalBudget, totalSavingsBalance, transactions, getAccountByName, setEditingTransaction, setShowAddTransaction, deposits, setDeposits, loans, setLoans, depositTransactions, setDepositTransactions, loanTransactions, setLoanTransactions, setTransactions }) => {
  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white"
          whileHover={whileHover}
          whileTap={whileTap}
          transition={spring}
          variants={zoomInOut}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex items-center mb-3">
            <ICONS.ArrowUpCircle className="w-6 h-6 mr-3" />
            <span className="text-sm opacity-90">Доходы</span>
          </div>
          <div className="text-2xl font-bold">{totalIncome.toLocaleString()} ₽</div>
        </motion.div>
        <motion.div
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white"
          whileHover={whileHover}
          whileTap={whileTap}
          transition={spring}
          variants={zoomInOut}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex items-center mb-3">
            <ICONS.ArrowDownCircle className="w-6 h-6 mr-3" />
            <span className="text-sm opacity-90">Расходы</span>
          </div>
          <div className="text-2xl font-bold">{totalExpenses.toLocaleString()} ₽</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
          whileHover={whileHover}
          whileTap={whileTap}
          transition={spring}
          variants={zoomInOut}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex items-center mb-3">
            <ICONS.Wallet className="w-6 h-6 mr-3" />
            <span className="text-sm opacity-90">Бюджет</span>
          </div>
          <div className="text-2xl font-bold">{totalBudget.toLocaleString()} ₽</div>
        </motion.div>
        <motion.div
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white"
          whileHover={whileHover}
          whileTap={whileTap}
          transition={spring}
          variants={zoomInOut}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex items-center mb-3">
            <ICONS.PiggyBank className="w-6 h-6 mr-3" />
            <span className="text-sm opacity-90">Копилка</span>
          </div>
          <div className="text-2xl font-bold">{totalSavingsBalance.toLocaleString()} ₽</div>
        </motion.div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Последние транзакции</h3>
        <div className="space-y-4">
          {transactions.slice(-5).reverse().map((transaction) => (
            <motion.div key={transaction.id} variants={zoomInOut} initial="initial" whileInView="whileInView" viewport={{ once: true, amount: 0.2 }}>
              <TransactionItem
                transaction={transaction}
                getAccountByName={getAccountByName}
                setEditingTransaction={setEditingTransaction}
                setShowAddTransaction={setShowAddTransaction}
                transactions={transactions}
                setTransactions={setTransactions}
                deposits={deposits}
                setDeposits={setDeposits}
                loans={loans}
                setLoans={setLoans}
                depositTransactions={depositTransactions}
                setDepositTransactions={setDepositTransactions}
                loanTransactions={loanTransactions}
                setLoanTransactions={setLoanTransactions}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;