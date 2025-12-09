import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('google_access_token')?.value

    const url = `https://photospicker.googleapis.com/v1/mediaItems?sessionId=${sessionId}`;

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
            console.log('Got photo data successfully:', data)
            return NextResponse.json(data)

        }
        else {
            const errorData = await response.text(); // Use .text() instead of .json()
            console.error(`Failed to get photo data ${sessionId}:`, errorData)
            return NextResponse.json({ error: 'Failed to get photo data', details: errorData }, { status: response.status })
        }


    } catch (error) {
        console.error('Error getting photo data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }


}


