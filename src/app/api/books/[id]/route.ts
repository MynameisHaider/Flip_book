import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET book by ID with all topics and pages for reading
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await db.book.findUnique({
      where: { id: params.id },
      include: {
        topics: {
          orderBy: { order: 'asc' },
          include: {
            pages: {
              orderBy: { pageNumber: 'asc' },
            },
          },
        },
      },
    });

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Only allow access to published books
    if (book.status !== 'published') {
      return NextResponse.json(
        { error: 'Book not available' },
        { status: 403 }
      );
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error('Get book error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
