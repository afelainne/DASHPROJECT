"use client"

import React, { useState } from 'react';
import AdvancedFinancialDashboard from '@/components/finance/advanced-financial-dashboard';
import MainLayout from '@/components/layout/main-layout';
import TransactionTable from '@/components/finance/transaction-table';
import FinancialActionModal from '@/components/finance/financial-action-modal';
import { CashFlowChart, RevenueByProjectChart, ExpensesByCategoryChart } from '@/components/finance/financial-charts';
import { 
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  DocumentArrowUpIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const mockTransactions = [
  {
    id: '1',
    date: '2025-01-10',
    description: 'Pagamento - Identidade Visual Café Premium',
    category: 'Receita de Projetos',
    amount: 15000,
    type: 'income' as const,
    project: 'Café Premium',
    status: 'confirmed' as const
  },
  {
    id: '2',
    date: '2025-01-09',
    description: 'Adobe Creative Suite - Licença Mensal',
    category: 'Software',
    amount: -350,
    type: 'expense' as const,
    status: 'confirmed' as const
  },
  {
    id: '3',
    date: '2025-01-08',
    description: 'Freelancer - Desenvolvimento Frontend',
    category: 'Terceirização',
    amount: -2500,
    type: 'expense' as const,
    project: 'TechStart',
    status: 'confirmed' as const
  },
  {
    id: '4',
    date: '2025-01-07',
    description: 'Sinal - Website TechStart',
    category: 'Receita de Projetos',
    amount: 8000,
    type: 'income' as const,
    project: 'TechStart',
    status: 'confirmed' as const
  },
  {
    id: '5',
    date: '2025-01-06',
    description: 'Material de Escritório',
    category: 'Despesas Operacionais',
    amount: -450,
    type: 'expense' as const,
    status: 'pending' as const
  }
];

const mockFinancialSummary = {
  totalRevenue: 23000,
  totalExpenses: 3300,
  netProfit: 19700,
  monthlyGrowth: 15.6
};

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'reports'>('overview');
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'receita' | 'despesa' | 'ofx' | 'lancamento' | 'relatorio' | null>(null);
  const [transactions, setTransactions] = useState(mockTransactions);

  console.log('FinancePage rendering, activeTab:', activeTab);

  const handleOpenActionModal = (type: 'receita' | 'despesa' | 'ofx' | 'lancamento' | 'relatorio') => {
    console.log('Opening action modal for:', type);
    setActionType(type);
    setShowActionModal(true);
  };

  const handleCreateTransaction = (transactionData: any) => {
    console.log('Adding new transaction:', transactionData);
    setTransactions(prev => [transactionData, ...prev]);
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <MainLayout 
      title="Financeiro" 
      subtitle="Controle financeiro e análise de receitas e despesas"
    >
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Visão Geral', icon: ChartBarIcon },
            { id: 'transactions', label: 'Lançamentos', icon: BanknotesIcon },
            { id: 'reports', label: 'Relatórios', icon: DocumentArrowUpIcon },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Advanced Financial Dashboard Integration */}
          <AdvancedFinancialDashboard />
          
          {/* Financial Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CashFlowChart />
            <RevenueByProjectChart />
          </div>
          
          <ExpensesByCategoryChart />
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Lançamentos</h3>
              <p className="text-sm text-gray-600">Gerencie todas as transações financeiras</p>
            </div>
            <button 
              onClick={() => handleOpenActionModal('lancamento')}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Novo Lançamento</span>
            </button>
          </div>
          <TransactionTable transactions={transactions} />
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="swiss-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatórios Financeiros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <ChartBarIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h4 className="font-medium text-gray-900 mb-2">DRE</h4>
              <p className="text-sm text-gray-600 mb-4">Demonstração do Resultado do Exercício</p>
              <button className="btn-primary w-full">Gerar DRE</button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <BanknotesIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="font-medium text-gray-900 mb-2">Fluxo de Caixa</h4>
              <p className="text-sm text-gray-600 mb-4">Projeção de entradas e saídas</p>
              <button className="btn-primary w-full">Gerar Fluxo</button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <DocumentArrowUpIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h4 className="font-medium text-gray-900 mb-2">Balancete</h4>
              <p className="text-sm text-gray-600 mb-4">Resumo contábil do período</p>
              <button className="btn-primary w-full">Gerar Balancete</button>
            </div>
          </div>
        </div>
      )}

      {/* Financial Action Modal */}
      <FinancialActionModal
        isOpen={showActionModal}
        onClose={() => {
          setShowActionModal(false);
          setActionType(null);
        }}
        actionType={actionType}
        onCreateTransaction={handleCreateTransaction}
      />
    </MainLayout>
  );
}