// src/features/auth/SignInScreen.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { spring, whileTap } from '../../utils/motion';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ICONS } from '../../components/icons';

const SignInScreen = ({ switchView }) => {
  const { navigateToTab, closeAllModals } = useAppContext();
  const { signIn } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn({ email: formData.email, password: formData.password });
      closeAllModals();
      navigateToTab('profile');
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">Пароль</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          />
        </div>
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium flex items-center"
        >
          <ICONS.AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <motion.button
        onClick={handleSignIn}
        disabled={loading}
        className={`w-full p-4 rounded-2xl font-semibold text-white transition-colors flex items-center justify-center ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        whileTap={whileTap}
        transition={spring}
      >
        {loading ? (
          <ICONS.Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          'Войти'
        )}
      </motion.button>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Нет аккаунта?
        <button
          onClick={switchView}
          className="text-blue-600 dark:text-blue-400 font-medium ml-1"
        >
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
};

export default SignInScreen;