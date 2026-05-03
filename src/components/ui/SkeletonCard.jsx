// src/components/ui/SkeletonCard.jsx
import React from 'react'
import { motion } from 'framer-motion'

const SkeletonCard = ({ type = 'default' }) => {
  const shimmerVariants = {
    initial: { backgroundPosition: '200% 0' },
    animate: { 
      backgroundPosition: '-200% 0',
      transition: { 
        duration: 1.5, 
        repeat: Infinity,
        ease: 'linear'
      }
    }
  }

  if (type === 'stat') {
    return (
      <motion.div
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        className="card"
        style={{
          background: 'linear-gradient(90deg, var(--border-light) 25%, var(--border-color) 50%, var(--border-light) 75%)',
          backgroundSize: '200% 100%'
        }}
      >
        <div className="card-body">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start' 
          }}>
            <div style={{ flex: 1 }}>
              <div className="skeleton-text" style={{ 
                height: '14px', 
                width: '60%', 
                marginBottom: '12px',
                backgroundColor: 'var(--border-color)',
                borderRadius: '4px'
              }} />
              <div className="skeleton-text" style={{ 
                height: '32px', 
                width: '40%',
                backgroundColor: 'var(--border-color)',
                borderRadius: '8px'
              }} />
            </div>
            <div className="skeleton-icon" style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'var(--border-color)'
            }} />
          </div>
        </div>
      </motion.div>
    )
  }

  if (type === 'project') {
    return (
      <motion.div
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        className="card"
        style={{
          background: 'linear-gradient(90deg, var(--border-light) 25%, var(--border-color) 50%, var(--border-light) 75%)',
          backgroundSize: '200% 100%'
        }}
      >
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div className="skeleton-title" style={{
              height: '24px',
              width: '70%',
              backgroundColor: 'var(--border-color)',
              borderRadius: '6px'
            }} />
            <div className="skeleton-menu" style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              backgroundColor: 'var(--border-color)'
            }} />
          </div>
          <div className="skeleton-text" style={{
            height: '16px',
            width: '90%',
            marginBottom: '8px',
            backgroundColor: 'var(--border-color)',
            borderRadius: '4px'
          }} />
          <div className="skeleton-text" style={{
            height: '16px',
            width: '70%',
            marginBottom: '16px',
            backgroundColor: 'var(--border-color)',
            borderRadius: '4px'
          }} />
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="skeleton-badge" style={{
              height: '20px',
              width: '80px',
              backgroundColor: 'var(--border-color)',
              borderRadius: '4px'
            }} />
            <div className="skeleton-badge" style={{
              height: '20px',
              width: '80px',
              backgroundColor: 'var(--border-color)',
              borderRadius: '4px'
            }} />
          </div>
        </div>
      </motion.div>
    )
  }

  if (type === 'task') {
    return (
      <motion.div
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        className="task-item"
        style={{
          background: 'linear-gradient(90deg, var(--border-light) 25%, var(--border-color) 50%, var(--border-light) 75%)',
          backgroundSize: '200% 100%',
          border: '1px solid var(--border-color)'
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div className="skeleton-title" style={{
              height: '20px',
              width: '40%',
              backgroundColor: 'var(--border-color)',
              borderRadius: '4px'
            }} />
            <div className="skeleton-badge" style={{
              height: '24px',
              width: '80px',
              backgroundColor: 'var(--border-color)',
              borderRadius: '6px'
            }} />
          </div>
          <div className="skeleton-text" style={{
            height: '14px',
            width: '80%',
            marginBottom: '8px',
            backgroundColor: 'var(--border-color)',
            borderRadius: '4px'
          }} />
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <div className="skeleton-text" style={{
              height: '12px',
              width: '100px',
              backgroundColor: 'var(--border-color)',
              borderRadius: '4px'
            }} />
            <div className="skeleton-text" style={{
              height: '12px',
              width: '80px',
              backgroundColor: 'var(--border-color)',
              borderRadius: '4px'
            }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="skeleton-button" style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: 'var(--border-color)'
          }} />
          <div className="skeleton-button" style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: 'var(--border-color)'
          }} />
        </div>
      </motion.div>
    )
  }

  if (type === 'user') {
    return (
      <motion.div
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        className="card"
        style={{
          background: 'linear-gradient(90deg, var(--border-light) 25%, var(--border-color) 50%, var(--border-light) 75%)',
          backgroundSize: '200% 100%'
        }}
      >
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div className="skeleton-avatar" style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'var(--border-color)'
            }} />
            <div className="skeleton-badge" style={{
              height: '24px',
              width: '70px',
              backgroundColor: 'var(--border-color)',
              borderRadius: '12px'
            }} />
          </div>
          <div className="skeleton-title" style={{
            height: '20px',
            width: '60%',
            marginBottom: '8px',
            backgroundColor: 'var(--border-color)',
            borderRadius: '4px'
          }} />
          <div className="skeleton-text" style={{
            height: '14px',
            width: '80%',
            marginBottom: '8px',
            backgroundColor: 'var(--border-color)',
            borderRadius: '4px'
          }} />
          <div className="skeleton-text" style={{
            height: '12px',
            width: '50%',
            backgroundColor: 'var(--border-color)',
            borderRadius: '4px'
          }} />
        </div>
      </motion.div>
    )
  }

  // Default skeleton card
  return (
    <motion.div
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
      className="card"
      style={{
        background: 'linear-gradient(90deg, var(--border-light) 25%, var(--border-color) 50%, var(--border-light) 75%)',
        backgroundSize: '200% 100%'
      }}
    >
      <div className="card-body skeleton-card">
        <div className="skeleton-title" style={{
          height: '24px',
          width: '70%',
          marginBottom: '12px',
          backgroundColor: 'var(--border-color)',
          borderRadius: '6px'
        }} />
        <div className="skeleton-text" style={{
          height: '16px',
          width: '90%',
          marginBottom: '8px',
          backgroundColor: 'var(--border-color)',
          borderRadius: '4px'
        }} />
        <div className="skeleton-text" style={{
          height: '16px',
          width: '80%',
          marginBottom: '16px',
          backgroundColor: 'var(--border-color)',
          borderRadius: '4px'
        }} />
        <div className="skeleton-button" style={{
          height: '36px',
          width: '100px',
          backgroundColor: 'var(--border-color)',
          borderRadius: '8px'
        }} />
      </div>
    </motion.div>
  )
}

export default SkeletonCard