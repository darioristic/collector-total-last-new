import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create test organization
  const organization = await prisma.organization.upsert({
    where: { id: 'test-org-1' },
    update: {},
    create: {
      id: 'test-org-1',
      name: 'Collector Test Company',
      domain: 'collector-test.com',
      subscriptionPlan: 'pro'
    }
  });

  console.log('✅ Created organization:', organization.name);

  // Create test users
  const hashedPassword = await bcrypt.hash('pass123', 12);

  // Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@crm.com' },
    update: {
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true
    },
    create: {
      email: 'admin@crm.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true
    }
  });

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'manager@collector-test.com' },
    update: {
      name: 'John Manager',
      role: 'ADMIN',
      isActive: true
    },
    create: {
      email: 'manager@collector-test.com',
      name: 'John Manager',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true
    }
  });

  // Employee
  const employee = await prisma.user.upsert({
    where: { email: 'employee@collector-test.com' },
    update: {
      name: 'Jane Employee',
      role: 'EMPLOYEE',
      isActive: true
    },
    create: {
      email: 'employee@collector-test.com',
      name: 'Jane Employee',
      password: hashedPassword,
      role: 'EMPLOYEE',
      isActive: true
    }
  });

  console.log('✅ Created users:', { superAdmin: superAdmin.email, admin: admin.email, employee: employee.email });

  // Add users to organization
  await prisma.organizationMember.upsert({
    where: { 
      organizationId_userId: {
        organizationId: organization.id,
        userId: superAdmin.id
      }
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: superAdmin.id,
      role: 'admin'
    }
  });

  await prisma.organizationMember.upsert({
    where: { 
      organizationId_userId: {
        organizationId: organization.id,
        userId: admin.id
      }
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: admin.id,
      role: 'admin'
    }
  });

  await prisma.organizationMember.upsert({
    where: { 
      organizationId_userId: {
        organizationId: organization.id,
        userId: employee.id
      }
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: employee.id,
      role: 'member'
    }
  });

  console.log('✅ Added users to organization');

  // Create user profiles
  await prisma.userProfile.upsert({
    where: { userId: superAdmin.id },
    update: {},
    create: {
      userId: superAdmin.id,
      phone: '+1-555-0100',
      department: 'IT',
      position: 'Super Administrator',
      bio: 'System administrator with full access'
    }
  });

  await prisma.userProfile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      phone: '+1-555-0101',
      department: 'Management',
      position: 'Project Manager',
      bio: 'Experienced project manager'
    }
  });

  await prisma.userProfile.upsert({
    where: { userId: employee.id },
    update: {},
    create: {
      userId: employee.id,
      phone: '+1-555-0102',
      department: 'Sales',
      position: 'Sales Representative',
      bio: 'Dedicated sales professional'
    }
  });

  console.log('✅ Created user profiles');

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('Super Admin: admin@crm.com / pass123');
  console.log('Manager: manager@collector-test.com / pass123');
  console.log('Employee: employee@collector-test.com / pass123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
