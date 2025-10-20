import { NextRequest, NextResponse } from 'next/server';
import { collectorBot } from '@/lib/collector-bot';

// PUT /api/collector-bot/[id] - Označi notifikaciju kao pročitanu
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    collectorBot.markAsRead(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: 'Failed to mark notification as read' }, { status: 500 });
  }
}
