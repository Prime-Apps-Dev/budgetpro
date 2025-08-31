// src/components/modals/AlertModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { spring, whileTap } from '../../utils/motion';
import { ICONS } from '../icons';
import { useAppContext } from '../../context/AppContext';

/**
 * Универсальный компонент модального окна для предупреждений и подтверждений.
 * @param {object} props - Свойства компонента.
 * @param {boolean} props.isVisible - Флаг видимости модального окна.
 * @param {string} props.title - Заголовок модального окна.
 * @param {string} props.message - Основное сообщение.
 * @param {function} props.onConfirm - Функция, вызываемая при подтверждении.
 * @param {function} props.onCancel - Функция, вызываемая при отмене.
 * @returns {JSX.Element|null}
 */
const AlertModal = ({ isVisible, title, message, onConfirm, onCancel }) => {
  const { isDarkMode } = useAppContext();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`rounded-3xl p-6 max-w-sm w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ICONS.AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {message}
              </p>
            </div>
            
            <div className="flex space-x-3">
              <motion.button
                onClick={onCancel}
                className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl font-medium"
                whileTap={whileTap}
                transition={spring}
              >
                Отмена
              </motion.button>
              <motion.button
                onClick={onConfirm}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-2xl font-medium"
                whileTap={whileTap}
                transition={spring}
              >
                Удалить
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertModal;