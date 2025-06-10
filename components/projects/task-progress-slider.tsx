"use client"

import React, { useState } from 'react';
import {
  CheckCircleIcon,
  PencilIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

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
  projectId?: string;
}

interface TaskProgressSliderProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

// Função para calcular prioridade automática baseada no deadline
const calculateAutomaticPriority = (task: Task): Task['priority'] => {
  const today = new Date();
  const dueDate = new Date(task.dueDate);
  const startDate = task.startDate ? new Date(task.startDate) : today;
  
  // Calcular dias restantes até o deadline
  const daysUntilDeadline = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calcular duração total do projeto
  const totalProjectDays = Math.ceil((dueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calcular percentual de tempo restante
  const timeRemainingPercent = totalProjectDays > 0 ? (daysUntilDeadline / totalProjectDays) * 100 : 0;
  
  console.log(`Calculating priority for task ${task.title}: ${daysUntilDeadline} days remaining, ${timeRemainingPercent.toFixed(1)}% of total time`);
  
  // Determinar prioridade baseada no tempo restante
  if (daysUntilDeadline < 0) {
    return 'high'; // Tarefa atrasada
  } else if (timeRemainingPercent <= 25 || daysUntilDeadline <= 3) {
    return 'high'; // Urgente - menos de 25% do tempo ou 3 dias
  } else if (timeRemainingPercent <= 50 || daysUntilDeadline <= 7) {
    return 'medium'; // Média urgência - menos de 50% do tempo ou 7 dias
  } else {
    return 'low'; // Baixa urgência - mais tempo disponível
  }
};

export default function TaskProgressSlider({ task, onUpdateTask }: TaskProgressSliderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDays, setEditDays] = useState(task.days || '');
  const [editProgress, setEditProgress] = useState(task.progress || 0);

  console.log('TaskProgressSlider rendering for task:', task.title);

  // Calcular prioridade automática
  const automaticPriority = calculateAutomaticPriority(task);
  
  // Atualizar prioridade se for diferente da atual
  React.useEffect(() => {
    if (task.priority !== automaticPriority) {
      console.log(`Updating task ${task.title} priority from ${task.priority} to ${automaticPriority}`);
      onUpdateTask(task.id, { priority: automaticPriority });
    }
  }, [task.id, task.priority, automaticPriority, onUpdateTask]);

  const handleProgressChange = (newProgress: number) => {
    console.log('Updating task progress:', task.id, 'to:', newProgress);
    setEditProgress(newProgress);
    
    // Determinar status baseado no progresso
    let newStatus: Task['status'] = task.status;
    if (newProgress === 100) {
      newStatus = 'done';
    } else if (newProgress > 0) {
      newStatus = 'progress';
    } else {
      newStatus = 'todo';
    }

    onUpdateTask(task.id, { 
      progress: newProgress,
      status: newStatus
    });
  };

  const handleMarkComplete = () => {
    console.log('Marking task complete:', task.id);
    handleProgressChange(100);
  };

  const handleSaveDays = () => {
    console.log('Saving task days:', task.id, 'new days:', editDays);
    onUpdateTask(task.id, { days: editDays });
    setIsEditing(false);
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'done': return 'text-green-600';
      case 'progress': return 'text-blue-600';
      case 'review': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'done': return 'Concluída';
      case 'progress': return 'Em Progresso';
      case 'review': return 'Em Revisão';
      case 'todo': return 'Pendente';
      default: return 'Pendente';
    }
  };

  const getPriorityInfo = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return { 
        color: 'bg-red-100 text-red-700 border-red-200', 
        text: 'Alta Prioridade',
        icon: <ExclamationTriangleIcon className="w-3 h-3" />
      };
      case 'medium': return { 
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200', 
        text: 'Média Prioridade',
        icon: <ClockIcon className="w-3 h-3" />
      };
      case 'low': return { 
        color: 'bg-green-100 text-green-700 border-green-200', 
        text: 'Baixa Prioridade',
        icon: <CheckCircleIcon className="w-3 h-3" />
      };
    }
  };

  const priorityInfo = getPriorityInfo(automaticPriority);

  // Calcular dias restantes
  const today = new Date();
  const dueDate = new Date(task.dueDate);
  const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`bg-white border rounded-lg p-4 hover:shadow-md transition-all duration-200 ${
      automaticPriority === 'high' ? 'border-red-200 shadow-red-50' :
      automaticPriority === 'medium' ? 'border-yellow-200 shadow-yellow-50' :
      'border-gray-200'
    }`}>
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm mb-1">{task.title}</h4>
          <p className="text-xs text-gray-600">{task.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-medium ${getStatusColor(task.status)}`}>
            {getStatusText(task.status)}
          </span>
          <button
            onClick={handleMarkComplete}
            disabled={task.progress === 100}
            className={`p-1 rounded transition-colors ${
              task.progress === 100 
                ? 'text-green-500' 
                : 'text-gray-400 hover:text-green-500'
            }`}
          >
            <CheckCircleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Deadline Alert */}
      {daysRemaining <= 3 && daysRemaining >= 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
          <div className="flex items-center text-red-700 text-xs">
            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
            <span className="font-medium">
              Deadline em {daysRemaining} dia{daysRemaining !== 1 ? 's' : ''}!
            </span>
          </div>
        </div>
      )}

      {daysRemaining < 0 && (
        <div className="bg-red-100 border border-red-300 rounded-lg p-2 mb-3">
          <div className="flex items-center text-red-800 text-xs">
            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
            <span className="font-medium">
              Tarefa atrasada em {Math.abs(daysRemaining)} dia{Math.abs(daysRemaining) !== 1 ? 's' : ''}!
            </span>
          </div>
        </div>
      )}

      {/* Progress Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-600">Progresso</label>
          <span className="text-xs font-semibold text-gray-900">{editProgress}%</span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={editProgress}
            onChange={(e) => handleProgressChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${
                automaticPriority === 'high' ? '#ef4444' :
                automaticPriority === 'medium' ? '#f59e0b' : '#10b981'
              } 0%, ${
                automaticPriority === 'high' ? '#ef4444' :
                automaticPriority === 'medium' ? '#f59e0b' : '#10b981'
              } ${editProgress}%, #e5e7eb ${editProgress}%, #e5e7eb 100%)`
            }}
          />
        </div>

        {/* Progress Markers */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Task Details */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
        {/* Days Editor */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-600 flex items-center">
              <CalendarIcon className="w-3 h-3 mr-1" />
              Prazo
            </label>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <PencilIcon className="w-3 h-3" />
            </button>
          </div>
          
          {isEditing ? (
            <div className="flex space-x-1">
              <input
                type="text"
                value={editDays}
                onChange={(e) => setEditDays(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                placeholder="Ex: 5 dias"
              />
              <button
                onClick={handleSaveDays}
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                ✓
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xs text-gray-900">{task.days || 'Não definido'}</p>
              <p className="text-xs text-gray-600">
                Entrega: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
              </p>
              <p className={`text-xs font-medium ${
                daysRemaining < 0 ? 'text-red-600' :
                daysRemaining <= 3 ? 'text-orange-600' :
                'text-gray-600'
              }`}>
                {daysRemaining < 0 
                  ? `${Math.abs(daysRemaining)} dias de atraso`
                  : `${daysRemaining} dias restantes`
                }
              </p>
            </div>
          )}
        </div>

        {/* Assignee */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Responsável</label>
          <p className="text-xs text-gray-900">{task.assignee || 'Não atribuído'}</p>
        </div>
      </div>

      {/* Priority Badge - Automatic */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityInfo.color}`}>
          {priorityInfo.icon}
          <span className="ml-1">{priorityInfo.text}</span>
        </span>
        
        <div className="flex items-center text-xs text-gray-500">
          <ClockIcon className="w-3 h-3 mr-1" />
          <span>{task.category}</span>
        </div>
      </div>
    </div>
  );
}