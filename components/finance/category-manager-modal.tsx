'use client';

import React, { useState } from 'react';
import { XMarkIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useCategories, useCreateCategory, useDeleteCategory } from '../../hooks/use-finance';

interface CategoryManagerModalProps {
  type: 'receita' | 'despesa';
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryManagerModal({ type, isOpen, onClose }: CategoryManagerModalProps) {
  const [newName, setNewName] = useState('');
  const { data: categories, isLoading } = useCategories(type);
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  console.log('CategoryManagerModal rendering:', { type, isOpen, categoriesCount: categories?.length });

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!newName.trim()) return;
    
    createCategory.mutate(
      { name: newName.trim(), type },
      {
        onSuccess: () => {
          console.log('Category created successfully');
          setNewName('');
        },
        onError: (error) => {
          console.error('Error creating category:', error);
        }
      }
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      deleteCategory.mutate(id, {
        onSuccess: () => {
          console.log('Category deleted successfully');
        },
        onError: (error) => {
          console.error('Error deleting category:', error);
        }
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Gerenciar Categorias - {type === 'receita' ? 'Receitas' : 'Despesas'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Criar nova categoria */}
          <div className="flex space-x-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nome da categoria"
              className="flex-1 p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              disabled={createCategory.isPending}
            />
            <button
              onClick={handleCreate}
              disabled={!newName.trim() || createCategory.isPending}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Adicionar</span>
            </button>
          </div>

          {/* Lista de categorias */}
          <div className="border border-gray-200 rounded-lg">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">
                Categorias Existentes ({categories?.length || 0})
              </h3>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  Carregando categorias...
                </div>
              ) : categories && categories.length > 0 ? (
                categories.map((category: any) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    <span className="text-gray-900">{category.name}</span>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={deleteCategory.isPending}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 disabled:opacity-50"
                      title="Excluir categoria"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Nenhuma categoria encontrada
                </div>
              )}
            </div>
          </div>

          {/* Botão fechar */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}