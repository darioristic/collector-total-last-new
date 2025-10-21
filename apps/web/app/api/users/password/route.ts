import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { verifyToken, verifyPassword, hashPassword } from '@/lib/auth';

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
    const { currentPassword, newPassword, confirmPassword } = body;

    // Validate required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ 
        error: 'All password fields are required' 
      }, { status: 400 });
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ 
        error: 'New password and confirmation do not match' 
      }, { status: 400 });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json({ 
        error: 'Password must be at least 8 characters long' 
      }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ 
        error: 'Current password is incorrect' 
      }, { status: 400 });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password in database
    await prisma.user.update({
      where: { id: payload.userId },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    });

    // Invalidate all user sessions after password change
    await prisma.userDevice.updateMany({
      where: { userId: payload.userId },
      data: { isActive: false }
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully. Please log in again.',
      requiresReauth: true
    });

  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
