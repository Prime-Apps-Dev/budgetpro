import React from 'react';
import { ICONS } from '../icons';

const MyFinancialProductsScreen = ({ setCurrentScreen }) => {
  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="flex items-center mb-8">
        <button
          onClick={() => setCurrentScreen('')}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Финансовые продукты</h2>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setCurrentScreen('loans-list')}
          className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <div className="flex items-center">
            <ICONS.MinusCircle className="w-6 h-6 mr-4 text-gray-800 dark:text-gray-200" />
            <span className="font-medium text-gray-800 dark:text-gray-200">Мои кредиты</span>
          </div>
          <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
        </button>
        
        <button
          onClick={() => setCurrentScreen('deposits-list')}
          className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <div className="flex items-center">
            <ICONS.Banknote className="w-6 h-6 mr-4 text-gray-800 dark:text-gray-200" />
            <span className="font-medium text-gray-800 dark:text-gray-200">Мои депозиты</span>
          </div>
          <ICONS.ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default MyFinancialProductsScreen;