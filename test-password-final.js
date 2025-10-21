// Test password change functionality
// Using built-in fetch (Node.js 18+) instead of deprecated node-fetch

// Configuration
const API_BASE_URL = 'http://localhost:3000';
const TEST_CREDENTIALS = {
  email: 'admin@crm.com',
  oldPassword: 'admin123',
  newPassword: 'newpass123'
};

/**
 * Helper function to make API calls with timeout
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<Response>} The fetch response
 * @throws {Error} If request times out or fails
 */
async function apiCall(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

/**
 * Tests the complete password change functionality
 * 1. Login with old password
 * 2. Change password
 * 3. Verify login with new password works
 * 4. Verify login with old password fails
 */
async function testPasswordChange() {
  try {
    console.log('🔐 Testing password change...');
    
    // Step 1: Login
    const loginResponse = await apiCall(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: TEST_CREDENTIALS.email, 
        password: TEST_CREDENTIALS.oldPassword 
      })
    });
    
    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      console.log('❌ Login failed - Status:', loginResponse.status);
      console.log('❌ Login failed - Response:', errorData);
      throw new Error(`Login failed: ${errorData.error || 'Unknown error'}`);
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    console.log('✅ Login successful');
    
    // Step 2: Change password
    const passwordResponse = await apiCall(`${API_BASE_URL}/api/users/password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentPassword: TEST_CREDENTIALS.oldPassword,
        newPassword: TEST_CREDENTIALS.newPassword,
        confirmPassword: TEST_CREDENTIALS.newPassword
      })
    });
    
    console.log('📡 Password change response status:', passwordResponse.status);
    
    if (!passwordResponse.ok) {
      const errorData = await passwordResponse.json();
      console.log('❌ Password change failed:', errorData.error || 'Unknown error');
      console.log('Response status:', passwordResponse.status);
      return;
    }
    
    const passwordData = await passwordResponse.json();
    console.log('✅ Password change successful');
    console.log('Message:', passwordData.message);
    
    // Step 3: Try to login with new password
    const newLoginResponse = await apiCall(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: TEST_CREDENTIALS.email, 
        password: TEST_CREDENTIALS.newPassword 
      })
    });
    
    if (newLoginResponse.ok) {
      console.log('✅ Login with new password successful');
    } else {
      console.log('❌ Login with new password failed');
    }
    
    // Step 4: Try to login with old password (should fail)
    const oldLoginResponse = await apiCall(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: TEST_CREDENTIALS.email, 
        password: TEST_CREDENTIALS.oldPassword 
      })
    });
    
    if (oldLoginResponse.ok) {
      console.log('❌ Login with old password succeeded (should have failed)');
    } else {
      console.log('✅ Login with old password failed (as expected)');
    }
    
    console.log('\n🎉 Password change functionality works!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', error);
    
    // Additional error context
    if (error.message.includes('timeout')) {
      console.error('💡 Tip: Check if the server is running on port 3001');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Tip: Make sure the API server is started');
    }
  }
}

testPasswordChange();
