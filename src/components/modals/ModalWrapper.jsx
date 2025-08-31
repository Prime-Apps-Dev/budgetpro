// src/components/modals/ModalWrapper.jsx
import React from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { ICONS } from '../icons';
import { useAppContext } from '../../context/AppContext';

/**
 * Оболочка для модальных окон, обеспечивающая базовую анимацию
 * и функциональность закрытия.
 * @param {object} props - Свойства компонента.
 * @param {string} props.title - Заголовок модального окна.
 * @param {React.ReactNode} props.children - Содержимое модального окна.
 * @param {function} props.handleClose - Функция для закрытия модального окна.
 */
const ModalWrapper = ({ title, children, handleClose }) => {
  const { isDarkMode } = useAppContext();
  const dragControls = useDragControls();

  const modalVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
      },
    },
    exit: {
      y: "100%",
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  };

  function startDrag(event) {
    dragControls.start(event);
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleClose} // Закрытие по клику вне модалки
      >
        <motion.div
          className={`relative w-full max-w-md rounded-t-3xl shadow-lg flex flex-col max-h-[75vh] ${
            isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
          }`}
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()} // Предотвратить закрытие при клике внутри
          drag="y"
          dragControls={dragControls}
          onDragEnd={(event, info) => {
            if (info.velocity.y > 0 && info.point.y > window.innerHeight * 0.5) {
              handleClose();
            }
          }}
          dragConstraints={{ top: 0 }} // Ограничение движения: только вниз от начальной позиции
          dragElastic={0.5} // Эластичность перетаскивания
        >
          {/* Handle для перетаскивания */}
          <div
            className="flex justify-center p-4 cursor-grab"
            onPointerDown={startDrag} // Начинаем перетаскивание при нажатии на ручку
          >
            <div
              className={`w-16 h-1.5 rounded-full ${
                isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}
            />
          </div>

          {/* Заголовок и кнопка закрытия */}
          <div className="flex justify-between items-center px-6 pb-4">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <motion.button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              whileTap={{ scale: 0.9 }}
            >
              <ICONS.X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Содержимое модального окна */}
          <div className="flex-grow px-6 pb-6 overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalWrapper;