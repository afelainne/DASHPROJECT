import { NextRequest, NextResponse } from 'next/server';

interface DashboardData {
  receita: number;
  despesas: number;
  lucro: number;
  fluxoCaixa: number;
  pctVsAnterior: {
    receita: number;
    despesas: number;
    lucro: number;
  };
  receitaPorTipoProjeto: Array<{
    projectType: string;
    value: number;
    color: string;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching financial dashboard data');
    
    // Simulated data - replace with real database queries
    const currentMonth = new Date().getMonth();
    const mockData: DashboardData = {
      receita: 45000 + (Math.random() * 10000),
      despesas: 28000 + (Math.random() * 5000),
      lucro: 17000 + (Math.random() * 8000),
      fluxoCaixa: 12000 + (Math.random() * 6000),
      pctVsAnterior: {
        receita: 12.5,
        despesas: -8.2,
        lucro: 18.7
      },
      receitaPorTipoProjeto: [
        { projectType: 'Identidade Visual', value: 18000, color: '#3B82F6' },
        { projectType: 'Website', value: 15000, color: '#10B981' },
        { projectType: 'App Mobile', value: 8000, color: '#F59E0B' },
        { projectType: 'Catálogo Digital', value: 4000, color: '#EF4444' }
      ]
    };

    console.log('Dashboard data generated:', mockData);
    
    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}