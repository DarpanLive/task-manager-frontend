// src/components/layout/MobileNav.jsx
import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, theme, setTheme } = useAuth()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/projects', label: 'Projects', icon: '📁' },
    { path: '/tasks', label: 'Tasks', icon: '✅' },
    { path: '/users', label: 'Users', icon: '👥', adminOnly: true },
  ]

  const filteredItems = navItems.filter(item => !item.adminOnly || user?.role === 'ADMIN')

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <button className="mobile-nav-toggle" onClick={() => setIsOpen(true)} aria-label="Open menu">
        ☰
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mobile-overlay"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="mobile-menu"
            >
              <div className="mobile-menu-header">
                <span className="logo">TaskFlow</span>
                <button className="mobile-close" onClick={() => setIsOpen(false)}>
                  ✕
                </button>
              </div>

              <nav className="sidebar-nav">
                {filteredItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="nav-item"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="sidebar-footer">
                <button
                  onClick={() => {
                    setTheme(theme === 'light' ? 'dark' : 'light')
                    setIsOpen(false)
                  }}
                  className="nav-item"
                  style={{ width: '100%' }}
                >
                  <span className="nav-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
                  <span className="nav-label">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="nav-item"
                  style={{ width: '100%', color: '#ef4444' }}
                >
                  <span className="nav-icon">🚪</span>
                  <span className="nav-label">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileNav