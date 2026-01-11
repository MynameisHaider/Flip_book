import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all books
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'draft', 'published', or null for all

    const where = status ? { status } : {};

    const books = await db.book.findMany({
      where,
      include: {
        topics: {
          orderBy: { order: 'asc' },
          include: {
            _count: {
              select: { pages: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ books });
  } catch (error) {
    console.error('Get books error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new book
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description } = body;

    // Validate input
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create book
    const book = await db.book.create({
      data: {
        title,
        description: description || null,
        status: 'draft',
      },
    });

    return NextResponse.json({
      success: true,
      book,
    }, { status: 201 });
  } catch (error) {
    console.error('Create book error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
