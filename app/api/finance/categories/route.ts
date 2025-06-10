import { NextRequest, NextResponse } from 'next/server';

// Mock database - in production, use Vercel KV or Supabase
export let categories = [
  { id: '1', name: 'Projetos de Design', type: 'receita', createdAt: new Date().toISOString() },
  { id: '2', name: 'Consultoria', type: 'receita', createdAt: new Date().toISOString() },
  { id: '3', name: 'Venda de Produtos', type: 'receita', createdAt: new Date().toISOString() },
  { id: '4', name: 'Aluguel', type: 'despesa', createdAt: new Date().toISOString() },
  { id: '5', name: 'Material de Escritório', type: 'despesa', createdAt: new Date().toISOString() },
  { id: '6', name: 'Software/Licenças', type: 'despesa', createdAt: new Date().toISOString() },
  { id: '7', name: 'Marketing', type: 'despesa', createdAt: new Date().toISOString() },
];

export async function GET(request: NextRequest) {
  console.log('GET /api/finance/categories');
  
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type && !['receita', 'despesa'].includes(type)) {
    return NextResponse.json(
      { error: 'Invalid type. Must be "receita" or "despesa"' },
      { status: 400 }
    );
  }

  let filteredCategories = categories;
  if (type) {
    filteredCategories = categories.filter(cat => cat.type === type);
  }

  console.log(`Returning ${filteredCategories.length} categories for type: ${type || 'all'}`);
  return NextResponse.json(filteredCategories);
}

export async function POST(request: NextRequest) {
  console.log('POST /api/finance/categories');
  
  try {
    const body = await request.json();
    const { name, type } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    if (!['receita', 'despesa'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be "receita" or "despesa"' },
        { status: 400 }
      );
    }

    const newCategory = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      type,
      createdAt: new Date().toISOString()
    };

    categories.push(newCategory);

    console.log('Category created:', newCategory);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}