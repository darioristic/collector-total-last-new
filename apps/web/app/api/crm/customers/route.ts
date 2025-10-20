import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(['active', 'inactive', 'potential']).default('active'),
  source: z.string().optional(),
  assignedToId: z.string().optional()
});

// GET /api/crm/customers - List all customers
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      organizationId: payload.organizationId
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          leads: true,
          invoices: true
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.customer.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        customers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get customers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/crm/customers - Create new customer
export async function POST(request: NextRequest) {
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
    const validatedData = createCustomerSchema.parse(body);

    // Check if customer with same email already exists
    if (validatedData.email) {
      const existingCustomer = await prisma.customer.findFirst({
        where: {
          email: validatedData.email,
          organizationId: payload.organizationId
        }
      });

      if (existingCustomer) {
        return NextResponse.json(
          { error: 'Customer with this email already exists' },
          { status: 400 }
        );
      }
    }

    const customer = await prisma.customer.create({
      data: {
        ...validatedData,
        organizationId: payload.organizationId,
        assignedToId: validatedData.assignedToId || payload.userId
      },
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
    }, { status: 201 });

  } catch (error) {
    console.error('Create customer error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
