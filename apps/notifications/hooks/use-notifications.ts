import { useState, useEffect, useCallback } from 'react'
import { notificationRealtime } from '@/lib/realtime'
import { Notification } from '@/lib/types'

interface UseNotificationsOptions {
  userId: string
  autoSubscribe?: boolean
}

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  markAsRead: (notificationId: string) => Promise<boolean>
  markAllAsRead: () => Promise<boolean>
  refreshNotifications: () => Promise<void>
}

export function useNotifications({ 
  userId, 
  autoSubscribe = true 
}: UseNotificationsOptions): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/notifications?user_id=${userId}&limit=50`)
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }

      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching notifications:', err)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationRealtime.getUnreadCount(userId)
      setUnreadCount(count)
    } catch (err) {
      console.error('Error fetching unread count:', err)
    }
  }, [userId])

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string): Promise<boolean> => {
    try {
      const success = await notificationRealtime.markAsRead(notificationId)
      if (success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read_at: new Date().toISOString() }
              : notification
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      return success
    } catch (err) {
      console.error('Error marking notification as read:', err)
      return false
    }
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    try {
      const success = await notificationRealtime.markAllAsRead(userId)
      if (success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => ({
            ...notification,
            read_at: notification.read_at || new Date().toISOString()
          }))
        )
        setUnreadCount(0)
      }
      return success
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
      return false
    }
  }, [userId])

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    await Promise.all([fetchNotifications(), fetchUnreadCount()])
  }, [fetchNotifications, fetchUnreadCount])

  // Handle new notification
  const handleNewNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev])
    if (!notification.read_at) {
      setUnreadCount(prev => prev + 1)
    }
  }, [])

  // Handle notification update
  const handleNotificationUpdate = useCallback((notification: Notification) => {
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? notification : n)
    )
    
    // Update unread count if read status changed
    if (notification.read_at) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }, [])

  // Handle count change
  const handleCountChange = useCallback((count: number) => {
    setUnreadCount(count)
  }, [])

  // Handle errors
  const handleError = useCallback((err: any) => {
    setError(err.message || 'Real-time connection error')
    console.error('Real-time notification error:', err)
  }, [])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!autoSubscribe || !userId) return

    // Subscribe to notifications
    notificationRealtime.subscribeToUserNotifications(
      userId,
      handleNewNotification,
      handleError
    )

    // Subscribe to notification count
    notificationRealtime.subscribeToNotificationCount(
      userId,
      handleCountChange,
      handleError
    )

    // Initial fetch
    refreshNotifications()

    // Cleanup
    return () => {
      notificationRealtime.unsubscribeFromUserNotifications(userId)
      notificationRealtime.unsubscribeFromNotificationCount(userId)
    }
  }, [userId, autoSubscribe, handleNewNotification, handleNotificationUpdate, handleCountChange, handleError, refreshNotifications])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  }
}
