"use client"

import React, { useState } from 'react';
import { XMarkIcon, DocumentArrowUpIcon, PlusIcon, ArrowDownIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface FinancialActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'receita' | 'despesa' | 'ofx' | 'lancamento' | 'relatorio' | null;
  onCreateTransaction: (data: any) => void;
}

export default function FinancialActionModal({ 
  isOpen, 
  onClose, 
  actionType, 
  onCreateTransaction 
}: FinancialActionModalProps) {
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    project: '',
    type: 'income' as 'income' | 'expense',
    status: 'confirmed' as 'confirmed' | 'pending'
  });

  const [ofxFile, setOfxFile] = useState<File | null>(null);

  console.log('FinancialActionModal rendering, actionType:', actionType, 'isOpen:', isOpen);

  if (!isOpen || !actionType) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating financial transaction:', actionType, formData);

    if (actionType === 'ofx') {
      // Handle OFX import
      if (ofxFile) {
        console.log('Importing OFX file:', ofxFile.name);
        // Simulate OFX import - in real app, would parse the file
        const mockImportedTransactions = [
          {
            id: `imported-${Date.now()}-1`,
            date: '2025-01-15',
            description: 'PIX Recebido - Cliente ABC',
            category: 'Receita de Projetos',
            amount: 5000,
            type: 'income' as const,
            status: 'confirmed' as const,
            imported: true
          },
          {
            id: `imported-${Date.now()}-2`,
            date: '2025-01-14',
            description: 'Débito Automático - Internet',
            category: 'Despesas Operacionais',
            amount: -150,
            type: 'expense' as const,
            status: 'confirmed' as const,
            imported: true
          }
        ];
        
        mockImportedTransactions.forEach(transaction => {
          onCreateTransaction(transaction);
        });
      }
    } else if (actionType === 'relatorio') {
      console.log('Generating financial report...');
      // In real app, would generate actual report
      alert('Relatório gerado com sucesso! Download iniciará em breve.');
    } else {
      // Handle regular transactions
      const transactionData = {
        id: `transaction-${Date.now()}`,
        ...formData,
        amount: actionType === 'despesa' ? -Math.abs(Number(formData.amount)) : Number(formData.amount),
        type: actionType === 'despesa' ? 'expense' : 'income'
      };
      
      onCreateTransaction(transactionData);
    }

    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFormData({
      description: '',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      project: '',
      type: 'income',
      status: 'confirmed'
    });
    setOfxFile(null);
  };

  const getModalTitle = () => {
    switch (actionType) {
      case 'receita': return 'Nova Receita';
      case 'despesa': return 'Nova Despesa';
      case 'ofx': return 'Importar OFX';
      case 'lancamento': return 'Novo Lançamento';
      case 'relatorio': return 'Gerar Relatório';
      default: return 'Ação Financeira';
    }
  };

  const getModalIcon = () => {
    switch (actionType) {
      case 'receita': return <PlusIcon className="w-6 h-6 text-green-600" />;
      case 'despesa': return <ArrowDownIcon className="w-6 h-6 text-red-600" />;
      case 'ofx': return <DocumentArrowUpIcon className="w-6 h-6 text-blue-600" />;
      case 'lancamento': return <PlusIcon className="w-6 h-6 text-blue-600" />;
      case 'relatorio': return <ChartBarIcon className="w-6 h-6 text-purple-600" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {getModalIcon()}
            <h2 className="text-xl font-semibold text-gray-900">{getModalTitle()}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OFX Import */}
          {actionType === 'ofx' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <DocumentArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Selecione o arquivo OFX do seu banco</p>
                <input
                  type="file"
                  accept=".ofx,.OFX"
                  onChange={(e) => setOfxFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="ofx-upload"
                />
                <label
                  htmlFor="ofx-upload"
                  className="btn-primary cursor-pointer inline-flex items-center space-x-2"
                >
                  <span>Escolher Arquivo</span>
                </label>
                {ofxFile && (
                  <p className="text-sm text-green-600 mt-2 font-medium">
                    Arquivo selecionado: {ofxFile.name}
                  </p>
                )}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Formatos suportados:</strong> OFX (Open Financial Exchange)
                  <br />
                  Disponível na maioria dos bancos brasileiros (Itaú, Bradesco, Santander, etc.)
                </p>
              </div>
            </div>
          )}

          {/* Report Generation */}
          {actionType === 'relatorio' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <ChartBarIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">DRE</h4>
                  <p className="text-sm text-gray-600 mb-3">Demonstração do Resultado</p>
                  <button type="button" className="btn-outline w-full text-sm">Selecionar</button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <DocumentArrowUpIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Fluxo de Caixa</h4>
                  <p className="text-sm text-gray-600 mb-3">Entradas e Saídas</p>
                  <button type="button" className="btn-outline w-full text-sm">Selecionar</button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <ChartBarIcon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Balancete</h4>
                  <p className="text-sm text-gray-600 mb-3">Resumo Contábil</p>
                  <button type="button" className="btn-outline w-full text-sm">Selecionar</button>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Período</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    className="form-input"
                    defaultValue="2025-01-01"
                  />
                  <input
                    type="date"
                    className="form-input"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Regular Transaction Form */}
          {(actionType === 'receita' || actionType === 'despesa' || actionType === 'lancamento') && (
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">Descrição *</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="form-input"
                  placeholder={`Ex: ${actionType === 'receita' ? 'Pagamento projeto Cliente ABC' : 'Licença Adobe Creative Suite'}`}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Categoria *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="form-input"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {actionType === 'receita' || actionType === 'lancamento' ? (
                      <>
                        <option value="Receita de Projetos">Receita de Projetos</option>
                        <option value="Consultoria">Consultoria</option>
                        <option value="Licenciamento">Licenciamento</option>
                        <option value="Outros">Outros</option>
                      </>
                    ) : (
                      <>
                        <option value="Software">Software</option>
                        <option value="Terceirização">Terceirização</option>
                        <option value="Despesas Operacionais">Despesas Operacionais</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Equipamentos">Equipamentos</option>
                        <option value="Outros">Outros</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="form-input"
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Data *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Projeto (Opcional)</label>
                  <input
                    type="text"
                    value={formData.project}
                    onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                    className="form-input"
                    placeholder="Ex: Identidade Visual - Café Premium"
                  />
                </div>
              </div>

              {actionType === 'lancamento' && (
                <div className="form-group">
                  <label className="form-label">Tipo *</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="income"
                        checked={formData.type === 'income'}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'income' | 'expense' }))}
                        className="mr-2"
                      />
                      <span className="text-green-600">Receita</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="expense"
                        checked={formData.type === 'expense'}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'income' | 'expense' }))}
                        className="mr-2"
                      />
                      <span className="text-red-600">Despesa</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'confirmed' | 'pending' }))}
                  className="form-input"
                >
                  <option value="confirmed">Confirmado</option>
                  <option value="pending">Pendente</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="btn-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
              disabled={
                (actionType === 'ofx' && !ofxFile) ||
                ((actionType === 'receita' || actionType === 'despesa' || actionType === 'lancamento') && 
                 (!formData.description || !formData.category || !formData.amount))
              }
            >
              {actionType === 'ofx' ? <DocumentArrowUpIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
              <span>
                {actionType === 'ofx' ? 'Importar' : 
                 actionType === 'relatorio' ? 'Gerar' : 'Criar'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}