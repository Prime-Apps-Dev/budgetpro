// src/utils/motion.js
export const spring = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
};

export const whileTap = { scale: 0.95 };

export const whileHover = { scale: 1.05 };

export const jiggle = {
  rotate: [0, -2, 2, -2, 2, 0],
  transition: {
    duration: 0.3,
    times: [0, 0.2, 0.4, 0.6, 0.8, 1],
  },
};

export const fadeInOut = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.25, type: "tween" },
};

export const pressSlow = {
  scale: 0.9,
  transition: { duration: 0.5, type: "tween" },
};

export const zoomInOut = {
  // initial: { opacity: 0.5, scale: 0.9 }, // Удаляем initial, чтобы элементы были видны сразу
  whileInView: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

// Новые анимации для MyFinancialProductsScreen

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, type: "tween" },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4, type: "tween" },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.3, type: "tween" },
};

export const slideInFromLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
  transition: { duration: 0.3, type: "tween" },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 25 },
};

export const bounceIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
    }
  },
  exit: { opacity: 0, scale: 0.3 },
};