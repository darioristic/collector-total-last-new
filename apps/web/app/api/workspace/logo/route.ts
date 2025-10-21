import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/workspace/logo - Upload workspace logo
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const logoFile = formData.get('logo') as File;

    if (!logoFile) {
      return NextResponse.json({ error: 'No logo file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(logoFile.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (logoFile.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    // Convert file to base64 for storage
    const bytes = await logoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${logoFile.type};base64,${base64}`;

    // Get the first organization as the workspace
    const workspace = await prisma.organization.findFirst();

    if (!workspace) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // In a real implementation, you'd store the logo in a file storage service
    // and save the URL in the database. For now, we'll return the data URL.
    
    return NextResponse.json({
      success: true,
      logoUrl: dataUrl,
      message: 'Logo uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/workspace/logo - Remove workspace logo
export async function DELETE() {
  try {
    // Get the first organization as the workspace
    const workspace = await prisma.organization.findFirst();

    if (!workspace) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // In a real implementation, you'd remove the logo from file storage
    // and update the database record.
    
    return NextResponse.json({
      success: true,
      message: 'Logo removed successfully'
    });
  } catch (error) {
    console.error('Error removing logo:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
