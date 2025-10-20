import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export async function POST(request: NextRequest) {
  try {
    console.log('Login API called');
    const body = await request.json();
    console.log('Login request body:', { ...body, password: '***' });
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    console.log('Validation passed for:', validatedData.email);
    
    // Login user
    const result = await loginUser(validatedData);
    console.log('Login successful for user:', result.user.email);
    
    return NextResponse.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Login API error:', error);
    
    if (error instanceof z.ZodError) {
      console.log('Validation error:', error.errors);
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.errors
      }, { status: 400 });
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    console.log('Returning error:', errorMessage);
    
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 401 });
  }
}
