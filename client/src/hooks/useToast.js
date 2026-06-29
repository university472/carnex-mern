// client/src/hooks/useToast.js
import { useToastContext } from '../context/ToastContext'

export function useToast() {
  return useToastContext()
}
