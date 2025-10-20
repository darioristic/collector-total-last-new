import { supabaseClient } from './supabase'
import { Notification } from './types'

export class NotificationRealtime {
  private subscriptions: Map<string, any> = new Map()

  // Subscribe to notifications for a specific user
  subscribeToUserNotifications(
    userId: string, 
    onNotification: (notification: Notification) => void,
    onError?: (error: any) => void
  ) {
    const subscription = supabaseClient
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload: any) => {
          console.log('New notification received:', payload.new)
          onNotification(payload.new as Notification)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload: any) => {
          console.log('Notification updated:', payload.new)
          onNotification(payload.new as Notification)
        }
      )
      .subscribe((status: any) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to notifications for user ${userId}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to notifications')
          onError?.(new Error('Failed to subscribe to notifications'))
        }
      })

    this.subscriptions.set(userId, subscription)
    return subscription
  }

  // Subscribe to notification count changes
  subscribeToNotificationCount(
    userId: string,
    onCountChange: (count: number) => void,
    onError?: (error: any) => void
  ) {
    const subscription = supabaseClient
      .channel(`notification_count:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        async () => {
          // Fetch updated count
          const { count, error } = await supabaseClient
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .is('read_at', null)

          if (error) {
            console.error('Error fetching notification count:', error)
            onError?.(error)
          } else {
            onCountChange(count || 0)
          }
        }
      )
      .subscribe((status: any) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to notification count for user ${userId}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to notification count')
          onError?.(new Error('Failed to subscribe to notification count'))
        }
      })

    this.subscriptions.set(`count:${userId}`, subscription)
    return subscription
  }

  // Unsubscribe from notifications for a specific user
  unsubscribeFromUserNotifications(userId: string) {
    const subscription = this.subscriptions.get(userId)
    if (subscription) {
      supabaseClient.removeChannel(subscription)
      this.subscriptions.delete(userId)
      console.log(`Unsubscribed from notifications for user ${userId}`)
    }
  }

  // Unsubscribe from notification count
  unsubscribeFromNotificationCount(userId: string) {
    const subscription = this.subscriptions.get(`count:${userId}`)
    if (subscription) {
      supabaseClient.removeChannel(subscription)
      this.subscriptions.delete(`count:${userId}`)
      console.log(`Unsubscribed from notification count for user ${userId}`)
    }
  }

  // Unsubscribe from all notifications
  unsubscribeAll() {
    this.subscriptions.forEach((subscription, key) => {
      supabaseClient.removeChannel(subscription)
      console.log(`Unsubscribed from ${key}`)
    })
    this.subscriptions.clear()
  }

  // Get current unread notification count
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabaseClient
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .is('read_at', null)

    if (error) {
      console.error('Error fetching unread count:', error)
      return 0
    }

    return count || 0
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    const { error } = await supabaseClient
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId)

    if (error) {
      console.error('Error marking notification as read:', error)
      return false
    }

    return true
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<boolean> {
    const { error } = await supabaseClient
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('read_at', null)

    if (error) {
      console.error('Error marking all notifications as read:', error)
      return false
    }

    return true
  }
}

// Export singleton instance
export const notificationRealtime = new NotificationRealtime()
