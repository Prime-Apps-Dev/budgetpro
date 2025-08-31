// src/components/ui/LongPressWrapper.jsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LongPressWrapper = ({ 
  children, 
  onTap, 
  onDoubleTap, 
  onSwipeLeft, 
  onLongPress,
  className = "",
  disabled = false,
  item = null, // Добавляем item для передачи в обработчики
  swipeDeleteIcon: SwipeDeleteIcon = null // Опциональная иконка для удаления
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [swipeDistance, setSwipeDistance] = useState(0);
  
  const pressTimer = useRef(null);
  const tapTimer = useRef(null);
  const tapCount = useRef(0);
  const hasMoved = useRef(false);
  const hasTriggeredLongPress = useRef(false);
  const isScrolling = useRef(false);
  
  // Константы для настройки жестов
  const LONG_PRESS_DURATION = 500; // мс
  const DOUBLE_TAP_DELAY = 300; // мс
  const SWIPE_THRESHOLD = 50; // пикселей
  const MOVE_THRESHOLD = 10; // пикселей для определения движения
  const SCROLL_THRESHOLD = 5; // пикселей для начала скролла
  const MAX_SWIPE_DISTANCE = 80; // максимальное расстояние свайпа для анимации

  // Настройки анимации (аналог spring и whileTap из оригинала)
  const springConfig = { 
    type: "spring", 
    stiffness: 300, 
    damping: 30 
  };
  
  const whileTapConfig = { 
    scale: 0.98,
    transition: { duration: 0.1 }
  };

  const clearTimers = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
      tapTimer.current = null;
    }
  }, []);

  const resetState = useCallback(() => {
    setIsPressed(false);
    setSwipeDistance(0);
    hasMoved.current = false;
    hasTriggeredLongPress.current = false;
    isScrolling.current = false;
    tapCount.current = 0;
  }, []);

  const getEventPos = useCallback((e) => {
    if (e.touches && e.touches[0]) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }, []);

  const calculateDistance = useCallback((pos1, pos2) => {
    return Math.sqrt(
      Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2)
    );
  }, []);

  const handleStart = useCallback((e) => {
    if (disabled) return;
    
    // Предотвращаем всплытие только для touch событий
    if (e.type === 'touchstart') {
      e.stopPropagation();
    }
    
    const pos = getEventPos(e);
    setStartPos(pos);
    setCurrentPos(pos);
    setIsPressed(true);
    setSwipeDistance(0); // Сбрасываем свайп при новом нажатии
    
    hasMoved.current = false;
    hasTriggeredLongPress.current = false;
    isScrolling.current = false;

    // Запускаем таймер для долгого нажатия
    pressTimer.current = setTimeout(() => {
      if (!hasMoved.current && !hasTriggeredLongPress.current) {
        hasTriggeredLongPress.current = true;
        onLongPress?.(item || undefined);
      }
    }, LONG_PRESS_DURATION);
  }, [disabled, getEventPos, onLongPress, item]);

  const handleMove = useCallback((e) => {
    if (disabled || !isPressed) return;

    const pos = getEventPos(e);
    setCurrentPos(pos);
    
    const distance = calculateDistance(startPos, pos);
    const deltaX = pos.x - startPos.x;
    const deltaY = pos.y - startPos.y;
    
    // Определяем, началось ли движение
    if (distance > MOVE_THRESHOLD) {
      hasMoved.current = true;
      
      // Определяем направление движения
      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
      const isVertical = Math.abs(deltaY) > Math.abs(deltaX);
      
      // Если движение вертикальное и превышает порог - это скролл
      if (isVertical && Math.abs(deltaY) > SCROLL_THRESHOLD) {
        isScrolling.current = true;
        setSwipeDistance(0); // Сбрасываем свайп при скролле
        clearTimers();
        // Позволяем событию всплыть для скролла
        return;
      }
      
      // Если движение горизонтальное - обрабатываем свайп и предотвращаем скролл
      if (isHorizontal) {
        e.preventDefault();
        e.stopPropagation();
        
        // Обновляем расстояние свайпа (только влево)
        if (deltaX < 0) {
          const swipe = Math.min(Math.abs(deltaX), MAX_SWIPE_DISTANCE);
          setSwipeDistance(swipe);
        } else {
          setSwipeDistance(0); // Сбрасываем при свайпе вправо
        }
      }
    }
    
    // Отменяем долгое нажатие при движении
    if (hasMoved.current && pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, [disabled, isPressed, startPos, calculateDistance, clearTimers, getEventPos]);

  const handleEnd = useCallback((e) => {
    if (disabled) return;
    
    clearTimers();
    
    const pos = getEventPos(e);
    const distance = calculateDistance(startPos, pos);
    const deltaX = pos.x - startPos.x;
    
    // Если это был скролл - игнорируем
    if (isScrolling.current) {
      resetState();
      return;
    }
    
    // Если сильно сдвинули - проверяем на свайп
    if (distance > SWIPE_THRESHOLD) {
      // Свайп влево
      if (deltaX < -SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(pos.y - startPos.y)) {
        e.preventDefault();
        e.stopPropagation();
        onSwipeLeft?.(item || undefined);
        resetState();
        return;
      }
    }
    
    // Если не было движения и не было долгого нажатия - это тап
    if (!hasMoved.current && !hasTriggeredLongPress.current) {
      e.preventDefault();
      e.stopPropagation();
      
      tapCount.current += 1;
      
      if (tapCount.current === 1) {
        // Ждем возможный второй тап
        tapTimer.current = setTimeout(() => {
          if (tapCount.current === 1) {
            onTap?.(item || undefined);
          }
          resetState();
        }, DOUBLE_TAP_DELAY);
      } else if (tapCount.current === 2) {
        // Двойной тап
        clearTimeout(tapTimer.current);
        onDoubleTap?.(item || undefined);
        resetState();
      }
    } else {
      resetState();
    }
  }, [
    disabled, 
    clearTimers, 
    getEventPos, 
    calculateDistance, 
    startPos, 
    resetState, 
    onSwipeLeft, 
    onTap, 
    onDoubleTap
  ]);

  // Обработчики для отмены действий при уходе курсора/пальца
  const handleCancel = useCallback(() => {
    clearTimers();
    resetState();
  }, [clearTimers, resetState]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(pressTimer.current);
      clearTimeout(tapTimer.current);
    };
  }, []);

  // Обработчик для предотвращения контекстного меню
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Определяем, показывать ли кнопку удаления
  const showDeleteButton = swipeDistance > SWIPE_THRESHOLD;

  return (
    <div className="relative">
      <motion.div
        className={`${className} ${isPressed && !isScrolling.current ? 'pressed' : ''}`}
        style={{ 
          x: -swipeDistance,
          touchAction: 'pan-y', // Разрешаем вертикальный скролл
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
        transition={springConfig}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleCancel}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onTouchCancel={handleCancel}
        onContextMenu={handleContextMenu}
        whileTap={swipeDistance === 0 ? whileTapConfig : {}}
      >
        {children}
      </motion.div>
      
      <AnimatePresence>
        {showDeleteButton && SwipeDeleteIcon && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={(e) => {
              e.stopPropagation();
              onSwipeLeft?.(item || undefined);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white p-3 rounded-2xl shadow-lg z-10"
          >
            <SwipeDeleteIcon className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LongPressWrapper;