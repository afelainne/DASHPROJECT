'use client';

import React, { useState } from 'react';
import { XMarkIcon, ArrowUpTrayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useImportOfx } from '../../hooks/use-finance';
import { useToast } from '../../hooks/use-toast';

interface ModalImportOfxProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ImportResult {
  success: boolean;
  transactions: Array<{
    id: string;
    date: string;
    amount: number;
    description: string;
    type: 'receita' | 'despesa';
    category: string;
  }>;
  fileName: string;
  totalTransactions: number;
  totalReceitas: number;
  totalDespesas: number;
}

export default function ModalImportOfx({ isOpen, onClose }: ModalImportOfxProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const importOfx = useImportOfx();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/x-ofx' && !file.name.toLowerCase().endsWith('.ofx')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo OFX válido",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setImportResult(null);
    console.log('OFX file selected:', file.name, file.size);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    
    try {
      console.log('Starting OFX import process');
      const result = await importOfx(selectedFile);
      setImportResult(result);
      
      toast({
        title: "Sucesso",
        description: `${result.totalTransactions} transações importadas com sucesso`,
      });
    } catch (error) {
      console.error('Error importing OFX:', error);
      toast({
        title: "Erro",
        description: "Falha ao processar arquivo OFX",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImportResult(null);
    setIsProcessing(false);
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Importar Extrato OFX
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {!importResult ? (
          <div className="space-y-4">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : selectedFile 
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto" />
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <ArrowUpTrayIcon className="w-12 h-12 text-gray-400 mx-auto" />
                  <p className="text-sm font-medium text-gray-900">
                    Arraste um arquivo OFX aqui ou clique para selecionar
                  </p>
                  <p className="text-xs text-gray-500">
                    Suporta arquivos .ofx de extratos bancários
                  </p>
                </div>
              )}
              
              <input
                type="file"
                accept=".ofx"
                onChange={handleFileInput}
                className="hidden"
                id="ofx-file-input"
              />
              
              {!selectedFile && (
                <label
                  htmlFor="ofx-file-input"
                  className="inline-block mt-2 btn-outline cursor-pointer"
                >
                  Selecionar Arquivo
                </label>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Como obter arquivo OFX:
              </h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Acesse o internet banking do seu banco</li>
                <li>• Vá em "Extratos" ou "Movimentação"</li>
                <li>• Selecione o período desejado</li>
                <li>• Escolha o formato "OFX" para download</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn-outline flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleImport}
                disabled={!selectedFile || isProcessing}
                className="btn-primary flex-1"
              >
                {isProcessing ? 'Processando...' : 'Importar'}
              </button>
            </div>
          </div>
        ) : (
          /* Import Results */
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <h3 className="text-sm font-medium text-green-900">
                  Importação Concluída
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-green-700 font-medium">Total</p>
                  <p className="text-green-900">{importResult.totalTransactions} transações</p>
                </div>
                <div>
                  <p className="text-green-700 font-medium">Receitas</p>
                  <p className="text-green-900">{formatCurrency(importResult.totalReceitas)}</p>
                </div>
                <div>
                  <p className="text-green-700 font-medium">Despesas</p>
                  <p className="text-green-900">{formatCurrency(importResult.totalDespesas)}</p>
                </div>
              </div>
            </div>

            {/* Transactions Preview */}
            <div className="border border-gray-200 rounded-lg">
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-900">
                  Transações Importadas
                </h4>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {importResult.transactions.map((transaction, index) => (
                  <div key={transaction.id} className="p-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-600">
                          {transaction.category} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'receita' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleClose}
                className="btn-primary flex-1"
              >
                Concluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}