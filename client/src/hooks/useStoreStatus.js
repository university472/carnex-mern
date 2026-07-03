// client/src/hooks/useStoreStatus.js
import { useState, useEffect } from 'react';

export function useStoreStatus() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function check() {
      const now = new Date();
      const day = now.getDay(); // 0=Sun
      const hour = now.getHours();
      // Mon-Sat, 9am-5pm
      setIsOpen(day >= 1 && day <= 6 && hour >= 9 && hour < 17);
    }
    check();
    const timer = setInterval(check, 60000); // re‑check every minute
    return () => clearInterval(timer);
  }, []);

  return isOpen;
}