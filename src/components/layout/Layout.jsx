// src/components/layout/Layout.jsx
import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

const Layout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setIsSidebarExpanded(false)
      }
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <div>
      {!isMobile && (
        <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
      )}
      <MobileNav />
      <main className={`main-content ${isSidebarExpanded ? 'main-content-expanded' : 'main-content-collapsed'}`}>
        <div className="content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout