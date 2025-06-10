import { NextRequest, NextResponse } from 'next/server';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface DREData {
  periodo: string;
  receitaOperacional: {
    servicosDesign: number;
    consultoria: number;
    manutencao: number;
    total: number;
  };
  custosVariaveis: {
    freelancers: number;
    ferramentas: number;
    materiais: number;
    total: number;
  };
  despesasFixas: {
    aluguel: number;
    salarios: number;
    marketing: number;
    administrativo: number;
    total: number;
  };
  resultado: {
    receitaLiquida: number;
    margemBruta: number;
    lucroOperacional: number;
    margemLiquida: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    console.log('Generating DRE report');
    
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || format(new Date(), 'yyyy-MM');
    
    const date = new Date(month + '-01');
    const periodo = format(date, 'MMMM yyyy');
    
    // Generate DRE data
    const receitaOperacional = {
      servicosDesign: 35000 + (Math.random() * 10000),
      consultoria: 8000 + (Math.random() * 5000),
      manutencao: 4000 + (Math.random() * 2000),
      total: 0
    };
    receitaOperacional.total = receitaOperacional.servicosDesign + 
                              receitaOperacional.consultoria + 
                              receitaOperacional.manutencao;

    const custosVariaveis = {
      freelancers: 8000 + (Math.random() * 3000),
      ferramentas: 2500 + (Math.random() * 1000),
      materiais: 1200 + (Math.random() * 800),
      total: 0
    };
    custosVariaveis.total = custosVariaveis.freelancers + 
                           custosVariaveis.ferramentas + 
                           custosVariaveis.materiais;

    const despesasFixas = {
      aluguel: 3500,
      salarios: 15000,
      marketing: 2800 + (Math.random() * 1200),
      administrativo: 1800 + (Math.random() * 600),
      total: 0
    };
    despesasFixas.total = despesasFixas.aluguel + 
                         despesasFixas.salarios + 
                         despesasFixas.marketing + 
                         despesasFixas.administrativo;

    const receitaLiquida = receitaOperacional.total - custosVariaveis.total;
    const margemBruta = (receitaLiquida / receitaOperacional.total) * 100;
    const lucroOperacional = receitaLiquida - despesasFixas.total;
    const margemLiquida = (lucroOperacional / receitaOperacional.total) * 100;

    const dreData: DREData = {
      periodo,
      receitaOperacional: {
        ...receitaOperacional,
        total: Math.round(receitaOperacional.total)
      },
      custosVariaveis: {
        ...custosVariaveis,
        total: Math.round(custosVariaveis.total)
      },
      despesasFixas: {
        ...despesasFixas,
        total: Math.round(despesasFixas.total)
      },
      resultado: {
        receitaLiquida: Math.round(receitaLiquida),
        margemBruta: Math.round(margemBruta * 100) / 100,
        lucroOperacional: Math.round(lucroOperacional),
        margemLiquida: Math.round(margemLiquida * 100) / 100
      }
    };

    console.log('DRE report generated for:', periodo);
    
    return NextResponse.json(dreData);
  } catch (error) {
    console.error('Error generating DRE report:', error);
    return NextResponse.json(
      { error: 'Failed to generate DRE report' },
      { status: 500 }
    );
  }
}