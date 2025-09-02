// src/components/ui/InteractiveSavingGoalCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { whileHover, zoomInOut } from '../../utils/motion';
import FinancialItemCard from './FinancialItemCard';
import LongPressWrapper from './LongPressWrapper';
import { ICONS } from '../icons';

/**
 * Интерактивная карточка для финансовой цели (копилки),
 * с поддержкой свайпа, долгого нажатия и клика.
 *
 * @param {object} props - Свойства компонента.
 * @param {object} props.goal - Объект цели.
 * @param {string} props.currencySymbol - Символ валюты.
 * @param {function} props.onDelete - Обработчик удаления.
 * @param {function} props.onEdit - Обработчик редактирования.
 * @param {function} props.onClick - Обработчик клика.
 * @param {function} props.onDoubleTap - Обработчик двойного клика.
 * @returns {JSX.Element}
 */
const InteractiveSavingGoalCard = ({ goal, currencySymbol, onDelete, onEdit, onClick, onDoubleTap }) => {
    const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
    const isCompleted = progress >= 100;
    
    return (
        <motion.div 
            key={goal.id} 
            variants={zoomInOut}
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.2 }}
        >
            <LongPressWrapper
                onTap={() => onClick(goal)} // <-- ИСПРАВЛЕНО: Одиночное нажатие для добавления транзакции
                onLongPress={() => onEdit(goal)} // <-- ИСПРАВЛЕНО: Долгое нажатие для редактирования
                onSwipeLeft={() => onDelete(goal)} // <-- ИСПРАВЛЕНО: Явно передаем цель
                onDoubleTap={() => onDoubleTap(goal)} // <-- ИСПРАВЛЕНО: Двойное нажатие для истории
                swipeDeleteIcon={ICONS.Trash2}
                item={goal}
            >
                <motion.div
                    className="relative"
                    whileHover={whileHover}
                >
                    <FinancialItemCard
                        title={goal.title}
                        subtitle={goal.deadline ? `до ${goal.deadline}` : ''}
                        amountText={goal.current.toLocaleString()}
                        infoText={`из ${goal.target.toLocaleString()} ${currencySymbol}`}
                        progress={progress}
                        gradient="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700"
                        iconName="PiggyBank"
                        type="savings"
                    />
                </motion.div>
            </LongPressWrapper>
        </motion.div>
    );
};

export default InteractiveSavingGoalCard;