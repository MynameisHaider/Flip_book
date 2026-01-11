import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generatePages } from '@/lib/page-generator';

// GET topics for a book
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');

    if (!bookId) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    const topics = await db.topic.findMany({
      where: { bookId },
      include: {
        pages: {
          orderBy: { pageNumber: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ topics });
  } catch (error) {
    console.error('Get topics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new topic
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookId, title, content, order } = body;

    // Validate input
    if (!bookId || !title || !content) {
      return NextResponse.json(
        { error: 'Book ID, title, and content are required' },
        { status: 400 }
      );
    }

    // Check if book exists
    const book = await db.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Auto-generate pages from content
    const pageContents = generatePages(content);

    // Create topic with pages in a transaction
    const topic = await db.topic.create({
      data: {
        bookId,
        title,
        content,
        order: order || 0,
        pages: {
          create: pageContents.map((pageContent, index) => ({
            pageNumber: index + 1,
            content: pageContent,
          })),
        },
      },
      include: {
        pages: {
          orderBy: { pageNumber: 'asc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      topic,
    }, { status: 201 });
  } catch (error) {
    console.error('Create topic error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
