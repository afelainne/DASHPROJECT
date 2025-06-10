"use client"

import React, { useState } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { DEFAULT_PROJECT_TASKS, TASK_CATEGORIES, createCustomTask } from '@/lib/project-templates';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (taskData: any) => void;
  projectName?: string;
}

export default function NewTaskModal({ isOpen, onClose, onCreateTask, projectName = '' }: NewTaskModalProps) {
  const [taskType, setTaskType] = useState<'predefined' | 'custom'>('predefined');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customData, setCustomData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: 'Personalizada',
    dueDate: ''
  });

  console.log('NewTaskModal rendering, isOpen:', isOpen, 'taskType:', taskType);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating new task, type:', taskType);

    let taskData;

    if (taskType === 'predefined' && selectedTemplate) {
      const template = DEFAULT_PROJECT_TASKS.find(t => t.id === selectedTemplate);
      if (template) {
        taskData = {
          id: `${template.id}-${Date.now()}`,
          title: template.title,
          description: template.description,
          priority: template.priority,
          assignee: '',
          dueDate: 'A definir',
          labels: [template.category, projectName].filter(Boolean),
          category: template.category,
          days: `Dias ${template.startDay}-${template.endDay}`,
          status: 'todo'
        };
      }
    } else if (taskType === 'custom') {
      taskData = createCustomTask({
        ...customData,
        ...(projectName && { labels: [customData.category, projectName] })
      });
    }

    if (taskData) {
      onCreateTask(taskData);
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setTaskType('predefined');
    setSelectedTemplate('');
    setCustomData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'Personalizada',
      dueDate: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Nova Tarefa</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Type Selection */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="form-label mb-3">Tipo de Tarefa</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="predefined"
                  checked={taskType === 'predefined'}
                  onChange={(e) => setTaskType(e.target.value as 'predefined' | 'custom')}
                  className="mr-2"
                />
                <span>Tarefa Padrão do Workflow</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="custom"
                  checked={taskType === 'custom'}
                  onChange={(e) => setTaskType(e.target.value as 'predefined' | 'custom')}
                  className="mr-2"
                />
                <span>Tarefa Personalizada</span>
              </label>
            </div>
          </div>

          {/* Predefined Task Selection */}
          {taskType === 'predefined' && (
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">Selecionar Tarefa Padrão *</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Escolha uma tarefa...</option>
                  {DEFAULT_PROJECT_TASKS.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.title} (Dias {template.startDay}-{template.endDay}) - {template.category}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTemplate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  {(() => {
                    const template = DEFAULT_PROJECT_TASKS.find(t => t.id === selectedTemplate);
                    return template ? (
                      <div>
                        <h4 className="font-medium text-blue-900 mb-2">{template.title}</h4>
                        <p className="text-blue-700 text-sm mb-2">{template.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-blue-600">
                          <span>Categoria: {template.category}</span>
                          <span>Prioridade: {template.priority}</span>
                          <span>Duração: Dias {template.startDay}-{template.endDay}</span>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Custom Task Form */}
          {taskType === 'custom' && (
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">Título da Tarefa *</label>
                <input
                  type="text"
                  value={customData.title}
                  onChange={(e) => setCustomData(prev => ({ ...prev, title: e.target.value }))}
                  className="form-input"
                  placeholder="Ex: Revisão de textos"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea
                  value={customData.description}
                  onChange={(e) => setCustomData(prev => ({ ...prev, description: e.target.value }))}
                  className="form-input"
                  rows={3}
                  placeholder="Descreva os objetivos e entregáveis desta tarefa..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="form-label">Prioridade</label>
                  <select
                    value={customData.priority}
                    onChange={(e) => setCustomData(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                    className="form-input"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <select
                    value={customData.category}
                    onChange={(e) => setCustomData(prev => ({ ...prev, category: e.target.value }))}
                    className="form-input"
                  >
                    {TASK_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Prazo</label>
                  <input
                    type="date"
                    value={customData.dueDate}
                    onChange={(e) => setCustomData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="btn-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
              disabled={taskType === 'predefined' ? !selectedTemplate : !customData.title}
            >
              <PlusIcon className="w-4 h-4" />
              <span>Criar Tarefa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}