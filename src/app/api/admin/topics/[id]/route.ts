import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generatePages } from '@/lib/page-generator';

// GET topic by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const topic = await db.topic.findUnique({
      where: { id: params.id },
      include: {
        book: true,
        pages: {
          orderBy: { pageNumber: 'asc' },
        },
      },
    });

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ topic });
  } catch (error) {
    console.error('Get topic error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update topic
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, content, order } = body;

    // Check if topic exists
    const existingTopic = await db.topic.findUnique({
      where: { id: params.id },
      include: {
        pages: true,
      },
    });

    if (!existingTopic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    // If content is being updated, regenerate pages
    if (content && content !== existingTopic.content) {
      // Delete existing pages
      await db.page.deleteMany({
        where: { topicId: params.id },
      });

      // Generate new pages
      const pageContents = generatePages(content);

      // Update topic and create new pages in a transaction
      const topic = await db.topic.update({
        where: { id: params.id },
        data: {
          title: title || existingTopic.title,
          content,
          order: order !== undefined ? order : existingTopic.order,
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
      });
    }

    // If only title or order is being updated (no page regeneration needed)
    const topic = await db.topic.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(order !== undefined && { order }),
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
    });
  } catch (error) {
    console.error('Update topic error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE topic
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if topic exists
    const existingTopic = await db.topic.findUnique({
      where: { id: params.id },
    });

    if (!existingTopic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    // Delete topic (will cascade delete pages)
    await db.topic.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Topic deleted successfully',
    });
  } catch (error) {
    console.error('Delete topic error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
