'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon, CogIcon } from '@heroicons/react/24/outline';
import { useCategories, useCreateFinanceEntry } from '../../hooks/use-finance';
import CategoryManagerModal from './category-manager-modal';

interface ModalFinanceEntryProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'receita' | 'despesa';
}

interface FormData {
  amount: number;
  description: string;
  categoryId: string;
  date: string;
  projectId?: string;
}

export default function ModalFinanceEntry({ isOpen, onClose, type }: ModalFinanceEntryProps) {
  const [isCategoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const { data: categories, isLoading: categoriesLoading } = useCategories(type);
  const createEntry = useCreateFinanceEntry();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0]
    }
  });

  console.log('ModalFinanceEntry rendering:', { type, isOpen, categoriesCount: categories?.length });

  if (!isOpen) return null;

  const onSubmit = (data: FormData) => {
    console.log('Submitting finance entry:', { ...data, type });
    
    createEntry.mutate(
      {
        type,
        amount: data.amount,
        description: data.description,
        categoryId: data.categoryId,
        date: data.date,
        projectId: data.projectId
      },
      {
        onSuccess: () => {
          console.log('Finance entry created successfully');
          reset();
          onClose();
        },
        onError: (error) => {
          console.error('Error creating finance entry:', error);
        }
      }
    );
  };

  const title = type === 'receita' ? 'Nova Receita' : 'Nova Despesa';
  const amountPlaceholder = type === 'receita' ? 'Ex: 5000.00' : 'Ex: 1200.00';

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Valor */}
            <div className="form-group">
              <label className="form-label">Valor (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('amount', { 
                  required: 'Valor é obrigatório',
                  min: { value: 0.01, message: 'Valor deve ser maior que zero' }
                })}
                className="form-input"
                placeholder={amountPlaceholder}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
              )}
            </div>

            {/* Data */}
            <div className="form-group">
              <label className="form-label">Data *</label>
              <input
                type="date"
                {...register('date', { required: 'Data é obrigatória' })}
                className="form-input"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            {/* Categoria */}
            <div className="form-group">
              <label className="form-label">Categoria *</label>
              <div className="flex items-center space-x-2">
                <select
                  {...register('categoryId', { required: 'Categoria é obrigatória' })}
                  className="flex-1 form-input"
                  disabled={categoriesLoading}
                >
                  <option value="">
                    {categoriesLoading ? 'Carregando...' : 'Selecione uma categoria'}
                  </option>
                  {categories?.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setCategoryManagerOpen(true)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-100 flex items-center space-x-1"
                  title="Gerenciar categorias"
                >
                  <CogIcon className="w-4 h-4" />
                  <span>Gerenciar</span>
                </button>
              </div>
              {errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
              )}
            </div>

            {/* Descrição */}
            <div className="form-group">
              <label className="form-label">Descrição *</label>
              <textarea
                {...register('description', { required: 'Descrição é obrigatória' })}
                className="form-input"
                rows={3}
                placeholder={`Descreva esta ${type}...`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Projeto (opcional) */}
            <div className="form-group">
              <label className="form-label">Projeto (opcional)</label>
              <select
                {...register('projectId')}
                className="form-input"
              >
                <option value="">Não vincular a projeto</option>
                <option value="project-1">Identidade Visual - Café Premium</option>
                <option value="project-2">Website Corporativo - TechStart</option>
                <option value="project-3">App Mobile - StartupX</option>
              </select>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
                disabled={createEntry.isPending}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={createEntry.isPending}
              >
                {createEntry.isPending ? 'Salvando...' : `Criar ${type === 'receita' ? 'Receita' : 'Despesa'}`}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Category Manager Modal */}
      <CategoryManagerModal
        type={type}
        isOpen={isCategoryManagerOpen}
        onClose={() => setCategoryManagerOpen(false)}
      />
    </>
  );
}