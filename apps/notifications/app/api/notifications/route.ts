import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { NotificationDatabase } from '@/lib/database'
import { sendEmailNotification } from '@/lib/email'
import { sendPushNotification, getDeviceTokensForUser } from '@/lib/push'
import { CreateNotificationRequest, SendNotificationRequest } from '@/lib/types'

const createNotificationSchema = z.object({
  user_id: z.string().uuid(),
  title: z.string().min(1).max(255),
  message: z.string().min(1).max(1000),
  type: z.enum(['info', 'success', 'warning', 'error', 'confirm']),
  channels: z.array(z.enum(['in_app', 'email', 'push', 'sms'])).min(1),
  metadata: z.record(z.any()).optional(),
  expires_at: z.string().datetime().optional(),
})

const sendNotificationSchema = z.object({
  user_ids: z.array(z.string().uuid()).min(1),
  title: z.string().min(1).max(255),
  message: z.string().min(1).max(1000),
  type: z.enum(['info', 'success', 'warning', 'error', 'confirm']),
  channels: z.array(z.enum(['in_app', 'email', 'push', 'sms'])).min(1),
  metadata: z.record(z.any()).optional(),
  expires_at: z.string().datetime().optional(),
})

// GET /api/notifications - Get notifications for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const unreadOnly = searchParams.get('unread_only') === 'true'

    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    try {
      // Dohvati iz baze
      const notifications = await NotificationDatabase.getUserNotifications(userId, {
        limit,
        offset,
        unreadOnly
      })

      return NextResponse.json({ notifications })
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in GET /api/notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/notifications - Create and send notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Check if it's a bulk send request
    if (body.user_ids && Array.isArray(body.user_ids)) {
      return handleBulkSend(body)
    } else {
      return handleSingleSend(body)
    }
  } catch (error) {
    console.error('Error in POST /api/notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleSingleSend(body: any) {
  try {
    const validatedData = createNotificationSchema.parse(body)
    
    // Create notification record
    const notification = await NotificationDatabase.createNotification({
      userId: validatedData.user_id,
      title: validatedData.title,
      message: validatedData.message,
      type: validatedData.type,
      channel: validatedData.channels[0], // Store primary channel
      status: 'pending',
      metadata: validatedData.metadata,
      expiresAt: validatedData.expires_at ? new Date(validatedData.expires_at) : undefined,
    })

    // Send notifications through requested channels
    const results = await sendNotificationThroughChannels(notification, validatedData.channels)

    return NextResponse.json({ 
      notification, 
      delivery_results: results 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }
    console.error('Error in handleSingleSend:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleBulkSend(body: any) {
  try {
    const validatedData = sendNotificationSchema.parse(body)
    
    // Create notification records for all users
    const createdNotifications = await Promise.all(
      validatedData.user_ids.map(userId => 
        NotificationDatabase.createNotification({
          userId,
          title: validatedData.title,
          message: validatedData.message,
          type: validatedData.type,
          channel: validatedData.channels[0],
          status: 'pending',
          metadata: validatedData.metadata,
          expiresAt: validatedData.expires_at ? new Date(validatedData.expires_at) : undefined,
        })
      )
    )

    // Send notifications through requested channels for each user
    const results = await Promise.all(
      createdNotifications.map(notification => 
        sendNotificationThroughChannels(notification, validatedData.channels)
      )
    )

    return NextResponse.json({ 
      notifications: createdNotifications, 
      delivery_results: results 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }
    console.error('Error in handleBulkSend:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function sendNotificationThroughChannels(notification: any, channels: string[]) {
  const results = []

  for (const channel of channels) {
    try {
      switch (channel) {
        case 'in_app':
          // In-app notifications are already stored in database
          await NotificationDatabase.markAsRead(notification.id)
          results.push({ channel: 'in_app', success: true })
          break

        case 'email':
          // Get user email (ovo treba implementirati u UserDatabase klasi)
          // Za sada koristimo dummy email
          const userEmail = `user-${notification.userId}@example.com`
          const emailResult = await sendEmailNotification(notification, userEmail)
          results.push({ channel: 'email', ...emailResult })
          break

        case 'push':
          const deviceTokens = await getDeviceTokensForUser(notification.user_id)
          if (deviceTokens.length > 0) {
            const pushResult = await sendPushNotification(notification, deviceTokens)
            results.push({ channel: 'push', ...pushResult })
          } else {
            results.push({ channel: 'push', success: false, error: 'No device tokens found' })
          }
          break

        case 'sms':
          // SMS implementation would go here
          results.push({ channel: 'sms', success: false, error: 'SMS not implemented yet' })
          break
      }
    } catch (error) {
      results.push({ 
        channel, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }

  return results
}
