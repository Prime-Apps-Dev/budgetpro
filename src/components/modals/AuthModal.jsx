// src/components/modals/AuthModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModalWrapper from './ModalWrapper';
import SignInScreen from '../../features/auth/SignInScreen';
import SignUpScreen from '../../features/auth/SignUpScreen';

const AuthModal = ({ handleClose }) => {
  const [isSignInView, setIsSignInView] = useState(true);

  const switchView = () => {
    setIsSignInView(prev => !prev);
  };
  
  const handleCloseWrapper = () => {
    setIsSignInView(true); // Reset to sign-in view on close
    handleClose();
  };

  return (
    <ModalWrapper
      title={isSignInView ? 'Войти в аккаунт' : 'Создать аккаунт'}
      handleClose={handleCloseWrapper}
    >
      <AnimatePresence mode="wait">
        {isSignInView ? (
          <motion.div
            key="signin"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            <SignInScreen switchView={switchView} />
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            <SignUpScreen switchView={switchView} />
          </motion.div>
        )}
      </AnimatePresence>
    </ModalWrapper>
  );
};

export default AuthModal;