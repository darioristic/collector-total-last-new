import { supabase } from './supabase'
import { sendEmailNotification } from './email'
import { sendPushNotification, getDeviceTokensForUser } from './push'
import { CreateNotificationRequest, SendNotificationRequest, Notification } from './types'

export class NotificationService {
  private baseUrl: string

  constructor(baseUrl: string = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3003') {
    this.baseUrl = baseUrl
  }

  // Send notification to a single user
  async sendNotification(request: CreateNotificationRequest): Promise<{
    success: boolean
    notification?: Notification
    delivery_results?: any[]
    error?: string
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send notification')
      }

      const data = await response.json()
      return {
        success: true,
        notification: data.notification,
        delivery_results: data.delivery_results,
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Send notification to multiple users
  async sendBulkNotification(request: SendNotificationRequest): Promise<{
    success: boolean
    notifications?: Notification[]
    delivery_results?: any[]
    error?: string
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send bulk notification')
      }

      const data = await response.json()
      return {
        success: true,
        notifications: data.notifications,
        delivery_results: data.delivery_results,
      }
    } catch (error) {
      console.error('Error sending bulk notification:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Get notifications for a user
  async getUserNotifications(
    userId: string,
    options: {
      limit?: number
      offset?: number
      unreadOnly?: boolean
    } = {}
  ): Promise<{
    success: boolean
    notifications?: Notification[]
    error?: string
  }> {
    try {
      const params = new URLSearchParams({
        user_id: userId,
        limit: (options.limit || 50).toString(),
        offset: (options.offset || 0).toString(),
        unread_only: (options.unreadOnly || false).toString(),
      })

      const response = await fetch(`${this.baseUrl}/api/notifications?${params}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch notifications')
      }

      const data = await response.json()
      return {
        success: true,
        notifications: data.notifications,
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to mark notification as read')
      }

      return { success: true }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Get user notification preferences
  async getUserPreferences(userId: string): Promise<{
    success: boolean
    preferences?: any
    error?: string
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/notifications/preferences?user_id=${userId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch preferences')
      }

      const data = await response.json()
      return {
        success: true,
        preferences: data.preferences,
      }
    } catch (error) {
      console.error('Error fetching preferences:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Update user notification preferences
  async updateUserPreferences(
    userId: string,
    preferences: any
  ): Promise<{
    success: boolean
    preferences?: any
    error?: string
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/notifications/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, ...preferences }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update preferences')
      }

      const data = await response.json()
      return {
        success: true,
        preferences: data.preferences,
      }
    } catch (error) {
      console.error('Error updating preferences:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Helper method to send common notification types
  async sendTaskAssignedNotification(
    userId: string,
    taskTitle: string,
    projectName: string,
    assignerName: string
  ) {
    return this.sendNotification({
      user_id: userId,
      title: 'New Task Assigned',
      message: `${assignerName} assigned you a new task: "${taskTitle}" in project "${projectName}"`,
      type: 'info',
      channels: ['in_app', 'email'],
      metadata: {
        type: 'task_assigned',
        task_title: taskTitle,
        project_name: projectName,
        assigner_name: assignerName,
      },
    })
  }

  async sendInvoiceOverdueNotification(
    userId: string,
    invoiceNumber: string,
    amount: number,
    daysOverdue: number
  ) {
    return this.sendNotification({
      user_id: userId,
      title: 'Invoice Overdue',
      message: `Invoice ${invoiceNumber} for $${amount} is ${daysOverdue} days overdue`,
      type: 'warning',
      channels: ['in_app', 'email'],
      metadata: {
        type: 'invoice_overdue',
        invoice_number: invoiceNumber,
        amount,
        days_overdue: daysOverdue,
      },
    })
  }

  async sendLeaveRequestNotification(
    userId: string,
    employeeName: string,
    leaveType: string,
    startDate: string,
    endDate: string
  ) {
    return this.sendNotification({
      user_id: userId,
      title: 'Leave Request',
      message: `${employeeName} requested ${leaveType} leave from ${startDate} to ${endDate}`,
      type: 'confirm',
      channels: ['in_app', 'email'],
      metadata: {
        type: 'leave_request',
        employee_name: employeeName,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        actions: [
          { type: 'accept', label: 'Approve' },
          { type: 'reject', label: 'Reject' },
        ],
      },
    })
  }

  async sendProjectDeadlineNotification(
    userId: string,
    projectName: string,
    deadline: string,
    daysRemaining: number
  ) {
    return this.sendNotification({
      user_id: userId,
      title: 'Project Deadline Approaching',
      message: `Project "${projectName}" deadline is in ${daysRemaining} days (${deadline})`,
      type: daysRemaining <= 1 ? 'error' : 'warning',
      channels: ['in_app', 'email'],
      metadata: {
        type: 'project_deadline',
        project_name: projectName,
        deadline,
        days_remaining: daysRemaining,
      },
    })
  }
}

// Export singleton instance
export const notificationService = new NotificationService()
