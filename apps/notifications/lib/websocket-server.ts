import { createServer } from 'http'
import { Server as WebSocketServer } from 'ws'
import { initializeWebSocketServer } from './redis'

export function createNotificationServer() {
  const server = createServer()
  
  // Initialize WebSocket server
  initializeWebSocketServer(server)
  
  return server
}

// Export for use in Next.js API routes
export { initializeWebSocketServer }
