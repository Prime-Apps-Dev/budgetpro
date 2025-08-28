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