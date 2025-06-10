"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interfaces unificadas
export interface Project {
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
  actualCost?: number;
  profitMargin?: number;
}

export interface Task {
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
}

export interface FinancialEntry {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  projectId?: string;
  client?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  hourlyRate: number;
  utilization: number;
  activeProjects: string[];
}

// Context do sistema
interface DataContextType {
  // Projects
  projects: Project[];
  updateProject: (project: Project) => void;
  updateProjectStatus: (projectId: string, status: Project['status']) => void;
  createProject: (project: Omit<Project, 'id'>) => void;
  
  // Tasks
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  createTask: (task: Omit<Task, 'id'>) => void;
  
  // Financial
  financialEntries: FinancialEntry[];
  createFinancialEntry: (entry: Omit<FinancialEntry, 'id'>) => void;
  
  // Team
  teamMembers: TeamMember[];
  updateTeamMember: (memberId: string, updates: Partial<TeamMember>) => void;
  
  // Computed data
  dashboardStats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    overdueTasks: number;
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    avgProjectDuration: number;
    teamUtilization: number;
    thisMonthDeliveries: number;
    monthlyRecurring: number;
    avgProjectValue: number;
    profitMargin: number;
    pendingInvoices: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data inicial
const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Identidade Visual - Café Premium',
    client: 'Café Premium Ltda',
    status: 'Em Progresso',
    progress: 75,
    startDate: '2025-01-01',
    estimatedDays: '65',
    budget: "15000",
    actualCost: 8500,
    tasks: [],
    currentPhase: 'Criação'
  },
  {
    id: '2',
    name: 'Website Corporativo - TechStart',
    client: 'TechStart Inc',
    status: 'Em Progresso',
    progress: 45,
    startDate: '2025-01-15',
    estimatedDays: '65',
    budget: "25000",
    actualCost: 12000,
    tasks: []
  },
  {
    id: '3',
    name: 'Catálogo Digital - ModaStyle',
    client: 'ModaStyle',
    status: 'Concluído',
    progress: 100,
    startDate: '2024-12-01',
    estimatedDays: '65',
    budget: "18000",
    actualCost: 16500,
    tasks: []
  },
  {
    id: '4',
    name: 'App Mobile - FitTracker',
    client: 'FitTracker Co',
    status: 'Planejamento',
    progress: 15,
    startDate: '2025-02-01',
    estimatedDays: '65',
    budget: "30000",
    actualCost: 2000,
    tasks: []
  }
];

const initialFinancialEntries: FinancialEntry[] = [
  {
    id: '1',
    date: '2025-01-08',
    amount: 15000,
    type: 'income',
    category: 'Projeto',
    description: 'Pagamento Café Premium - 1ª parcela',
    projectId: '1',
    client: 'Café Premium Ltda'
  },
  {
    id: '2',
    date: '2025-01-15',
    amount: 12500,
    type: 'income',
    category: 'Projeto',
    description: 'Pagamento TechStart - Entrada',
    projectId: '2',
    client: 'TechStart Inc'
  },
  {
    id: '3',
    date: '2025-01-05',
    amount: 3200,
    type: 'expense',
    category: 'Software',
    description: 'Licenças Adobe Creative Cloud'
  },
  {
    id: '4',
    date: '2025-01-12',
    amount: 1800,
    type: 'expense',
    category: 'Escritório',
    description: 'Aluguel escritório janeiro'
  }
];

const initialTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'João Silva',
    role: 'Designer Sênior',
    email: 'joao@designflow.com',
    hourlyRate: 85,
    utilization: 92,
    activeProjects: ['1', '2']
  },
  {
    id: '2',
    name: 'Maria Santos',
    role: 'UX/UI Designer',
    email: 'maria@designflow.com',
    hourlyRate: 75,
    utilization: 88,
    activeProjects: ['2', '4']
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    role: 'Motion Designer',
    email: 'carlos@designflow.com',
    hourlyRate: 70,
    utilization: 85,
    activeProjects: ['1']
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>(initialFinancialEntries);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);

  // Gerar tarefas automáticas para projetos existentes
  useEffect(() => {
    const { generateTasksForProject } = require('./project-templates');
    
    setProjects(prevProjects => 
      prevProjects.map(project => {
        if (project.tasks.length === 0) {
          const generatedTasks = generateTasksForProject(project.name, new Date(project.startDate));
          const tasksWithProjectId = generatedTasks.map((task: any) => ({
            ...task,
            projectId: project.id,
            estimatedHours: 8,
            actualHours: 0,
            progress: 0
          }));
          
          // Simular progresso baseado no status do projeto
          let completedTasks = 0;
          if (project.status === 'Em Progresso') {
            completedTasks = Math.floor(tasksWithProjectId.length * 0.4);
          } else if (project.status === 'Em Revisão') {
            completedTasks = Math.floor(tasksWithProjectId.length * 0.8);
          } else if (project.status === 'Concluído') {
            completedTasks = tasksWithProjectId.length;
          }
          
          tasksWithProjectId.forEach((task: any, index: number) => {
            if (index < completedTasks) {
              task.status = 'done';
              task.progress = 100;
              task.actualHours = task.estimatedHours;
            } else if (index === completedTasks && project.status === 'Em Progresso') {
              task.status = 'progress';
              task.progress = 60;
              task.actualHours = Math.floor(task.estimatedHours * 0.6);
            }
          });
          
          const currentPhase = tasksWithProjectId.find((task: any) => task.status === 'progress')?.title ||
                              tasksWithProjectId.find((task: any) => task.status === 'todo')?.title ||
                              'Todas as tarefas concluídas';
          
          return {
            ...project,
            tasks: tasksWithProjectId,
            currentPhase: currentPhase
          };
        }
        return project;
      })
    );
  }, []);

  // Funções para manipular projects
  const updateProject = (updatedProject: Project) => {
    console.log('Updating project in context:', updatedProject.id);
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const updateProjectStatus = (projectId: string, status: Project['status']) => {
    console.log('Updating project status in context:', projectId, status);
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { 
        ...p, 
        status, 
        progress: status === 'Concluído' ? 100 : p.progress 
      } : p
    ));
  };

  const createProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: `project-${Date.now()}`,
    };
    setProjects(prev => [newProject, ...prev]);
    
    // Gerar entrada financeira se houver orçamento
    if (newProject.budget) {
      createFinancialEntry({
        date: new Date().toISOString().split('T')[0],
        amount: parseFloat(newProject.budget || '0'),
        type: 'income',
        category: 'Projeto',
        description: `Orçamento aprovado - ${newProject.name}`,
        projectId: newProject.id,
        client: newProject.client
      });
    }
  };

  // Funções para manipular tasks
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setProjects(prev => prev.map(project => ({
      ...project,
      tasks: project.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    })));
  };

  const createTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
    };
    
    setProjects(prev => prev.map(project => 
      project.id === taskData.projectId
        ? { ...project, tasks: [...project.tasks, newTask] }
        : project
    ));
  };

  // Funções financeiras
  const createFinancialEntry = (entryData: Omit<FinancialEntry, 'id'>) => {
    const newEntry: FinancialEntry = {
      ...entryData,
      id: `finance-${Date.now()}`,
    };
    setFinancialEntries(prev => [newEntry, ...prev]);
  };

  // Funções de equipe
  const updateTeamMember = (memberId: string, updates: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, ...updates } : member
    ));
  };

  // Calcular estatísticas do dashboard
  const dashboardStats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'Em Progresso').length,
    completedProjects: projects.filter(p => p.status === 'Concluído').length,
    overdueTasks: projects.reduce((total, project) => {
      const overdue = project.tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate < new Date() && task.status !== 'done';
      }).length;
      return total + overdue;
    }, 0),
    totalRevenue: financialEntries
      .filter(entry => entry.type === 'income')
      .reduce((total, entry) => total + entry.amount, 0),
    totalExpenses: financialEntries
      .filter(entry => entry.type === 'expense')
      .reduce((total, entry) => total + entry.amount, 0),
    netProfit: financialEntries
      .filter(entry => entry.type === 'income')
      .reduce((total, entry) => total + entry.amount, 0) -
      financialEntries
        .filter(entry => entry.type === 'expense')
        .reduce((total, entry) => total + entry.amount, 0),
    avgProjectDuration: Math.round(
      projects.reduce((total, project) => total + parseInt(project.estimatedDays), 0) / projects.length
    ),
    teamUtilization: Math.round(
      teamMembers.reduce((total, member) => total + member.utilization, 0) / teamMembers.length
    ),
    thisMonthDeliveries: projects.filter(p => {
      const completedThisMonth = p.status === 'Concluído' && 
        new Date(p.startDate).getMonth() === new Date().getMonth();
      return completedThisMonth;
    }).length,
    monthlyRecurring: financialEntries
      .filter(entry => entry.type === 'income' && 
        new Date(entry.date).getMonth() === new Date().getMonth())
      .reduce((total, entry) => total + entry.amount, 0),
    avgProjectValue: Math.round(
      projects.reduce((total, project) => total + parseFloat(project.budget || '0'), 0) / projects.length
    ),
    profitMargin: projects.length > 0 ? Math.round(
      projects.reduce((total, project) => {
        const revenue = parseFloat(project.budget || '0');
        const cost = project.actualCost || 0;
        return total + (revenue > 0 ? ((revenue - cost) / revenue) * 100 : 0);
      }, 0) / projects.length
    ) : 0,
    pendingInvoices: financialEntries.filter(entry => 
      entry.type === 'income' && entry.description.includes('pendente')
    ).length
  };

  const value: DataContextType = {
    projects,
    updateProject,
    updateProjectStatus,
    createProject,
    updateTask,
    createTask,
    financialEntries,
    createFinancialEntry,
    teamMembers,
    updateTeamMember,
    dashboardStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}