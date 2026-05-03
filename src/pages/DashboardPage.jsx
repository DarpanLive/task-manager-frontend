import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getDashboard } from "../api/dashboard"
import { useNavigate, useLocation } from 'react-router-dom'

const DashboardPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    fetchDashboard()
  }, [])

  // Refresh dashboard when coming back from other pages
  useEffect(() => {
    // Listen for when the component comes into focus
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDashboard()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Refresh when route changes (if coming back from tasks/projects)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Also refresh when location changes (navigation from other pages)
  useEffect(() => {
    fetchDashboard()
  }, [location.key])

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const res = await getDashboard()
      console.log('Dashboard data refreshed:', res.data)
      setDashboardData(res.data)
    } catch (err) {
      console.error("Dashboard error", err)
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { text: 'Good Morning', emoji: '🌅' }
    if (hour < 18) return { text: 'Good Afternoon', emoji: '☀️' }
    return { text: 'Good Evening', emoji: '🌙' }
  }

  const getProgressColor = (rate) => {
    if (rate >= 75) return '#10b981'
    if (rate >= 50) return '#f59e0b'
    if (rate >= 25) return '#f97316'
    return '#ef4444'
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'TODO': return { icon: '📝', color: '#8b5cf6', bg: '#f3e8ff' }
      case 'IN_PROGRESS': return { icon: '🔄', color: '#f59e0b', bg: '#fef3c7' }
      case 'DONE': return { icon: '✅', color: '#10b981', bg: '#d1fae5' }
      default: return { icon: '📋', color: '#6b7280', bg: '#f3f4f6' }
    }
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'HIGH': return { bg: '#fee2e2', color: '#dc2626', label: '🔴 High' }
      case 'MEDIUM': return { bg: '#fef3c7', color: '#d97706', label: '🟡 Medium' }
      case 'LOW': return { bg: '#d1fae5', color: '#059669', label: '🟢 Low' }
      default: return { bg: '#f3f4f6', color: '#6b7280', label: '⚪ Unknown' }
    }
  }

  const greeting = getGreeting()
  const completionRate = dashboardData?.totalTasks > 0 
    ? Math.round((dashboardData.completed / dashboardData.totalTasks) * 100) 
    : 0

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0f172a'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ fontSize: '3rem' }}
        >
          ⏳
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      {/* Refresh Button - Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={fetchDashboard}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}
      >
        🔄
      </motion.button>

      {/* Animated Background Elements */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{ 
              y: [null, -100],
              opacity: [0, 0.5, 0],
              x: [null, (Math.random() - 0.5) * 200]
            }}
            transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 10 }}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: 'rgba(79, 70, 229, 0.3)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)', 
          color: 'white', 
          padding: '2rem 2rem 4rem 2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative Shapes */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: '200px',
            height: '200px',
            background: 'rgba(139, 92, 246, 0.2)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: '250px',
            height: '250px',
            background: 'rgba(59, 130, 246, 0.15)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />

        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                <span>{greeting.emoji}</span> {greeting.text}, {user?.name || 'User'}!
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                style={{ color: '#c7d2fe', fontSize: '1rem' }}
              >
                {user?.role === 'ADMIN' 
                  ? "Here's your team's performance overview and key metrics." 
                  : "Track your personal productivity and task progress."}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              style={{ display: 'flex', gap: '0.5rem' }}
            >
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                backdropFilter: 'blur(10px)'
              }}>
                <span style={{ fontSize: '0.875rem' }}>📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 2rem 2rem', marginTop: '-2rem', position: 'relative', zIndex: 2 }}>
        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          {[
            { 
              title: 'Total Tasks', 
              value: dashboardData?.totalTasks || 0, 
              icon: '📋', 
              color: '#4f46e5', 
              gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              delay: 0.1 
            },
            { 
              title: 'Completed', 
              value: dashboardData?.completed || 0, 
              icon: '✅', 
              color: '#10b981', 
              gradient: 'linear-gradient(135deg, #10b981, #34d399)',
              delay: 0.2 
            },
            { 
              title: 'Pending', 
              value: dashboardData?.pending || 0, 
              icon: '⏳', 
              color: '#f59e0b', 
              gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              delay: 0.3 
            },
            { 
              title: 'Overdue', 
              value: dashboardData?.overdue || 0, 
              icon: '⚠️', 
              color: '#ef4444', 
              gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
              delay: 0.4 
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay }}
              whileHover={{ y: -8, scale: 1.02 }}
              style={{
                background: 'white',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)',
                cursor: 'pointer'
              }}
              onClick={() => stat.title === 'Overdue' && navigate('/tasks')}
            >
              <div style={{ padding: '1.5rem', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  fontSize: '2rem',
                  opacity: 0.1
                }}>
                  {stat.icon}
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: stat.color, marginBottom: '0.25rem' }}>
                  {stat.value}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500' }}>
                  {stat.title}
                </div>
              </div>
              <div style={{ height: '4px', background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)` }} />
            </motion.div>
          ))}
        </div>

        {/* Progress & Distribution Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Overall Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            style={{ background: 'white', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>📊 Overall Progress</h3>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: `conic-gradient(${getProgressColor(completionRate)} ${completionRate * 3.6}deg, #e2e8f0 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: getProgressColor(completionRate)
                }}>
                  {completionRate}%
                </div>
              </motion.div>
            </div>
            <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden', marginBottom: '1rem' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ height: '100%', background: getProgressColor(completionRate), borderRadius: '6px' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#64748b' }}>
              <span>✅ Completed: {dashboardData?.completed || 0}</span>
              <span>📋 Total: {dashboardData?.totalTasks || 0}</span>
            </div>
          </motion.div>

          {/* Status Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            style={{ background: 'white', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.5rem' }}>🎯 Task Status Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {dashboardData?.statusBreakdown && Object.entries(dashboardData.statusBreakdown).map(([status, count]) => {
                const statusInfo = getStatusIcon(status)
                const percentage = dashboardData?.totalTasks > 0 ? (count / dashboardData.totalTasks) * 100 : 0
                return (
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{statusInfo.icon}</span> {status.replace('_', ' ')}
                      </span>
                      <span style={{ fontWeight: 'bold', color: statusInfo.color }}>{count}</span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8 }}
                        style={{ height: '100%', background: statusInfo.color, borderRadius: '4px' }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Overdue Tasks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{ background: 'white', borderRadius: '1.5rem', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚠️</span> Overdue Tasks
              {dashboardData?.overdue > 0 && (
                <span style={{
                  background: '#ef4444',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem'
                }}>
                  {dashboardData.overdue} tasks
                </span>
              )}
            </h3>
            {dashboardData?.overdue > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/tasks')}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                View All Tasks →
              </motion.button>
            )}
          </div>
          
          {dashboardData?.overdueTasks?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '3rem',
                background: '#f0fdf4',
                borderRadius: '1rem',
                border: '1px solid #bbf7d0'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
              <p style={{ color: '#166534', fontWeight: '500' }}>Great job! No overdue tasks!</p>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>You're on track with all your tasks.</p>
            </motion.div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {dashboardData?.overdueTasks?.map((task, index) => {
                const priorityInfo = getPriorityColor(task.priority)
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                    onClick={() => navigate('/tasks')}
                    style={{
                      padding: '1.25rem',
                      background: '#fef2f2',
                      borderRadius: '1rem',
                      border: '1px solid #fecaca',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: '600', color: '#dc2626', marginBottom: '0.25rem' }}>{task.title}</h4>
                        <p style={{ fontSize: '0.875rem', color: '#475569' }}>{task.description?.substring(0, 100)}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                          background: priorityInfo.bg,
                          color: priorityInfo.color
                        }}>
                          {priorityInfo.label}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>📁</span> {task.projectName || 'Unknown Project'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#dc2626' }}>
                        <span>⚠️</span> Overdue
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>👤</span> {task.assignedTo?.name || 'Unassigned'}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Quick Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={{
            background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
            borderRadius: '1.5rem',
            padding: '1.5rem',
            color: 'white'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            <div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: '2rem' }}
              >
                🎯
              </motion.div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
                {dashboardData?.completed || 0} / {dashboardData?.totalTasks || 0} Tasks Completed
              </div>
            </div>
            <div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                style={{ fontSize: '2rem' }}
              >
                ⚡
              </motion.div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
                Completion Rate: {completionRate}%
              </div>
            </div>
            <div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                style={{ fontSize: '2rem' }}
              >
                {dashboardData?.overdue === 0 ? '🌟' : '⚠️'}
              </motion.div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
                {dashboardData?.overdue === 0 ? 'All tasks on track!' : `${dashboardData?.overdue} overdue tasks need attention`}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Motivation Quote */}
        {completionRate >= 80 && dashboardData?.overdue === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
              borderRadius: '1rem',
              textAlign: 'center'
            }}
          >
            <p style={{ color: '#065f46', fontWeight: '500' }}>
              🌟 Outstanding performance! You're crushing your goals! Keep up the great work! 🚀
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage