import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedWorkspace() {
  try {
    console.log('🌱 Seeding workspace data...');

    // Check if organization already exists
    const existingOrg = await prisma.organization.findFirst();
    
    if (existingOrg) {
      console.log('✅ Organization already exists:', existingOrg.name);
      return;
    }

    // Create a default organization
    const organization = await prisma.organization.create({
      data: {
        name: 'Collector CRM',
        domain: 'collector.crm',
        subscriptionPlan: 'pro'
      }
    });

    console.log('✅ Created organization:', organization);

    // Create a default user
    const user = await prisma.user.create({
      data: {
        email: 'admin@collector.com',
        name: 'Admin User',
        password: 'hashedpassword', // In real app, this would be properly hashed
        role: 'SUPER_ADMIN'
      }
    });

    console.log('✅ Created user:', user);

    // Create organization member
    const member = await prisma.organizationMember.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        role: 'admin'
      }
    });

    console.log('✅ Created organization member:', member);

    console.log('🎉 Workspace seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding workspace:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedWorkspace();
