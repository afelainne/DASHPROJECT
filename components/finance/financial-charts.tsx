"use client"

import React from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

// Mock data for financial charts
const cashFlowData = [
  { month: 'Jan', receitas: 25000, despesas: 8000, liquido: 17000 },
  { month: 'Fev', receitas: 32000, despesas: 9500, liquido: 22500 },
  { month: 'Mar', receitas: 28000, despesas: 7200, liquido: 20800 },
  { month: 'Abr', receitas: 35000, despesas: 11000, liquido: 24000 },
  { month: 'Mai', receitas: 29000, despesas: 8800, liquido: 20200 },
  { month: 'Jun', receitas: 42000, despesas: 12500, liquido: 29500 },
];

const revenueByProjectData = [
  { name: 'Identidade Visual', value: 35000, color: '#3B82F6' },
  { name: 'Website Design', value: 28000, color: '#10B981' },
  { name: 'Consultoria', value: 15000, color: '#F59E0B' },
  { name: 'Branding', value: 22000, color: '#EF4444' },
];

const expensesCategoryData = [
  { category: 'Software', amount: 2800 },
  { category: 'Terceirização', amount: 5200 },
  { category: 'Marketing', amount: 1800 },
  { category: 'Operacional', amount: 3200 },
  { category: 'Equipamentos', amount: 4500 },
];

const projectionData = [
  { month: 'Jul', receitas: 38000, despesas: 10000, projecao: true },
  { month: 'Ago', receitas: 45000, despesas: 11500, projecao: true },
  { month: 'Set', receitas: 40000, despesas: 9800, projecao: true },
  { month: 'Out', receitas: 48000, despesas: 12000, projecao: true },
  { month: 'Nov', receitas: 52000, despesas: 13200, projecao: true },
  { month: 'Dez', receitas: 55000, despesas: 14000, projecao: true },
];

const allCashFlowData = [...cashFlowData, ...projectionData];

export function CashFlowChart() {
  console.log('CashFlowChart rendering');

  return (
    <div className="swiss-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Fluxo de Caixa - 2025</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={allCashFlowData}>
            <defs>
              <linearGradient id="receitasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="liquidoGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL',
                  minimumFractionDigits: 0
                }).format(value),
                name === 'receitas' ? 'Receitas' : 
                name === 'despesas' ? 'Despesas' : 'Líquido'
              ]}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="receitas" 
              stroke="#10B981" 
              strokeWidth={2}
              fill="url(#receitasGradient)"
            />
            <Area 
              type="monotone" 
              dataKey="liquido" 
              stroke="#3B82F6" 
              strokeWidth={2}
              fill="url(#liquidoGradient)"
            />
            <Line 
              type="monotone" 
              dataKey="despesas" 
              stroke="#EF4444" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Receitas</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">Despesas</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600">Líquido</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-gray-400" style={{ borderTop: '2px dashed #9CA3AF' }}></div>
          <span className="text-gray-600">Projeção</span>
        </div>
      </div>
    </div>
  );
}

export function RevenueByProjectChart() {
  console.log('RevenueByProjectChart rendering');

  return (
    <div className="swiss-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Receita por Tipo de Projeto</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={revenueByProjectData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {revenueByProjectData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [
                new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL',
                  minimumFractionDigits: 0
                }).format(value),
                'Receita'
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {revenueByProjectData.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-sm text-gray-600">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL',
                  minimumFractionDigits: 0
                }).format(item.value)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExpensesByCategoryChart() {
  console.log('ExpensesByCategoryChart rendering');

  return (
    <div className="swiss-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Despesas por Categoria</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={expensesCategoryData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <YAxis 
              type="category"
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              width={80}
            />
            <Tooltip 
              formatter={(value: number) => [
                new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL',
                  minimumFractionDigits: 0
                }).format(value),
                'Despesa'
              ]}
            />
            <Bar 
              dataKey="amount" 
              fill="#EF4444"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}