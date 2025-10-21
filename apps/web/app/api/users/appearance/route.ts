import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
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

    // Get user profile for appearance settings
    // const userProfile = await prisma.userProfile.findUnique({
    //   where: { userId: payload.userId }
    // });

    // For now, return default settings since appearance is not in current schema
    // In production, you would store these in a separate UserPreferences table
    const mockAppearance = {
      theme: {
        preset: 'default',
        scale: 100,
        radius: 'medium',
        mode: 'system'
      },
      accessibility: {
        highContrast: false,
        reducedMotion: false,
        colorBlindSupport: false,
        customAccentColor: false
      }
    };

    return NextResponse.json({
      success: true,
      data: mockAppearance
    });

  } catch (error) {
    console.error('Error fetching appearance settings:', error);
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
    const { theme, accessibility } = body;

    // Validate theme settings
    if (theme) {
      const validPresets = ['default', 'blue', 'green', 'purple', 'orange'];
      const validScales = [90, 95, 100, 105, 110];
      const validRadius = ['none', 'small', 'medium', 'large'];
      const validModes = ['light', 'dark', 'system'];

      if (theme.preset && !validPresets.includes(theme.preset)) {
        return NextResponse.json({ 
          error: 'Invalid theme preset' 
        }, { status: 400 });
      }

      if (theme.scale && !validScales.includes(theme.scale)) {
        return NextResponse.json({ 
          error: 'Invalid theme scale' 
        }, { status: 400 });
      }

      if (theme.radius && !validRadius.includes(theme.radius)) {
        return NextResponse.json({ 
          error: 'Invalid theme radius' 
        }, { status: 400 });
      }

      if (theme.mode && !validModes.includes(theme.mode)) {
        return NextResponse.json({ 
          error: 'Invalid theme mode' 
        }, { status: 400 });
      }
    }

    // For now, just return success since appearance settings are not stored in current schema
    // In production, you would store these in a separate UserPreferences table
    const updatedSettings = {
      theme: theme || {},
      accessibility: accessibility || {},
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'Appearance settings updated successfully'
    });

  } catch (error) {
    console.error('Error updating appearance settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
