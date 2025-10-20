import { NextRequest, NextResponse } from 'next/server';
import { blacklistToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'No token provided'
      }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    
    // Blacklist token
    await blacklistToken(token);
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Logout failed'
    }, { status: 500 });
  }
}
