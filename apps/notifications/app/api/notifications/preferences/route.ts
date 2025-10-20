import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { NotificationDatabase } from '@/lib/database'
import { NotificationPreferences } from '@/lib/types'

const preferencesSchema = z.object({
  user_id: z.string().uuid(),
  email_enabled: z.boolean().optional(),
  push_enabled: z.boolean().optional(),
  sms_enabled: z.boolean().optional(),
  in_app_enabled: z.boolean().optional(),
  email_types: z.array(z.string()).optional(),
  push_types: z.array(z.string()).optional(),
  sms_types: z.array(z.string()).optional(),
  quiet_hours_start: z.string().optional(),
  quiet_hours_end: z.string().optional(),
})

// GET /api/notifications/preferences - Get user notification preferences
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    const preferences = await NotificationDatabase.getUserPreferences(userId)
    
    if (!preferences) {
      // No preferences found, return defaults
      const defaultPreferences: NotificationPreferences = {
        id: '',
        user_id: userId,
        email_enabled: true,
        push_enabled: true,
        sms_enabled: false,
        in_app_enabled: true,
        email_types: ['info', 'success', 'warning', 'error'],
        push_types: ['info', 'success', 'warning', 'error'],
        sms_types: ['error'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      return NextResponse.json({ preferences: defaultPreferences })
    }

    return NextResponse.json({ preferences })
  } catch (error) {
    console.error('Error in GET /api/notifications/preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/notifications/preferences - Create or update notification preferences
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = preferencesSchema.parse(body)

    const result = await NotificationDatabase.upsertUserPreferences(
      validatedData.user_id,
      {
        emailEnabled: validatedData.email_enabled,
        pushEnabled: validatedData.push_enabled,
        smsEnabled: validatedData.sms_enabled,
        inAppEnabled: validatedData.in_app_enabled,
        emailTypes: validatedData.email_types?.join(','),
        pushTypes: validatedData.push_types?.join(','),
        smsTypes: validatedData.sms_types?.join(','),
        quietHoursStart: validatedData.quiet_hours_start,
        quietHoursEnd: validatedData.quiet_hours_end,
      }
    )

    return NextResponse.json({ preferences: result })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }
    console.error('Error in POST /api/notifications/preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
