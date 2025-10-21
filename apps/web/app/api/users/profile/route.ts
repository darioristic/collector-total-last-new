import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/database';

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

    // Get user with profile data
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        profile: true,
        organizationMembers: {
          include: {
            organization: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Format response data
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      firstName: user.name.split(' ')[0] || '',
      lastName: user.name.split(' ').slice(1).join(' ') || '',
      phone: user.profile?.phone || '',
      bio: user.profile?.bio || '',
      address: '', // Not in current schema
      city: '', // Not in current schema
      state: '', // Not in current schema
      zipCode: '', // Not in current schema
      language: user.profile?.language || 'en',
      role: user.role,
      status: user.isActive ? 'Active' : 'Inactive',
      avatar: '/images/avatars/01.png', // Default avatar
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };

    return NextResponse.json({
      success: true,
      data: userData
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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
    const { firstName, lastName, email, phone, bio, address, city, state, zipCode, language } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ 
        error: 'First name, last name, and email are required' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    // Update user and profile in transaction
    const updatedUser = await prisma.$transaction(async (tx) => {
      // Update user basic info
      const user = await tx.user.update({
        where: { id: payload.userId },
        data: {
          name: `${firstName} ${lastName}`,
          email: email,
          updatedAt: new Date()
        }
      });

      // Update or create profile
      const profile = await tx.userProfile.upsert({
        where: { userId: payload.userId },
        update: {
          phone: phone || null,
          bio: bio || null,
          language: language || 'en',
          updatedAt: new Date()
        },
        create: {
          userId: payload.userId,
          phone: phone || null,
          bio: bio || null,
          language: language || 'en'
        }
      });

      return { user, profile };
    });

    // Format response data
    const userData = {
      id: updatedUser.user.id,
      email: updatedUser.user.email,
      name: updatedUser.user.name,
      firstName: firstName,
      lastName: lastName,
      phone: updatedUser.profile.phone || '',
      bio: updatedUser.profile.bio || '',
      address: address || '',
      city: city || '',
      state: state || '',
      zipCode: zipCode || '',
      language: updatedUser.profile.language || 'en',
      role: updatedUser.user.role,
      status: updatedUser.user.isActive ? 'Active' : 'Inactive',
      avatar: '/images/avatars/01.png',
      updatedAt: updatedUser.user.updatedAt.toISOString()
    };

    return NextResponse.json({
      success: true,
      data: userData,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
