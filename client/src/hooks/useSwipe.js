import { useRef, useCallback } from 'react';

export function useSwipe({ onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight, threshold = 50 }) {
  const touchStart = useRef(null);

  const handleTouchStart = useCallback((e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!touchStart.current) return;
    const { x: startX, y: startY } = touchStart.current;
    const { clientX: endX, clientY: endY } = e.changedTouches[0];
    const dx = endX - startX;
    const dy = endY - startY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      if (dx > 0 && onSwipeRight) onSwipeRight();
      else if (dx < 0 && onSwipeLeft) onSwipeLeft();
    } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > threshold) {
      if (dy > 0 && onSwipeDown) onSwipeDown();
      else if (dy < 0 && onSwipeUp) onSwipeUp();
    }
    touchStart.current = null;
  }, [onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight, threshold]);

  return { onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd };
}