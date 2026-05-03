import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'

// Import all pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import TasksPage from './pages/TasksPage'
import UsersPage from './pages/UsersPage'
// import AnalyticsPage from './pages/AnalyticsPage'
// import ReportsPage from './pages/ReportsPage'

// Auth Guard Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

// Layout with Sidebar
const LayoutWithSidebar = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '260px', transition: 'margin-left 0.3s' }}>
        {children}
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      {/* Public Routes - No Sidebar */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Protected Routes with Sidebar */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <LayoutWithSidebar>
            <DashboardPage />
          </LayoutWithSidebar>
        </ProtectedRoute>
      } />
      
      <Route path="/projects" element={
        <ProtectedRoute>
          <LayoutWithSidebar>
            <ProjectsPage />
          </LayoutWithSidebar>
        </ProtectedRoute>
      } />
      
      <Route path="/tasks" element={
        <ProtectedRoute>
          <LayoutWithSidebar>
            <TasksPage />
          </LayoutWithSidebar>
        </ProtectedRoute>
      } />
      
      <Route path="/users" element={
        <ProtectedRoute adminOnly>
          <LayoutWithSidebar>
            <UsersPage />
          </LayoutWithSidebar>
        </ProtectedRoute>
      } />
      
      {/* <Route path="/analytics" element={
        <ProtectedRoute adminOnly>
          <LayoutWithSidebar>
            <AnalyticsPage />
          </LayoutWithSidebar>
        </ProtectedRoute>
      } />
      
      <Route path="/reports" element={
        <ProtectedRoute adminOnly>
          <LayoutWithSidebar>
            <ReportsPage />
          </LayoutWithSidebar>
        </ProtectedRoute>
      } /> */}
      
      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App