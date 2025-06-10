'use client';

import React from 'react';
import { BanknotesIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useFinanceDashboard } from '../../hooks/use-finance';
import FinancialActionButtons from './financial-action-buttons';

interface FinancialMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
}

export default function AdvancedFinancialDashboard() {
  const { data: dashboard, isLoading, isError } = useFinanceDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="swiss-card animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="swiss-card">
        <p className="text-red-600">Erro ao carregar dados financeiros</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const metrics: FinancialMetric[] = [
    {
      label: 'Receita Mensal',
      value: formatCurrency(dashboard?.receita || 0),
      change: formatPercentage(dashboard?.pctVsAnterior?.receita || 0),
      trend: (dashboard?.pctVsAnterior?.receita || 0) >= 0 ? 'up' : 'down',
      icon: BanknotesIcon
    },
    {
      label: 'Despesas',
      value: formatCurrency(dashboard?.despesas || 0),
      change: formatPercentage(dashboard?.pctVsAnterior?.despesas || 0),
      trend: (dashboard?.pctVsAnterior?.despesas || 0) < 0 ? 'up' : 'down',
      icon: ArrowTrendingDownIcon
    },
    {
      label: 'Lucro Líquido',
      value: formatCurrency(dashboard?.lucro || 0),
      change: formatPercentage(dashboard?.pctVsAnterior?.lucro || 0),
      trend: (dashboard?.pctVsAnterior?.lucro || 0) >= 0 ? 'up' : 'down',
      icon: ArrowTrendingUpIcon
    },
    {
      label: 'Fluxo de Caixa',
      value: formatCurrency(dashboard?.fluxoCaixa || 0),
      change: '+5,3%',
      trend: 'up',
      icon: ChartBarIcon
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="swiss-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{metric.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">vs mês anterior</span>
                </div>
              </div>
              <div className="ml-4">
                <metric.icon className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <FinancialActionButtons />

      {/* Latest Transactions */}
      <div className="swiss-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Últimas Transações</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Ver todas
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { id: 1, desc: 'Pagamento - Website Corporativo', value: 15000, type: 'receita', date: '10/06' },
            { id: 2, desc: 'Adobe Creative Suite', value: -2500, type: 'despesa', date: '08/06' },
            { id: 3, desc: 'Freelancer - Design', value: -1200, type: 'despesa', date: '05/06' },
            { id: 4, desc: 'App Mobile - 50%', value: 8000, type: 'receita', date: '03/06' }
          ].map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{transaction.desc}</p>
                <p className="text-xs text-gray-500">{transaction.date}/2025</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.value > 0 ? '+' : ''}{formatCurrency(transaction.value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}