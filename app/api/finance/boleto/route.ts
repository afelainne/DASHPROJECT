import { NextRequest, NextResponse } from 'next/server';

interface BoletoRequest {
  amount: number;
  dueDate: string;
  clientData: {
    name: string;
    document: string;
    email: string;
    address: string;
  };
  description: string;
  projectId?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('Processing boleto generation request');
    
    const body = await request.json();
    const { amount, dueDate, clientData, description, projectId } = body as BoletoRequest;

    if (!amount || !dueDate || !clientData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simulate boleto generation
    const boletoNumber = `BOL-${Date.now()}`;
    const boletoData = {
      number: boletoNumber,
      digitableLine: '23791.23457 89012.345678 90123.456789 1 23456789012345',
      barCode: '23791234567890123456789012345678901234567890',
      amount,
      dueDate,
      issuedAt: new Date().toISOString(),
      client: clientData,
      description,
      projectId,
      status: 'pending',
      pdfUrl: `/boleto/${boletoNumber}.pdf`,
      instructions: [
        'Pagamento após vencimento sujeito a multa de 2%',
        'Juros de mora de 1% ao mês',
        'Não receber após 30 dias do vencimento'
      ]
    };

    console.log('Boleto generated:', boletoData);

    return NextResponse.json({
      success: true,
      boleto: boletoData,
      message: 'Boleto gerado com sucesso'
    });
  } catch (error) {
    console.error('Error generating boleto:', error);
    return NextResponse.json(
      { error: 'Failed to generate boleto' },
      { status: 500 }
    );
  }
}