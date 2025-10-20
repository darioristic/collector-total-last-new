import { NextRequest, NextResponse } from 'next/server'
import { NotificationDatabase, NotificationCache } from '@/lib/database'

// GET /api/notifications/[id] - Get specific notification
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Prvo proveri cache
    const cachedNotification = await NotificationCache.getCachedNotification(params.id)
    if (cachedNotification) {
      return NextResponse.json({ notification: cachedNotification })
    }

    // Dohvati iz baze
    const notification = await NotificationDatabase.getNotificationById(params.id)
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    // Cache notifikaciju
    await NotificationCache.cacheNotification(notification)

    return NextResponse.json({ notification })
  } catch (error) {
    console.error('Error in GET /api/notifications/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/notifications/[id] - Update notification (mark as read, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { read, status, metadata } = body

    let updatedNotification

    if (read !== undefined) {
      if (read) {
        updatedNotification = await NotificationDatabase.markAsRead(params.id)
      }
    } else if (status) {
      // Ažuriraj status (treba dodati u NotificationDatabase)
      updatedNotification = await NotificationDatabase.getNotificationById(params.id)
    }

    if (!updatedNotification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    // Invalidiraj cache
    await NotificationCache.invalidateNotificationCache(params.id)

    return NextResponse.json({ notification: updatedNotification })
  } catch (error) {
    console.error('Error in PUT /api/notifications/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/notifications/[id] - Delete notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await NotificationDatabase.deleteNotification(params.id)

    // Invalidiraj cache
    await NotificationCache.invalidateNotificationCache(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/notifications/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
