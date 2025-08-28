// src/components/modals/EditProfileModal.jsx
import React, { useState } from 'react';
import { ICONS } from '../icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import ModalWrapper from './ModalWrapper';

/**
 * Модальное окно для редактирования профиля пользователя.
 * Позволяет изменять имя, email, аватар и его цвет.
 * @returns {JSX.Element}
 */
const EditProfileModal = () => {
  const { userProfile, setUserProfile, setShowEditProfileModal } = useAppContext();
  const [editedProfile, setEditedProfile] = useState({ ...userProfile });
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  /**
   * Сохраняет изменения профиля и закрывает модальное окно.
   */
  const handleSave = () => {
    setUserProfile(editedProfile);
    setShowEditProfileModal(false);
  };
  
  /**
   * Закрывает модальное окно без сохранения.
   */
  const handleClose = () => {
    setShowEditProfileModal(false);
  };

  const avatarOptions = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🎯', '💼', '🏦', '💰'];
  const colorOptions = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

  return (
    <ModalWrapper
      title="Редактировать профиль"
      handleClose={handleClose}
    >
      <div className="space-y-8">
        {/* Аватар */}
        <div className="text-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 cursor-pointer"
            style={{ backgroundColor: editedProfile.avatarColor }}
            onClick={() => setShowAvatarPicker(true)}
          >
            {editedProfile.avatar}
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowAvatarPicker(true)}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600"
            >
              <ICONS.User className="w-4 h-4 mr-2" />
              Сменить иконку
            </button>
            <button
              onClick={() => setShowColorPicker(true)}
              className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-xl text-sm font-medium hover:bg-purple-600"
            >
              <ICONS.Palette className="w-4 h-4 mr-2" />
              Сменить цвет
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showAvatarPicker && (
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Выберите иконку</h3>
                <button onClick={() => setShowAvatarPicker(false)}>
                  <ICONS.X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-4">
                {avatarOptions.map(avatar => (
                  <button
                    key={avatar}
                    onClick={() => {
                      setEditedProfile({ ...editedProfile, avatar });
                      setShowAvatarPicker(false);
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      editedProfile.avatar === avatar ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{ backgroundColor: editedProfile.avatarColor }}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showColorPicker && (
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Выберите цвет</h3>
                <button onClick={() => setShowColorPicker(false)}>
                  <ICONS.X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      setEditedProfile({ ...editedProfile, avatarColor: color });
                      setShowColorPicker(false);
                    }}
                    className={`w-12 h-12 rounded-full ${
                      editedProfile.avatarColor === color ? 'ring-2 ring-gray-400' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Имя</label>
          <input
            type="text"
            value={editedProfile.name}
            onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-2xl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Email</label>
          <input
            type="email"
            value={editedProfile.email}
            onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-2xl"
          />
        </div>
      </div>
      <div className="p-6">
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white p-4 rounded-2xl font-semibold hover:bg-blue-700"
        >
          Сохранить изменения
        </button>
      </div>
    </ModalWrapper>
  );
};

export default EditProfileModal;