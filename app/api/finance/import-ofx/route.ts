import { NextRequest, NextResponse } from 'next/server';

interface OFXTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'receita' | 'despesa';
  category: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('Processing OFX import');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const fileContent = await file.text();
    console.log('OFX file received:', file.name, 'Size:', file.size);

    // Simulate OFX parsing - replace with actual ofx-js implementation
    const mockTransactions: OFXTransaction[] = [
      {
        id: `ofx-${Date.now()}-1`,
        date: '2025-06-01',
        amount: 15000,
        description: 'Pagamento Cliente - Projeto Website',
        type: 'receita',
        category: 'Serviços'
      },
      {
        id: `ofx-${Date.now()}-2`,
        date: '2025-06-03',
        amount: -2500,
        description: 'Adobe Creative Suite',
        type: 'despesa',
        category: 'Ferramentas'
      },
      {
        id: `ofx-${Date.now()}-3`,
        date: '2025-06-05',
        amount: -850,
        description: 'Energia Elétrica',
        type: 'despesa',
        category: 'Infraestrutura'
      },
      {
        id: `ofx-${Date.now()}-4`,
        date: '2025-06-08',
        amount: 8000,
        description: 'Entrada Projeto App Mobile',
        type: 'receita',
        category: 'Serviços'
      }
    ];

    console.log('OFX transactions parsed:', mockTransactions.length);

    return NextResponse.json({
      success: true,
      transactions: mockTransactions,
      fileName: file.name,
      totalTransactions: mockTransactions.length,
      totalReceitas: mockTransactions
        .filter(t => t.type === 'receita')
        .reduce((sum, t) => sum + t.amount, 0),
      totalDespesas: mockTransactions
        .filter(t => t.type === 'despesa')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    });
  } catch (error) {
    console.error('Error processing OFX:', error);
    return NextResponse.json(
      { error: 'Failed to process OFX file' },
      { status: 500 }
    );
  }
}