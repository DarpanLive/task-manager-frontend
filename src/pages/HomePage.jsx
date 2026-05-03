import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [counters, setCounters] = useState({ users: 0, projects: 0, tasks: 0, teams: 0 })

  useEffect(() => {
    setIsVisible(true)
    
    // Animate counters
    const animateCounter = (key, target) => {
      let start = 0
      const duration = 2000
      const increment = target / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          setCounters(prev => ({ ...prev, [key]: target }))
          clearInterval(timer)
        } else {
          setCounters(prev => ({ ...prev, [key]: Math.floor(start) }))
        }
      }, 16)
      return () => clearInterval(timer)
    }
    
    animateCounter('users', 15234)
    animateCounter('projects', 892)
    animateCounter('tasks', 45678)
    animateCounter('teams', 1234)
  }, [])

  const floatingShapes = [
    { id: 1, x: '10%', y: '20%', size: 180, delay: 0, duration: 20 },
    { id: 2, x: '85%', y: '15%', size: 120, delay: 2, duration: 25 },
    { id: 3, x: '15%', y: '70%', size: 250, delay: 4, duration: 18 },
    { id: 4, x: '75%', y: '65%', size: 140, delay: 6, duration: 22 },
    { id: 5, x: '50%', y: '85%', size: 100, delay: 8, duration: 30 },
    { id: 6, x: '90%', y: '45%', size: 110, delay: 10, duration: 28 },
    { id: 7, x: '5%', y: '45%', size: 130, delay: 12, duration: 24 },
    { id: 8, x: '45%', y: '10%', size: 70, delay: 14, duration: 35 },
    { id: 9, x: '95%', y: '80%', size: 90, delay: 16, duration: 26 },
  ]

  const features = [
    { icon: '🔐', title: 'Secure Authentication', desc: 'JWT based login & signup system with role-based access control', color: '#a78bfa' },
    { icon: '📊', title: 'Smart Dashboard', desc: 'Real-time analytics, task tracking, and progress monitoring', color: '#60a5fa' },
    { icon: '👥', title: 'Team Management', desc: 'Create projects, assign tasks, and manage team members', color: '#34d399' },
    { icon: '✅', title: 'Task Tracking', desc: 'Easy task creation, status updates, and priority management', color: '#fbbf24' },
    { icon: '📱', title: 'Responsive Design', desc: 'Works seamlessly on desktop, tablet, and mobile devices', color: '#f472b6' },
    { icon: '🎨', title: 'Modern UI/UX', desc: 'Beautiful interface with smooth animations and dark mode', color: '#c084fc' },
    { icon: '⚡', title: 'Real-time Updates', desc: 'Live task updates and instant notifications', color: '#fb923c' },
    { icon: '📈', title: 'Advanced Analytics', desc: 'Detailed reports and performance metrics', color: '#2dd4bf' },
  ]

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Product Manager', text: 'TaskFlow has transformed how our team works. The intuitive interface and powerful features make project management a breeze!', rating: 5, avatar: 'SJ' },
    { name: 'Michael Chen', role: 'Tech Lead', text: 'Best task management tool I\'ve used. The role-based access and real-time updates are game changers for our workflow.', rating: 5, avatar: 'MC' },
    { name: 'Emily Rodriguez', role: 'Startup Founder', text: 'Incredible tool for startups! We managed to increase our productivity by 200% using TaskFlow.', rating: 5, avatar: 'ER' },
    { name: 'David Kim', role: 'Project Manager', text: 'TaskFlow helped us deliver projects 40% faster. The analytics dashboard is incredibly insightful!', rating: 5, avatar: 'DK' },
  ]

  const stats = [
    { icon: '👥', value: counters.users.toLocaleString(), label: 'Active Users', suffix: '+' },
    { icon: '📁', value: counters.projects.toLocaleString(), label: 'Projects Created', suffix: '+' },
    { icon: '✅', value: counters.tasks.toLocaleString(), label: 'Tasks Completed', suffix: '+' },
    { icon: '🏢', value: counters.teams.toLocaleString(), label: 'Happy Teams', suffix: '+' },
  ]

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a3e 50%, #24243e 100%)', 
      overflowX: 'hidden', 
      position: 'relative' 
    }}>
      {/* Animated Background Shapes */}
      {floatingShapes.map((shape) => (
        <motion.div
          key={shape.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.1, 0.25, 0.1],
            scale: [1, 1.3, 1],
            x: [0, 40, -40, 0],
            y: [0, -40, 40, 0]
          }}
          transition={{ duration: shape.duration, delay: shape.delay, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            position: 'absolute',
            left: shape.x,
            top: shape.y,
            width: shape.size,
            height: shape.size,
            background: `radial-gradient(circle, rgba(167, 139, 250, 0.15), rgba(236, 72, 153, 0.05))`,
            borderRadius: '50%',
            filter: 'blur(70px)',
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* Animated Grid Lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(rgba(167, 139, 250, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(167, 139, 250, 0.03) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        pointerEvents: 'none'
      }} />

      {/* Enhanced Particles */}
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: 0 }}
          animate={{ 
            y: [null, -150],
            opacity: [0, 0.4, 0],
            x: [null, (Math.random() - 0.5) * 250]
          }}
          transition={{ 
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: 'linear'
          }}
          style={{ 
            position: 'absolute', 
            width: Math.random() * 3 + 1 + 'px', 
            height: Math.random() * 3 + 1 + 'px', 
            background: `rgba(167, 139, 250, ${0.2 + Math.random() * 0.5})`, 
            borderRadius: '50%', 
            pointerEvents: 'none',
            boxShadow: '0 0 10px rgba(167, 139, 250, 0.5)'
          }}
        />
      ))}

      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'rgba(15, 12, 41, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(167, 139, 250, 0.2)',
          zIndex: 1000,
          padding: '1rem 2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <motion.div whileHover={{ scale: 1.05 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 10px rgba(167, 139, 250, 0.5))' }}>✅</span>
            <motion.h1 
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ 
                fontSize: '1.8rem', 
                fontWeight: 'bold', 
                background: 'linear-gradient(135deg, #a78bfa, #ec4899, #f43f5e)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              TaskFlow
            </motion.h1>
          </motion.div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login">
              <motion.button 
                whileHover={{ scale: 1.05, borderColor: '#c084fc' }} 
                whileTap={{ scale: 0.95 }} 
                style={{ 
                  padding: '0.5rem 1.5rem', 
                  background: 'transparent', 
                  border: '2px solid #a78bfa', 
                  color: '#a78bfa', 
                  borderRadius: '0.75rem', 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s'
                }}
              >
                Login
              </motion.button>
            </Link>
            <Link to="/signup">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(167, 139, 250, 0.6)' }} 
                whileTap={{ scale: 0.95 }} 
                style={{ 
                  padding: '0.5rem 1.5rem', 
                  background: 'linear-gradient(135deg, #a78bfa, #ec4899)', 
                  border: 'none', 
                  color: 'white', 
                  borderRadius: '0.75rem', 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem 4rem', position: 'relative' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
            <motion.div 
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }} 
              transition={{ delay: 1, duration: 2, repeat: Infinity, repeatDelay: 3 }} 
              style={{ 
                display: 'inline-block', 
                padding: '0.6rem 1.2rem', 
                background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(236, 72, 153, 0.2))', 
                borderRadius: '2rem', 
                marginBottom: '2rem',
                border: '1px solid rgba(167, 139, 250, 0.3)'
              }}
            >
              <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>✨ Welcome to the Future of Team Management</span>
            </motion.div>
            
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ delay: 0.3, type: 'spring', stiffness: 100 }} 
              style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: '1.2' }}
            >
              <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899, #f43f5e)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Streamline Your</span><br />
              <span style={{ color: 'white' }}>Team's Workflow</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.5 }} 
              style={{ fontSize: '1.2rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.6' }}
            >
              The all-in-one platform for project management, task tracking, and team collaboration. 
              Get more done with TaskFlow.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.7 }} 
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link to="/signup">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(167, 139, 250, 0.7)' }} 
                  whileTap={{ scale: 0.95 }} 
                  style={{ 
                    padding: '1rem 2rem', 
                    background: 'linear-gradient(135deg, #a78bfa, #ec4899)', 
                    border: 'none', 
                    color: 'white', 
                    borderRadius: '1rem', 
                    cursor: 'pointer', 
                    fontWeight: 'bold', 
                    fontSize: '1.1rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  Start Free Trial
                </motion.button>
              </Link>
              <motion.button 
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.15)' }} 
                whileTap={{ scale: 0.95 }} 
                style={{ 
                  padding: '1rem 2rem', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  border: '1px solid rgba(167, 139, 250, 0.5)', 
                  color: '#a78bfa', 
                  borderRadius: '1rem', 
                  cursor: 'pointer', 
                  fontWeight: 'bold', 
                  fontSize: '1.1rem' 
                }}
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Features
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            cursor: 'pointer'
          }}
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div style={{ width: '30px', height: '50px', border: '2px solid rgba(167, 139, 250, 0.5)', borderRadius: '20px', position: 'relative' }}>
            <motion.div
              animate={{ y: [5, 25, 5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: '6px', height: '10px', background: '#a78bfa', borderRadius: '3px', position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '8px' }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={{ padding: '4rem 2rem', background: 'rgba(0,0,0,0.2)' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.05 }}
              style={{ 
                padding: '1.5rem', 
                background: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: '1rem', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#a78bfa' }}
              >
                {stat.value}{stat.suffix}
              </motion.div>
              <div style={{ color: '#cbd5e1', marginTop: '0.5rem', fontSize: '0.9rem' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={{ padding: '4rem 2rem' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: 'spring' }}
              style={{ display: 'inline-block', padding: '0.25rem 1rem', background: 'rgba(167, 139, 250, 0.2)', borderRadius: '2rem', marginBottom: '1rem' }}
            >
              <span style={{ color: '#a78bfa', fontSize: '0.9rem' }}>Why Choose Us</span>
            </motion.div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white' }}>
              Powerful Features for <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Modern Teams</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Everything you need to manage your projects efficiently</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, background: 'rgba(255, 255, 255, 0.08)' }}
                style={{ 
                  padding: '2rem', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  borderRadius: '1rem', 
                  border: '1px solid rgba(255, 255, 255, 0.08)', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.2 }} 
                  transition={{ duration: 0.5 }} 
                  style={{ 
                    fontSize: '3rem', 
                    marginBottom: '1rem',
                    display: 'inline-block'
                  }}
                >
                  {feature.icon}
                </motion.div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'white' }}>{feature.title}</h3>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>{feature.desc}</p>
                <motion.div
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    fontSize: '0.8rem',
                    color: feature.color,
                    opacity: 0.5
                  }}
                >
                  →
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      {/* <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={{ padding: '4rem 2rem', background: 'rgba(0,0,0,0.2)' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: 'spring' }}
              style={{ display: 'inline-block', padding: '0.25rem 1rem', background: 'rgba(167, 139, 250, 0.2)', borderRadius: '2rem', marginBottom: '1rem' }}
            >
              <span style={{ color: '#a78bfa', fontSize: '0.9rem' }}>Testimonials</span>
            </motion.div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white' }}>
              What Our <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Customers Say</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Trusted by teams worldwide</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                style={{ 
                  padding: '2rem', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  borderRadius: '1rem', 
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    background: 'linear-gradient(135deg, #a78bfa, #ec4899)', 
                    borderRadius: '1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: 'white'
                  }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 'bold', color: 'white' }}>{testimonial.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#a78bfa' }}>{testimonial.role}</p>
                  </div>
                </div>
                <div style={{ color: '#fbbf24', marginBottom: '1rem' }}>
                  {'⭐'.repeat(testimonial.rating)}
                </div>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontStyle: 'italic' }}>"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section> */}

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        viewport={{ once: true }} 
        style={{ 
          padding: '3rem 2rem', 
          borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
          textAlign: 'center',
          marginTop: '2rem'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <Link to="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#a78bfa'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>About</Link>
            <Link to="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#a78bfa'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Features</Link>
            <Link to="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#a78bfa'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Pricing</Link>
            <Link to="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#a78bfa'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Contact</Link>
            <Link to="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#a78bfa'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Privacy Policy</Link>
          </div>
          <p style={{ color: '#64748b' }}>
            ©️ 2025 TaskFlow. All rights reserved. Made with ❤️ for better teamwork.
          </p>
        </div>
      </motion.footer>
    </div>
  )
}

export default HomePage