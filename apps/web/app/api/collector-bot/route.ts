import { NextRequest, NextResponse } from 'next/server';
import { collectorBot } from '@/lib/collector-bot';

// GET /api/collector-bot - Dohvati notifikacije
export async function GET() {
  try {
    const notifications = collectorBot.getNotifications();
    const unreadCount = collectorBot.getUnreadCount();
    
    return NextResponse.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching collector bot notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// POST /api/collector-bot - Dodaj novu notifikaciju
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.role === 'System') {
      collectorBot.sendSystemNotification(body.title, body.desc, body.type);
    } else {
      collectorBot.sendUserNotification(body.title, body.desc, body.avatar, body.type);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding notification:', error);
    return NextResponse.json({ error: 'Failed to add notification' }, { status: 500 });
  }
}
