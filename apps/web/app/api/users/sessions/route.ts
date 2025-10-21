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

    // Get user devices (sessions) from database
    const userDevices = await prisma.userDevice.findMany({
      where: { 
        userId: payload.userId,
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format sessions data
    const sessions = userDevices.map((device, index) => ({
      id: device.id,
      device: device.deviceType === 'mobile' ? 'Mobile Device' : 'Desktop',
      browser: 'Unknown', // Not stored in current schema
      location: 'Unknown', // Not stored in current schema
      lastActive: device.updatedAt.toISOString(),
      isCurrent: index === 0, // Assume first device is current
      ipAddress: 'Unknown' // Not stored in current schema
    }));

    return NextResponse.json({
      success: true,
      data: sessions
    });

  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ 
        error: 'Session ID is required' 
      }, { status: 400 });
    }

    // Verify session belongs to user and deactivate it
    const updatedDevice = await prisma.userDevice.updateMany({
      where: {
        id: sessionId,
        userId: payload.userId
      },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    });

    if (updatedDevice.count === 0) {
      return NextResponse.json({ 
        error: 'Session not found or does not belong to user' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Session revoked successfully'
    });

  } catch (error) {
    console.error('Error revoking session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
