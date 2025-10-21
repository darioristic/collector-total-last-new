import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

interface WorkspaceSettings {
  userRegistration: boolean;
  emailNotifications: boolean;
  dataBackup: boolean;
  apiAccess: boolean;
}

interface OrganizationWithSettings {
  id: string;
  name: string;
  domain: string | null;
  subscriptionPlan: string | null;
  userRegistration: boolean;
  emailNotifications: boolean;
  dataBackup: boolean;
  apiAccess: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  joinedAt: Date;
  organization: OrganizationWithSettings;
}

interface UserWithOrganization {
  id: string;
  email: string;
  name: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  organizationMembers: OrganizationMember[];
}

// GET /api/workspace/settings - Get workspace settings
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching workspace settings...');
    
    // Check for auth token in cookies
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('No auth token found, returning default settings');
      // Return default settings if no auth token
      const settings = {
        userRegistration: true,
        emailNotifications: true,
        dataBackup: true,
        apiAccess: false,
      };
      return NextResponse.json(settings);
    }
    
    // Verify token
    const payload = verifyToken(authToken);
    if (!payload) {
      console.log('Invalid token, returning default settings');
      // Return default settings if token is invalid
      const settings = {
        userRegistration: true,
        emailNotifications: true,
        dataBackup: true,
        apiAccess: false,
      };
      return NextResponse.json(settings);
    }
    
    console.log('Token verified for user:', payload.userId);
    
    // Get the user's organization
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

    const userWithOrg = user as UserWithOrganization;
    if (!userWithOrg || !userWithOrg.organizationMembers || !userWithOrg.organizationMembers[0]) {
      console.log('User organization not found, returning default settings');
      // Return default settings if no organization found
      const settings = {
        userRegistration: true,
        emailNotifications: true,
        dataBackup: true,
        apiAccess: false,
      };
      return NextResponse.json(settings);
    }

    const organization = userWithOrg.organizationMembers[0].organization;
    console.log('Found organization:', organization.id);

    // Return organization settings
    const organizationWithSettings = organization as OrganizationWithSettings;
    const settings: WorkspaceSettings = {
      userRegistration: organizationWithSettings.userRegistration ?? true,
      emailNotifications: organizationWithSettings.emailNotifications ?? true,
      dataBackup: organizationWithSettings.dataBackup ?? true,
      apiAccess: organizationWithSettings.apiAccess ?? false,
    };
    
    console.log('Returning settings:', settings);
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching workspace settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/workspace/settings - Update workspace settings
export async function PUT(request: NextRequest) {
  try {
    console.log('Updating workspace settings...');
    const body = await request.json();
    console.log('Request body:', body);

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

    const userWithOrg = user as UserWithOrganization;
    if (!userWithOrg || !userWithOrg.organizationMembers || !userWithOrg.organizationMembers[0]) {
      return NextResponse.json({ error: 'User organization not found' }, { status: 404 });
    }

    const organization = userWithOrg.organizationMembers[0].organization;

    // Update organization settings
    const updateData: Record<string, boolean | Date> = {
      updatedAt: new Date()
    };

    // Only include fields that exist in the request body
    if (body.userRegistration !== undefined) {
      updateData.userRegistration = body.userRegistration;
    }
    if (body.emailNotifications !== undefined) {
      updateData.emailNotifications = body.emailNotifications;
    }
    if (body.dataBackup !== undefined) {
      updateData.dataBackup = body.dataBackup;
    }
    if (body.apiAccess !== undefined) {
      updateData.apiAccess = body.apiAccess;
    }

    const updatedOrganization = await prisma.organization.update({
      where: { id: organization.id },
      data: updateData
    });

    const organizationWithSettings = updatedOrganization as OrganizationWithSettings;
    const updatedSettings: WorkspaceSettings = {
      userRegistration: organizationWithSettings.userRegistration ?? true,
      emailNotifications: organizationWithSettings.emailNotifications ?? true,
      dataBackup: organizationWithSettings.dataBackup ?? true,
      apiAccess: organizationWithSettings.apiAccess ?? false,
    };

    console.log('Workspace settings updated successfully:', updatedSettings);

    // Return the updated settings
    return NextResponse.json(updatedSettings);

  } catch (error) {
    console.error('Error updating workspace settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
