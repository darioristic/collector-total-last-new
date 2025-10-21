import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const createCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  taxId: z.string().optional(),
  registrationNo: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default('Serbia'),
  contactEmail: z.string().email('Invalid email format').optional(),
  contactPhone: z.string().optional(),
  website: z.string().url('Invalid website URL').optional(),
  isTenant: z.boolean().default(false)
});

const updateCompanySchema = createCompanySchema.partial();

// GET /api/finance/companies - List all companies
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
    const isTenant = searchParams.get('isTenant');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      organizationId: payload.organizationId
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { taxId: { contains: search, mode: 'insensitive' } },
        { registrationNo: { contains: search, mode: 'insensitive' } },
        { contactEmail: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (isTenant !== null && isTenant !== undefined) {
      where.isTenant = isTenant === 'true';
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: {
          bankAccounts: true,
          _count: {
            select: {
              offers: true,
              orders: true,
              invoices: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.company.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        companies,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get companies error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

// POST /api/finance/companies - Create new company
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
    const validatedData = createCompanySchema.parse(body);

    // Check if company with same tax ID already exists
    if (validatedData.taxId) {
      const existingCompany = await prisma.company.findFirst({
        where: {
          taxId: validatedData.taxId,
          organizationId: payload.organizationId
        }
      });

      if (existingCompany) {
        return NextResponse.json(
          { error: 'Company with this tax ID already exists' },
          { status: 400 }
        );
      }
    }

    const company = await prisma.company.create({
      data: {
        ...validatedData,
        organizationId: payload.organizationId!
      },
      include: {
        bankAccounts: true
      }
    });

    return NextResponse.json({
      success: true,
      data: company
    }, { status: 201 });

  } catch (error) {
    console.error('Create company error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}
