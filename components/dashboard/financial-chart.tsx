"use client"

import React from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  BanknotesIcon 
} from '@heroicons/react/24/outline';

interface FinancialData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface FinancialChartProps {
  data: FinancialData[];
  currentMonthSummary: {
    revenue: number;
    expenses: number;
    profit: number;
    profitChange: number;
  };
}

export default function FinancialChart({ data, currentMonthSummary }: FinancialChartProps) {
  console.log('FinancialChart rendering data for', data.length, 'months');

  const maxValue = Math.max(...data.flatMap(d => [d.revenue, d.expenses]));
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="swiss-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Fluxo de Caixa</h3>
        <a href="/finance" className="text-sm text-blue-500 hover:text-blue-600 font-medium">
          Ver detalhes
        </a>
      </div>

      {/* Current Month Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <ArrowUpIcon className="w-5 h-5 text-green-500 mr-1" />
            <span className="text-sm font-medium text-gray-700">Receitas</span>
          </div>
          <p className="text-xl font-semibold text-gray-900">
            {formatCurrency(currentMonthSummary.revenue)}
          </p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <ArrowDownIcon className="w-5 h-5 text-red-500 mr-1" />
            <span className="text-sm font-medium text-gray-700">Despesas</span>
          </div>
          <p className="text-xl font-semibold text-gray-900">
            {formatCurrency(currentMonthSummary.expenses)}
          </p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <BanknotesIcon className="w-5 h-5 text-blue-500 mr-1" />
            <span className="text-sm font-medium text-gray-700">Lucro</span>
          </div>
          <p className="text-xl font-semibold text-gray-900">
            {formatCurrency(currentMonthSummary.profit)}
          </p>
          <p className={`text-sm font-medium ${
            currentMonthSummary.profitChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {currentMonthSummary.profitChange >= 0 ? '+' : ''}
            {currentMonthSummary.profitChange.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Últimos 6 meses</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span>Receitas</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span>Despesas</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-12 text-xs text-gray-600 text-right">
                {item.month}
              </div>
              
              <div className="flex-1 relative h-8 bg-gray-100 rounded">
                {/* Revenue Bar */}
                <div 
                  className="absolute top-0 left-0 h-4 bg-green-500 rounded-t"
                  style={{ width: `${(item.revenue / maxValue) * 100}%` }}
                />
                
                {/* Expenses Bar */}
                <div 
                  className="absolute bottom-0 left-0 h-4 bg-red-500 rounded-b"
                  style={{ width: `${(item.expenses / maxValue) * 100}%` }}
                />
              </div>
              
              <div className="w-20 text-xs text-gray-600 text-right">
                {formatCurrency(item.profit)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}