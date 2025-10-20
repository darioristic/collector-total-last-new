export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'confirm'
  channel: 'in_app' | 'email' | 'push' | 'sms'
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read'
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  read_at?: string
  expires_at?: string
}

export interface NotificationPreferences {
  id: string
  user_id: string
  email_enabled: boolean
  push_enabled: boolean
  sms_enabled: boolean
  in_app_enabled: boolean
  email_types: string[]
  push_types: string[]
  sms_types: string[]
  quiet_hours_start?: string
  quiet_hours_end?: string
  created_at: string
  updated_at: string
}

export interface CreateNotificationRequest {
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'confirm'
  channels: ('in_app' | 'email' | 'push' | 'sms')[]
  metadata?: Record<string, any>
  expires_at?: string
}

export interface SendNotificationRequest {
  user_ids: string[]
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'confirm'
  channels: ('in_app' | 'email' | 'push' | 'sms')[]
  metadata?: Record<string, any>
  expires_at?: string
}
