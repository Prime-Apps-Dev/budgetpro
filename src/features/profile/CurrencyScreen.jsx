// src/components/screens/profile/CurrencyScreen.jsx
import React from 'react';
import { ICONS } from '../../components/icons';
import { CURRENCIES } from '../../constants/currencies';
import { motion } from 'framer-motion';
import { spring, whileTap, zoomInOut } from '../../utils/motion';
import ReactCountryFlag from 'react-country-flag';
import { useAppContext } from '../../context/AppContext';

/**
 * Компонент экрана выбора валюты.
 * Позволяет пользователю изменить основную валюту приложения.
 * @returns {JSX.Element}
 */
const CurrencyScreen = () => {
  const { goBack, currencyCode, setCurrencyCode } = useAppContext();
  
  /**
   * Обрабатывает изменение валюты.
   * @param {string} newCurrencyCode - Новый код валюты.
   */
  const handleCurrencyChange = (newCurrencyCode) => {
    setCurrencyCode(newCurrencyCode);
    goBack();
  };

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
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Валюта</h2>
      </div>

      <div className="space-y-4">
        {CURRENCIES.map(c => (
          <motion.button
            key={c.code}
            onClick={() => handleCurrencyChange(c.code)}
            className={`w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 ${currencyCode === c.code ? 'border-2 border-blue-500' : ''}`}
            whileTap={whileTap}
            transition={spring}
            variants={zoomInOut}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex items-center">
              <ReactCountryFlag
                countryCode={c.countryCode}
                svg
                style={{
                  width: '2em',
                  height: '1.5em',
                  marginRight: '0.5em',
                  lineHeight: '1.5em'
                }}
                title={c.name}
              />
              <span className="font-medium text-gray-800 dark:text-gray-200">{c.code}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CurrencyScreen;