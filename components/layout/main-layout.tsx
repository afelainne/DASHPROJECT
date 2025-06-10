"use client"

import React, { useState } from 'react';
import Sidebar from './sidebar';
import Header from './header';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  console.log('MainLayout rendering with title:', title, 'sidebar collapsed:', sidebarCollapsed);

  const handleToggleSidebar = () => {
    console.log('Toggling sidebar from', sidebarCollapsed, 'to', !sidebarCollapsed);
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={handleToggleSidebar}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header title={title} subtitle={subtitle} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}