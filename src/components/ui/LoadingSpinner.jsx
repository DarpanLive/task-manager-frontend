// src/components/ui/LoadingSpinner.jsx
import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="spinner"
      />
    </div>
  )
}

export default LoadingSpinner