// src/components/modals/GoalTransactionsModal.jsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { spring, whileTap } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import ModalWrapper from './ModalWrapper';
import TransactionItem from '../ui/TransactionItem';

/**
 * Модальное окно для отображения транзакций, связанных с финансовой целью (копилкой).
 * @returns {JSX.Element}
 */
const GoalTransactionsModal = () => {
    const {
        transactions,
        selectedGoal,
        setShowGoalTransactionsModal,
        setShowAddTransaction,
        setEditingTransaction,
        setTransactions
    } = useAppContext();

    if (!selectedGoal) {
        return null;
    }

    const goalTransactions = useMemo(() => {
        return transactions.filter(t => 
            (t.category === 'В копилку' || t.category === 'С копилки') && 
            t.description?.includes(selectedGoal.title)
        ).reverse();
    }, [transactions, selectedGoal]);
    
    const handleClose = () => {
        setShowGoalTransactionsModal(false);
    };

    return (
        <ModalWrapper
            title={`Операции по цели: ${selectedGoal.title}`}
            handleClose={handleClose}
        >
            <div className="flex-grow overflow-y-auto pr-2">
                <div className="space-y-4">
                    <motion.div
                        className="bg-white rounded-2xl p-6 shadow-sm mb-4 dark:bg-gray-800"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Текущий прогресс</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                                <span>Накоплено:</span>
                                <span className="font-semibold">{selectedGoal.current.toLocaleString()} {selectedGoal.currencySymbol}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                                <span>Цель:</span>
                                <span className="font-semibold">{selectedGoal.target.toLocaleString()} {selectedGoal.currencySymbol}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                                <div
                                    className="h-2 rounded-full bg-purple-500"
                                    style={{ width: `${Math.min((selectedGoal.current / selectedGoal.target) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </motion.div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-4">История операций</h3>
                    {goalTransactions.length > 0 ? (
                        <div className="space-y-3">
                            {goalTransactions.map(transaction => (
                                <TransactionItem
                                    key={transaction.id}
                                    transaction={transaction}
                                    onEdit={() => {
                                        setEditingTransaction(transaction);
                                        setShowAddTransaction(true);
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">Транзакций не найдено.</p>
                    )}
                </div>
            </div>
        </ModalWrapper>
    );
};

export default GoalTransactionsModal;