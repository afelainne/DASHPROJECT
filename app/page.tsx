'use client';

import React from 'react';
import MainLayout from '../components/layout/main-layout';
import StatsCard from '../components/dashboard/stats-card';
import ProjectBoardPreview from '../components/dashboard/project-board-preview';
import FinancialChart from '../components/dashboard/financial-chart';
import QuickActions from '../components/dashboard/quick-actions';

export default function DashboardPage() {
  
  return (
    <MainLayout 
      title="Dashboard" 
      subtitle="Visão geral dos seus projetos e finanças"
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <QuickActions />
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Projetos Ativos"
            value="12"
            change={{ value: "+2 este mês", type: "increase" }}
          />
          <StatsCard
            title="Receita Mensal"
            value="R$ 45.230"
            change={{ value: "+12,5% vs anterior", type: "increase" }}
          />
          <StatsCard
            title="Tarefas Pendentes"
            value="28"
            change={{ value: "-5 esta semana", type: "decrease" }}
          />
          <StatsCard
            title="Prazo Médio"
            value="18 dias"
            change={{ value: "Dentro do esperado", type: "neutral" }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Board Preview */}
          <ProjectBoardPreview 
            projects={[
              {
                id: '1',
                name: 'Identidade Visual - Café Premium',
                progress: 75,
                tasks: [
                  { id: '1', title: 'Logo principal', status: 'completed' as const, priority: 'high' as const, assignee: 'João' },
                  { id: '2', title: 'Variações do logo', status: 'in-progress' as const, priority: 'medium' as const, assignee: 'Maria' },
                  { id: '3', title: 'Manual de marca', status: 'todo' as const, priority: 'medium' as const },
                  { id: '4', title: 'Aplicações em produtos', status: 'todo' as const, priority: 'low' as const },
                ]
              },
              {
                id: '2',
                name: 'Website Corporativo - TechStart',
                progress: 45,
                tasks: [
                  { id: '5', title: 'Wireframes', status: 'completed' as const, priority: 'high' as const, assignee: 'Ana' },
                  { id: '6', title: 'Design das páginas', status: 'in-progress' as const, priority: 'high' as const, assignee: 'Carlos' },
                  { id: '7', title: 'Desenvolvimento frontend', status: 'todo' as const, priority: 'medium' as const },
                ]
              },
            ]}
          />
          
          {/* Financial Chart */}
          <FinancialChart 
            data={[
              { month: 'Jul', revenue: 85000, expenses: 42000, profit: 43000 },
              { month: 'Ago', revenue: 92000, expenses: 38000, profit: 54000 },
              { month: 'Set', revenue: 78000, expenses: 45000, profit: 33000 },
              { month: 'Out', revenue: 105000, expenses: 48000, profit: 57000 },
              { month: 'Nov', revenue: 118000, expenses: 52000, profit: 66000 },
              { month: 'Dez', revenue: 124000, expenses: 49000, profit: 75000 },
            ]}
            currentMonthSummary={{
              revenue: 124000,
              expenses: 49000,
              profit: 75000,
              profitChange: 13.6,
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
}