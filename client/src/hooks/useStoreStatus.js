// // client/src/hooks/useStoreStatus.js
// import { useState, useEffect } from 'react';

// export function useStoreStatus() {
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     function check() {
//       const now = new Date();
//       const day = now.getDay(); // 0=Sun
//       const hour = now.getHours();
//       // Mon-Sat, 9am-5pm
//       setIsOpen(day >= 1 && day <= 6 && hour >= 9 && hour < 17);
//     }
//     check();
//     const timer = setInterval(check, 60000); // re‑check every minute
//     return () => clearInterval(timer);
//   }, []);

//   return isOpen;
// }

// client/src/hooks/useStoreStatus.js
import { useState, useEffect, useCallback } from 'react'

const OPEN_HOUR = 9 // 9 AM
const CLOSE_HOUR = 17 // 5 PM
const CHECK_INTERVAL = 60000 // 1 minute

export function useStoreStatus() {
  const [isOpen, setIsOpen] = useState(false)

  const checkStatus = useCallback(() => {
    try {
      // Get current Pacific Time
      const pacificTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
        weekday: 'short' // Optional: check business days
      }).format(new Date())

      // Parse time and optional day
      const [weekday, time] = pacificTime.split(', ')
      const [hour, minute] = time.split(':').map(Number)

      // Check if it's a weekday (optional - remove if open 7 days)
      const isWeekday = !['Sat', 'Sun'].includes(weekday)

      // Check business hours
      const isBusinessHours =
        (hour > OPEN_HOUR || (hour === OPEN_HOUR && minute >= 0)) && // 9:00 or later
        (hour < CLOSE_HOUR || (hour === CLOSE_HOUR && minute === 0)) // Before 17:00

      setIsOpen(isWeekday && isBusinessHours)
    } catch (error) {
      console.error(error)
      // Fallback to local time with day check
      const now = new Date()
      const day = now.getDay() // 0=Sun, 6=Sat
      const hour = now.getHours()

      const isWeekday = day >= 1 && day <= 5 // Mon-Fri
      const isBusinessHours = hour >= OPEN_HOUR && hour < CLOSE_HOUR

      setIsOpen(isWeekday && isBusinessHours)
      console.warn('Falling back to local time for store status check')
    }
  }, [])

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, CHECK_INTERVAL)

    // Optional: Sync with next minute boundary for more precise updates
    const now = Date.now()
    const delay = CHECK_INTERVAL - (now % CHECK_INTERVAL)
    const timeout = setTimeout(() => {
      checkStatus()
      // Could realign interval here if needed
    }, delay)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [checkStatus])

  return isOpen
}
