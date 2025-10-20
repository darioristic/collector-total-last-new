import Redis from 'ioredis'
import { WebSocketServer } from 'ws'
import { WebSocket } from 'ws'

// Redis client za caching i pub/sub
export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
})

// WebSocket server za real-time notifikacije
let wss: WebSocketServer | null = null
const connectedClients = new Map<string, Set<WebSocket>>()

export function initializeWebSocketServer(server: any) {
  wss = new WebSocketServer({ server })
  
  wss.on('connection', (ws: WebSocket, request) => {
    const url = new URL(request.url || '', `http://${request.headers.host}`)
    const userId = url.searchParams.get('userId')
    
    if (!userId) {
      ws.close(1008, 'User ID required')
      return
    }

    // Dodaj klijenta u mapu
    if (!connectedClients.has(userId)) {
      connectedClients.set(userId, new Set())
    }
    connectedClients.get(userId)!.add(ws)

    console.log(`User ${userId} connected to notifications`)

    // Handle disconnection
    ws.on('close', () => {
      const userClients = connectedClients.get(userId)
      if (userClients) {
        userClients.delete(ws)
        if (userClients.size === 0) {
          connectedClients.delete(userId)
        }
      }
      console.log(`User ${userId} disconnected from notifications`)
    })

    // Handle ping/pong za keep-alive
    ws.on('pong', () => {
      // Client is alive
    })
  })

  // Redis subscriber za real-time notifikacije
  const subscriber = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  })

  subscriber.subscribe('notifications', (err) => {
    if (err) {
      console.error('Failed to subscribe to notifications channel:', err)
    } else {
      console.log('Subscribed to notifications channel')
    }
  })

  subscriber.on('message', (channel, message) => {
    if (channel === 'notifications') {
      try {
        const notification = JSON.parse(message)
        broadcastToUser(notification.user_id, notification)
      } catch (error) {
        console.error('Error parsing notification message:', error)
      }
    }
  })

  // Keep-alive ping svakih 30 sekundi
  setInterval(() => {
    wss?.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping()
      }
    })
  }, 30000)
}

// Broadcast notifikaciju specifičnom korisniku
export function broadcastToUser(userId: string, notification: any) {
  const userClients = connectedClients.get(userId)
  if (userClients) {
    const message = JSON.stringify({
      type: 'notification',
      data: notification
    })
    
    userClients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message)
      }
    })
  }
}

// Broadcast notifikaciju svim korisnicima
export function broadcastToAll(notification: any) {
  const message = JSON.stringify({
    type: 'notification',
    data: notification
  })
  
  wss?.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message)
    }
  })
}

// Redis cache helper funkcije
export class NotificationCache {
  private static readonly CACHE_PREFIX = 'notification:'
  private static readonly USER_PREFIX = 'user_notifications:'
  private static readonly UNREAD_PREFIX = 'unread_count:'

  // Cache notifikaciju
  static async cacheNotification(notification: any) {
    const key = `${this.CACHE_PREFIX}${notification.id}`
    await redis.setex(key, 3600, JSON.stringify(notification)) // 1 sat cache
  }

  // Dohvati notifikaciju iz cache-a
  static async getCachedNotification(id: string) {
    const key = `${this.CACHE_PREFIX}${id}`
    const cached = await redis.get(key)
    return cached ? JSON.parse(cached) : null
  }

  // Cache korisničke notifikacije
  static async cacheUserNotifications(userId: string, notifications: any[]) {
    const key = `${this.USER_PREFIX}${userId}`
    await redis.setex(key, 300, JSON.stringify(notifications)) // 5 minuta cache
  }

  // Dohvati korisničke notifikacije iz cache-a
  static async getCachedUserNotifications(userId: string) {
    const key = `${this.USER_PREFIX}${userId}`
    const cached = await redis.get(key)
    return cached ? JSON.parse(cached) : null
  }

  // Cache broj nepročitanih notifikacija
  static async cacheUnreadCount(userId: string, count: number) {
    const key = `${this.UNREAD_PREFIX}${userId}`
    await redis.setex(key, 60, count.toString()) // 1 minuta cache
  }

  // Dohvati broj nepročitanih notifikacija iz cache-a
  static async getCachedUnreadCount(userId: string): Promise<number | null> {
    const key = `${this.UNREAD_PREFIX}${userId}`
    const cached = await redis.get(key)
    return cached ? parseInt(cached) : null
  }

  // Invalidiraj cache za korisnika
  static async invalidateUserCache(userId: string) {
    const keys = [
      `${this.USER_PREFIX}${userId}`,
      `${this.UNREAD_PREFIX}${userId}`
    ]
    await redis.del(...keys)
  }

  // Invalidiraj cache za notifikaciju
  static async invalidateNotificationCache(notificationId: string) {
    const key = `${this.CACHE_PREFIX}${notificationId}`
    await redis.del(key)
  }
}

// Redis pub/sub za real-time notifikacije
export class NotificationPublisher {
  private static readonly CHANNEL = 'notifications'

  // Publikuj notifikaciju
  static async publishNotification(notification: any) {
    await redis.publish(this.CHANNEL, JSON.stringify(notification))
  }

  // Publikuj bulk notifikacije
  static async publishBulkNotifications(notifications: any[]) {
    const pipeline = redis.pipeline()
    notifications.forEach(notification => {
      pipeline.publish(this.CHANNEL, JSON.stringify(notification))
    })
    await pipeline.exec()
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await redis.quit()
  wss?.close()
})
