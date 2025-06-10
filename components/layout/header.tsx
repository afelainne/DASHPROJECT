"use client"

import React from 'react';
import { 
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  console.log('Header rendering with title:', title);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left: Title and Subtitle */}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-semibold text-gray-900 truncate">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-600 truncate mt-1">{subtitle}</p>
        )}
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10 w-full"
            placeholder="Buscar projetos, tarefas, clientes..."
          />
        </div>
      </div>

      {/* Right: Actions and Profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus-ring rounded">
          <BellIcon className="h-6 w-6" />
        </button>

        {/* Profile Menu */}
        <div className="relative">
          <button className="flex items-center space-x-3 text-sm rounded-full focus-ring p-1 hover:bg-gray-50 transition-colors duration-200">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm font-medium">JD</span>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-gray-900">João Designer</p>
              <p className="text-xs text-gray-500">Designer Gráfico</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}