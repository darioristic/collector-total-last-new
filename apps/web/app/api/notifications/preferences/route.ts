import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get user notification preferences from database
    const preferences = await prisma.notificationPreferences.findUnique({
      where: { userId: payload.userId }
    });

    // Return default preferences if none exist
    const defaultPreferences = {
      emailEnabled: true,
      pushEnabled: true,
      smsEnabled: false,
      inAppEnabled: true,
      emailTypes: ['info', 'success', 'warning', 'error'],
      pushTypes: ['info', 'success', 'warning', 'error'],
      smsTypes: ['error'],
      quietHoursStart: null,
      quietHoursEnd: null
    };

    const userPreferences = preferences || defaultPreferences;

    // Format response for UI
    const responseData = {
      global: {
        email: userPreferences.emailEnabled,
        push: userPreferences.pushEnabled,
        inApp: userPreferences.inAppEnabled,
        sms: userPreferences.smsEnabled
      },
      applications: {
        // Mock application preferences - in production, these would be stored separately
        'collector-bot': {
          email: userPreferences.emailEnabled,
          push: userPreferences.pushEnabled,
          inApp: userPreferences.inAppEnabled,
          sms: userPreferences.smsEnabled
        },
        'calendar': {
          email: userPreferences.emailEnabled,
          push: userPreferences.pushEnabled,
          inApp: userPreferences.inAppEnabled,
          sms: false
        },
        'payment': {
          email: userPreferences.emailEnabled,
          push: false,
          inApp: userPreferences.inAppEnabled,
          sms: userPreferences.smsEnabled
        }
      }
    };

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { global } = body; // applications not used in current implementation

    // Update or create notification preferences
    const updatedPreferences = await prisma.notificationPreferences.upsert({
      where: { userId: payload.userId },
      update: {
        emailEnabled: global?.email ?? true,
        pushEnabled: global?.push ?? true,
        smsEnabled: global?.sms ?? false,
        inAppEnabled: global?.inApp ?? true,
        updatedAt: new Date()
      },
      create: {
        userId: payload.userId,
        emailEnabled: global?.email ?? true,
        pushEnabled: global?.push ?? true,
        smsEnabled: global?.sms ?? false,
        inAppEnabled: global?.inApp ?? true
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedPreferences,
      message: 'Notification preferences updated successfully'
    });

  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
