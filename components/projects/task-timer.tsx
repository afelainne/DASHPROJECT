"use client"

import React, { useState } from 'react';
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  PencilIcon,
  ChatBubbleLeftIcon,
  ClockIcon
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
  projectId: string;
  isRunning?: boolean;
  comments?: string[];
}

interface TaskTimerProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export default function TaskTimer({ task, onUpdateTask }: TaskTimerProps) {
  const [isRunning, setIsRunning] = useState(task.isRunning || false);
  const [currentHours, setCurrentHours] = useState(task.actualHours || 0);
  const [showDetails, setShowDetails] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingHours, setEditingHours] = useState(false);
  const [tempHours, setTempHours] = useState(currentHours);

  console.log('TaskTimer rendering for task:', task.title, 'isRunning:', isRunning);

  const handlePlayPause = () => {
    const newRunningState = !isRunning;
    setIsRunning(newRunningState);
    
    if (newRunningState) {
      // Iniciar timer
      console.log('Starting timer for task:', task.id);
      onUpdateTask(task.id, { 
        isRunning: true,
        status: task.status === 'todo' ? 'progress' : task.status
      });
    } else {
      // Pausar timer - incrementar horas
      const incrementedHours = currentHours + 0.25; // Adiciona 15 minutos por pausa
      setCurrentHours(incrementedHours);
      console.log('Pausing timer for task:', task.id, 'new hours:', incrementedHours);
      onUpdateTask(task.id, { 
        isRunning: false,
        actualHours: incrementedHours
      });
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    onUpdateTask(task.id, { 
      isRunning: false,
      actualHours: currentHours 
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const updatedComments = [...(task.comments || []), newComment.trim()];
      onUpdateTask(task.id, { comments: updatedComments });
      setNewComment('');
    }
  };

  const handleSaveHours = () => {
    setCurrentHours(tempHours);
    onUpdateTask(task.id, { actualHours: tempHours });
    setEditingHours(false);
  };

  const formatTime = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  return (
    <div className="space-y-4">
      {/* Timer Controls */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePlayPause}
            className={`p-2 rounded-full transition-colors ${
              isRunning 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
          >
            {isRunning ? (
              <PauseIcon className="w-5 h-5" />
            ) : (
              <PlayIcon className="w-5 h-5" />
            )}
          </button>
          
          <button
            onClick={handleStop}
            disabled={!isRunning}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <StopIcon className="w-5 h-5" />
          </button>
          
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              {isRunning ? 'Em andamento' : 'Pausado'}
            </p>
            <p className="text-gray-600">{formatTime(currentHours)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setEditingHours(!editingHours)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <ChatBubbleLeftIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Edit Hours */}
      {editingHours && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-blue-900">Horas trabalhadas:</label>
            <input
              type="number"
              step="0.25"
              value={tempHours}
              onChange={(e) => setTempHours(parseFloat(e.target.value) || 0)}
              className="w-20 px-2 py-1 border border-blue-300 rounded text-sm"
            />
            <button
              onClick={handleSaveHours}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Salvar
            </button>
            <button
              onClick={() => {
                setEditingHours(false);
                setTempHours(currentHours);
              }}
              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Task Details & Comments */}
      {showDetails && (
        <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-lg">
          {/* Task Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Estimado:</span>
              <span className="ml-2 text-gray-900">{formatTime(task.estimatedHours || 0)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Trabalhado:</span>
              <span className="ml-2 text-gray-900">{formatTime(currentHours)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Restante:</span>
              <span className="ml-2 text-gray-900">
                {formatTime(Math.max(0, (task.estimatedHours || 0) - currentHours))}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Eficiência:</span>
              <span className={`ml-2 font-medium ${
                currentHours <= (task.estimatedHours || 0) ? 'text-green-600' : 'text-red-600'
              }`}>
                {task.estimatedHours ? Math.round((task.estimatedHours / Math.max(currentHours, 0.1)) * 100) : 0}%
              </span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <ChatBubbleLeftIcon className="w-4 h-4 mr-2" />
              Comentários
            </h4>
            
            {/* Existing Comments */}
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {(task.comments || []).map((comment, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-600">Você</span>
                    <span className="text-xs text-gray-500">
                      {new Date().toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-gray-900">{comment}</p>
                </div>
              ))}
            </div>
            
            {/* Add Comment */}
            <div className="mt-3 flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicionar comentário..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Progresso</span>
              <span className="text-sm font-medium text-gray-900">{task.progress || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  (task.progress || 0) === 100 ? 'bg-green-500' :
                  (task.progress || 0) >= 75 ? 'bg-blue-500' :
                  (task.progress || 0) >= 50 ? 'bg-yellow-500' :
                  'bg-gray-400'
                }`}
                style={{ width: `${task.progress || 0}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}