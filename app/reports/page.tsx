'use client';

import React, { useState } from 'react';
import MainLayout from '../../components/layout/main-layout';
import { useCashflowReport, useDREReport } from '../../hooks/use-finance';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DocumentArrowDownIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function ReportsPage() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('2025-06');
  
  const { data: cashflow, isLoading: cashflowLoading } = useCashflowReport();
  const { data: dre, isLoading: dreLoading } = useDREReport();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const exportReport = (type: 'cashflow' | 'dre') => {
    console.log(`Exporting ${type} report`);
    // Implementation for PDF export would go here
  };

  return (
    <MainLayout 
      title="Relatórios" 
      subtitle="Análises financeiras e demonstrativos contábeis"
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="form-select"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="form-select"
              >
                <option value="2025-01">Janeiro 2025</option>
                <option value="2025-02">Fevereiro 2025</option>
                <option value="2025-03">Março 2025</option>
                <option value="2025-04">Abril 2025</option>
                <option value="2025-05">Maio 2025</option>
                <option value="2025-06">Junho 2025</option>
                <option value="2025-07">Julho 2025</option>
                <option value="2025-08">Agosto 2025</option>
                <option value="2025-09">Setembro 2025</option>
                <option value="2025-10">Outubro 2025</option>
                <option value="2025-11">Novembro 2025</option>
                <option value="2025-12">Dezembro 2025</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => exportReport('cashflow')}
              className="btn-outline flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              <span>Exportar Fluxo</span>
            </button>
            <button 
              onClick={() => exportReport('dre')}
              className="btn-outline flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              <span>Exportar DRE</span>
            </button>
          </div>
        </div>

        {/* Fluxo de Caixa */}
        <div className="swiss-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Fluxo de Caixa - {selectedYear}
          </h2>
          
          {cashflowLoading ? (
            <div className="h-80 bg-gray-50 rounded flex items-center justify-center">
              <p className="text-gray-500">Carregando dados...</p>
            </div>
          ) : (
            <>
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashflow?.data || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                      tickFormatter={(value) => new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(value)}
                    />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        formatCurrency(value), 
                        name === 'receitas' ? 'Receitas' :
                        name === 'despesas' ? 'Despesas' :
                        name === 'liquido' ? 'Líquido' : 'Projeção'
                      ]}
                      labelStyle={{ color: '#374151' }}
                      contentStyle={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="receitas" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="despesas" 
                      stroke="#EF4444" 
                      strokeWidth={3}
                      dot={{ fill: '#EF4444', strokeWidth: 2, r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="liquido" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                    />
                    {cashflow?.data?.some((item: any) => item.projecao) && (
                      <Line 
                        type="monotone" 
                        dataKey="projecao" 
                        stroke="#22D3EE" 
                        strokeWidth={3}
                        strokeDasharray="8 4"
                        dot={{ fill: '#22D3EE', strokeWidth: 2, r: 5 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Summary Cards */}
              {cashflow?.summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-xs font-medium text-green-800 uppercase tracking-wide">
                      Total Receitas
                    </p>
                    <p className="text-lg font-semibold text-green-900">
                      {formatCurrency(cashflow.summary.totalReceitas)}
                    </p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-xs font-medium text-red-800 uppercase tracking-wide">
                      Total Despesas
                    </p>
                    <p className="text-lg font-semibold text-red-900">
                      {formatCurrency(cashflow.summary.totalDespesas)}
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs font-medium text-blue-800 uppercase tracking-wide">
                      Líquido Acumulado
                    </p>
                    <p className="text-lg font-semibold text-blue-900">
                      {formatCurrency(cashflow.summary.liquidoAcumulado)}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-800 uppercase tracking-wide">
                      Projeção Restante
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(cashflow.summary.projecaoRestante)}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* DRE */}
        <div className="swiss-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Demonstrativo do Resultado do Exercício (DRE)
          </h2>
          
          {dreLoading ? (
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
              <p className="text-gray-500">Carregando dados...</p>
            </div>
          ) : dre ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">{dre.periodo}</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* DRE Table */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">RECEITA OPERACIONAL</h4>
                    <div className="space-y-1 text-sm ml-4">
                      <div className="flex justify-between">
                        <span>Serviços de Design</span>
                        <span>{formatCurrency(dre.receitaOperacional.servicosDesign)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Consultoria</span>
                        <span>{formatCurrency(dre.receitaOperacional.consultoria)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Manutenção</span>
                        <span>{formatCurrency(dre.receitaOperacional.manutencao)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total Receita</span>
                        <span>{formatCurrency(dre.receitaOperacional.total)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">CUSTOS VARIÁVEIS</h4>
                    <div className="space-y-1 text-sm ml-4">
                      <div className="flex justify-between">
                        <span>Freelancers</span>
                        <span className="text-red-600">({formatCurrency(dre.custosVariaveis.freelancers)})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ferramentas</span>
                        <span className="text-red-600">({formatCurrency(dre.custosVariaveis.ferramentas)})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Materiais</span>
                        <span className="text-red-600">({formatCurrency(dre.custosVariaveis.materiais)})</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total Custos</span>
                        <span className="text-red-600">({formatCurrency(dre.custosVariaveis.total)})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="flex justify-between font-semibold">
                      <span>RECEITA LÍQUIDA</span>
                      <span>{formatCurrency(dre.resultado.receitaLiquida)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-600">
                      <span>Margem Bruta</span>
                      <span>{dre.resultado.margemBruta.toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">DESPESAS FIXAS</h4>
                    <div className="space-y-1 text-sm ml-4">
                      <div className="flex justify-between">
                        <span>Aluguel</span>
                        <span className="text-red-600">({formatCurrency(dre.despesasFixas.aluguel)})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Salários</span>
                        <span className="text-red-600">({formatCurrency(dre.despesasFixas.salarios)})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Marketing</span>
                        <span className="text-red-600">({formatCurrency(dre.despesasFixas.marketing)})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Administrativo</span>
                        <span className="text-red-600">({formatCurrency(dre.despesasFixas.administrativo)})</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total Despesas</span>
                        <span className="text-red-600">({formatCurrency(dre.despesasFixas.total)})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded">
                    <div className="flex justify-between font-semibold">
                      <span>LUCRO OPERACIONAL</span>
                      <span className={dre.resultado.lucroOperacional >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(dre.resultado.lucroOperacional)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Margem Líquida</span>
                      <span>{dre.resultado.margemLiquida.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                
                {/* Visual Chart */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Breakdown Visual</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Receita Total', value: dre.receitaOperacional.total, fill: '#10B981' },
                          { name: 'Custos Variáveis', value: -dre.custosVariaveis.total, fill: '#F59E0B' },
                          { name: 'Despesas Fixas', value: -dre.despesasFixas.total, fill: '#EF4444' },
                          { name: 'Lucro Líquido', value: dre.resultado.lucroOperacional, fill: '#3B82F6' }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          fontSize={10}
                        />
                        <YAxis 
                          tickFormatter={(value) => new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          }).format(value)}
                          fontSize={10}
                        />
                        <Tooltip 
                          formatter={(value: any) => [formatCurrency(Math.abs(value)), '']}
                        />
                        <Bar dataKey="value" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum dado disponível para o período selecionado</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}