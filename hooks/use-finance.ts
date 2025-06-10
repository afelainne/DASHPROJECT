import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Category {
  id: string;
  name: string;
  type: 'receita' | 'despesa';
  createdAt: string;
}

export function useCategories(type: 'receita' | 'despesa') {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: async () => {
      console.log(`Fetching categories for type: ${type}`);
      const response = await fetch(`/api/finance/categories?type=${type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    }
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newCategory: { name: string; type: 'receita' | 'despesa' }) => {
      console.log('Creating category:', newCategory);
      const response = await fetch('/api/finance/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      
      return response.json();
    },
    onSuccess: (_, variables) => {
      console.log('Category created successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['categories', variables.type] });
    }
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting category:', id);
      const response = await fetch(`/api/finance/categories/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      
      return response.json();
    },
    onSuccess: () => {
      console.log('Category deleted successfully, invalidating all category queries');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
}

export function useFinanceEntries() {
  return useQuery({
    queryKey: ['finance-entries'],
    queryFn: async () => {
      console.log('Fetching finance entries');
      const response = await fetch('/api/finance/entries');
      if (!response.ok) {
        throw new Error('Failed to fetch finance entries');
      }
      return response.json();
    }
  });
}

export function useFinanceDashboard() {
  return useQuery({
    queryKey: ['finance-dashboard'],
    queryFn: async () => {
      console.log('Fetching finance dashboard data');
      const response = await fetch('/api/finance/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return response.json();
    }
  });
}

export function useCashflowReport() {
  return useQuery({
    queryKey: ['cashflow-report'],
    queryFn: async () => {
      console.log('Fetching cashflow report');
      const response = await fetch('/api/finance/reports/cashflow');
      if (!response.ok) {
        throw new Error('Failed to fetch cashflow report');
      }
      return response.json();
    }
  });
}

export function useDREReport() {
  return useQuery({
    queryKey: ['dre-report'],
    queryFn: async () => {
      console.log('Fetching DRE report');
      const response = await fetch('/api/finance/reports/dre');
      if (!response.ok) {
        throw new Error('Failed to fetch DRE report');
      }
      return response.json();
    }
  });
}

export function useImportOfx() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (file: File) => {
      console.log('Importing OFX file:', file.name);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/finance/import-ofx', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to import OFX file');
      }
      
      return response.json();
    },
    onSuccess: () => {
      console.log('OFX file imported successfully');
      queryClient.invalidateQueries({ queryKey: ['finance-entries'] });
      queryClient.invalidateQueries({ queryKey: ['finance-dashboard'] });
    }
  });
}

export function useCreateFinanceEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (entry: {
      type: 'receita' | 'despesa';
      amount: number;
      description: string;
      categoryId: string;
      date: string;
      projectId?: string;
    }) => {
      console.log('Creating finance entry:', entry);
      const response = await fetch('/api/finance/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create finance entry');
      }
      
      return response.json();
    },
    onSuccess: () => {
      console.log('Finance entry created successfully');
      queryClient.invalidateQueries({ queryKey: ['finance-entries'] });
      queryClient.invalidateQueries({ queryKey: ['finance-dashboard'] });
    }
  });
}