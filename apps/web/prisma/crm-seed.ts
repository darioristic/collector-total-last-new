import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CRM seed...');

  // Get the test organization
  const organization = await prisma.organization.findUnique({
    where: { id: 'test-org-1' }
  });

  if (!organization) {
    console.log('❌ Test organization not found. Please run the main seed first.');
    return;
  }

  // Get users for assignment
  const users = await prisma.user.findMany({
    where: {
      organizationMembers: {
        some: {
          organizationId: organization.id
        }
      }
    }
  });

  if (users.length === 0) {
    console.log('❌ No users found in organization. Please run the main seed first.');
    return;
  }

  const adminUser = users.find(u => u.role === 'ADMIN') || users[0];

  // Create test customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1-555-0101',
        company: 'Acme Corporation',
        address: '123 Business St, New York, NY 10001',
        status: 'active',
        source: 'website',
        organizationId: organization.id,
        assignedToId: adminUser.id
      }
    }),
    prisma.customer.create({
      data: {
        name: 'TechStart Inc',
        email: 'hello@techstart.com',
        phone: '+1-555-0102',
        company: 'TechStart Inc',
        address: '456 Innovation Ave, San Francisco, CA 94105',
        status: 'active',
        source: 'referral',
        organizationId: organization.id,
        assignedToId: adminUser.id
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Global Solutions Ltd',
        email: 'info@globalsolutions.com',
        phone: '+1-555-0103',
        company: 'Global Solutions Ltd',
        address: '789 Enterprise Blvd, Chicago, IL 60601',
        status: 'potential',
        source: 'cold_call',
        organizationId: organization.id,
        assignedToId: adminUser.id
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0104',
        company: 'Johnson Consulting',
        address: '321 Professional Pl, Boston, MA 02101',
        status: 'active',
        source: 'social_media',
        organizationId: organization.id,
        assignedToId: adminUser.id
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Mike Chen',
        email: 'mike.chen@startup.io',
        phone: '+1-555-0105',
        company: 'StartupIO',
        address: '654 Founder St, Austin, TX 78701',
        status: 'inactive',
        source: 'conference',
        organizationId: organization.id,
        assignedToId: adminUser.id
      }
    })
  ]);

  console.log('✅ Created customers:', customers.length);

  // Create test leads
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        name: 'John Smith',
        email: 'john.smith@newcompany.com',
        phone: '+1-555-0201',
        company: 'New Company LLC',
        source: 'website',
        status: 'new',
        value: 50000,
        organizationId: organization.id,
        assignedToId: adminUser.id
      }
    }),
    prisma.lead.create({
      data: {
        name: 'Emily Davis',
        email: 'emily.davis@innovate.com',
        phone: '+1-555-0202',
        company: 'Innovate Corp',
        source: 'referral',
        status: 'contacted',
        value: 75000,
        organizationId: organization.id,
        assignedToId: adminUser.id
      }
    }),
    prisma.lead.create({
      data: {
        name: 'Robert Wilson',
        email: 'robert.wilson@techcorp.com',
        phone: '+1-555-0203',
        company: 'TechCorp Industries',
        source: 'cold_call',
        status: 'qualified',
        value: 100000,
        organizationId: organization.id,
        assignedToId: adminUser.id
      }
    }),
    prisma.lead.create({
      data: {
        name: 'Lisa Brown',
        email: 'lisa.brown@enterprise.com',
        phone: '+1-555-0204',
        company: 'Enterprise Solutions',
        source: 'conference',
        status: 'proposal',
        value: 150000,
        organizationId: organization.id,
        assignedToId: adminUser.id
      }
    }),
    prisma.lead.create({
      data: {
        name: 'David Miller',
        email: 'david.miller@success.com',
        phone: '+1-555-0205',
        company: 'Success Inc',
        source: 'website',
        status: 'closed_won',
        value: 200000,
        organizationId: organization.id,
        assignedToId: adminUser.id
      }
    }),
    prisma.lead.create({
      data: {
        name: 'Jennifer Taylor',
        email: 'jennifer.taylor@declined.com',
        phone: '+1-555-0206',
        company: 'Declined Corp',
        source: 'referral',
        status: 'closed_lost',
        value: 30000,
        organizationId: organization.id,
        assignedToId: adminUser.id
      }
    })
  ]);

  console.log('✅ Created leads:', leads.length);

  // Create some invoices for existing customers
  const invoices = await Promise.all([
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-001',
        customerId: customers[0].id,
        amount: 25000,
        status: 'paid',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        organizationId: organization.id,
        createdById: adminUser.id
      }
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-002',
        customerId: customers[1].id,
        amount: 15000,
        status: 'sent',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        organizationId: organization.id,
        createdById: adminUser.id
      }
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-003',
        customerId: customers[2].id,
        amount: 35000,
        status: 'draft',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        organizationId: organization.id,
        createdById: adminUser.id
      }
    })
  ]);

  console.log('✅ Created invoices:', invoices.length);

  console.log('🎉 CRM seed completed successfully!');
  console.log('\n📊 CRM Data Summary:');
  console.log(`- Customers: ${customers.length}`);
  console.log(`- Leads: ${leads.length}`);
  console.log(`- Invoices: ${invoices.length}`);
  console.log(`- Total Pipeline Value: $${leads.reduce((sum, lead) => sum + (lead.value || 0), 0).toLocaleString()}`);
}

main()
  .catch((e) => {
    console.error('❌ CRM seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
