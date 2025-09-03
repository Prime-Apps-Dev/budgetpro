// src/components/modals/BudgetTransactionsModal.jsx
import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import ModalWrapper from './ModalWrapper';
import TransactionItem from '../ui/TransactionItem';

/**
 * Модальное окно для отображения транзакций, связанных с бюджетом.
 * @returns {JSX.Element}
 */
const BudgetTransactionsModal = () => {
    const {
        transactions,
        selectedBudgetForTransactions,
        setShowBudgetTransactionsModal,
        setShowAddTransaction,
        setEditingTransaction,
        currencySymbol
    } = useAppContext();

    if (!selectedBudgetForTransactions) {
        return null;
    }

    // Фильтруем транзакции, связанные с данным бюджетом
    const budgetTransactions = useMemo(() => {
        const [year, month] = selectedBudgetForTransactions.monthKey.split('-');
        return transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return (
                t.category === selectedBudgetForTransactions.category &&
                t.type === 'expense' &&
                transactionDate.getFullYear() === parseInt(year) &&
                transactionDate.getMonth() + 1 === parseInt(month)
            );
        }).reverse();
    }, [transactions, selectedBudgetForTransactions]);

    const handleClose = () => {
        setShowBudgetTransactionsModal(false);
    };

    /**
     * Обрабатывает удаление транзакции.
     * @param {object} transaction - Объект транзакции.
     */
    const handleDeleteTransaction = (transaction) => {
        // Логика удаления транзакции из общего списка
        // В этом модальном окне мы не удаляем бюджет, а только транзакцию
        // TODO: Реализовать логику удаления транзакции с обновлением общего списка
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
            title={`Операции по бюджету: ${selectedBudgetForTransactions.category}`}
            handleClose={handleClose}
        >
            <div className="flex-grow overflow-y-auto pr-2">
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl p-6 shadow-sm mb-4 dark:bg-gray-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Детали бюджета</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                                <span>Категория:</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedBudgetForTransactions.category}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                                <span>Лимит:</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedBudgetForTransactions.limit.toLocaleString()} {currencySymbol}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                                <span>Потрачено:</span>
                                <span className="font-semibold text-red-500">{
                                    transactions.filter(t => t.category === selectedBudgetForTransactions.category && t.type === 'expense')
                                        .reduce((sum, t) => sum + t.amount, 0)
                                        .toLocaleString()
                                } {currencySymbol}</span>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-4">История операций</h3>
                    {budgetTransactions.length > 0 ? (
                        <div className="space-y-3">
                            {budgetTransactions.map(transaction => (
                                <TransactionItem
                                    key={transaction.id}
                                    transaction={transaction}
                                    onEdit={handleEditTransaction}
                                    onDelete={handleDeleteTransaction}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">Транзакций по этому бюджету не найдено.</p>
                    )}
                </div>
            </div>
        </ModalWrapper>
    );
};

export default BudgetTransactionsModal;