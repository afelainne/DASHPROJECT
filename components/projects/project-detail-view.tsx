"use client"

import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  PlusIcon,
  CalendarIcon,
  UserIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  PencilIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import NewTaskModal from './new-task-modal';
import TaskTimer from './task-timer';
import TaskProgressSlider from './task-progress-slider';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  startDate?: string;
  category: string;
  days?: string;
  status: 'todo' | 'progress' | 'review' | 'done';
  progress?: number;
  estimatedHours?: number;
  actualHours?: number;
  projectId: string;
  isRunning?: boolean;
  comments?: string[];
}

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'Planejamento' | 'Em Progresso' | 'Em Revisão' | 'Concluído';
  progress: number;
  description?: string;
  budget?: string;
  startDate: string;
  estimatedDays: string;
  tasks: Task[];
  currentPhase?: string;
}

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onUpdateProject: (project: Project) => void;
}

export default function ProjectDetailView({ 
  project, 
  onBack, 
  onUpdateProject 
}: ProjectDetailViewProps) {
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  console.log('ProjectDetailView rendering for project:', project.name);

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    console.log('Updating task:', taskId, 'with updates:', updates);
    
    const updatedTasks = project.tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    
    // Recalcular progresso do projeto baseado nas tarefas
    const totalTasks = updatedTasks.length;
    const completedTasks = updatedTasks.filter(t => t.status === 'done').length;
    const newProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Determinar fase atual
    const currentTask = updatedTasks.find(t => t.status === 'progress') || 
                       updatedTasks.find(t => t.status === 'todo');
    const currentPhase = currentTask ? currentTask.title : 'Projeto finalizado';
    
    const updatedProject = {
      ...project,
      tasks: updatedTasks,
      progress: newProgress,
      currentPhase: currentPhase
    };
    
    onUpdateProject(updatedProject);
  };

  const handleCreateTask = (taskData: any) => {
    console.log('Creating new task:', taskData);
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      status: 'todo' as Task['status'],
      progress: 0,
      estimatedHours: 8,
      actualHours: 0,
      projectId: project.id
    };
    
    const updatedTasks = [...project.tasks, newTask];
    const updatedProject = {
      ...project,
      tasks: updatedTasks
    };
    
    onUpdateProject(updatedProject);
    setShowTaskModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído': return 'bg-green-100 text-green-700 border-green-200';
      case 'Em Progresso': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Em Revisão': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Planejamento': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCurrentPhase = () => {
    if (project.tasks && project.tasks.length > 0) {
      const inProgressTask = project.tasks.find(task => task.status === 'progress');
      if (inProgressTask) {
        return inProgressTask.title;
      }
      const todoTask = project.tasks.find(task => task.status === 'todo');
      if (todoTask) {
        return `Próxima: ${todoTask.title}`;
      }
      return 'Todas as tarefas concluídas';
    }
    return project.currentPhase || 'Aguardando início';
  };

  const getProjectStats = () => {
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = project.tasks.filter(t => t.status === 'progress').length;
    const overdueTasks = 0; // Implementar lógica de prazo
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks
    };
  };

  const stats = getProjectStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <p className="text-gray-600">{project.client}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <button
                onClick={() => setShowTaskModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Nova Tarefa</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Project Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Phase & Progress */}
            <div className="swiss-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status do Projeto</h3>
              
              {/* Current Phase Indicator */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-900">Fase Atual</h4>
                  <ClockIcon className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-blue-700 font-medium">{getCurrentPhase()}</p>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Progresso Geral</span>
                  <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      project.progress === 100 ? 'bg-green-500' :
                      project.progress >= 75 ? 'bg-blue-500' :
                      project.progress >= 50 ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Início</span>
                  <span>50%</span>
                  <span>Conclusão</span>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="swiss-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Projeto</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Data de Início</p>
                    <p className="font-medium text-gray-900">{formatDate(project.startDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Prazo Estimado</p>
                    <p className="font-medium text-gray-900">{project.estimatedDays} dias</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Cliente</p>
                    <p className="font-medium text-gray-900">{project.client}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Orçamento</p>
                    <p className="font-medium text-gray-900">{project.budget || 'Não definido'}</p>
                  </div>
                </div>
              </div>
              
              {project.description && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 font-medium mb-2">Descrição</p>
                  <p className="text-gray-900">{project.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Project Stats */}
          <div className="space-y-4">
            <div className="swiss-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ChartBarIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Total de Tarefas</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.totalTasks}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Concluídas</span>
                  </div>
                  <span className="font-semibold text-green-600">{stats.completedTasks}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <PlayIcon className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Em Andamento</span>
                  </div>
                  <span className="font-semibold text-blue-600">{stats.inProgressTasks}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">Atrasadas</span>
                  </div>
                  <span className="font-semibold text-red-600">{stats.overdueTasks}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section with Progress Sliders */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Tarefas do Projeto</h3>
            <span className="text-sm text-gray-600">{project.tasks.length} tarefas total</span>
          </div>

          {project.tasks.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {project.tasks.map((task: Task) => (
                <TaskProgressSlider
                  key={task.id}
                  task={task}
                  onUpdateTask={handleUpdateTask}
                />
              ))}
            </div>
          ) : (
            <div className="swiss-card text-center py-12">
              <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa ainda</h4>
              <p className="text-gray-600 mb-4">Comece adicionando a primeira tarefa do projeto</p>
              <button
                onClick={() => setShowTaskModal(true)}
                className="btn-primary"
              >
                Adicionar Primeira Tarefa
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
}