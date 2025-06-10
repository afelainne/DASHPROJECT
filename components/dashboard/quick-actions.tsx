'use client';

import React, { useState } from 'react';
import { 
  FolderIcon, 
  ClockIcon, 
  CurrencyDollarIcon, 
  DocumentChartBarIcon 
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import NewProjectModal from '../projects/new-project-modal';
import NewTaskModal from '../projects/new-task-modal';
import ModalFinanceEntry from '../finance/modal-finance-entry';

interface QuickAction {
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
  color: string;
}

export default function QuickActions() {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const router = useRouter();

  const actions: QuickAction[] = [
    {
      icon: FolderIcon,
      label: 'Novo Projeto',
      onClick: () => setShowProjectModal(true),
      color: 'blue'
    },
    {
      icon: ClockIcon,
      label: 'Nova Tarefa',
      onClick: () => setShowTaskModal(true),
      color: 'green'
    },
    {
      icon: CurrencyDollarIcon,
      label: 'Lançamento',
      onClick: () => setShowFinanceModal(true),
      color: 'purple'
    },
    {
      icon: DocumentChartBarIcon,
      label: 'Relatório',
      onClick: () => router.push('/reports'),
      color: 'orange'
    }
  ];

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Ações Rápidas</h3>
        <div className="flex justify-between">
          {actions.map(({ icon: Icon, label, onClick, color }) => (
            <button
              key={label}
              className="flex flex-col items-center text-sm text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-50"
              onClick={onClick}
            >
              <Icon className={`w-6 h-6 mb-1 text-${color}-500`} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      <NewProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onCreateProject={(project) => {
          console.log('Project created:', project);
          setShowProjectModal(false);
        }}
      />
      
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Nova Tarefa</h2>
            <p className="text-gray-600 mb-4">
              Para criar uma tarefa, primeiro selecione um projeto na página de projetos.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowTaskModal(false)}
                className="btn-outline flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  router.push('/projects');
                }}
                className="btn-primary flex-1"
              >
                Ir para Projetos
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ModalFinanceEntry
        isOpen={showFinanceModal}
        onClose={() => setShowFinanceModal(false)}
        type="receita"
      />
    </>
  );
}