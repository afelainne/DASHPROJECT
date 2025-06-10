"use client"

import React from 'react';
import { 
  ClockIcon, 
  UserIcon,
  ExclamationTriangleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  labels?: string[];
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

interface KanbanBoardProps {
  columns: Column[];
}

const priorityColors = {
  low: 'text-gray-400',
  medium: 'text-yellow-500',
  high: 'text-red-500',
};

export default function KanbanBoard({ columns }: KanbanBoardProps) {
  console.log('KanbanBoard rendering with', columns.length, 'columns');

  return (
    <div className="h-full overflow-auto">
      <div className="grid grid-kanban gap-6 p-6 min-h-full">
        {columns.map((column) => (
          <div key={column.id} className="bg-gray-50 rounded-lg p-4 min-h-96">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <h3 className="font-medium text-gray-900">{column.title}</h3>
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <div key={task.id} className="swiss-card cursor-pointer hover-lift">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                    {task.priority === 'high' && (
                      <ExclamationTriangleIcon className={`w-4 h-4 ${priorityColors[task.priority]}`} />
                    )}
                  </div>

                  {task.description && (
                    <p className="text-swiss-caption mb-3 line-clamp-2">{task.description}</p>
                  )}

                  {task.labels && task.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {task.labels.map((label, index) => (
                        <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                          {label}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      {task.dueDate && (
                        <div className="flex items-center text-gray-500">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          <span>{task.dueDate}</span>
                        </div>
                      )}
                    </div>

                    {task.assignee && (
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {task.assignee.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Task Button */}
              <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors duration-200">
                + Adicionar tarefa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}