import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { loginUser } from "../api/auth"

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState({ email: false, password: false })

  const floatingShapes = [
    { id: 1, x: '10%', y: '20%', size: 150, delay: 0, duration: 20, color: 'rgba(167, 139, 250, 0.15)' },
    { id: 2, x: '85%', y: '15%', size: 100, delay: 2, duration: 25, color: 'rgba(236, 72, 153, 0.15)' },
    { id: 3, x: '15%', y: '70%', size: 200, delay: 4, duration: 18, color: 'rgba(79, 70, 229, 0.1)' },
    { id: 4, x: '75%', y: '65%', size: 120, delay: 6, duration: 22, color: 'rgba(139, 92, 246, 0.15)' },
    { id: 5, x: '50%', y: '40%', size: 80, delay: 8, duration: 28, color: 'rgba(168, 85, 247, 0.1)' },
    { id: 6, x: '30%', y: '80%', size: 90, delay: 10, duration: 24, color: 'rgba(244, 114, 182, 0.12)' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Please fill in all fields')
      setTimeout(() => setError(''), 3000)
      return
    }
    
    setLoading(true)
    setError('')

    try {
      const response = await loginUser({
        email: email.trim().toLowerCase(),
        password: password
      })

      if (response.data) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
        }
        
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user))
        } else {
          localStorage.setItem('user', JSON.stringify({
            email: email,
            role: response.data.role || 'MEMBER'
          }))
        }

        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Login error:', err)
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          err.response?.data?.errors?.map(e => e.message).join(', ') ||
                          'Invalid email or password. Please try again.'
      
      setError(errorMessage)
      setTimeout(() => setError(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} }
      handleSubmit(fakeEvent)
    }, 100)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', 
      position: 'relative', 
      overflow: 'hidden',
      padding: '1rem'
    }}>
      {/* Animated Background Shapes */}
      {floatingShapes.map((shape) => (
        <motion.div
          key={shape.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.2, 0.5, 0.2], 
            scale: [1, 1.3, 1], 
            x: [0, 40, -40, 0], 
            y: [0, -40, 40, 0] 
          }}
          transition={{ 
            duration: shape.duration, 
            delay: shape.delay, 
            repeat: Infinity, 
            repeatType: 'reverse' 
          }}
          style={{ 
            position: 'absolute', 
            left: shape.x, 
            top: shape.y, 
            width: shape.size, 
            height: shape.size, 
            background: shape.color, 
            borderRadius: '50%', 
            filter: 'blur(70px)', 
            pointerEvents: 'none' 
          }}
        />
      ))}

      {/* Animated Particles */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0 
          }}
          animate={{ 
            y: [null, -150],
            opacity: [0, 0.4, 0],
            x: [null, (Math.random() - 0.5) * 200]
          }}
          transition={{ 
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: 'linear'
          }}
          style={{ 
            position: 'absolute', 
            width: '3px', 
            height: '3px', 
            background: 'rgba(255,255,255,0.5)', 
            borderRadius: '50%', 
            pointerEvents: 'none' 
          }}
        />
      ))}

      {/* Login Card - FIXED HEIGHT, NO SCROLLING */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ 
          background: 'rgba(255, 255, 255, 0.98)', 
          backdropFilter: 'blur(20px)', 
          borderRadius: '2rem', 
          padding: '2rem',
          width: '100%', 
          maxWidth: '420px',
          boxShadow: '0 30px 60px -20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.1)',
          zIndex: 10,
          position: 'relative'
        }}
      >
        {/* Backend Connection Status */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          background: '#10b981',
          color: 'white',
          padding: '0.2rem 0.6rem',
          borderRadius: '0.5rem',
          fontSize: '0.65rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <span>🔌</span> Live API
        </div>

        {/* Logo Section - Reduced margin */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <motion.div 
            whileHover={{ rotate: 360, scale: 1.1 }} 
            transition={{ duration: 0.5, type: 'spring' }}
            style={{ 
              width: '60px', 
              height: '60px', 
              background: 'linear-gradient(135deg, #667eea, #764ba2)', 
              borderRadius: '1rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 0.75rem', 
              boxShadow: '0 15px 30px -10px rgba(102, 126, 234, 0.4)',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '1.8rem' }}>✅</span>
          </motion.div>
          
          <motion.h1 
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ 
              fontSize: '1.8rem', 
              fontWeight: 'bold', 
              background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb, #667eea)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '0.25rem'
            }}
          >
            TaskFlow
          </motion.h1>
          
          <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            Welcome back! Please login
          </p>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              style={{ 
                background: '#fef2f2', 
                borderLeft: '4px solid #ef4444',
                color: '#dc2626', 
                padding: '0.6rem 1rem', 
                borderRadius: '0.75rem', 
                marginBottom: '1rem', 
                fontSize: '0.8rem',
                fontWeight: '500'
              }}
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.4rem', 
              fontSize: '0.8rem', 
              fontWeight: '600', 
              color: isFocused.email ? '#667eea' : '#64748b',
              transition: 'color 0.2s'
            }}>
              📧 Email Address
            </label>
            <motion.div
              animate={{ 
                boxShadow: isFocused.email ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : '0 0 0 0px rgba(102, 126, 234, 0)'
              }}
              transition={{ duration: 0.2 }}
              style={{ borderRadius: '0.75rem', overflow: 'hidden' }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused({ ...isFocused, email: true })}
                onBlur={() => setIsFocused({ ...isFocused, email: false })}
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem',
                  border: `2px solid ${isFocused.email ? '#667eea' : '#e2e8f0'}`,
                  borderRadius: '0.75rem',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                  outline: 'none',
                  background: '#f8fafc',
                  boxSizing: 'border-box'
                }}
                required
              />
            </motion.div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.4rem', 
              fontSize: '0.8rem', 
              fontWeight: '600', 
              color: isFocused.password ? '#667eea' : '#64748b',
              transition: 'color 0.2s'
            }}>
              🔒 Password
            </label>
            <div style={{ position: 'relative' }}>
              <motion.div
                animate={{ 
                  boxShadow: isFocused.password ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : '0 0 0 0px rgba(102, 126, 234, 0)'
                }}
                transition={{ duration: 0.2 }}
                style={{ borderRadius: '0.75rem', overflow: 'hidden' }}
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused({ ...isFocused, password: true })}
                  onBlur={() => setIsFocused({ ...isFocused, password: false })}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '0.7rem 2.5rem 0.7rem 1rem',
                    border: `2px solid ${isFocused.password ? '#667eea' : '#e2e8f0'}`,
                    borderRadius: '0.75rem',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s',
                    outline: 'none',
                    background: '#f8fafc',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </motion.div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: '0.25rem',
                  borderRadius: '0.5rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
            <Link 
              to="/forgot-password" 
              style={{ 
                fontSize: '0.7rem', 
                color: '#667eea', 
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#764ba2'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#667eea'}
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            style={{
              width: '100%',
              padding: '0.8rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s',
              marginBottom: '1rem'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ display: 'inline-block' }}
                >
                  ⏳
                </motion.span>
                Logging in...
              </span>
            ) : (
              'Login →'
            )}
          </motion.button>
        </form>

        {/* Demo Credentials Box - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
          style={{ 
            marginTop: '0.5rem', 
            padding: '0.75rem', 
            background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
            borderRadius: '0.75rem',
            border: '1px solid #d8b4fe'
          }}
        >
          <p style={{ 
            fontSize: '0.7rem', 
            textAlign: 'center', 
            fontWeight: 'bold', 
            marginBottom: '0.5rem', 
            color: '#6b21a5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <span>🎯</span> Demo Credentials <span>👇</span>
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1.5rem', 
            flexWrap: 'wrap',
            fontSize: '0.7rem'
          }}>
            <div 
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => handleDemoLogin('admin@example.com', 'admin123')}
            >
              <span style={{ 
                background: '#6b21a5', 
                color: 'white', 
                padding: '0.15rem 0.4rem', 
                borderRadius: '0.5rem',
                fontSize: '0.65rem',
                display: 'inline-block',
                marginBottom: '0.2rem'
              }}>
                Admin
              </span>
              <div style={{ color: '#4c1d95', marginTop: '0.2rem', fontSize: '0.65rem' }}>
                admin@example.com
                <br />
                admin123
              </div>
            </div>
            <div 
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => handleDemoLogin('member@example.com', 'member123')}
            >
              <span style={{ 
                background: '#059669', 
                color: 'white', 
                padding: '0.15rem 0.4rem', 
                borderRadius: '0.5rem',
                fontSize: '0.65rem',
                display: 'inline-block',
                marginBottom: '0.2rem'
              }}>
                Member
              </span>
              <div style={{ color: '#065f46', marginTop: '0.2rem', fontSize: '0.65rem' }}>
                member@example.com
                <br />
                member123
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sign Up Link */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '1rem', 
          paddingTop: '0.75rem',
          borderTop: '1px solid #e2e8f0'
        }}>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              style={{ 
                color: '#667eea', 
                textDecoration: 'none', 
                fontWeight: 'bold',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#764ba2'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#667eea'}
            >
              Sign up →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage