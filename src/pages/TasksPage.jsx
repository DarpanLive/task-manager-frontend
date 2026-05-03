import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import API from "../api/api"
import * as taskAPI from "../api/task"

const TasksPage = () => {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [members, setMembers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [filterProject, setFilterProject] = useState('ALL')
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  })
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    deadline: '',
    projectId: '',
    assignedToId: ''
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      await loadTasks()
      
      try {
        const projectsResponse = await API.get("/projects/get-all")
        setProjects(projectsResponse.data)
      } catch (error) {
        console.log('Projects endpoint error')
      }
      
      try {
        const membersResponse = await API.get("/users/get-all")
        setMembers(membersResponse.data)
      } catch (error) {
        console.log('Members endpoint error')
      }
    } catch (error) {
      console.error('Error loading data:', error)
      setToast({ message: 'Failed to load data from server', type: 'error' })
      setTimeout(() => setToast(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const loadTasks = async () => {
    try {
      const response = await taskAPI.getTasks(
        filterStatus || null,
        filterPriority || null,
        user?.role !== 'ADMIN' ? user?.id : null,
        { page: pagination.page, size: pagination.size }
      )
      
      if (response.data.content) {
        setTasks(response.data.content)
        setPagination({
          page: response.data.pageable?.pageNumber || 0,
          size: response.data.pageable?.pageSize || 10,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0
        })
      } else {
        setTasks(response.data)
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
      throw error
    }
  }

  const handleViewTaskDetails = async (taskId) => {
    setLoading(true)
    try {
      const response = await taskAPI.getTaskById(taskId)
      setSelectedTask(response.data)
      setShowDetailsModal(true)
    } catch (error) {
      console.error('Error fetching task details:', error)
      setToast({ message: 'Failed to load task details', type: 'error' })
      setTimeout(() => setToast(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.projectId || !formData.assignedToId) {
      setToast({ message: 'Title, Project, and Assigned To are required', type: 'error' })
      setTimeout(() => setToast(null), 3000)
      return
    }

    setLoading(true)
    try {
      const taskData = {
        title: formData.title,
        description: formData.description || '',
        status: formData.status,
        priority: formData.priority,
        deadline: formData.deadline || null,
        projectId: parseInt(formData.projectId),
        assignedToId: parseInt(formData.assignedToId)
      }
      
      if (editingTask) {
        await taskAPI.updateTask(editingTask.id, taskData)
        setToast({ message: 'Task updated successfully!', type: 'success' })
      } else {
        await taskAPI.createTask(taskData)
        setToast({ message: `Task "${formData.title}" created successfully!`, type: 'success' })
      }
      
      await loadTasks()
      setTimeout(() => setToast(null), 3000)
      setShowModal(false)
      resetForm()
    } catch (error) {
      console.error('Error saving task:', error)
      const errorMessage = error.response?.data?.message || 'Error saving task'
      setToast({ message: errorMessage, type: 'error' })
      setTimeout(() => setToast(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEditingTask(null)
    setFormData({
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      deadline: '',
      projectId: '',
      assignedToId: ''
    })
  }

  const handleEdit = async (task) => {
    setLoading(true)
    try {
      const response = await taskAPI.getTaskById(task.id)
      const freshTask = response.data
      
      setEditingTask(freshTask)
      setFormData({
        title: freshTask.title,
        description: freshTask.description || '',
        status: freshTask.status,
        priority: freshTask.priority,
        deadline: freshTask.deadline || '',
        projectId: freshTask.projectId?.toString() || '',
        assignedToId: freshTask.assignedTo?.id?.toString() || ''
      })
      setShowModal(true)
    } catch (error) {
      console.error('Error fetching task for edit:', error)
      setToast({ message: 'Error loading task for edit', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    
    setLoading(true)
    try {
      await taskAPI.deleteTask(id)
      setToast({ message: 'Task deleted successfully!', type: 'success' })
      await loadTasks()
      setTimeout(() => setToast(null), 3000)
    } catch (error) {
      console.error('Error deleting task:', error)
      setToast({ message: 'Error deleting task', type: 'error' })
      setTimeout(() => setToast(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    setLoading(true)
    try {
      await taskAPI.updateTaskStatus(taskId, { status: newStatus })
      setToast({ message: `Task status updated`, type: 'success' })
      await loadTasks()
      setTimeout(() => setToast(null), 2000)
    } catch (error) {
      console.error('Error updating task status:', error)
      setToast({ message: 'Error updating task status', type: 'error' })
      setTimeout(() => setToast(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadTasks()
    }
  }, [filterStatus, filterPriority, pagination.page, user])

  const getFilteredTasks = () => {
    let filtered = tasks
    if (filterProject !== 'ALL') {
      filtered = filtered.filter(t => t.projectId?.toString() === filterProject)
    }
    return filtered
  }

  const filteredTasks = getFilteredTasks()
  const isAdmin = user?.role === 'ADMIN'

  const getStatusStyle = (status) => {
    switch(status) {
      case 'DONE': 
        return { background: '#d1fae5', color: '#065f46', icon: '✅', label: 'Completed' }
      case 'IN_PROGRESS': 
        return { background: '#fef3c7', color: '#92400e', icon: '🔄', label: 'In Progress' }
      case 'TODO': 
        return { background: '#e2e8f0', color: '#475569', icon: '⏳', label: 'To Do' }
      default: 
        return { background: '#e2e8f0', color: '#475569', icon: '⏳', label: 'To Do' }
    }
  }

  const getPriorityStyle = (priority) => {
    switch(priority) {
      case 'HIGH': 
        return { borderColor: '#ef4444', bg: '#fee2e2', label: '🔴 High', color: '#dc2626' }
      case 'MEDIUM': 
        return { borderColor: '#f59e0b', bg: '#fef3c7', label: '🟡 Medium', color: '#d97706' }
      case 'LOW': 
        return { borderColor: '#10b981', bg: '#d1fae5', label: '🟢 Low', color: '#059669' }
      default: 
        return { borderColor: '#10b981', bg: '#d1fae5', label: '🟢 Low', color: '#059669' }
    }
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Please log in to view tasks</h2>
        </div>
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
                <span>✅</span> Task Management
              </h1>
              <p style={{ color: '#c7d2fe', fontSize: '0.9rem' }}>
                {isAdmin ? 'Create, assign, and track tasks for your team' : 'Manage and update your assigned tasks'}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
                <span>👋 {user.name}</span>
                <span style={{ marginLeft: '0.5rem', background: user.role === 'ADMIN' ? '#8b5cf6' : '#10b981', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem' }}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 2rem 2rem', marginTop: '-1.5rem', position: 'relative', zIndex: 2 }}>
        {/* Create Task Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { resetForm(); setShowModal(true) }}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white',
                border: 'none',
                borderRadius: '1rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>➕</span> Create New Task
            </motion.button>
          )}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '2rem', 
            flexWrap: 'wrap',
            background: 'white',
            padding: '1rem',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPagination({ ...pagination, page: 0 }) }}
            style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', background: 'white', cursor: 'pointer' }}
          >
            <option value="">All Status</option>
            <option value="TODO">⏳ To Do</option>
            <option value="IN_PROGRESS">🔄 In Progress</option>
            <option value="DONE">✅ Completed</option>
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => { setFilterPriority(e.target.value); setPagination({ ...pagination, page: 0 }) }}
            style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', background: 'white', cursor: 'pointer' }}
          >
            <option value="">All Priorities</option>
            <option value="LOW">🟢 Low</option>
            <option value="MEDIUM">🟡 Medium</option>
            <option value="HIGH">🔴 High</option>
          </select>
          
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', background: 'white', cursor: 'pointer' }}
          >
            <option value="ALL">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </motion.div>

        {/* Tasks List */}
        {loading && tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: '2rem' }}>⏳</motion.div>
            <p style={{ color: '#666', marginTop: '1rem' }}>Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '1rem' }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>
              {isAdmin ? 'No tasks found. Create your first task!' : 'No tasks assigned to you yet.'}
            </p>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AnimatePresence>
              {filteredTasks.map((task, index) => {
                const project = projects.find(p => p.id === task.projectId)
                const priorityStyle = getPriorityStyle(task.priority)
                const statusStyle = getStatusStyle(task.status)
                const isOverdue = task.overdue
                
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01, x: 5 }}
                    onClick={() => handleViewTaskDetails(task.id)}
                    style={{
                      background: 'white',
                      borderRadius: '1rem',
                      borderLeft: `5px solid ${priorityStyle.borderColor}`,
                      overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>{task.title}</h3>
                            {isOverdue && task.status !== 'DONE' && (
                              <span style={{ background: '#fee2e2', color: '#dc2626', padding: '0.2rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: '500' }}>
                                ⚠️ Overdue
                              </span>
                            )}
                          </div>
                          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                            {task.description?.substring(0, 120) || 'No description'}
                            {task.description?.length > 120 && '...'}
                          </p>
                          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', flexWrap: 'wrap' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>📁 {project?.name || 'Unknown'}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>👤 {task.assignedTo?.name || 'Unassigned'}</span>
                            {task.deadline && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: isOverdue && task.status !== 'DONE' ? '#dc2626' : '#64748b' }}>
                                📅 Due: {new Date(task.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', background: priorityStyle.bg, color: priorityStyle.color, fontWeight: '500' }}>
                            {priorityStyle.label}
                          </span>
                          
                          {isAdmin ? (
                            <select
                              value={task.status}
                              onChange={(e) => { e.stopPropagation(); handleStatusChange(task.id, e.target.value) }}
                              onClick={(e) => e.stopPropagation()}
                              style={{ padding: '0.25rem 0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontSize: '0.75rem', cursor: 'pointer', background: statusStyle.background, color: statusStyle.color }}
                            >
                              <option value="TODO">⏳ To Do</option>
                              <option value="IN_PROGRESS">🔄 In Progress</option>
                              <option value="DONE">✅ Completed</option>
                            </select>
                          ) : (
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', background: statusStyle.background, color: statusStyle.color }}>
                              {statusStyle.icon} {statusStyle.label}
                            </span>
                          )}
                          
                          {isAdmin && (
                            <div style={{ display: 'flex', gap: '0.25rem' }} onClick={(e) => e.stopPropagation()}>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEdit(task)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '0.25rem', color: '#4f46e5' }}
                              >
                                ✏️
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(task.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '0.25rem', color: '#ef4444' }}
                              >
                                🗑️
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {!isAdmin && task.status !== 'DONE' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }} 
                          onClick={(e) => e.stopPropagation()}
                        >
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}
                            style={{ padding: '0.25rem 0.75rem', background: '#fef3c7', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '500' }}
                          >
                            🚀 Start Working
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStatusChange(task.id, 'DONE')}
                            style={{ padding: '0.25rem 0.75rem', background: '#d1fae5', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '500' }}
                          >
                            ✅ Mark Complete
                          </motion.button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 0}
                  style={{
                    padding: '0.5rem 1rem',
                    background: pagination.page === 0 ? '#e5e7eb' : '#4f46e5',
                    color: pagination.page === 0 ? '#9ca3af' : 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: pagination.page === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  ← Previous
                </motion.button>
                <span style={{ padding: '0.5rem 1rem', background: 'white', borderRadius: '0.5rem' }}>
                  Page {pagination.page + 1} of {pagination.totalPages}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page + 1 >= pagination.totalPages}
                  style={{
                    padding: '0.5rem 1rem',
                    background: pagination.page + 1 >= pagination.totalPages ? '#e5e7eb' : '#4f46e5',
                    color: pagination.page + 1 >= pagination.totalPages ? '#9ca3af' : 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: pagination.page + 1 >= pagination.totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next →
                </motion.button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Task Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedTask && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailsModal(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '550px', maxHeight: '90vh', background: 'white', borderRadius: '1rem', zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              <div style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>📋 Task Details</h2>
                <button onClick={() => setShowDetailsModal(false)} style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', color: 'white' }}>✕</button>
              </div>
              <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>Title</h3>
                  <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#1e293b' }}>{selectedTask.title}</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>Description</h3>
                  <p style={{ color: '#475569' }}>{selectedTask.description || 'No description provided'}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>Status</h3>
                    <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', ...getStatusStyle(selectedTask.status) }}>
                      {getStatusStyle(selectedTask.status).icon} {getStatusStyle(selectedTask.status).label}
                    </span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>Priority</h3>
                    <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', ...getPriorityStyle(selectedTask.priority) }}>
                      {getPriorityStyle(selectedTask.priority).label}
                    </span>
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>Deadline</h3>
                  <p style={{ color: selectedTask.overdue && selectedTask.status !== 'DONE' ? '#dc2626' : '#475569' }}>
                    {selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleDateString() : 'No deadline set'}
                    {selectedTask.overdue && selectedTask.status !== 'DONE' && ' (Overdue!)'}
                  </p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>Project</h3>
                  <p style={{ color: '#475569' }}>{projects.find(p => p.id === selectedTask.projectId)?.name || 'Unknown'}</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>Assigned To</h3>
                  <p style={{ color: '#475569' }}>{selectedTask.assignedTo?.name || 'Unassigned'}</p>
                </div>
              </div>
              <div style={{ padding: '1rem 1.5rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                {isAdmin && (
                  <button onClick={() => { setShowDetailsModal(false); handleEdit(selectedTask) }} style={{ padding: '0.5rem 1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
                    ✏️ Edit Task
                  </button>
                )}
                <button onClick={() => setShowDetailsModal(false)} style={{ padding: '0.5rem 1rem', background: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: '0.5rem', cursor: 'pointer' }}>Close</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create/Edit Task Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              style={{ position: 'fixed', top: '2rem', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '550px', maxHeight: '90vh', background: 'white', borderRadius: '1rem', zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '2px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                  {editingTask ? '✏️ Edit Task' : '➕ Create New Task'}
                </h2>
                <button onClick={() => setShowModal(false)} style={{ width: '32px', height: '32px', borderRadius: '0.5rem', background: '#f3f4f6', border: 'none', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Task Title *</label>
                    <input 
                      type="text" 
                      value={formData.title} 
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                      placeholder="Enter task title" 
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} 
                      required 
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Description</label>
                    <textarea 
                      value={formData.description} 
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                      rows="4" 
                      placeholder="Enter task description" 
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', resize: 'vertical' }} 
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Status</label>
                      <select 
                        value={formData.status} 
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })} 
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                      >
                        <option value="TODO">⏳ To Do</option>
                        <option value="IN_PROGRESS">🔄 In Progress</option>
                        <option value="DONE">✅ Completed</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Priority</label>
                      <select 
                        value={formData.priority} 
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })} 
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                      >
                        <option value="LOW">🟢 Low</option>
                        <option value="MEDIUM">🟡 Medium</option>
                        <option value="HIGH">🔴 High</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Deadline</label>
                      <input 
                        type="date" 
                        value={formData.deadline} 
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} 
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Project *</label>
                      <select 
                        value={formData.projectId} 
                        onChange={(e) => setFormData({ ...formData, projectId: e.target.value })} 
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} 
                        required
                      >
                        <option value="">Select Project</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Assign To *</label>
                    <select 
                      value={formData.assignedToId} 
                      onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })} 
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} 
                      required
                    >
                      <option value="">Select Member</option>
                      {members.filter(m => m.role === 'MEMBER').map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </form>
              </div>
              <div style={{ padding: '1rem 1.5rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setShowModal(false)} 
                  style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid #d1d5db', borderRadius: '0.5rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={loading} 
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '0.5rem', 
                    cursor: loading ? 'not-allowed' : 'pointer', 
                    opacity: loading ? 0.7 : 1 
                  }}
                >
                  {loading ? 'Saving...' : (editingTask ? 'Update Task' : 'Create Task')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TasksPage