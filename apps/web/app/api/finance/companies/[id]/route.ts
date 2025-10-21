import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const updateCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required').optional(),
  taxId: z.string().optional(),
  registrationNo: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  contactEmail: z.string().email('Invalid email format').optional(),
  contactPhone: z.string().optional(),
  website: z.string().url('Invalid website URL').optional(),
  isTenant: z.boolean().optional()
});

// GET /api/finance/companies/[id] - Get company by ID
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

    const company = await prisma.company.findFirst({
      where: {
        id: params.id,
        organizationId: payload.organizationId
      },
      include: {
        bankAccounts: true,
        offers: {
          select: {
            id: true,
            offerNo: true,
            status: true,
            total: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        orders: {
          select: {
            id: true,
            orderNo: true,
            status: true,
            orderDate: true
          },
          orderBy: { orderDate: 'desc' },
          take: 5
        },
        invoices: {
          select: {
            id: true,
            invoiceNo: true,
            status: true,
            total: true,
            issueDate: true
          },
          orderBy: { issueDate: 'desc' },
          take: 5
        }
      }
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: company
    });

  } catch (error) {
    console.error('Get company error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    );
  }
}

// PUT /api/finance/companies/[id] - Update company
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
    const validatedData = updateCompanySchema.parse(body);

    // Check if company exists and belongs to organization
    const existingCompany = await prisma.company.findFirst({
      where: {
        id: params.id,
        organizationId: payload.organizationId
      }
    });

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Check if tax ID is being changed and if it conflicts
    if (validatedData.taxId && validatedData.taxId !== existingCompany.taxId) {
      const conflictingCompany = await prisma.company.findFirst({
        where: {
          taxId: validatedData.taxId,
          organizationId: payload.organizationId,
          id: { not: params.id }
        }
      });

      if (conflictingCompany) {
        return NextResponse.json(
          { error: 'Company with this tax ID already exists' },
          { status: 400 }
        );
      }
    }

    const updatedCompany = await prisma.company.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        bankAccounts: true
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedCompany
    });

  } catch (error) {
    console.error('Update company error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    );
  }
}

// DELETE /api/finance/companies/[id] - Delete company
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

    // Check if company exists and belongs to organization
    const existingCompany = await prisma.company.findFirst({
      where: {
        id: params.id,
        organizationId: payload.organizationId
      },
      include: {
        _count: {
          select: {
            offers: true,
            orders: true,
            invoices: true
          }
        }
      }
    });

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Check if company has related records
    const hasRelatedRecords = 
      existingCompany._count.offers > 0 ||
      existingCompany._count.orders > 0 ||
      existingCompany._count.invoices > 0;

    if (hasRelatedRecords) {
      return NextResponse.json(
        { 
          error: 'Cannot delete company with existing offers, orders, or invoices',
          details: {
            offers: existingCompany._count.offers,
            orders: existingCompany._count.orders,
            invoices: existingCompany._count.invoices
          }
        },
        { status: 400 }
      );
    }

    await prisma.company.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Company deleted successfully'
    });

  } catch (error) {
    console.error('Delete company error:', error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    );
  }
}
