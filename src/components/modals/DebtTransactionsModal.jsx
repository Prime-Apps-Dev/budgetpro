// src/components/modals/DebtTransactionsModal.jsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { spring, whileTap } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import ModalWrapper from './ModalWrapper';
import TransactionItem from '../ui/TransactionItem';

/**
 * Модальное окно для отображения транзакций, связанных с долгом.
 * @returns {JSX.Element}
 */
const DebtTransactionsModal = () => {
    const {
        transactions,
        selectedDebtForTransactions,
        setShowDebtTransactionsModal,
        setShowAddTransaction,
        setEditingTransaction,
        currencySymbol,
        setTransactions,
        setDebts,
        debts
    } = useAppContext();

    if (!selectedDebtForTransactions) {
        return null;
    }
    
    // Фильтруем транзакции, связанные с данным долгом
    const debtTransactions = useMemo(() => {
        return transactions.filter(t => 
            t.linkedDebtId === selectedDebtForTransactions.id ||
            t.description?.includes(selectedDebtForTransactions.description)
        ).reverse();
    }, [transactions, selectedDebtForTransactions]);
    
    const handleClose = () => {
        setShowDebtTransactionsModal(false);
    };

    /**
     * Обрабатывает удаление транзакции.
     * @param {object} transaction - Объект транзакции.
     */
    const handleDeleteTransaction = (transaction) => {
        // Удаляем из общего списка
        setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== transaction.id));
        // Удаляем связанный долг, если транзакция была его погашением
        if (transaction.linkedDebtId) {
            setDebts(debts.filter(d => d.id !== transaction.linkedDebtId));
        }
    };

    /**
     * Обрабатывает редактирование транзакции.
     * @param {object} transaction - Объект транзакции.
     */
    const handleEditTransaction = (transaction) => {
        setEditingTransaction(transaction);
        setShowAddTransaction(true);
    };

    return (
        <ModalWrapper
            title={`Операции по долгу: ${selectedDebtForTransactions.person}`}
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
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Детали долга</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                                <span>Кому/Кто:</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedDebtForTransactions.person}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                                <span>Сумма:</span>
                                <span className={`font-semibold ${selectedDebtForTransactions.type === 'i-owe' ? 'text-red-500' : 'text-green-500'}`}>
                                    {selectedDebtForTransactions.type === 'i-owe' ? '' : '+'}{selectedDebtForTransactions.amount.toLocaleString()} {currencySymbol}
                                </span>
                            </div>
                            {selectedDebtForTransactions.description && (
                                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                                    <span>Описание:</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedDebtForTransactions.description}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-4">История операций</h3>
                    {debtTransactions.length > 0 ? (
                        <div className="space-y-3">
                            {debtTransactions.map(transaction => (
                                <TransactionItem
                                    key={transaction.id}
                                    transaction={transaction}
                                    onEdit={handleEditTransaction} // <-- ИСПРАВЛЕНО
                                    onDelete={handleDeleteTransaction} // <-- ДОБАВЛЕНО
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

export default DebtTransactionsModal;