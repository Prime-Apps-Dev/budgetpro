// src/components/modals/SyncConflictModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ICONS } from '../icons';
import { useAppContext } from '../../context/AppContext';
import ModalWrapper from './ModalWrapper';

const SyncConflictModal = () => {
  const { showSyncConflictModal, setShowSyncConflictModal, syncConflictData, handleResolveConflict } = useAppContext();
  
  if (!showSyncConflictModal || !syncConflictData) return null;

  const { conflicts } = syncConflictData;
  const categoriesWithConflicts = Object.keys(conflicts).filter(key => conflicts[key]);

  return (
    <AnimatePresence>
      <ModalWrapper
        title="Конфликт данных"
        handleClose={() => setShowSyncConflictModal(false)}
      >
        <div className="flex-grow overflow-y-auto pr-2">
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <ICONS.AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                Обнаружен конфликт данных
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Данные в локальном хранилище и облаке не совпадают. Пожалуйста, выберите, какую версию вы хотите сохранить.
              </p>
            </div>

            <div className="space-y-4">
              {categoriesWithConflicts.map(category => (
                <div key={category} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-2xl flex items-center justify-between">
                  <span className="font-medium text-gray-800 dark:text-gray-200">{category}</span>
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => handleResolveConflict(category, 'local')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm"
                      whileTap={{ scale: 0.95 }}
                    >
                      Использовать локальные
                    </motion.button>
                    <motion.button
                      onClick={() => handleResolveConflict(category, 'cloud')}
                      className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm"
                      whileTap={{ scale: 0.95 }}
                    >
                      Использовать облачные
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
            
            <motion.button
              onClick={() => handleResolveConflict('all', 'local')}
              className="w-full p-4 rounded-2xl font-semibold text-white bg-blue-600 hover:bg-blue-700"
              whileTap={{ scale: 0.95 }}
            >
              Использовать все локальные
            </motion.button>
            <motion.button
              onClick={() => handleResolveConflict('all', 'cloud')}
              className="w-full p-4 rounded-2xl font-semibold text-white bg-green-600 hover:bg-green-700"
              whileTap={{ scale: 0.95 }}
            >
              Использовать все облачные
            </motion.button>
          </div>
        </div>
      </ModalWrapper>
    </AnimatePresence>
  );
};

export default SyncConflictModal;