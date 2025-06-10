"use client"

import React, { useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { 
  ViewColumnsIcon, 
  CalendarIcon, 
  ChartBarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  BuildingOfficeIcon,
  EyeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// Import dos novos componentes
import ProjectBoardView from '@/components/projects/project-board-view';
import ProjectDetailView from '@/components/projects/project-detail-view';
import NewProjectModal from '@/components/projects/new-project-modal';
import { useData, Project } from '@/lib/data-context';

export default function ProjectsPage() {
  const { 
    projects, 
    updateProject, 
    updateProjectStatus, 
    createProject 
  } = useData();
  
  const [activeView, setActiveView] = useState<'boards' | 'list' | 'calendar'>('boards');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  console.log('ProjectsPage rendering with real data, activeView:', activeView, 'selectedProject:', selectedProject);

  // Agrupar projetos por status
  const projectsByStatus = {
    'Planejamento': projects.filter(p => p.status === 'Planejamento'),
    'Em Progresso': projects.filter(p => p.status === 'Em Progresso'),
    'Em Revisão': projects.filter(p => p.status === 'Em Revisão'),
    'Concluído': projects.filter(p => p.status === 'Concluído'),
  };

  const handleCreateProject = (projectData: any) => {
    console.log('Creating project:', projectData);
    createProject({
      name: projectData.name,
      client: projectData.client,
      status: 'Planejamento',
      progress: 0,
      description: projectData.description,
      budget: parseFloat(projectData.budget) || 0,
      startDate: projectData.startDate,
      estimatedDays: projectData.estimatedDays,
      tasks: projectData.tasks || []
    });
    setShowNewProjectModal(false);
  };

  const handleProjectClick = (projectId: string) => {
    console.log('Opening project details for:', projectId);
    setSelectedProject(projectId);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  const handleUpdateProjectStatus = (projectId: string, newStatus: any) => {
    console.log('Updating project status:', projectId, 'to:', newStatus);
    const project = projects.find(p => p.id === projectId);
    if (project) {
      updateProject({ ...project, status: newStatus });
    }
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  // Se um projeto está selecionado, mostrar a view de detalhes
  if (selectedProject && selectedProjectData) {
    return (
      <ProjectDetailView
        project={selectedProjectData}
        onBack={handleBackToProjects}
        onUpdateProject={updateProject}
      />
    );
  }

  return (
    <MainLayout 
      title="Projetos" 
      subtitle="Gerencie seus projetos de design e acompanhe o progresso"
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 w-64"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex border border-gray-300 rounded">
            <button
              onClick={() => setActiveView('boards')}
              className={`p-2 ${activeView === 'boards' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <ViewColumnsIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`p-2 ${activeView === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <ChartBarIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveView('calendar')}
              className={`p-2 ${activeView === 'calendar' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
          </div>

          <button className="btn-outline flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4" />
            <span>Filtros</span>
          </button>

          {/* Botão azul grande "+NOVO PROJETO" */}
          <button 
            onClick={() => setShowNewProjectModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-3 text-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <PlusIcon className="w-6 h-6" />
            <span>NOVO PROJETO</span>
          </button>
        </div>
      </div>



      {/* Content based on active view */}
      <div className="flex-1">
        {activeView === 'boards' && (
          <ProjectBoardView
            projectsByStatus={projectsByStatus}
            onProjectClick={handleProjectClick}
            onUpdateProjectStatus={handleUpdateProjectStatus}
            searchTerm={searchTerm}
          />
        )}
        
        {activeView === 'list' && (
          <div className="swiss-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lista de Projetos</h3>
            <div className="space-y-4">
              {projects
                .filter(project => 
                  project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  project.client.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(project => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-600">{project.client}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'Concluído' ? 'bg-green-100 text-green-700' :
                        project.status === 'Em Progresso' ? 'bg-blue-100 text-blue-700' :
                        project.status === 'Em Revisão' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {project.status}
                      </span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12">{project.progress}%</span>
                      <button
                        onClick={() => handleProjectClick(project.id)}
                        className="text-blue-500 hover:text-blue-600 flex items-center space-x-1"
                      >
                        <EyeIcon className="w-4 h-4" />
                        <span className="text-sm">Ver</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'calendar' && (
          <div className="swiss-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendário de Projetos</h3>
            <div className="text-center py-12 text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4" />
              <p>Visualização de calendário será implementada aqui</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal Novo Projeto */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onCreateProject={handleCreateProject}
      />
    </MainLayout>
  );
}