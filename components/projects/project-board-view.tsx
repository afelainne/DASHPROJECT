"use client"

import React, { useState, useMemo } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import {
  BuildingOfficeIcon,
  CalendarIcon,
  UserIcon,
  ChartBarIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'Planejamento' | 'Em Progresso' | 'Em Revisão' | 'Concluído';
  progress: number;
  startDate: string;
  estimatedDays: string;
  tasks: any[];
  currentPhase?: string;
}

interface ProjectsByStatus {
  'Planejamento': Project[];
  'Em Progresso': Project[];
  'Em Revisão': Project[];
  'Concluído': Project[];
}

interface ProjectBoardViewProps {
  projectsByStatus: ProjectsByStatus;
  onProjectClick: (projectId: string) => void;
  onUpdateProjectStatus: (projectId: string, newStatus: Project['status']) => void;
  searchTerm: string;
}

interface ProjectCardProps {
  project: Project;
  onProjectClick: (projectId: string) => void;
}

const ProjectCard = React.memo(function ProjectCard({ project, onProjectClick }: ProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }), [transform, transition, isDragging]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planejamento': return 'border-l-gray-500';
      case 'Em Progresso': return 'border-l-blue-500';
      case 'Em Revisão': return 'border-l-yellow-500';
      case 'Concluído': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  // Determinar fase atual baseada nas tarefas
  const getCurrentPhase = () => {
    if (project.tasks && project.tasks.length > 0) {
      const inProgressTasks = project.tasks.filter(task => task.status === 'progress');
      if (inProgressTasks.length > 0) {
        return inProgressTasks[0].title;
      }
      const todoTasks = project.tasks.filter(task => task.status === 'todo');
      if (todoTasks.length > 0) {
        return `Próxima: ${todoTasks[0].title}`;
      }
    }
    return project.currentPhase || 'Iniciando projeto';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${getStatusColor(project.status)}`}
    >
      {/* Drag Handle Area - Only this area activates drag */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing mb-3"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
              {project.name}
            </h4>
            <div className="flex items-center text-xs text-gray-600 mb-2">
              <UserIcon className="w-3 h-3 mr-1" />
              <span>{project.client}</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onProjectClick(project.id);
            }}
            className="text-blue-500 hover:text-blue-600 p-1 rounded hover:bg-blue-50 cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rest of the card content - No drag */}
      <div className="space-y-3"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Current Phase Indicator */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="flex items-center text-xs text-blue-700 mb-1">
            <ClockIcon className="w-3 h-3 mr-1" />
            <span className="font-medium">Fase Atual</span>
          </div>
          <p className="text-xs text-blue-600 font-medium">{getCurrentPhase()}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Progresso</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                project.progress === 100 ? 'bg-green-500' :
                project.progress >= 75 ? 'bg-blue-500' :
                project.progress >= 50 ? 'bg-yellow-500' :
                'bg-gray-400'
              }`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center">
            <CalendarIcon className="w-3 h-3 mr-1" />
            <span>Início: {new Date(project.startDate).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center">
            <ChartBarIcon className="w-3 h-3 mr-1" />
            <span>{project.estimatedDays} dias estimados</span>
          </div>
        </div>

        {/* Task Summary */}
        <div 
          className="flex items-center justify-between pt-2 border-t border-gray-100"
          style={{ pointerEvents: 'auto' }}
        >
          <span className="text-xs text-gray-500">
            {project.tasks.length} tarefas
            {project.tasks.filter(t => t.status === 'done').length > 0 && (
              <span className="ml-1 text-green-600">
                • {project.tasks.filter(t => t.status === 'done').length} ✓
              </span>
            )}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onProjectClick(project.id);
            }}
            className="text-xs text-blue-500 hover:text-blue-600 font-medium cursor-pointer"
          >
            Ver detalhes →
          </button>
        </div>
      </div>
    </div>
  );
});

interface DroppableColumnProps {
  title: string;
  status: Project['status'];
  projects: Project[];
  onProjectClick: (projectId: string) => void;
  searchTerm: string;
  id: string;
}

const DroppableColumn = React.memo(function DroppableColumn({ title, status, projects, onProjectClick, searchTerm, id }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const filteredProjects = useMemo(() => 
    projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
    ), 
    [projects, searchTerm]
  );

  const getColumnColor = (status: string, isOver: boolean) => {
    const baseColor = status === 'Planejamento' ? 'bg-gray-50 border-gray-300' :
                     status === 'Em Progresso' ? 'bg-blue-50 border-blue-300' :
                     status === 'Em Revisão' ? 'bg-yellow-50 border-yellow-300' :
                     'bg-green-50 border-green-300';
    
    return isOver ? baseColor.replace('50', '100').replace('300', '400') : baseColor;
  };

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col flex-1 h-auto border-2 border-dashed rounded-lg transition-colors ${getColumnColor(status, isOver)}`}
    >
      <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      
      <div className="flex-1 p-4 space-y-3 h-auto overflow-visible">
        <SortableContext items={filteredProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onProjectClick={onProjectClick}
            />
          ))}
        </SortableContext>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BuildingOfficeIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {isOver ? 'Solte aqui' : 'Nenhum projeto nesta etapa'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default function ProjectBoardView({ 
  projectsByStatus, 
  onProjectClick, 
  onUpdateProjectStatus, 
  searchTerm 
}: ProjectBoardViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Removed console.log for performance
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeProjectId = active.id as string;
    const overColumnId = over.id as string;

    // Mapear IDs das colunas para status
    const statusMap: { [key: string]: Project['status'] } = {
      'column-planejamento': 'Planejamento',
      'column-em-progresso': 'Em Progresso', 
      'column-em-revisao': 'Em Revisão',
      'column-concluido': 'Concluído'
    };

    const newStatus = statusMap[overColumnId];

    if (newStatus) {
      onUpdateProjectStatus(activeProjectId, newStatus);
    }

    setActiveId(null);
  };

  const allProjects = Object.values(projectsByStatus).flat();
  const activeProject = allProjects.find(p => p.id === activeId);

  return (
    <DndContext 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        <DroppableColumn
          id="column-planejamento"
          title="Planejamento"
          status="Planejamento"
          projects={projectsByStatus['Planejamento']}
          onProjectClick={onProjectClick}
          searchTerm={searchTerm}
        />
        
        <DroppableColumn
          id="column-em-progresso"
          title="Em Progresso"
          status="Em Progresso"
          projects={projectsByStatus['Em Progresso']}
          onProjectClick={onProjectClick}
          searchTerm={searchTerm}
        />
        
        <DroppableColumn
          id="column-em-revisao"
          title="Em Revisão"
          status="Em Revisão"
          projects={projectsByStatus['Em Revisão']}
          onProjectClick={onProjectClick}
          searchTerm={searchTerm}
        />
        
        <DroppableColumn
          id="column-concluido"
          title="Concluído"
          status="Concluído"
          projects={projectsByStatus['Concluído']}
          onProjectClick={onProjectClick}
          searchTerm={searchTerm}
        />
      </div>

      <DragOverlay>
        {activeProject && (
          <div className="transform rotate-3 opacity-90 scale-105">
            <ProjectCard project={activeProject} onProjectClick={onProjectClick} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}