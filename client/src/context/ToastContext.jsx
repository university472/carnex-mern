// client/src/context/ToastContext.jsx
import { createContext, useContext } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const success = (msg) => toast.success(msg)
  const error = (msg) => toast.error(msg)
  const info = (msg) => toast(msg)
  const promise = (prom, msgs) => toast.promise(prom, msgs)

  return (
    <ToastContext.Provider value={{ success, error, info, promise }}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: '13px',
            maxWidth: '360px'
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#fff' }
          },
          error: {
            iconTheme: { primary: '#DC2626', secondary: '#fff' }
          }
        }}
      />
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider')
  }

  return context
}
