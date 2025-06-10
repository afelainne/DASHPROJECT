"use client"

import React from 'react';
import { 
  ClockIcon, 
  UserIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
}

interface Project {
  id: string;
  name: string;
  tasks: Task[];
  progress: number;
}

interface ProjectBoardPreviewProps {
  projects: Project[];
}

const statusConfig = {
  'todo': { label: 'A Fazer', color: 'bg-gray-100 text-gray-700' },
  'in-progress': { label: 'Em Progresso', color: 'bg-blue-100 text-blue-700' },
  'review': { label: 'Revisão', color: 'bg-yellow-100 text-yellow-700' },
  'completed': { label: 'Concluído', color: 'bg-green-100 text-green-700' },
};

const priorityConfig = {
  'low': { color: 'text-gray-400', icon: null },
  'medium': { color: 'text-yellow-500', icon: ClockIcon },
  'high': { color: 'text-red-500', icon: ExclamationTriangleIcon },
};

export default function ProjectBoardPreview({ projects }: ProjectBoardPreviewProps) {
  console.log('ProjectBoardPreview rendering projects:', projects.length);

  return (
    <div className="swiss-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Projetos Ativos</h3>
        <a href="/projects" className="text-sm text-blue-500 hover:text-blue-600 font-medium">
          Ver todos
        </a>
      </div>

      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-4">
            {/* Project Header */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">{project.name}</h4>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{project.progress}%</span>
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="space-y-2">
              {project.tasks.slice(0, 3).map((task) => {
                const PriorityIcon = priorityConfig[task.priority].icon;
                return (
                  <div key={task.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      {PriorityIcon && (
                        <PriorityIcon className={`w-4 h-4 ${priorityConfig[task.priority].color}`} />
                      )}
                      <span className="text-sm text-gray-900">{task.title}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${statusConfig[task.status].color}
                      `}>
                        {statusConfig[task.status].label}
                      </span>
                      
                      {task.assignee && (
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {task.assignee.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {project.tasks.length > 3 && (
                <div className="text-center py-2">
                  <span className="text-sm text-gray-500">
                    +{project.tasks.length - 3} mais tarefas
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}