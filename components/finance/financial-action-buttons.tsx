'use client';

import React, { useState } from 'react';
import { 
  PlusIcon, 
  ArrowUpTrayIcon, 
  DocumentChartBarIcon,
  CurrencyDollarIcon,
  MinusIcon 
} from '@heroicons/react/24/outline';
import ModalFinanceEntry from './modal-finance-entry';
import ModalImportOfx from './modal-import-ofx';

interface QuickActionButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
  color?: 'green' | 'red' | 'blue' | 'gray';
}

function QuickActionButton({ icon: Icon, label, onClick, color = 'gray' }: QuickActionButtonProps) {
  const colorClasses = {
    green: 'text-green-600 hover:text-green-700 hover:bg-green-50',
    red: 'text-red-600 hover:text-red-700 hover:bg-red-50',
    blue: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
    gray: 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
  };

  return (
    <button
      className={`flex flex-col items-center p-4 rounded-lg border border-gray-200 transition-all ${colorClasses[color]}`}
      onClick={onClick}
    >
      <Icon className="w-8 h-8 mb-2" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default function FinancialActionButtons() {
  const [showReceitaModal, setShowReceitaModal] = useState(false);
  const [showDespesaModal, setShowDespesaModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleGerarRelatorio = () => {
    console.log('Navigating to reports page');
    window.location.href = '/reports';
  };

  return (
    <>
      <div className="swiss-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            icon={PlusIcon}
            label="Nova Receita"
            onClick={() => setShowReceitaModal(true)}
            color="green"
          />
          
          <QuickActionButton
            icon={MinusIcon}
            label="Nova Despesa"
            onClick={() => setShowDespesaModal(true)}
            color="red"
          />
          
          <QuickActionButton
            icon={ArrowUpTrayIcon}
            label="Importar OFX"
            onClick={() => setShowImportModal(true)}
            color="blue"
          />
          
          <QuickActionButton
            icon={DocumentChartBarIcon}
            label="Gerar Relatório"
            onClick={handleGerarRelatorio}
            color="blue"
          />
        </div>
      </div>

      {/* Modals */}
      <ModalFinanceEntry
        isOpen={showReceitaModal}
        onClose={() => setShowReceitaModal(false)}
        type="receita"
      />
      
      <ModalFinanceEntry
        isOpen={showDespesaModal}
        onClose={() => setShowDespesaModal(false)}
        type="despesa"
      />
      
      <ModalImportOfx
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </>
  );
}