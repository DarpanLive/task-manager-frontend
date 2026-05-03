import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  // Mock login function
  const login = async (email, password) => {
    // Mock users
    const mockUsers = {
      'admin@example.com': { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN', password: 'admin123' },
      'member@example.com': { id: '2', name: 'Member User', email: 'member@example.com', role: 'MEMBER', password: 'member123' }
    }
    
    const foundUser = mockUsers[email]
    if (foundUser && foundUser.password === password) {
      const { password: _, ...userWithoutPassword } = foundUser
      localStorage.setItem('token', 'mock-jwt-token')
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      setUser(userWithoutPassword)
      setIsAuthenticated(true)
      return userWithoutPassword
    }
    
    throw new Error('Invalid credentials')
  }

  const signup = async (name, email, password, role) => {
    // Mock signup - just return success
    return { message: 'User created successfully' }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, theme, setTheme, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}