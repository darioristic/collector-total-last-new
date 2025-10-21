import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/database';

// GET /api/workspace - Get workspace information
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching workspace data...');
    
    // Check for auth token in cookies
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('No auth token found, returning default workspace data');
      // Return default workspace data if no auth token
      const defaultWorkspace = {
        id: 'default-workspace',
        name: 'Collector CRM',
        domain: 'collector.crm',
        subscriptionPlan: 'free',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        memberCount: 1
      };
      return NextResponse.json(defaultWorkspace);
    }
    
    // Verify token
    const payload = verifyToken(authToken);
    if (!payload) {
      console.log('Invalid token, returning default workspace data');
      // Return default workspace data if token is invalid
      const defaultWorkspace = {
        id: 'default-workspace',
        name: 'Collector CRM',
        domain: 'collector.crm',
        subscriptionPlan: 'free',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        memberCount: 1
      };
      return NextResponse.json(defaultWorkspace);
    }
    
    console.log('Token verified for user:', payload.userId);

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        organizationMembers: {
          include: {
            organization: true
          }
        }
      }
    });

    if (!user || !user.organizationMembers[0]) {
      console.log('User organization not found, returning default workspace data');
      const defaultWorkspace = {
        id: 'default-workspace',
        name: 'Collector CRM',
        domain: 'collector.crm',
        subscriptionPlan: 'free',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        memberCount: 1
      };
      return NextResponse.json(defaultWorkspace);
    }

    const organization = user.organizationMembers[0].organization;
    
    // Get member count
    const memberCount = await prisma.organizationMember.count({
      where: { organizationId: organization.id }
    });

    const workspace = {
      id: organization.id,
      name: organization.name,
      domain: organization.domain || 'collector.crm',
      subscriptionPlan: organization.subscriptionPlan || 'free',
      createdAt: organization.createdAt.toISOString(),
      updatedAt: organization.updatedAt.toISOString(),
      memberCount
    };

    console.log('Returning workspace data:', workspace);
    return NextResponse.json(workspace);
  } catch (error) {
    console.error('Error fetching workspace:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/workspace - Update workspace information
export async function PUT(request: NextRequest) {
  try {
    console.log('Updating workspace data...');
    const body = await request.json();
    console.log('Request body:', body);
    
    const { name, domain, subscriptionPlan } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Check for auth token in cookies
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('No auth token found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify token
    const payload = verifyToken(authToken);
    if (!payload) {
      console.log('Invalid token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    console.log('Token verified for user:', payload.userId);

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        organizationMembers: {
          include: {
            organization: true
          }
        }
      }
    });

    if (!user || !user.organizationMembers[0]) {
      return NextResponse.json({ error: 'User organization not found' }, { status: 404 });
    }

    const organization = user.organizationMembers[0].organization;

    // Update organization
    const updatedOrganization = await prisma.organization.update({
      where: { id: organization.id },
      data: {
        name: name,
        domain: domain || organization.domain,
        subscriptionPlan: subscriptionPlan || organization.subscriptionPlan,
        updatedAt: new Date()
      }
    });

    // Get member count
    const memberCount = await prisma.organizationMember.count({
      where: { organizationId: organization.id }
    });

    const updatedWorkspace = {
      id: updatedOrganization.id,
      name: updatedOrganization.name,
      domain: updatedOrganization.domain || 'collector.crm',
      subscriptionPlan: updatedOrganization.subscriptionPlan || 'free',
      createdAt: updatedOrganization.createdAt.toISOString(),
      updatedAt: updatedOrganization.updatedAt.toISOString(),
      memberCount
    };

    console.log('Workspace data updated successfully:', updatedWorkspace);

    return NextResponse.json(updatedWorkspace);
  } catch (error) {
    console.error('Error updating workspace:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
