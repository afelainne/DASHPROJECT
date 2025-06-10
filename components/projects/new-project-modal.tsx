'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

interface WorkflowPhase {
  id: string;
  label: string;
  enabled: boolean;
  startDay: number;
  endDay: number;
  defaultStart: number;
  defaultEnd: number;
}

interface ProjectFormData {
  name: string;
  client: string;
  description: string;
  budget: string;
  startDate: string;
  estimatedDays: number;
  phases: WorkflowPhase[];
}

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (projectData: any) => void;
}

const defaultPhases: Omit<WorkflowPhase, 'enabled'>[] = [
  { id: 'contract', label: 'Dados cadastrais e Contrato', defaultStart: 1, defaultEnd: 2, startDay: 1, endDay: 2 },
  { id: 'briefing', label: 'Briefing e Arquivos do cliente', defaultStart: 1, defaultEnd: 1, startDay: 1, endDay: 1 },
  { id: 'debriefing', label: 'Debriefing', defaultStart: 3, defaultEnd: 12, startDay: 3, endDay: 12 },
  { id: 'moodboard', label: 'Moodboard', defaultStart: 15, defaultEnd: 19, startDay: 15, endDay: 19 },
  { id: 'start', label: 'Início do projeto', defaultStart: 20, defaultEnd: 23, startDay: 20, endDay: 23 },
  { id: 'creation', label: 'Criação', defaultStart: 23, defaultEnd: 45, startDay: 23, endDay: 45 },
  { id: 'presentation', label: 'Apresentação', defaultStart: 45, defaultEnd: 55, startDay: 45, endDay: 55 },
  { id: 'finalization', label: 'Finalização', defaultStart: 55, defaultEnd: 65, startDay: 55, endDay: 65 },
];

export default function NewProjectModal({ isOpen, onClose, onCreateProject }: NewProjectModalProps) {
  const { register, handleSubmit, watch, setValue, control, reset } = useForm<ProjectFormData>({
    defaultValues: {
      name: '',
      client: '',
      description: '',
      budget: '',
      startDate: new Date().toISOString().split('T')[0],
      estimatedDays: 65,
      phases: defaultPhases.map(phase => ({ ...phase, enabled: true }))
    }
  });

  const { fields, update } = useFieldArray({
    control,
    name: 'phases'
  });

  const estimatedDays = watch('estimatedDays');
  const phases = watch('phases');

  console.log('NewProjectModal rendering, isOpen:', isOpen);

  if (!isOpen) return null;

  // Recalcular proporções quando duração mudar
  useEffect(() => {
    if (estimatedDays && estimatedDays !== 65) {
      const ratio = estimatedDays / 65;
      phases.forEach((phase, index) => {
        const newStartDay = Math.round(phase.defaultStart * ratio);
        const newEndDay = Math.round(phase.defaultEnd * ratio);
        update(index, {
          ...phase,
          startDay: newStartDay,
          endDay: newEndDay
        });
      });
    }
  }, [estimatedDays, update]);

  // Calcular duração total baseada nas fases ativas
  const calculateTotalDuration = () => {
    const enabledPhases = phases.filter(p => p.enabled);
    if (enabledPhases.length === 0) return 0;
    return Math.max(...enabledPhases.map(p => p.endDay));
  };

  const onSubmit = (data: ProjectFormData) => {
    console.log('Creating new project with data:', data);

    const enabledPhases = data.phases.filter(p => p.enabled);
    const totalDuration = calculateTotalDuration();

    const projectData = {
      id: `project-${Date.now()}`,
      name: data.name,
      client: data.client,
      description: data.description,
      budget: parseFloat(data.budget) || 0,
      startDate: data.startDate,
      estimatedDays: totalDuration.toString(),
      duration: totalDuration,
      status: 'Planejamento',
      progress: 0,
      workflowPhases: enabledPhases.map(phase => ({
        label: phase.label,
        startDay: phase.startDay,
        endDay: phase.endDay,
        id: phase.id
      })),
      tasks: enabledPhases.map((phase, index) => ({
        id: `task-${Date.now()}-${index}`,
        title: phase.label,
        description: `Fase do projeto: ${phase.label} (Dias ${phase.startDay}-${phase.endDay})`,
        status: 'todo',
        priority: 'medium',
        startDay: phase.startDay,
        endDay: phase.endDay,
        progress: 0
      }))
    };

    onCreateProject(projectData);
    reset();
    onClose();
  };

  const updatePhaseDuration = (index: number, field: 'startDay' | 'endDay', value: number) => {
    const currentPhase = phases[index];
    const updatedPhase = { ...currentPhase, [field]: value };
    
    // Validar que startDay <= endDay
    if (field === 'startDay' && value > updatedPhase.endDay) {
      updatedPhase.endDay = value;
    } else if (field === 'endDay' && value < updatedPhase.startDay) {
      updatedPhase.startDay = value;
    }

    update(index, updatedPhase);

    // Atualizar duração total se necessário
    const newTotalDuration = calculateTotalDuration();
    if (newTotalDuration !== estimatedDays) {
      setValue('estimatedDays', newTotalDuration);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Novo Projeto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Nome do Projeto *</label>
              <input
                {...register('name', { required: true })}
                className="form-input"
                placeholder="Ex: Identidade Visual - Café Premium"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cliente *</label>
              <input
                {...register('client', { required: true })}
                className="form-input"
                placeholder="Ex: Café Premium Ltda"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea
              {...register('description')}
              className="form-input"
              rows={3}
              placeholder="Breve descrição do escopo do projeto..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-group">
              <label className="form-label">Orçamento (R$)</label>
              <input
                type="number"
                {...register('budget')}
                className="form-input"
                placeholder="15000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Data de Início *</label>
              <input
                type="date"
                {...register('startDate', { required: true })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duração Estimada (dias)</label>
              <select
                {...register('estimatedDays', { valueAsNumber: true })}
                className="form-input"
              >
                <option value={30}>30 dias</option>
                <option value={45}>45 dias</option>
                <option value={65}>65 dias (Padrão)</option>
                <option value={90}>90 dias</option>
                <option value={120}>120 dias</option>
              </select>
            </div>
          </div>

          {/* Workflow Phases - Dynamic */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Fases do Workflow</h3>
              <span className="text-sm text-gray-500">
                Total: {calculateTotalDuration()} dias
              </span>
            </div>
            
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-3 py-2 border-b last:border-b-0">
                  <input
                    type="checkbox"
                    {...register(`phases.${index}.enabled`)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  
                  <label className="flex-1 text-sm text-gray-800 min-w-0">
                    {field.label}
                  </label>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-500">Dia:</span>
                    <input
                      type="number"
                      min={1}
                      max={estimatedDays}
                      value={phases[index]?.startDay || field.startDay}
                      onChange={(e) => updatePhaseDuration(index, 'startDay', parseInt(e.target.value) || 1)}
                      className="w-16 p-1 border border-gray-300 rounded text-center"
                      disabled={!phases[index]?.enabled}
                    />
                    <span className="text-gray-500">até</span>
                    <input
                      type="number"
                      min={1}
                      max={estimatedDays}
                      value={phases[index]?.endDay || field.endDay}
                      onChange={(e) => updatePhaseDuration(index, 'endDay', parseInt(e.target.value) || 1)}
                      className="w-16 p-1 border border-gray-300 rounded text-center"
                      disabled={!phases[index]?.enabled}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                ✓ {phases.filter(p => p.enabled).length} fases selecionadas
              </p>
              <p className="text-sm text-blue-600 mt-1">
                As tarefas serão criadas automaticamente conforme as fases selecionadas
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Criar Projeto</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}