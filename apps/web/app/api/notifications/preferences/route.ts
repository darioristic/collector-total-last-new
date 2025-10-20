import { NextRequest, NextResponse } from 'next/server'

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3003'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = `${NOTIFICATION_SERVICE_URL}/api/notifications/preferences?${searchParams.toString()}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.error || 'Failed to fetch preferences' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying notification preferences request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const url = `${NOTIFICATION_SERVICE_URL}/api/notifications/preferences`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.error || 'Failed to update preferences' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying notification preferences request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
