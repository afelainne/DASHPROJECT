export interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  startDay: number;
  endDay: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'progress' | 'review' | 'done';
}

export const DEFAULT_PROJECT_TASKS: TaskTemplate[] = [
  {
    id: 'cadastral-data',
    title: 'Dados Cadastrais',
    description: 'Coleta de informações cadastrais do cliente e documentação necessária',
    startDay: 1,
    endDay: 2,
    category: 'Administrativo',
    priority: 'high',
    status: 'todo'
  },
  {
    id: 'contract-signature',
    title: 'Contrato e Assinatura Digital',
    description: 'Elaboração do contrato (PDF) e coleta de assinatura digital',
    startDay: 1,
    endDay: 2,
    category: 'Administrativo',
    priority: 'high',
    status: 'todo'
  },
  {
    id: 'briefing',
    title: 'Briefing',
    description: 'Reunião de briefing e coleta de arquivos do cliente',
    startDay: 1,
    endDay: 1,
    category: 'Planejamento',
    priority: 'high',
    status: 'todo'
  },
  {
    id: 'debriefing',
    title: 'Debriefing',
    description: 'Análise detalhada do briefing e definição de diretrizes do projeto',
    startDay: 3,
    endDay: 12,
    category: 'Planejamento',
    priority: 'high',
    status: 'todo'
  },
  {
    id: 'moodboard',
    title: 'Moodboard',
    description: 'Criação de painel de referências visuais e conceituais',
    startDay: 15,
    endDay: 19,
    category: 'Conceituação',
    priority: 'medium',
    status: 'todo'
  },
  {
    id: 'project-start',
    title: 'Início do Projeto',
    description: 'Kickoff oficial do projeto e alinhamento de expectativas',
    startDay: 20,
    endDay: 23,
    category: 'Desenvolvimento',
    priority: 'medium',
    status: 'todo'
  },
  {
    id: 'creation',
    title: 'Criação',
    description: 'Desenvolvimento criativo e execução das peças do projeto',
    startDay: 23,
    endDay: 45,
    category: 'Desenvolvimento',
    priority: 'high',
    status: 'todo'
  },
  {
    id: 'presentation',
    title: 'Apresentação',
    description: 'Apresentação das propostas ao cliente e coleta de feedback',
    startDay: 45,
    endDay: 55,
    category: 'Aprovação',
    priority: 'high',
    status: 'todo'
  },
  {
    id: 'finalization',
    title: 'Finalização',
    description: 'Ajustes finais, entrega de arquivos e fechamento do projeto',
    startDay: 55,
    endDay: 65,
    category: 'Entrega',
    priority: 'high',
    status: 'todo'
  }
];

export const TASK_CATEGORIES = [
  'Administrativo',
  'Planejamento', 
  'Conceituação',
  'Desenvolvimento',
  'Aprovação',
  'Entrega',
  'Personalizada'
];

export function generateTasksForProject(projectName: string, startDate: Date = new Date()): any[] {
  return DEFAULT_PROJECT_TASKS.map((template, index) => {
    const taskStartDate = new Date(startDate);
    taskStartDate.setDate(startDate.getDate() + template.startDay - 1);
    
    const taskEndDate = new Date(startDate);
    taskEndDate.setDate(startDate.getDate() + template.endDay - 1);

    return {
      id: `${template.id}-${Date.now()}-${index}`,
      title: template.title,
      description: template.description,
      priority: template.priority,
      assignee: '',
      dueDate: taskEndDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      startDate: taskStartDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      labels: [template.category, projectName],
      category: template.category,
      days: `Dias ${template.startDay}-${template.endDay}`,
      status: template.status
    };
  });
}

export function createCustomTask(data: {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: string;
}): any {
  return {
    id: `custom-${Date.now()}`,
    title: data.title,
    description: data.description,
    priority: data.priority,
    assignee: '',
    dueDate: data.dueDate || 'A definir',
    labels: [data.category],
    category: data.category,
    status: 'todo'
  };
}