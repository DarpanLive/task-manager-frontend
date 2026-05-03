import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import API from "../api/api";
import * as projectAPI from "../api/project";

const ProjectsPage = () => {
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [members, setMembers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [selectedMembers, setSelectedMembers] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    memberIds: []
  })
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  // ✅ USER LOAD
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    loadData()
  }, [])

  // ✅ LOAD DATA (NO USER OVERRIDE)
  const loadData = async () => {
    setLoading(true)
    try {
      const res = await projectAPI.getProjects()
      console.log("Projects from backend:", res.data)
      setProjects(res.data)

      const usersRes = await API.get("/users/get-all")
      setMembers(usersRes.data)

    } catch (err) {
      console.error(err)
      setToast({ message: 'Failed to load projects', type: 'error' })
      setTimeout(() => setToast(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setToast({ message: 'Project name required', type: 'error' })
      setTimeout(() => setToast(null), 3000)
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        memberIds: selectedMembers
      }

      if (editingProject) {
        await projectAPI.updateProject(editingProject.id, payload)
        setToast({ message: 'Project updated successfully!', type: 'success' })
      } else {
        await projectAPI.createProject(payload)
        setToast({ message: 'Project created successfully!', type: 'success' })
      }

      await loadData()
      setShowModal(false)
      resetForm()
      setTimeout(() => setToast(null), 3000)
    } catch (err) {
      console.error(err)
      setToast({ message: 'Error saving project', type: 'error' })
      setTimeout(() => setToast(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEditingProject(null)
    setSelectedMembers([])
    setFormData({ name: '', description: '', memberIds: [] })
  }

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return

    setLoading(true)
    try {
      await projectAPI.deleteProject(id)
      setToast({ message: 'Project deleted successfully!', type: 'success' })
      await loadData()
      setTimeout(() => setToast(null), 3000)
    } catch {
      setToast({ message: 'Delete failed', type: 'error' })
      setTimeout(() => setToast(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  // ✅ EDIT
  const handleEdit = async (project) => {
    setLoading(true)
    try {
      const res = await projectAPI.getProjectById(project.id)
      const p = res.data

      const memberIds = p.members?.map(m => m.id) || []

      setEditingProject(p)
      setFormData({
        name: p.name,
        description: p.description,
        memberIds
      })
      setSelectedMembers(memberIds)
      setShowModal(true)
    } catch (error) {
      console.error(error)
      setToast({ message: 'Error loading project', type: 'error' })
      setTimeout(() => setToast(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const toggleMemberSelection = (id) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(m => m !== id))
    } else {
      setSelectedMembers([...selectedMembers, id])
    }
  }

  const isAdmin = user?.role === "ADMIN"

  // ✅ IMPORTANT FIX → NO FILTERING
  const userProjects = projects

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f0f4f8'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Please log in to view projects</h2>
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
                <span>📊</span> TaskFlow - Projects
              </h1>
              <p style={{ color: '#c7d2fe', fontSize: '0.9rem' }}>
                {isAdmin ? 'Manage and track all your projects' : 'View and manage your assigned projects'}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
                <span>👋 {user?.name || user?.email}</span>
                <span style={{ marginLeft: '0.5rem', background: user?.role === 'ADMIN' ? '#8b5cf6' : '#10b981', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem' }}>
                  {user?.role}
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
            <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>
              📁 {isAdmin ? 'All Projects' : 'My Projects'}
            </h1>
            <p style={{ color: '#666' }}>
              {isAdmin 
                ? `Manage and track all projects (${userProjects.length} total)` 
                : `View and manage your assigned projects (${userProjects.length} total)`}
            </p>
          </div>
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetForm()
                setShowModal(true)
              }}
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
              <span style={{ fontSize: '1.2rem' }}>➕</span>
              Create New Project
            </motion.button>
          )}
        </div>

        {/* Loading State */}
        {loading && projects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: '2rem' }}>⏳</motion.div>
            <p style={{ color: '#666', marginTop: '1rem' }}>Loading projects...</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && userProjects.length === 0 ? (
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
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📂</div>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '0.5rem' }}>
              {isAdmin ? 'No projects yet. Create your first project!' : 'No projects assigned to you yet.'}
            </p>
            {!isAdmin && (
              <p style={{ fontSize: '0.875rem', color: '#999' }}>
                Ask an administrator to add you as a member to a project.
              </p>
            )}
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
            {userProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e293b' }}>
                        {project.name}
                      </h3>
                      {project.createdBy && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                          Created by: {project.createdBy.name}
                        </div>
                      )}
                    </div>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(project)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem', color: '#4f46e5' }}
                          title="Edit project"
                        >
                          ✏️
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(project.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem', color: '#ef4444' }}
                          title="Delete project"
                        >
                          🗑️
                        </motion.button>
                      </div>
                    )}
                  </div>
                  
                  <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {project.description || 'No description provided'}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#666', flexWrap: 'wrap' }}>
                    <span>👥 Members: {project.members?.length || 0}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 999,
                backdropFilter: 'blur(4px)'
              }}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '550px',
                maxHeight: '90vh',
                background: 'white',
                borderRadius: '1rem',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <div style={{
                padding: '1.25rem 1.5rem',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                  {editingProject ? '✏️ Edit Project' : '➕ Create New Project'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '0.5rem',
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                <form onSubmit={handleSubmit}>
                  {/* Project Name */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: '#374151' }}>
                      Project Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter project name"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s',
                        outline: 'none'
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
                  
                  {/* Description */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: '#374151' }}>
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="4"
                      placeholder="Enter project description"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  {/* Members Selection */}
                  {isAdmin && members.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: '#374151' }}>
                        Select Members
                      </label>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '0.5rem', 
                        maxHeight: '200px', 
                        overflowY: 'auto', 
                        padding: '0.75rem', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '0.5rem',
                        background: '#f8fafc'
                      }}>
                        {members.map(member => (
                          <motion.button
                            key={member.id}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleMemberSelection(member.id)}
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '0.5rem',
                              border: '1px solid',
                              borderColor: selectedMembers.includes(member.id) ? '#4f46e5' : '#d1d5db',
                              background: selectedMembers.includes(member.id) ? '#e0e7ff' : 'white',
                              color: selectedMembers.includes(member.id) ? '#4f46e5' : '#374151',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: selectedMembers.includes(member.id) ? '600' : '400',
                              transition: 'all 0.2s'
                            }}
                          >
                            {selectedMembers.includes(member.id) ? '✓' : '○'} {member.name}
                          </motion.button>
                        ))}
                      </div>
                      {selectedMembers.length > 0 && (
                        <p style={{ fontSize: '0.75rem', color: '#4f46e5', marginTop: '0.5rem' }}>
                          ✓ {selectedMembers.length} member(s) selected
                        </p>
                      )}
                    </div>
                  )}
                </form>
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '1rem 1.5rem',
                background: '#f9fafb',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end'
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProjectsPage