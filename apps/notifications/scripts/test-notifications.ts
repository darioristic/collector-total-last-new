import { notificationService } from '../lib/notification-service'

async function testNotifications() {
  console.log('🧪 Testing Notification Service...\n')

  // Test 1: Send single notification
  console.log('1. Testing single notification...')
  const singleResult = await notificationService.sendNotification({
    user_id: 'user-123',
    title: 'Test Notification',
    message: 'This is a test notification from the notification service',
    type: 'info',
    channels: ['in_app', 'email'],
    metadata: {
      test: true,
      timestamp: new Date().toISOString()
    }
  })
  
  console.log('Single notification result:', singleResult)
  console.log('✅ Single notification test completed\n')

  // Test 2: Send bulk notification
  console.log('2. Testing bulk notification...')
  const bulkResult = await notificationService.sendBulkNotification({
    user_ids: ['user-123', 'user-456', 'user-789'],
    title: 'System Maintenance',
    message: 'The system will be down for maintenance in 1 hour',
    type: 'warning',
    channels: ['in_app', 'email'],
    metadata: {
      maintenance_window: '2024-01-01T02:00:00Z',
      duration: '2 hours'
    }
  })
  
  console.log('Bulk notification result:', bulkResult)
  console.log('✅ Bulk notification test completed\n')

  // Test 3: Send task assigned notification
  console.log('3. Testing task assigned notification...')
  const taskResult = await notificationService.sendTaskAssignedNotification(
    'user-123',
    'Fix login bug',
    'Web Application',
    'John Doe'
  )
  
  console.log('Task assigned result:', taskResult)
  console.log('✅ Task assigned notification test completed\n')

  // Test 4: Send invoice overdue notification
  console.log('4. Testing invoice overdue notification...')
  const invoiceResult = await notificationService.sendInvoiceOverdueNotification(
    'user-123',
    'INV-2024-001',
    1500.00,
    5
  )
  
  console.log('Invoice overdue result:', invoiceResult)
  console.log('✅ Invoice overdue notification test completed\n')

  // Test 5: Send leave request notification
  console.log('5. Testing leave request notification...')
  const leaveResult = await notificationService.sendLeaveRequestNotification(
    'user-456',
    'Jane Smith',
    'Vacation',
    '2024-01-15',
    '2024-01-20'
  )
  
  console.log('Leave request result:', leaveResult)
  console.log('✅ Leave request notification test completed\n')

  // Test 6: Send project deadline notification
  console.log('6. Testing project deadline notification...')
  const deadlineResult = await notificationService.sendProjectDeadlineNotification(
    'user-123',
    'E-commerce Platform',
    '2024-01-31',
    3
  )
  
  console.log('Project deadline result:', deadlineResult)
  console.log('✅ Project deadline notification test completed\n')

  // Test 7: Get user notifications
  console.log('7. Testing get user notifications...')
  const getResult = await notificationService.getUserNotifications('user-123', {
    limit: 10,
    unreadOnly: false
  })
  
  console.log('Get notifications result:', getResult)
  console.log('✅ Get notifications test completed\n')

  // Test 8: Get user preferences
  console.log('8. Testing get user preferences...')
  const preferencesResult = await notificationService.getUserPreferences('user-123')
  
  console.log('Get preferences result:', preferencesResult)
  console.log('✅ Get preferences test completed\n')

  console.log('🎉 All notification tests completed!')
}

// Run tests if this file is executed directly
if (require.main === module) {
  testNotifications().catch(console.error)
}

export { testNotifications }
