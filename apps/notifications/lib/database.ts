import { PrismaClient } from '@prisma/client'
import { NotificationCache } from './redis'

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
})

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

// Database helper funkcije
export class NotificationDatabase {
  // Kreiraj notifikaciju
  static async createNotification(data: {
    userId: string
    title: string
    message: string
    type: string
    channel: string
    status: string
    metadata?: string
    expiresAt?: Date
  }) {
    return await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        channel: data.channel,
        status: data.status,
        metadata: data.metadata,
        expiresAt: data.expiresAt,
      }
    })
  }

  // Dohvati notifikacije za korisnika
  static async getUserNotifications(
    userId: string,
    options: {
      limit?: number
      offset?: number
      unreadOnly?: boolean
    } = {}
  ) {
    const { limit = 50, offset = 0, unreadOnly = false } = options

    const where: any = {
      userId,
      ...(unreadOnly && { readAt: null })
    }

    return await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })
  }

  // Dohvati broj nepročitanih notifikacija
  static async getUnreadCount(userId: string): Promise<number> {
    return await prisma.notification.count({
      where: {
        userId,
        readAt: null
      }
    })
  }

  // Označi notifikaciju kao pročitanu
  static async markAsRead(notificationId: string) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() }
    })
  }

  // Označi sve notifikacije kao pročitane
  static async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: {
        userId,
        readAt: null
      },
      data: { readAt: new Date() }
    })
  }

  // Dohvati notifikaciju po ID
  static async getNotificationById(id: string) {
    return await prisma.notification.findUnique({
      where: { id }
    })
  }

  // Obriši notifikaciju
  static async deleteNotification(id: string) {
    return await prisma.notification.delete({
      where: { id }
    })
  }

  // Dohvati preferencije korisnika
  static async getUserPreferences(userId: string) {
    return await prisma.notificationPreferences.findUnique({
      where: { userId }
    })
  }

  // Kreiraj ili ažuriraj preferencije
  static async upsertUserPreferences(
    userId: string,
    preferences: {
      emailEnabled?: boolean
      pushEnabled?: boolean
      smsEnabled?: boolean
      inAppEnabled?: boolean
      emailTypes?: string
      pushTypes?: string
      smsTypes?: string
      quietHoursStart?: string
      quietHoursEnd?: string
    }
  ) {
    return await prisma.notificationPreferences.upsert({
      where: { userId },
      update: preferences,
      create: {
        userId,
        ...preferences
      }
    })
  }

  // Dohvati device tokeni za korisnika
  static async getUserDeviceTokens(userId: string): Promise<string[]> {
    const devices = await prisma.userDevice.findMany({
      where: {
        userId,
        isActive: true
      },
      select: { deviceToken: true }
    })
    
    return devices.map(device => device.deviceToken)
  }

  // Registruj device token
  static async registerDeviceToken(
    userId: string,
    deviceToken: string,
    deviceType: string
  ) {
    return await prisma.userDevice.upsert({
      where: {
        userId_deviceToken: {
          userId,
          deviceToken
        }
      },
      update: {
        isActive: true,
        deviceType,
        updatedAt: new Date()
      },
      create: {
        userId,
        deviceToken,
        deviceType,
        isActive: true
      }
    })
  }

  // Deaktiviraj device token
  static async deactivateDeviceToken(userId: string, deviceToken: string) {
    return await prisma.userDevice.update({
      where: {
        userId_deviceToken: {
          userId,
          deviceToken
        }
      },
      data: { isActive: false }
    })
  }
}

// Re-export NotificationCache from redis
export { NotificationCache }
