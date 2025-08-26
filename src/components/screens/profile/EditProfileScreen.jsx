import React, { useState } from 'react';
import { ICONS } from '../../icons';

const EditProfileScreen = ({ userProfile, setUserProfile, setCurrentScreen }) => {
  const [editedProfile, setEditedProfile] = useState({ ...userProfile });
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const avatarOptions = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🎯', '💼', '🏦', '💰'];
  const colorOptions = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

  const handleSave = () => {
    setUserProfile(editedProfile);
    setCurrentScreen('');
  };

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-8">
        <button
          onClick={() => setCurrentScreen('')}
          className="mr-4 p-2 rounded-full hover:bg-gray-200"
        >
          <ICONS.ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Редактировать профиль</h2>
      </div>

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

        {/* Выбор аватара */}
        {showAvatarPicker && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
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
          </div>
        )}

        {/* Выбор цвета */}
        {showColorPicker && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
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
          </div>
        )}

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

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white p-4 rounded-2xl font-semibold hover:bg-blue-700"
        >
          Сохранить изменения
        </button>
      </div>
    </div>
  );
};

export default EditProfileScreen;