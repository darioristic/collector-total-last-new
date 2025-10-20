import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const updateCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(['active', 'inactive', 'potential']).optional(),
  source: z.string().optional(),
  assignedToId: z.string().optional()
});

// GET /api/crm/customers/[id] - Get customer by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const customer = await prisma.customer.findFirst({
      where: {
        id: params.id,
        organizationId: payload.organizationId
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        leads: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        invoices: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: customer
    });

  } catch (error) {
    console.error('Get customer error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

// PUT /api/crm/customers/[id] - Update customer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateCustomerSchema.parse(body);

    // Check if customer exists and belongs to organization
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        id: params.id,
        organizationId: payload.organizationId
      }
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if new email already exists
    if (validatedData.email && validatedData.email !== existingCustomer.email) {
      const emailExists = await prisma.customer.findFirst({
        where: {
          email: validatedData.email,
          organizationId: payload.organizationId,
          id: { not: params.id }
        }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Customer with this email already exists' },
          { status: 400 }
        );
      }
    }

    const customer = await prisma.customer.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: customer
    });

  } catch (error) {
    console.error('Update customer error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE /api/crm/customers/[id] - Delete customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if customer exists and belongs to organization
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        id: params.id,
        organizationId: payload.organizationId
      }
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check if customer has associated leads or invoices
    const [leadsCount, invoicesCount] = await Promise.all([
      prisma.lead.count({
        where: { customerId: params.id }
      }),
      prisma.invoice.count({
        where: { customerId: params.id }
      })
    ]);

    if (leadsCount > 0 || invoicesCount > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete customer with associated leads or invoices',
          details: {
            leadsCount,
            invoicesCount
          }
        },
        { status: 400 }
      );
    }

    await prisma.customer.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    });

  } catch (error) {
    console.error('Delete customer error:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
