import React from 'react';
import { ICONS } from '../../icons';
import { CURRENCIES } from '../../../constants/currencies';
import { motion } from 'framer-motion';
import { spring, whileTap, zoomInOut } from '../../../utils/motion';

const CurrencyScreen = ({ setCurrentScreen, currency, setCurrency }) => {
  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="flex items-center mb-8">
        <motion.button
          onClick={() => setCurrentScreen('profile')}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          whileTap={whileTap}
          transition={spring}
        >
          <ICONS.ChevronLeft className="w-6 h-6 dark:text-gray-300" />
        </motion.button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Валюта</h2>
      </div>

      <div className="space-y-4">
        {CURRENCIES.map(c => (
          <motion.button
            key={c.code}
            onClick={() => {
              setCurrency(c.symbol);
              setCurrentScreen('profile');
            }}
            className={`w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 ${currency === c.symbol ? 'border-2 border-blue-500' : ''}`}
            whileTap={whileTap}
            transition={spring}
            variants={zoomInOut}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex items-center">
              <span className="font-medium text-gray-800 dark:text-gray-200">{c.name} ({c.code})</span>
            </div>
            <span className="font-semibold text-gray-600 dark:text-gray-400">{c.symbol}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CurrencyScreen;