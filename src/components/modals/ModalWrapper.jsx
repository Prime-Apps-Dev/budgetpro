// src/components/modals/ModalWrapper.jsx
import React from 'react';
import { ICONS } from '../icons';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { spring, whileTap } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';

/**
 * Универсальный компонент-обертка для модальных окон.
 * Обеспечивает общую логику анимации, жестов и стиля.
 *
 * @param {object} props - Свойства компонента.
 * @param {string} props.title - Заголовок модального окна.
 * @param {function} props.handleClose - Функция для закрытия модального окна.
 * @param {React.ReactNode} props.children - Дочерние элементы, содержимое модального окна.
 * @param {React.ReactNode} [props.actions] - JSX-элемент для отображения справа от заголовка (например, кнопки "Редактировать", "Удалить").
 * @param {string} [props.className] - Дополнительные CSS-классы для внутреннего контейнера.
 * @returns {JSX.Element}
 */
const ModalWrapper = ({ title, handleClose, children, actions, className = '' }) => {
  const { isDarkMode } = useAppContext();

  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 200], [1, 0]);

  /**
   * Обрабатывает завершение жеста перетаскивания.
   * Если жест был достаточно сильным, закрывает модальное окно.
   * @param {Event} event - Событие.
   * @param {object} info - Информация о жесте.
   */
  const handleDragEnd = (event, info) => {
    // Порог расстояния в пикселях
    const distanceThreshold = 150; 
    // Порог скорости в пикселях/секунду
    const velocityThreshold = 200; 
    
    // Проверяем, был ли свайп быстрым вниз
    const isFastSwipe = info.velocity.y > velocityThreshold;
    // Проверяем, был ли drag достаточно долгим
    const isLongDrag = info.offset.y > distanceThreshold;

    if (isFastSwipe || isLongDrag) {
      handleClose();
    }
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "tween", duration: 0.3 }}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
          onClick={handleClose}
        />
      </AnimatePresence>
      <motion.div
        className="fixed inset-x-0 bottom-0 flex items-end justify-center z-50"
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "100%" }}
        transition={spring}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        style={{ y, opacity }}
      >
        <div className="relative bg-white dark:bg-gray-800 rounded-t-3xl p-6 shadow-xl w-full h-full flex flex-col cursor-grab max-h-[85vh]">
          <div className="flex justify-center mb-4 cursor-grab" onMouseDown={() => y.set(0)}>
            <motion.div
              onClick={handleClose}
              className="w-12 h-1 bg-gray-300 rounded-full cursor-pointer dark:bg-gray-600"
              whileTap={{ scale: 0.8 }}
              transition={spring}
            ></motion.div>
          </div>
          <div className="flex items-center mb-8">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{title}</h2>
            {actions && <div className="ml-auto flex items-center space-x-2">{actions}</div>}
          </div>
          <div className="flex-grow overflow-y-auto pr-2">
            {children}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ModalWrapper;