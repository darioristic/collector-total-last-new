import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'closed_won', 'closed_lost']).default('new'),
  value: z.number().positive('Value must be positive').optional(),
  assignedToId: z.string().optional(),
  customerId: z.string().optional()
});

// GET /api/crm/leads - List all leads
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
    const assignedToId = searchParams.get('assignedToId') || '';

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

    if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.lead.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        leads,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get leads error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// POST /api/crm/leads - Create new lead
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
    const validatedData = createLeadSchema.parse(body);

    // Check if lead with same email already exists
    if (validatedData.email) {
      const existingLead = await prisma.lead.findFirst({
        where: {
          email: validatedData.email,
          organizationId: payload.organizationId
        }
      });

      if (existingLead) {
        return NextResponse.json(
          { error: 'Lead with this email already exists' },
          { status: 400 }
        );
      }
    }

    // Validate customerId if provided
    if (validatedData.customerId) {
      const customer = await prisma.customer.findFirst({
        where: {
          id: validatedData.customerId,
          organizationId: payload.organizationId
        }
      });

      if (!customer) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 400 }
        );
      }
    }

    const lead = await prisma.lead.create({
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
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: lead
    }, { status: 201 });

  } catch (error) {
    console.error('Create lead error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
