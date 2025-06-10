"use client"

import React, { useState } from 'react';
import {
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  overdueTasks: number;
  totalRevenue: number;
  avgProjectDuration: number;
  teamUtilization: number;
  thisMonthDeliveries: number;
}

interface FinancialMetrics {
  monthlyRecurring: number;
  avgProjectValue: number;
  profitMargin: number;
  pendingInvoices: number;
}

interface ProjectManagementDashboardProps {
  stats: ProjectStats;
  financialMetrics: FinancialMetrics;
}

export default function ProjectManagementDashboard({ 
  stats, 
  financialMetrics 
}: ProjectManagementDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  console.log('ProjectManagementDashboard rendering with stats:', stats);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard de Projetos</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="form-input w-auto"
        >
          <option value="7d">Últimos 7 dias</option>
          <option value="30d">Últimos 30 dias</option>
          <option value="90d">Últimos 90 dias</option>
          <option value="1y">Último ano</option>
        </select>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Projects */}
        <div className="swiss-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Projetos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
              <p className="text-sm text-green-600">+12% vs mês anterior</p>
            </div>
            <ChartBarIcon className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        {/* Active Projects */}
        <div className="swiss-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Projetos Ativos</p>
              <p className="text-2xl font-bold text-blue-600">{stats.activeProjects}</p>
              <p className="text-sm text-blue-600">Em andamento</p>
            </div>
            <ClockIcon className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        {/* Revenue */}
        <div className="swiss-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-sm text-green-600">+18% vs mês anterior</p>
            </div>
            <CurrencyDollarIcon className="w-12 h-12 text-green-500" />
          </div>
        </div>

        {/* Team Utilization */}
        <div className="swiss-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilização da Equipe</p>
              <p className="text-2xl font-bold text-yellow-600">{formatPercentage(stats.teamUtilization)}</p>
              <p className="text-sm text-gray-600">Capacidade atual</p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Performance */}
        <div className="swiss-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance dos Projetos</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">Projetos Concluídos</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.completedProjects}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                <span className="text-sm text-gray-600">Tarefas Atrasadas</span>
              </div>
              <span className="font-semibold text-red-600">{stats.overdueTasks}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CalendarDaysIcon className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600">Duração Média</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.avgProjectDuration} dias</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">Entregas este Mês</span>
              </div>
              <span className="font-semibold text-green-600">{stats.thisMonthDeliveries}</span>
            </div>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="swiss-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas Financeiras</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Receita Recorrente Mensal</span>
              <span className="font-semibold text-green-600">{formatCurrency(financialMetrics.monthlyRecurring)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Valor Médio por Projeto</span>
              <span className="font-semibold text-blue-600">{formatCurrency(financialMetrics.avgProjectValue)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Margem de Lucro</span>
              <span className="font-semibold text-green-600">{formatPercentage(financialMetrics.profitMargin)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Faturas Pendentes</span>
              <span className="font-semibold text-yellow-600">{financialMetrics.pendingInvoices}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="swiss-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn-outline flex flex-col items-center py-4 hover:bg-blue-50 hover:border-blue-200">
            <ChartBarIcon className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm">Relatório Completo</span>
          </button>
          
          <button className="btn-outline flex flex-col items-center py-4 hover:bg-green-50 hover:border-green-200">
            <CurrencyDollarIcon className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm">Faturamento</span>
          </button>
          
          <button className="btn-outline flex flex-col items-center py-4 hover:bg-yellow-50 hover:border-yellow-200">
            <UserGroupIcon className="w-8 h-8 text-yellow-600 mb-2" />
            <span className="text-sm">Gestão de Equipe</span>
          </button>
          
          <button className="btn-outline flex flex-col items-center py-4 hover:bg-purple-50 hover:border-purple-200">
            <CalendarDaysIcon className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm">Cronograma</span>
          </button>
        </div>
      </div>
    </div>
  );
}