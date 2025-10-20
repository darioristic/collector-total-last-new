import admin from 'firebase-admin'
import { Notification } from './types'

// Initialize Firebase Admin SDK only if credentials are available
if (!admin.apps.length && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    })
  } catch (error) {
    console.warn('Firebase initialization failed:', error)
  }
}

export async function sendPushNotification(
  notification: Notification, 
  deviceTokens: string[]
) {
  try {
    if (!admin.apps.length) {
      return {
        success: false,
        error: 'Firebase not initialized'
      }
    }

    const message = {
      notification: {
        title: notification.title,
        body: notification.message,
      },
      data: {
        type: notification.type,
        notification_id: notification.id,
        ...notification.metadata,
      },
      tokens: deviceTokens,
    }

    const response = await admin.messaging().sendMulticast(message)
    
    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses,
    }
  } catch (error) {
    console.error('Push notification sending failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export async function getDeviceTokensForUser(userId: string): Promise<string[]> {
  try {
    const { NotificationDatabase } = await import('./database')
    return await NotificationDatabase.getUserDeviceTokens(userId)
  } catch (error) {
    console.error('Error in getDeviceTokensForUser:', error)
    return []
  }
}
