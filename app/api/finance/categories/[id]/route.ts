import { NextRequest, NextResponse } from 'next/server';
import { categories } from '../route';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log(`DELETE /api/finance/categories/${params.id}`);
  
  try {
    const categoryIndex = categories.findIndex(cat => cat.id === params.id);
    
    if (categoryIndex === -1) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const deletedCategory = categories[categoryIndex];
    categories.splice(categoryIndex, 1);

    console.log('Category deleted:', deletedCategory);
    return NextResponse.json(
      { message: 'Category deleted successfully', category: deletedCategory }
    );
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}