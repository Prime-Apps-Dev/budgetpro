// src/components/modals/AddEditCategoryModal.jsx
import React, { useState, useEffect } from 'react';
import { ICONS } from '../icons';
import { usefulIconOptions } from '../icons/usefulIcons';
import { motion, AnimatePresence } from 'framer-motion';
import { spring, whileTap } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import ModalWrapper from './ModalWrapper';

/**
 * Модальное окно для добавления или редактирования категории.
 * @returns {JSX.Element}
 */
const AddEditCategoryModal = () => {
  const {
    categories,
    setCategories,
    editingCategory,
    setEditingCategory,
    setShowAddCategoryModal,
  } = useAppContext();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('expense');
  const [newCategoryIcon, setNewCategoryIcon] = useState('LayoutGrid');

  const isEditing = !!editingCategory;

  useEffect(() => {
    if (isEditing) {
      setNewCategoryName(editingCategory.name);
      setNewCategoryType(editingCategory.type);
      setNewCategoryIcon(editingCategory.icon);
    } else {
      setNewCategoryName('');
      setNewCategoryType('expense');
      setNewCategoryIcon('LayoutGrid');
    }
  }, [isEditing, editingCategory]);

  /**
   * Обрабатывает сохранение новой или отредактированной категории.
   */
  const handleSaveCategory = () => {
    if (newCategoryName.trim()) {
      if (isEditing) {
        setCategories({
          ...categories,
          [editingCategory.type]: categories[editingCategory.type].map(cat =>
            cat.name === editingCategory.name
              ? { name: newCategoryName.trim(), icon: newCategoryIcon }
              : cat
          )
        });
        setEditingCategory(null);
      } else {
        const newCat = {
          name: newCategoryName.trim(),
          icon: newCategoryIcon
        };
        setCategories({
          ...categories,
          [newCategoryType]: [...categories[newCategoryType], newCat]
        });
      }
      handleClose();
    }
  };

  /**
   * Закрывает модальное окно.
   */
  const handleClose = () => {
    setShowAddCategoryModal(false);
    setEditingCategory(null);
    setNewCategoryName('');
    setNewCategoryIcon('LayoutGrid');
  };
  
  /**
   * Возвращает компонент иконки по имени.
   * @param {string} name - Имя иконки.
   * @returns {React.Component} - Компонент иконки.
   */
  const getIcon = (name) => {
    return ICONS[name] || ICONS.LayoutGrid;
  };
  
  // Варианты анимации для picker-ов
  const pickerAnimationVariants = {
    initial: { opacity: 0, scaleY: 0, transformOrigin: 'top' },
    animate: { opacity: 1, scaleY: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scaleY: 0, transition: { duration: 0.2 } }
  };

  return (
    <ModalWrapper
      title={isEditing ? 'Редактировать категорию' : 'Добавить новую категорию'}
      handleClose={handleClose}
    >
      <div className="flex-grow overflow-y-auto pr-2">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">Название</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>
          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">Тип</label>
              <select
                value={newCategoryType}
                onChange={(e) => setNewCategoryType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              >
                <option value="expense">Расход</option>
                <option value="income">Доход</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">Иконка</label>
            <AnimatePresence>
                <motion.div
                    className="grid grid-cols-6 gap-3 max-h-60 overflow-y-auto pr-2"
                    variants={pickerAnimationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {usefulIconOptions.map(iconName => {
                        const IconComponent = getIcon(iconName);
                        return (
                            <motion.button
                                key={iconName}
                                onClick={() => setNewCategoryIcon(iconName)}
                                className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 ${newCategoryIcon === iconName ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}
                                whileTap={whileTap}
                                transition={spring}
                            >
                                <IconComponent className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            </motion.button>
                        );
                    })}
                </motion.div>
            </AnimatePresence>
          </div>
          <motion.button
            onClick={handleSaveCategory}
            className="w-full p-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
            whileTap={whileTap}
            transition={spring}
          >
            {isEditing ? 'Сохранить изменения' : 'Создать категорию'}
          </motion.button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AddEditCategoryModal;