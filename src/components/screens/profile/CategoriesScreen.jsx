import React, { useState } from 'react';
import { ICONS } from '../../icons';
import { usefulIconOptions } from '../../icons/usefulIcons';

const CategoriesScreen = ({ categories, setCategories, setCurrentScreen }) => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('expense');
  const [newCategoryIcon, setNewCategoryIcon] = useState('LayoutGrid');
  const [editingCategory, setEditingCategory] = useState(null);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCat = {
        name: newCategoryName.trim(),
        icon: newCategoryIcon
      };
      setCategories({
        ...categories,
        [newCategoryType]: [...categories[newCategoryType], newCat]
      });
      setNewCategoryName('');
      setShowAddCategory(false);
      setNewCategoryIcon('LayoutGrid');
    }
  };

  const handleEditCategory = (type, oldName) => {
    const categoryToEdit = categories[type].find(cat => cat.name === oldName);
    if (categoryToEdit) {
      setEditingCategory({ ...categoryToEdit, type });
      setNewCategoryName(categoryToEdit.name);
      setNewCategoryIcon(categoryToEdit.icon);
    }
  };

  const handleUpdateCategory = () => {
    if (newCategoryName.trim() && editingCategory) {
      setCategories({
        ...categories,
        [editingCategory.type]: categories[editingCategory.type].map(cat =>
          cat.name === editingCategory.name
            ? { name: newCategoryName.trim(), icon: newCategoryIcon }
            : cat
        )
      });
      setNewCategoryName('');
      setNewCategoryIcon('LayoutGrid');
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (type, name) => {
    setCategories({
      ...categories,
      [type]: categories[type].filter(cat => cat.name !== name)
    });
  };

  const getIcon = (name) => {
    return ICONS[name] || ICONS.LayoutGrid;
  };

  const renderCategoryList = (type) => (
    <div className="space-y-3">
      {categories[type].map(cat => {
        const IconComponent = getIcon(cat.icon);
        return (
          <div key={cat.name} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between dark:bg-gray-800">
            <div className="flex items-center">
              <IconComponent className={`w-5 h-5 mr-3 ${type === 'expense' ? 'text-red-500' : 'text-green-500'}`} />
              <span className="text-gray-800 dark:text-gray-200">{cat.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEditCategory(type, cat.name)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg dark:hover:bg-gray-700"
              >
                <ICONS.Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteCategory(type, cat.name)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-gray-700"
              >
                <ICONS.Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (showAddCategory || editingCategory) {
    const isEditing = !!editingCategory;
    const currentName = isEditing ? newCategoryName : newCategoryName;
    const currentIcon = isEditing ? newCategoryIcon : newCategoryIcon;

    return (
      <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
        <div className="flex items-center mb-8">
          <button
            onClick={() => {
              setShowAddCategory(false);
              setEditingCategory(null);
              setNewCategoryName('');
              setNewCategoryIcon('LayoutGrid');
            }}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {isEditing ? 'Редактировать категорию' : 'Добавить новую категорию'}
          </h2>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 dark:bg-gray-800">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">Название</label>
              <input
                type="text"
                value={currentName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            {!isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">Тип</label>
                <select
                  value={newCategoryType}
                  onChange={(e) => setNewCategoryType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                >
                  <option value="expense">Расход</option>
                  <option value="income">Доход</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">Иконка</label>
              <div className="grid grid-cols-6 gap-3 max-h-60 overflow-y-auto pr-2">
                  {usefulIconOptions.map(iconName => {
                      const IconComponent = ICONS[iconName];
                      return (
                          <button
                              key={iconName}
                              onClick={() => setNewCategoryIcon(iconName)}
                              className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 ${currentIcon === iconName ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}
                          >
                              <IconComponent className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                          </button>
                      );
                  })}
              </div>
            </div>
            <button
              onClick={isEditing ? handleUpdateCategory : handleAddCategory}
              className="w-full p-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
            >
              {isEditing ? 'Сохранить изменения' : 'Создать категорию'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="flex items-center mb-8">
        <button
          onClick={() => setCurrentScreen('')}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Категории</h2>
        <button
          onClick={() => setShowAddCategory(true)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 ml-auto"
        >
          <ICONS.Plus className="w-6 h-6" />
        </button>
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