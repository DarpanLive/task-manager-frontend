// src/components/ui/Toast.jsx
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.25 }}
        className={`toast toast-${type}`}
      >
        <span className="toast-icon">{icons[type]}</span>
        <span className="toast-message">{message}</span>
        <button onClick={onClose} className="toast-close" aria-label="Close">
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

export default Toast