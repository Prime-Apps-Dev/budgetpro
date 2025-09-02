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
  item = null,
  swipeDeleteIcon: SwipeDeleteIcon = null
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
  const elementRef = useRef(null);
  
  const LONG_PRESS_DURATION = 500;
  const DOUBLE_TAP_DELAY = 300;
  const SWIPE_THRESHOLD = 50;
  const MOVE_THRESHOLD = 10;
  const SCROLL_THRESHOLD = 5;
  const MAX_SWIPE_DISTANCE = 80;

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
    console.log('🔍 getEventPos called with event:', e.type);
    
    // Для touch событий
    if (e.touches && e.touches.length > 0) {
      const pos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      console.log('🔍 Touch position (touches):', pos);
      return pos;
    }
    
    // Для touchend/touchcancel используем changedTouches
    if (e.changedTouches && e.changedTouches.length > 0) {
      const pos = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      console.log('🔍 Touch position (changedTouches):', pos);
      return pos;
    }
    
    // Для mouse событий
    if (e.clientX !== undefined && e.clientY !== undefined) {
      const pos = { x: e.clientX, y: e.clientY };
      console.log('🔍 Mouse position:', pos);
      return pos;
    }
    
    console.log('🔴 No valid coordinates found in event!');
    return { x: 0, y: 0 };
  }, []);

  const calculateDistance = useCallback((pos1, pos2) => {
    return Math.sqrt(
      Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2)
    );
  }, []);

  const handleStart = useCallback((e) => {
    if (disabled) return;
    
    console.log('🟢 LongPressWrapper handleStart called');
    const pos = getEventPos(e);
    console.log('🟢 Start position:', pos);
    
    // Проверяем валидность координат
    if (isNaN(pos.x) || isNaN(pos.y)) {
      console.log('🔴 Invalid start position, aborting');
      return;
    }
    
    setStartPos(pos);
    setCurrentPos(pos);
    setIsPressed(true);
    setSwipeDistance(0);
    
    hasMoved.current = false;
    hasTriggeredLongPress.current = false;
    isScrolling.current = false;

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
    
    if (distance > MOVE_THRESHOLD) {
      hasMoved.current = true;
      
      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
      const isVertical = Math.abs(deltaY) > Math.abs(deltaX);
      
      if (isVertical && Math.abs(deltaY) > SCROLL_THRESHOLD) {
        isScrolling.current = true;
        setSwipeDistance(0);
        clearTimers();
        return;
      }
      
      if (isHorizontal) {
        // ИСПРАВЛЕНИЕ: Вместо preventDefault используем return false
        // и добавляем проверку на пассивные слушатели
        try {
          e.preventDefault();
          e.stopPropagation();
        } catch (error) {
          // Игнорируем ошибки passive listener
        }
        
        if (deltaX < 0) {
          const swipe = Math.min(Math.abs(deltaX), MAX_SWIPE_DISTANCE);
          setSwipeDistance(swipe);
        } else {
          setSwipeDistance(0);
        }
      }
    }
    
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
    
    if (isScrolling.current) {
      resetState();
      return;
    }
    
    if (distance > SWIPE_THRESHOLD) {
      if (deltaX < -SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(pos.y - startPos.y)) {
        try {
          e.preventDefault();
          e.stopPropagation();
        } catch (error) {
          // Игнорируем ошибки passive listener
        }
        onSwipeLeft?.(item || undefined);
        resetState();
        return;
      }
    }
    
    if (!hasMoved.current && !hasTriggeredLongPress.current) {
      try {
        e.preventDefault();
        e.stopPropagation();
      } catch (error) {
        // Игнорируем ошибки passive listener
      }
      
      tapCount.current += 1;
      
      if (tapCount.current === 1) {
        tapTimer.current = setTimeout(() => {
          if (tapCount.current === 1) {
            onTap?.(item || undefined);
          }
          resetState();
        }, DOUBLE_TAP_DELAY);
      } else if (tapCount.current === 2) {
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
    onDoubleTap,
    item
  ]);

  const handleCancel = useCallback(() => {
    clearTimers();
    resetState();
  }, [clearTimers, resetState]);

  // ИСПРАВЛЕНИЕ: Используем useEffect для добавления слушателей с { passive: false }
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const touchStartHandler = (e) => handleStart(e);
    const touchMoveHandler = (e) => handleMove(e);
    const touchEndHandler = (e) => handleEnd(e);
    const touchCancelHandler = (e) => handleCancel(e);

    element.addEventListener('touchstart', touchStartHandler, { passive: false });
    element.addEventListener('touchmove', touchMoveHandler, { passive: false });
    element.addEventListener('touchend', touchEndHandler, { passive: false });
    element.addEventListener('touchcancel', touchCancelHandler, { passive: false });

    return () => {
      element.removeEventListener('touchstart', touchStartHandler);
      element.removeEventListener('touchmove', touchMoveHandler);
      element.removeEventListener('touchend', touchEndHandler);
      element.removeEventListener('touchcancel', touchCancelHandler);
    };
  }, [handleStart, handleMove, handleEnd, handleCancel]);

  useEffect(() => {
    return () => {
      clearTimeout(pressTimer.current);
      clearTimeout(tapTimer.current);
    };
  }, []);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
  }, []);

  const showDeleteButton = swipeDistance > SWIPE_THRESHOLD;

  return (
    <div className="relative">
      <motion.div
        ref={elementRef}
        className={`${className} ${isPressed && !isScrolling.current ? 'pressed' : ''}`}
        style={{ 
          x: -swipeDistance,
          touchAction: 'pan-y',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
        transition={springConfig}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleCancel}
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