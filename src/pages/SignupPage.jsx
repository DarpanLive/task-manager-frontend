import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { signupUser } from "../api/auth"

const SignupPage = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('MEMBER')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isFocused, setIsFocused] = useState({ 
    name: false, 
    email: false, 
    password: false, 
    confirmPassword: false 
  })

  const floatingShapes = [
    { id: 1, x: '10%', y: '20%', size: 150, delay: 0, duration: 20, color: 'rgba(167, 139, 250, 0.15)' },
    { id: 2, x: '85%', y: '15%', size: 100, delay: 2, duration: 25, color: 'rgba(236, 72, 153, 0.15)' },
    { id: 3, x: '15%', y: '70%', size: 200, delay: 4, duration: 18, color: 'rgba(79, 70, 229, 0.1)' },
    { id: 4, x: '75%', y: '65%', size: 120, delay: 6, duration: 22, color: 'rgba(139, 92, 246, 0.15)' },
  ]

  const getPasswordStrength = () => {
    if (!password) return { text: '', color: '#e2e8f0', width: '0%' }
    let score = 0
    if (password.length >= 6) score++
    if (password.match(/[a-z]/)) score++
    if (password.match(/[A-Z]/)) score++
    if (password.match(/[0-9]/)) score++
    if (password.match(/[@$!%*?&]/)) score++
    if (score <= 2) return { text: 'Weak', color: '#ef4444', width: '25%' }
    if (score <= 3) return { text: 'Fair', color: '#f59e0b', width: '50%' }
    if (score <= 4) return { text: 'Good', color: '#10b981', width: '75%' }
    return { text: 'Strong', color: '#059669', width: '100%' }
  }

  const passwordStrength = getPasswordStrength()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      setToast({ message: 'Please fill in all fields', type: 'error' })
      setTimeout(() => setToast(null), 3000)
      return
    }

    if (password !== confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' })
      setTimeout(() => setToast(null), 3000)
      return
    }

    if (password.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' })
      setTimeout(() => setToast(null), 3000)
      return
    }

    setLoading(true)

    try {
      const response = await signupUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role: role
      })

      if (response.data) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
        }
        
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user))
        } else {
          localStorage.setItem('user', JSON.stringify({
            id: response.data.id,
            name: name,
            email: email,
            role: role
          }))
        }

        setToast({ 
          message: 'Account created successfully! Redirecting...', 
          type: 'success' 
        })

        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      }
    } catch (err) {
      console.error('Signup error:', err)
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          err.message || 
                          'Signup failed. Please try again.'
      
      setToast({ message: errorMessage, type: 'error' })
      setTimeout(() => setToast(null), 3000)
    } finally {
      setLoading(false)
    }
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
      {/* Animated Background */}
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

      {/* Particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight, 
            opacity: 0 
          }}
          animate={{ 
            y: [null, -150], 
            opacity: [0, 0.3, 0], 
            x: [null, (Math.random() - 0.5) * 200] 
          }}
          transition={{ 
            duration: 3 + Math.random() * 4, 
            repeat: Infinity, 
            delay: Math.random() * 8 
          }}
          style={{ 
            position: 'absolute', 
            width: '2px', 
            height: '2px', 
            background: 'rgba(255,255,255,0.4)', 
            borderRadius: '50%', 
            pointerEvents: 'none' 
          }}
        />
      ))}

      {/* Signup Card - Compact */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ 
          background: 'rgba(255, 255, 255, 0.98)', 
          backdropFilter: 'blur(20px)', 
          borderRadius: '1.5rem', 
          padding: '1.5rem',
          width: '100%', 
          maxWidth: '420px',
          boxShadow: '0 30px 60px -20px rgba(0, 0, 0, 0.4)',
          zIndex: 10,
          position: 'relative',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        {/* Backend Connection Status */}
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          background: '#10b981',
          color: 'white',
          padding: '0.2rem 0.5rem',
          borderRadius: '0.5rem',
          fontSize: '0.6rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <span>🔌</span> Live
        </div>

        {/* Logo Section - Compact */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <motion.div 
            whileHover={{ rotate: 360, scale: 1.1 }} 
            transition={{ duration: 0.5 }} 
            style={{ 
              width: '50px', 
              height: '50px', 
              background: 'linear-gradient(135deg, #667eea, #764ba2)', 
              borderRadius: '1rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 0.5rem', 
              boxShadow: '0 15px 30px -10px rgba(102, 126, 234, 0.4)', 
              cursor: 'pointer' 
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>✨</span>
          </motion.div>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)', 
            WebkitBackgroundClip: 'text', 
            backgroundClip: 'text', 
            color: 'transparent',
            marginBottom: '0.25rem'
          }}>
            Create Account
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.7rem' }}>
            Join TaskFlow and boost your productivity
          </p>
        </div>

        {/* Toast Message */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ 
                background: toast.type === 'success' ? '#d1fae5' : '#fee2e2', 
                color: toast.type === 'success' ? '#065f46' : '#dc2626', 
                padding: '0.5rem', 
                borderRadius: '0.5rem', 
                marginBottom: '0.75rem', 
                textAlign: 'center',
                fontSize: '0.75rem'
              }}
            >
              {toast.type === 'success' ? '✓' : '⚠️'} {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form - Compact */}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              color: isFocused.name ? '#667eea' : '#64748b' 
            }}>
              👤 Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setIsFocused({ ...isFocused, name: true })}
              onBlur={() => setIsFocused({ ...isFocused, name: false })}
              placeholder="Enter your full name"
              style={{ 
                width: '100%', 
                padding: '0.6rem 0.75rem', 
                marginTop: '0.3rem', 
                border: `2px solid ${isFocused.name ? '#667eea' : '#e2e8f0'}`, 
                borderRadius: '0.5rem', 
                fontSize: '0.8rem', 
                outline: 'none', 
                background: '#f8fafc', 
                boxSizing: 'border-box' 
              }}
              required
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              color: isFocused.email ? '#667eea' : '#64748b' 
            }}>
              📧 Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused({ ...isFocused, email: true })}
              onBlur={() => setIsFocused({ ...isFocused, email: false })}
              placeholder="you@example.com"
              style={{ 
                width: '100%', 
                padding: '0.6rem 0.75rem', 
                marginTop: '0.3rem', 
                border: `2px solid ${isFocused.email ? '#667eea' : '#e2e8f0'}`, 
                borderRadius: '0.5rem', 
                fontSize: '0.8rem', 
                outline: 'none', 
                background: '#f8fafc', 
                boxSizing: 'border-box' 
              }}
              required
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              color: isFocused.password ? '#667eea' : '#64748b' 
            }}>
              🔒 Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused({ ...isFocused, password: true })}
                onBlur={() => setIsFocused({ ...isFocused, password: false })}
                placeholder="Create a password (min. 6 characters)"
                style={{ 
                  width: '100%', 
                  padding: '0.6rem 2rem 0.6rem 0.75rem', 
                  marginTop: '0.3rem', 
                  border: `2px solid ${isFocused.password ? '#667eea' : '#e2e8f0'}`, 
                  borderRadius: '0.5rem', 
                  fontSize: '0.8rem', 
                  outline: 'none', 
                  background: '#f8fafc', 
                  boxSizing: 'border-box' 
                }}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ 
                  position: 'absolute', 
                  right: '0.5rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {password && (
              <div style={{ marginTop: '0.3rem' }}>
                <div style={{ height: '3px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: passwordStrength.width }} 
                    style={{ 
                      height: '100%', 
                      background: passwordStrength.color
                    }} 
                  />
                </div>
                <p style={{ fontSize: '0.6rem', color: passwordStrength.color, marginTop: '0.2rem' }}>
                  Strength: {passwordStrength.text}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              color: isFocused.confirmPassword ? '#667eea' : '#64748b' 
            }}>
              🔐 Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setIsFocused({ ...isFocused, confirmPassword: true })}
                onBlur={() => setIsFocused({ ...isFocused, confirmPassword: false })}
                placeholder="Confirm your password"
                style={{ 
                  width: '100%', 
                  padding: '0.6rem 2rem 0.6rem 0.75rem', 
                  marginTop: '0.3rem', 
                  border: `2px solid ${isFocused.confirmPassword ? '#667eea' : '#e2e8f0'}`, 
                  borderRadius: '0.5rem', 
                  fontSize: '0.8rem', 
                  outline: 'none', 
                  background: '#f8fafc', 
                  boxSizing: 'border-box' 
                }}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                style={{ 
                  position: 'absolute', 
                  right: '0.5rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p style={{ fontSize: '0.6rem', color: '#ef4444', marginTop: '0.2rem' }}>
                ⚠️ Passwords do not match
              </p>
            )}
            {confirmPassword && password === confirmPassword && password && (
              <p style={{ fontSize: '0.6rem', color: '#10b981', marginTop: '0.2rem' }}>
                ✓ Passwords match
              </p>
            )}
          </div>

          {/* Role Selection - Compact */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>
              👑 Select Role
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.3rem' }}>
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={() => setRole('MEMBER')} 
                style={{ 
                  flex: 1, 
                  padding: '0.5rem', 
                  textAlign: 'center', 
                  border: `2px solid ${role === 'MEMBER' ? '#667eea' : '#e2e8f0'}`, 
                  borderRadius: '0.5rem', 
                  cursor: 'pointer', 
                  background: role === 'MEMBER' ? '#e0e7ff' : 'white', 
                  transition: 'all 0.2s' 
                }}
              >
                <span style={{ fontSize: '1rem' }}>👤</span>
                <div style={{ fontSize: '0.7rem', fontWeight: '500' }}>Member</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={() => setRole('ADMIN')} 
                style={{ 
                  flex: 1, 
                  padding: '0.5rem', 
                  textAlign: 'center', 
                  border: `2px solid ${role === 'ADMIN' ? '#667eea' : '#e2e8f0'}`, 
                  borderRadius: '0.5rem', 
                  cursor: 'pointer', 
                  background: role === 'ADMIN' ? '#e0e7ff' : 'white', 
                  transition: 'all 0.2s' 
                }}
              >
                <span style={{ fontSize: '1rem' }}>👑</span>
                <div style={{ fontSize: '0.7rem', fontWeight: '500' }}>Admin</div>
              </motion.div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            style={{ 
              width: '100%', 
              padding: '0.6rem', 
              background: 'linear-gradient(135deg, #667eea, #764ba2)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.5rem', 
              fontSize: '0.85rem', 
              fontWeight: 'bold', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              opacity: loading ? 0.7 : 1, 
              marginTop: '0.5rem' 
            }}
          >
            {loading ? '⏳ Creating Account...' : 'Create Account →'}
          </motion.button>
        </form>

        {/* Login Link */}
        <div style={{ textAlign: 'center', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '0.7rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>
              Login →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default SignupPage