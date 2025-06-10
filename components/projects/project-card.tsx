"use client"

import React, { useState } from 'react';
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  category: string;
  days?: string;
}

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    client: string;
    status: string;
    progress: number;
    description?: string;
    tasks?: Task[];
  };
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, newStatus: string) => void;
  onClick?: () => void;
}

export default function ProjectCard({ project, tasks, onUpdateTaskStatus, onClick }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  console.log('ProjectCard rendering for project:', project.name, 'tasks:', tasks.length);

  const projectTasks = tasks.filter(task => 
    task.category === project.name
  );

  const tasksByStatus = {
    todo: projectTasks.filter(t => t.status === 'todo'),
    progress: projectTasks.filter(t => t.status === 'progress'),
    review: projectTasks.filter(t => t.status === 'review'),
    done: projectTasks.filter(t => t.status === 'done')
  };

  const totalTasks = projectTasks.length;
  const completedTasks = tasksByStatus.done.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planejamento': return 'bg-blue-100 text-blue-800';
      case 'Em Progresso': return 'bg-yellow-100 text-yellow-800';
      case 'Em Revisão': return 'bg-purple-100 text-purple-800';
      case 'Concluído': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'progress': return <PlayCircleIcon className="w-4 h-4 text-blue-500" />;
      case 'review': return <ExclamationCircleIcon className="w-4 h-4 text-yellow-500" />;
      default: return <ClockIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleTaskStatusChange = (taskId: string, newStatus: string) => {
    console.log('Updating task status:', taskId, newStatus);
    onUpdateTaskStatus(taskId, newStatus);
  };

  return (
    <div className="swiss-card hover:shadow-md transition-shadow cursor-pointer">
      <div onClick={onClick}>
        {/* Project Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{project.client}</p>
            {project.description && (
              <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
            )}
          </div>
          
          <button
            onClick={handleExpand}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Progress Overview */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progresso Geral</span>
            <span>{progressPercentage}% ({completedTasks}/{totalTasks})</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Status Quick View */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-600">{tasksByStatus.todo.length}</div>
            <div className="text-xs text-gray-500">A Fazer</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{tasksByStatus.progress.length}</div>
            <div className="text-xs text-gray-500">Em Progresso</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-yellow-600">{tasksByStatus.review.length}</div>
            <div className="text-xs text-gray-500">Em Revisão</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{tasksByStatus.done.length}</div>
            <div className="text-xs text-gray-500">Concluídas</div>
          </div>
        </div>
      </div>

      {/* Expanded Tasks View */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Tarefas do Projeto</h4>
          
          {projectTasks.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Nenhuma tarefa encontrada para este projeto.</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {projectTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {getTaskStatusIcon(task.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                        <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'high' && '●'}
                          {task.priority === 'medium' && '●'}
                          {task.priority === 'low' && '●'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        {task.days && (
                          <span className="flex items-center space-x-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span>{task.days}</span>
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <ClockIcon className="w-3 h-3" />
                          <span>{task.dueDate}</span>
                        </span>
                        {task.assignee && (
                          <span className="flex items-center space-x-1">
                            <UserIcon className="w-3 h-3" />
                            <span>{task.assignee}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <select
                    value={task.status}
                    onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="todo">A Fazer</option>
                    <option value="progress">Em Progresso</option>
                    <option value="review">Em Revisão</option>
                    <option value="done">Concluído</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}