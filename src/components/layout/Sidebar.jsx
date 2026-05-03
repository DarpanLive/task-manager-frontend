import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(true)
  const [user, setUser] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // On mobile, start collapsed; on desktop, start expanded
      if (mobile) {
        setIsExpanded(false)
      } else {
        setIsExpanded(true)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const logout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      navigate('/login')
    }
  }

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard', roles: ['ADMIN', 'MEMBER'], description: 'Overview & Analytics' },
    { path: '/projects', icon: '📁', label: 'Projects', roles: ['ADMIN', 'MEMBER'], description: 'Manage projects' },
    { path: '/tasks', icon: '✅', label: 'Tasks', roles: ['ADMIN', 'MEMBER'], description: 'Track tasks' },
    { path: '/users', icon: '👥', label: 'Users', roles: ['ADMIN'], description: 'Team management' },
  ]

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role)
  )

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 70 }
  }

  return (
    <>
      {/* Floating Toggle Button - ALWAYS VISIBLE when sidebar is collapsed on any screen */}
      {!isExpanded && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            color: 'white',
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          ☰
        </motion.button>
      )}

      {/* Mobile Overlay - Click to close sidebar when expanded on mobile */}
      <AnimatePresence>
        {isMobile && isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 40
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="expanded"
        animate={isExpanded ? "expanded" : "collapsed"}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          background: 'linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          color: 'white',
          zIndex: 50,
          overflowX: 'hidden',
          overflowY: 'auto',
          boxShadow: '4px 0 20px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
          scrollbarWidth: 'thin',
          scrollbarColor: '#4f46e5 #1e1b4b'
        }}
      >
        {/* Decorative Gradient Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #4f46e5, #8b5cf6, #ec4899)'
        }} />

        {/* Logo Section with Toggle Button */}
        <div style={{
          padding: '1.5rem 1.25rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <motion.div
            animate={isExpanded ? { opacity: 1 } : { opacity: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)'
              }}
            >
              ✅
            </motion.div>
            <div>
              <h1 style={{ 
                fontSize: '1.4rem', 
                fontWeight: 'bold', 
                background: 'linear-gradient(135deg, #a78bfa, #ec4899, #f43f5e)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.5px'
              }}>
                TaskFlow
              </h1>
              <p style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '-2px' }}>Project Management</p>
            </div>
          </motion.div>
          
          {/* Toggle Button inside sidebar - Visible when expanded */}
          {isExpanded && (
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                color: 'white',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}
            >
              ◀
            </motion.button>
          )}
        </div>

        {/* User Info - Only show when expanded */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                padding: '1rem 1.25rem',
                margin: '0 0.75rem 1rem 0.75rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.08)',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  style={{
                    width: '45px',
                    height: '45px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    position: 'relative'
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                  <div style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    width: '12px',
                    height: '12px',
                    background: '#10b981',
                    borderRadius: '50%',
                    border: '2px solid #302b63'
                  }} />
                </motion.div>
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '2px' }}>{user?.name}</p>
                  <p style={{ 
                    fontSize: '0.7rem', 
                    opacity: 0.7,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      background: user?.role === 'ADMIN' ? '#f59e0b' : '#10b981',
                      borderRadius: '50%'
                    }} />
                    {user?.role === 'ADMIN' ? 'Administrator' : 'Team Member'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Items */}
        <nav style={{ padding: '0 0.75rem', flex: 1 }}>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  padding: '0 0.5rem',
                  marginBottom: '0.75rem',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'rgba(255,255,255,0.4)'
                }}
              >
                MAIN MENU
              </motion.div>
            )}
          </AnimatePresence>
          
          {filteredNavItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isExpanded ? 'flex-start' : 'center',
                  gap: isExpanded ? '1rem' : '0',
                  padding: isExpanded ? '0.75rem 1rem' : '0.75rem',
                  margin: '0.25rem 0',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                  background: isActive 
                    ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' 
                    : hoveredItem === item.path 
                      ? 'rgba(255,255,255,0.08)' 
                      : 'transparent',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden'
                })}
              >
                {/* Tooltip for collapsed mode */}
                {!isExpanded && (
                  <div style={{
                    position: 'absolute',
                    left: '70px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#1e1b4b',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    zIndex: 100,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    opacity: hoveredItem === item.path ? 1 : 0,
                    pointerEvents: 'none',
                    transition: 'opacity 0.2s'
                  }}>
                    {item.label}
                  </div>
                )}
                
                <span style={{ fontSize: '1.2rem', minWidth: '24px', textAlign: 'center' }}>{item.icon}</span>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      style={{ flex: 1 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                          {item.label}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.65rem', opacity: 0.5, marginTop: '2px' }}>
                        {item.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Footer - Logout */}
        <div style={{
          padding: '1rem 0.75rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          marginTop: 'auto'
        }}>
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isExpanded ? 'flex-start' : 'center',
              gap: isExpanded ? '0.75rem' : '0',
              width: '100%',
              padding: isExpanded ? '0.75rem 1rem' : '0.75rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '10px',
              color: '#f87171',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>🚪</span>
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  style={{ fontSize: '0.875rem', fontWeight: 500, flex: 1, textAlign: 'left' }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar