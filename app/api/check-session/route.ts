import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('google_access_token')?.value

    const url = `https://photospicker.googleapis.com/v1/sessions/${sessionId}`;

    if (!sessionId) {
        return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    if (!accessToken) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json()
            console.log('Session created successfully:', data)
            return NextResponse.json(data)

        } else {
            const errorData = await response.json();
            console.error(`Failed to get session data ${sessionId}:`, errorData)
            return NextResponse.json({ error: 'Failed to get session data' }, { status: response.status })
        }


    } catch (error) {
        console.error('Error getting session data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }


}


