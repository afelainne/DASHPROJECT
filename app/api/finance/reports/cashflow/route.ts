import { NextRequest, NextResponse } from 'next/server';
import { addMonths, format, startOfYear } from 'date-fns';

interface CashflowData {
  month: string;
  receitas: number;
  despesas: number;
  liquido: number;
  projecao?: number;
}

export async function GET(request: NextRequest) {
  try {
    console.log('Generating cashflow report');
    
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || '2025';
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    
    // Generate cashflow data for the year
    const cashflowData: CashflowData[] = [];
    
    for (let month = 0; month < 12; month++) {
      const date = addMonths(startOfYear(new Date(parseInt(year), 0, 1)), month);
      const monthName = format(date, 'MMM');
      
      // Generate realistic financial data with seasonal variations
      const seasonalMultiplier = month < 2 || month > 9 ? 0.8 : 1.2; // Lower in Jan/Feb and Nov/Dec
      const baseReceita = 25000 + (Math.random() * 15000) * seasonalMultiplier;
      const baseDespesa = 18000 + (Math.random() * 8000);
      
      const isActual = month <= currentMonth;
      const receitas = isActual ? baseReceita : 0;
      const despesas = isActual ? baseDespesa : 0;
      const liquido = receitas - despesas;
      
      // Projection for future months
      const projecao = !isActual ? baseReceita - baseDespesa : undefined;
      
      cashflowData.push({
        month: monthName,
        receitas: Math.round(receitas),
        despesas: Math.round(despesas),
        liquido: Math.round(liquido),
        projecao: projecao ? Math.round(projecao) : undefined
      });
    }

    const summary = {
      totalReceitas: cashflowData.reduce((sum, item) => sum + item.receitas, 0),
      totalDespesas: cashflowData.reduce((sum, item) => sum + item.despesas, 0),
      liquidoAcumulado: cashflowData.reduce((sum, item) => sum + item.liquido, 0),
      projecaoRestante: cashflowData
        .filter(item => item.projecao)
        .reduce((sum, item) => sum + (item.projecao || 0), 0)
    };

    console.log('Cashflow report generated:', { dataPoints: cashflowData.length, summary });
    
    return NextResponse.json({
      year: parseInt(year),
      data: cashflowData,
      summary
    });
  } catch (error) {
    console.error('Error generating cashflow report:', error);
    return NextResponse.json(
      { error: 'Failed to generate cashflow report' },
      { status: 500 }
    );
  }
}