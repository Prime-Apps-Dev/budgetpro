// src/components/ui/NoItemsPlaceholder.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { whileTap, spring, zoomInOut } from '../../utils/motion';
import { ICONS } from '../icons';

/**
 * Универсальный компонент-заполнитель для пустых списков.
 * @param {object} props - Свойства компонента.
 * @param {string} props.iconName - Имя иконки.
 * @param {string} props.iconColor - Цвет иконки.
 * @param {string} props.title - Заголовок.
 * @param {string} props.description - Описание.
 * @param {Array<object>} props.actions - Массив объектов с кнопками действий.
 * @returns {JSX.Element}
 */
const NoItemsPlaceholder = ({ iconName, iconColor, title, description, actions = [] }) => {
  const IconComponent = ICONS[iconName] || ICONS.Layers;

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
      variants={zoomInOut}
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: false, amount: 0.2 }}
    >
      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center`} style={{ backgroundColor: `${iconColor}30` }}>
        <IconComponent className={`w-8 h-8`} style={{ color: iconColor }} />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        {description}
      </p>
      {actions.length > 0 && (
        <div className="flex gap-3 justify-center">
          {actions.map((action, index) => (
            <motion.button
              key={index}
              onClick={action.onClick}
              className={`px-4 py-2 ${action.colorClass} text-white rounded-xl font-medium hover:opacity-90 transition-colors`}
              whileTap={whileTap}
              transition={spring}
            >
              {action.label}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default NoItemsPlaceholder;