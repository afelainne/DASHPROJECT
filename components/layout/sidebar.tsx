"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChartBarIcon, 
  FolderIcon, 
  CreditCardIcon, 
  CogIcon,
  HomeIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Projetos', href: '/projects', icon: FolderIcon },
  { name: 'Financeiro', href: '/finance', icon: CreditCardIcon },
  { name: 'Relatórios', href: '/reports', icon: ChartBarIcon },
  { name: 'Configurações', href: '/settings', icon: CogIcon },
];

export default function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  console.log('Sidebar rendering, collapsed:', isCollapsed, 'current path:', pathname);

  return (
    <div className={`
      bg-white border-r border-gray-200 flex flex-col transition-all duration-200 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-60'}
    `}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">DF</span>
            </div>
            <span className="font-semibold text-gray-900">DesignFlow Pro</span>
          </div>
        )}
        
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors duration-200 focus-ring"
          aria-label={isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                nav-item rounded group relative
                ${isActive ? 'active' : ''}
                ${isCollapsed ? 'justify-center px-2' : ''}
              `}
            >
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3">{item.name}</span>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-6 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-sm font-medium">JD</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">João Designer</p>
              <p className="text-xs text-gray-500 truncate">joao@designflow.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}