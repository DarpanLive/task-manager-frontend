import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import API from "../api/api";
import * as userAPI from "../api/users";
import * as taskAPI from "../api/task";

const UsersPage = () => {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'MEMBER'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const currentUser = await userAPI.getCurrentUser()
      setUser(currentUser.data)

      const usersRes = await userAPI.getAllUsers()
      setUsers(usersRes.data)

      const tasksRes = await taskAPI.getTasks()
      setTasks(tasksRes.data.content || [])

      const projectRes = await API.get("/projects/get-all")
      setProjects(projectRes.data)
    } catch (err) {
      console.error(err)
      setToast({ message: "Failed to load data", type: "error" })
      setTimeout(() => setToast(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  // ================= UPDATE USER =================
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingUser) {
        await userAPI.updateUser(editingUser.id, formData)
        setToast({ message: "User updated successfully", type: "success" })
      }
      setShowModal(false)
      setEditingUser(null)
      setFormData({ name: '', email: '', role: 'MEMBER' })
      await loadData()
      setTimeout(() => setToast(null), 3000)
    } catch (err) {
      setToast({ message: "Error updating user", type: "error" })
      setTimeout(() => setToast(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  // ================= DELETE USER =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return
    try {
      await userAPI.deleteUser(id)
      setToast({ message: "User deleted successfully", type: "success" })
      loadData()
      setTimeout(() => setToast(null), 3000)
    } catch {
      setToast({ message: "Delete failed", type: "error" })
      setTimeout(() => setToast(null), 3000)
    }
  }

  // ================= EDIT =================
  const handleEdit = (u) => {
    setEditingUser(u)
    setFormData({
      name: u.name,
      email: u.email,
      role: u.role
    })
    setShowModal(true)
  }

  // ================= STATS =================
  const getUserStats = (userId) => {
    const userTasks = tasks.filter(t => t.assignedTo?.id === userId)
    return {
      total: userTasks.length,
      completed: userTasks.filter(t => t.status === "DONE").length,
      pending: userTasks.filter(t => t.status === "TODO").length,
      progress: userTasks.filter(t => t.status === "IN_PROGRESS").length
    }
  }

  const isAdmin = user?.role === 'ADMIN'
  const currentUserId = user?.id

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: '2rem' }}>⏳</motion.div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚫</div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem', color: '#1f2937' }}>Access Denied</h1>
          <p style={{ color: '#6b7280' }}>Admin access required</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      {/* Animated Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{ y: [null, -100], opacity: [0, 0.3, 0], x: [null, (Math.random() - 0.5) * 200] }}
            transition={{ duration: 4 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 10 }}
            style={{ position: 'absolute', width: '3px', height: '3px', background: 'rgba(79, 70, 229, 0.3)', borderRadius: '50%' }}
          />
        ))}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            style={{
              position: 'fixed',
              top: '1rem',
              right: '1rem',
              padding: '0.75rem 1.5rem',
              background: toast.type === 'success' ? '#10b981' : '#ef4444',
              color: 'white',
              borderRadius: '0.5rem',
              zIndex: 2000,
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {toast.type === 'success' ? '✅' : '❌'} {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)', 
          color: 'white', 
          padding: '2rem 2rem 3rem 2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{ position: 'absolute', top: -50, right: -50, width: '200px', height: '200px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '50%' }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          style={{ position: 'absolute', bottom: -80, left: -80, width: '250px', height: '250px', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '50%' }}
        />

        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>👥</span> TaskFlow - Team Management
              </h1>
              <p style={{ color: '#c7d2fe', fontSize: '0.9rem' }}>
                Manage your team members and their roles
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
                <span>👋 {user.name}</span>
                <span style={{ marginLeft: '0.5rem', background: '#8b5cf6', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem' }}>
                  ADMIN
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 2rem 2rem', marginTop: '-1.5rem', position: 'relative', zIndex: 2 }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>👥 Team Members</h1>
            <p style={{ color: '#666' }}>
              Manage your team members and their roles ({users.length} total)
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && users.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: '2rem' }}>⏳</motion.div>
            <p style={{ color: '#666', marginTop: '1rem' }}>Loading users...</p>
          </div>
        )}

        {/* Stats Summary */}
        {!loading && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem', 
            marginBottom: '2rem' 
          }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              style={{ 
                background: 'white', 
                padding: '1.25rem', 
                borderRadius: '1rem', 
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontSize: '2rem' }}>👥</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4f46e5' }}>{users.length}</div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>Total Members</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              style={{ 
                background: 'white', 
                padding: '1.25rem', 
                borderRadius: '1rem', 
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontSize: '2rem' }}>👑</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>{users.filter(u => u.role === 'ADMIN').length}</div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>Admins</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              style={{ 
                background: 'white', 
                padding: '1.25rem', 
                borderRadius: '1rem', 
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontSize: '2rem' }}>👤</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{users.filter(u => u.role === 'MEMBER').length}</div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>Members</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              style={{ 
                background: 'white', 
                padding: '1.25rem', 
                borderRadius: '1rem', 
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontSize: '2rem' }}>✅</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{tasks.filter(t => t.status === 'DONE').length}</div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>Tasks Completed</div>
            </motion.div>
          </div>
        )}

        {/* Users Grid */}
        {!loading && users.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              textAlign: 'center', 
              padding: '4rem', 
              background: 'white', 
              borderRadius: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '0.5rem' }}>No team members yet.</p>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
            {users.map((member, index) => {
              const stats = getUserStats(member.id)
              const isCurrentUser = currentUserId === member.id
              
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  style={{
                    background: 'white',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: member.role === 'ADMIN' ? '2px solid #8b5cf6' : 'none',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ 
                    padding: '1.5rem',
                    background: member.role === 'ADMIN' ? 'linear-gradient(135deg, #faf5ff, #f3e8ff)' : 'white'
                  }}>
                    {/* User Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        style={{
                          width: '60px',
                          height: '60px',
                          background: `linear-gradient(135deg, ${member.role === 'ADMIN' ? '#8b5cf6' : '#4f46e5'}, ${member.role === 'ADMIN' ? '#c084fc' : '#7c3aed'})`,
                          borderRadius: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.8rem',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </motion.div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{member.name}</h3>
                          {isCurrentUser && (
                            <span style={{
                              padding: '0.2rem 0.5rem',
                              borderRadius: '0.5rem',
                              fontSize: '0.65rem',
                              background: '#4f46e5',
                              color: 'white'
                            }}>
                              You
                            </span>
                          )}
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.7rem',
                            background: member.role === 'ADMIN' ? '#8b5cf6' : '#10b981',
                            color: 'white'
                          }}>
                            {member.role === 'ADMIN' ? '👑 Admin' : '👤 Member'}
                          </span>
                        </div>
                        <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                          📧 {member.email}
                        </p>
                      </div>
                    </div>

                    {/* Task Stats */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                        <span>Task Completion</span>
                        <span style={{ 
                          fontWeight: 'bold', 
                          color: stats.total > 0 && stats.completed / stats.total >= 0.7 ? '#10b981' : stats.total > 0 && stats.completed / stats.total >= 0.4 ? '#f59e0b' : '#ef4444'
                        }}>
                          {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                        </span>
                      </div>
                      <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                          transition={{ duration: 0.5 }}
                          style={{ 
                            height: '100%', 
                            background: stats.total > 0 && stats.completed / stats.total >= 0.7 ? '#10b981' : stats.total > 0 && stats.completed / stats.total >= 0.4 ? '#f59e0b' : '#ef4444', 
                            borderRadius: '3px' 
                          }} 
                        />
                      </div>
                    </div>

                    {/* Task Breakdown */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.7rem', flexWrap: 'wrap' }}>
                      <span>📋 Total: {stats.total}</span>
                      <span>✅ Completed: {stats.completed}</span>
                      <span>🔄 Progress: {stats.progress}</span>
                      <span>⏳ Pending: {stats.pending}</span>
                    </div>

                    {/* Action Buttons */}
                    {!isCurrentUser && (
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleEdit(member)}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: '#4f46e5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          ✏️ Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDelete(member.id)}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          🗑️ Delete
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Edit User Modal - PERFECTLY CENTERED */}
      <AnimatePresence>
        {showModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}
          >
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)'
              }}
            />
            
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                position: 'relative',
                width: '90%',
                maxWidth: '450px',
                maxHeight: '90vh',
                backgroundColor: 'white',
                borderRadius: '1rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Modal Header */}
              <div style={{
                padding: '1.25rem 1.5rem',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white'
              }}>
                <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>✏️</span> Edit User
                </h2>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: '#374151' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter full name"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#4f46e5'
                        e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0'
                        e.target.style.boxShadow = 'none'
                      }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: '#374151' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#4f46e5'
                        e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0'
                        e.target.style.boxShadow = 'none'
                      }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: '#374151' }}>
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="MEMBER">👤 Member</option>
                      <option value="ADMIN">👑 Admin</option>
                    </select>
                  </div>

                  {/* Modal Footer Buttons */}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        opacity: loading ? 0.7 : 1
                      }}
                    >
                      {loading ? 'Saving...' : 'Update User'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowModal(false)}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: '#e2e8f0',
                        color: '#475569',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UsersPage