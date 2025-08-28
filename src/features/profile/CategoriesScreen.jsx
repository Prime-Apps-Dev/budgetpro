// src/features/profile/CategoriesScreen.jsx
import React from 'react';
import { ICONS } from '../../components/icons';
import { motion } from 'framer-motion';
import { spring, whileTap, zoomInOut } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';

/**
 * Компонент экрана "Категории".
 * Позволяет пользователю управлять категориями доходов и расходов: добавлять, редактировать и удалять.
 * @returns {JSX.Element}
 */
const CategoriesScreen = () => {
  const { 
    categories, 
    setCategories, 
    goBack,
    setShowAddCategoryModal,
    setEditingCategory,
  } = useAppContext();

  /**
   * Обрабатывает удаление категории.
   * @param {string} type - Тип категории ('income' или 'expense').
   * @param {string} name - Имя категории для удаления.
   */
  const handleDeleteCategory = (type, name) => {
    setCategories({
      ...categories,
      [type]: categories[type].filter(cat => cat.name !== name)
    });
  };

  /**
   * Возвращает компонент иконки по имени.
   * @param {string} name - Имя иконки.
   * @returns {React.Component} - Компонент иконки.
   */
  const getIcon = (name) => {
    return ICONS[name] || ICONS.LayoutGrid;
  };

  /**
   * Рендерит список категорий заданного типа.
   * @param {string} type - Тип категории ('expense' или 'income').
   * @returns {JSX.Element}
   */
  const renderCategoryList = (type) => (
    <div className="space-y-3">
      {categories[type].map(cat => {
        const IconComponent = getIcon(cat.icon);
        return (
          <motion.div 
            key={cat.name} 
            className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between dark:bg-gray-800"
            whileTap={whileTap}
            transition={spring}
            variants={zoomInOut}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="flex items-center">
              <IconComponent className={`w-5 h-5 mr-3 ${type === 'expense' ? 'text-red-500' : 'text-green-500'}`} />
              <span className="text-gray-800 dark:text-gray-200">{cat.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => {
                  setEditingCategory({ ...cat, type });
                  setShowAddCategoryModal(true);
                }}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg dark:hover:bg-gray-700"
                whileTap={whileTap}
                transition={spring}
              >
                <ICONS.Edit className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => handleDeleteCategory(type, cat.name)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-gray-700"
                whileTap={whileTap}
                transition={spring}
              >
                <ICONS.Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="flex items-center mb-8">
        <motion.button
          onClick={goBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          whileTap={whileTap}
          transition={spring}
        >
          <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
        </motion.button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Категории</h2>
        <motion.button
          onClick={() => {
            setEditingCategory(null);
            setShowAddCategoryModal(true);
          }}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 ml-auto"
          whileTap={{ scale: 0.8 }}
          transition={spring}
        >
          <ICONS.Plus className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 dark:text-gray-200">Расходы</h3>
          {renderCategoryList('expense')}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 dark:text-gray-200">Доходы</h3>
          {renderCategoryList('income')}
        </div>
      </div>
    </div>
  );
};

export default CategoriesScreen;