import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all published books
export async function GET(request: NextRequest) {
  try {
    const books = await db.book.findMany({
      where: {
        status: 'published',
      },
      include: {
        topics: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            order: true,
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
