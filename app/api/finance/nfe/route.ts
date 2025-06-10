import { NextRequest, NextResponse } from 'next/server';

interface NFERequest {
  entryIds: string[];
  clientData: {
    name: string;
    document: string;
    email: string;
    address: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log('Processing NFE generation request');
    
    const body = await request.json();
    const { entryIds, clientData } = body as NFERequest;

    if (!entryIds || entryIds.length === 0) {
      return NextResponse.json(
        { error: 'Entry IDs are required' },
        { status: 400 }
      );
    }

    if (!clientData || !clientData.name || !clientData.document) {
      return NextResponse.json(
        { error: 'Client data is required' },
        { status: 400 }
      );
    }

    // Simulate NFE generation
    const nfeNumber = `NFE-${Date.now()}`;
    const nfeData = {
      number: nfeNumber,
      series: '001',
      issuedAt: new Date().toISOString(),
      client: clientData,
      items: entryIds.map((id, index) => ({
        id,
        description: `Serviço de Design #${index + 1}`,
        quantity: 1,
        unitValue: 5000 + (Math.random() * 10000),
        totalValue: 5000 + (Math.random() * 10000)
      })),
      totalValue: entryIds.length * (5000 + (Math.random() * 10000)),
      status: 'issued',
      xmlUrl: `/nfe/${nfeNumber}.xml`,
      pdfUrl: `/nfe/${nfeNumber}.pdf`
    };

    console.log('NFE generated:', nfeData);

    return NextResponse.json({
      success: true,
      nfe: nfeData,
      message: 'NFE gerada com sucesso'
    });
  } catch (error) {
    console.error('Error generating NFE:', error);
    return NextResponse.json(
      { error: 'Failed to generate NFE' },
      { status: 500 }
    );
  }
}