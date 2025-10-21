import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // For now, return mock data - in production, this would fetch from database
    const mockBilling = {
      currentPlan: {
        id: 'pro',
        name: 'Pro Plan',
        price: 29,
        currency: 'USD',
        interval: 'month',
        status: 'active',
        nextBillingDate: '2024-12-20T00:00:00Z',
        paymentMethod: {
          type: 'card',
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025
        }
      },
      features: [
        'Unlimited projects',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'Team collaboration',
        'API access',
        'Advanced security',
        '99.9% uptime SLA'
      ],
      billingHistory: [
        {
          id: '1',
          date: '2024-11-20T00:00:00Z',
          amount: 29.00,
          currency: 'USD',
          status: 'paid',
          description: 'Pro Plan - Monthly'
        },
        {
          id: '2',
          date: '2024-10-20T00:00:00Z',
          amount: 29.00,
          currency: 'USD',
          status: 'paid',
          description: 'Pro Plan - Monthly'
        },
        {
          id: '3',
          date: '2024-09-20T00:00:00Z',
          amount: 29.00,
          currency: 'USD',
          status: 'paid',
          description: 'Pro Plan - Monthly'
        }
      ]
    };

    return NextResponse.json({
      success: true,
      data: mockBilling
    });

  } catch (error) {
    console.error('Error fetching billing data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { action, planId, paymentMethodId } = body;

    if (action === 'changePlan') {
      if (!planId) {
        return NextResponse.json({ 
          error: 'Plan ID is required' 
        }, { status: 400 });
      }

      // For now, return success - in production, this would:
      // 1. Validate plan exists
      // 2. Calculate proration
      // 3. Update subscription
      // 4. Process payment if needed

      return NextResponse.json({
        success: true,
        message: 'Plan changed successfully'
      });
    }

    if (action === 'updatePaymentMethod') {
      if (!paymentMethodId) {
        return NextResponse.json({ 
          error: 'Payment method ID is required' 
        }, { status: 400 });
      }

      // For now, return success - in production, this would:
      // 1. Validate payment method
      // 2. Update default payment method
      // 3. Update all active subscriptions

      return NextResponse.json({
        success: true,
        message: 'Payment method updated successfully'
      });
    }

    return NextResponse.json({ 
      error: 'Invalid action' 
    }, { status: 400 });

  } catch (error) {
    console.error('Error handling billing:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
