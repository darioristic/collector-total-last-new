import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // For now, return mock data - in production, this would fetch from database
    const mockTwoFA = {
      enabled: false,
      qrCode: null,
      backupCodes: [],
      lastUsed: null
    };

    return NextResponse.json({
      success: true,
      data: mockTwoFA
    });

  } catch (error) {
    console.error('Error fetching 2FA status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { action, code } = body;

    if (action === 'enable') {
      // For now, return mock QR code - in production, this would:
      // 1. Generate secret key
      // 2. Generate QR code
      // 3. Return QR code and backup codes
      
      const mockQRCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      const mockBackupCodes = [
        '12345678',
        '87654321',
        '11111111',
        '22222222',
        '33333333',
        '44444444',
        '55555555',
        '66666666'
      ];

      return NextResponse.json({
        success: true,
        data: {
          qrCode: mockQRCode,
          backupCodes: mockBackupCodes,
          secret: 'mock-secret-key'
        }
      });
    }

    if (action === 'verify') {
      if (!code) {
        return NextResponse.json({ 
          error: 'Verification code is required' 
        }, { status: 400 });
      }

      // For now, accept any 6-digit code - in production, this would verify TOTP
      if (code.length === 6 && /^\d+$/.test(code)) {
        return NextResponse.json({
          success: true,
          message: '2FA enabled successfully'
        });
      } else {
        return NextResponse.json({ 
          error: 'Invalid verification code' 
        }, { status: 400 });
      }
    }

    if (action === 'disable') {
      if (!code) {
        return NextResponse.json({ 
          error: 'Verification code is required to disable 2FA' 
        }, { status: 400 });
      }

      // For now, accept any 6-digit code - in production, this would verify TOTP
      if (code.length === 6 && /^\d+$/.test(code)) {
        return NextResponse.json({
          success: true,
          message: '2FA disabled successfully'
        });
      } else {
        return NextResponse.json({ 
          error: 'Invalid verification code' 
        }, { status: 400 });
      }
    }

    return NextResponse.json({ 
      error: 'Invalid action' 
    }, { status: 400 });

  } catch (error) {
    console.error('Error handling 2FA:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
