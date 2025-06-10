"use client"

import React from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  project?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface TransactionTableProps {
  transactions: Transaction[];
}

const statusConfig = {
  confirmed: { label: 'Confirmado', color: 'bg-green-100 text-green-700' },
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
};

export default function TransactionTable({ transactions }: TransactionTableProps) {
  console.log('TransactionTable rendering', transactions.length, 'transactions');

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);

  const formatDate = (dateStr: string) => 
    new Date(dateStr).toLocaleDateString('pt-BR');

  return (
    <div className="swiss-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Lançamentos Financeiros</h3>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar lançamentos..."
              className="form-input pl-10 w-64"
            />
          </div>
          <button className="btn-outline flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4" />
            <span>Filtros</span>
          </button>
          <button className="btn-primary">
            + Novo Lançamento
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="swiss-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Projeto</th>
              <th>Valor</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td>
                  <span className="text-gray-900">{formatDate(transaction.date)}</span>
                </td>
                
                <td>
                  <div className="flex items-center space-x-2">
                    {transaction.type === 'income' ? (
                      <ArrowUpIcon className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4 text-red-500" />
                    )}
                    <span className="font-medium text-gray-900">{transaction.description}</span>
                  </div>
                </td>
                
                <td>
                  <span className="text-gray-600">{transaction.category}</span>
                </td>
                
                <td>
                  {transaction.project ? (
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                      {transaction.project}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                
                <td>
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </span>
                </td>
                
                <td>
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${statusConfig[transaction.status].color}
                  `}>
                    {statusConfig[transaction.status].label}
                  </span>
                </td>
                
                <td>
                  <button className="text-gray-400 hover:text-gray-600">
                    <span className="sr-only">Ações</span>
                    ⋯
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-medium">1</span> a <span className="font-medium">10</span> de{' '}
          <span className="font-medium">{transactions.length}</span> resultados
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="btn-outline px-3 py-2 text-sm">Anterior</button>
          <button className="btn-primary px-3 py-2 text-sm">Próximo</button>
        </div>
      </div>
    </div>
  );
}