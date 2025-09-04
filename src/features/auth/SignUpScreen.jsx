// src/features/auth/SignUpScreen.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { spring, whileTap } from '../../utils/motion';
import { useAuth } from '../../context/AuthContext';
import { ICONS } from '../../components/icons';

const SignUpScreen = ({ switchView }) => {
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    if (e.target.name === 'password') {
      calculatePasswordStrength(e.target.value);
    }
  };
  
  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    setPasswordStrength(score);
  };
  
  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (formData.password.length < 6) {
        throw new Error('Пароль должен быть не менее 6 символов');
      }
      await signUp({ name: formData.name, email: formData.email, password: formData.password });
      setMessage('На вашу почту отправлена ссылка для подтверждения. Пожалуйста, проверьте свой почтовый ящик.');
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err.message || 'Произошла ошибка при регистрации. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">Имя</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ваше имя"
            className="w-full p-4 border border-gray-300 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          />
        </div>
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
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
              style={{ width: `${passwordStrength}%` }}
            />
          </div>
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

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl text-sm font-medium flex items-center"
        >
          <ICONS.Check className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{message}</span>
        </motion.div>
      )}

      <motion.button
        onClick={handleSignUp}
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
          'Зарегистрироваться'
        )}
      </motion.button>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Уже есть аккаунт?
        <button
          onClick={switchView}
          className="text-blue-600 dark:text-blue-400 font-medium ml-1"
        >
          Войти
        </button>
      </div>
    </div>
  );
};

export default SignUpScreen;