import { NextRequest, NextResponse } from 'next/server';

interface FinancialEntry {
  id: string;
  type: 'receita' | 'despesa';
  date: string;
  amount: number;
  category: string;
  description?: string;
  projectId?: string;
  createdAt: string;
}

// Mock database
let entries: FinancialEntry[] = [
  {
    id: '1',
    type: 'receita',
    date: '2025-06-01',
    amount: 15000,
    category: 'Identidade Visual',
    description: 'Projeto completo - Website Corporativo',
    projectId: 'proj-1',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    type: 'despesa',
    date: '2025-06-05',
    amount: 3500,
    category: 'Ferramentas',
    description: 'Adobe Creative Suite - Licença anual',
    createdAt: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching financial entries');
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const projectId = searchParams.get('projectId');

    let filteredEntries = [...entries];

    if (type) {
      filteredEntries = filteredEntries.filter(entry => entry.type === type);
    }

    if (startDate) {
      filteredEntries = filteredEntries.filter(entry => 
        new Date(entry.date) >= new Date(startDate)
      );
    }

    if (endDate) {
      filteredEntries = filteredEntries.filter(entry => 
        new Date(entry.date) <= new Date(endDate)
      );
    }

    if (projectId) {
      filteredEntries = filteredEntries.filter(entry => entry.projectId === projectId);
    }

    console.log('Filtered entries:', filteredEntries.length);
    
    return NextResponse.json(filteredEntries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Creating new financial entry');
    
    const body = await request.json();
    const { type, date, amount, category, description, projectId } = body;

    if (!type || !date || !amount || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newEntry: FinancialEntry = {
      id: `entry-${Date.now()}`,
      type,
      date,
      amount: parseFloat(amount),
      category,
      description,
      projectId,
      createdAt: new Date().toISOString()
    };

    entries.push(newEntry);
    
    console.log('Entry created:', newEntry);
    
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    const initialLength = entries.length;
    entries = entries.filter(entry => entry.id !== id);

    if (entries.length === initialLength) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    console.log('Entry deleted:', id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    );
  }
}