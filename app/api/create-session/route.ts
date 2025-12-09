import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'



export async function POST() {

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('google_access_token')?.value
    if (!accessToken) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const response = await fetch('https://photospicker.googleapis.com/v1/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        })

        console.log('Response status:', response.status)

        if (!response.ok) {
            const error = await response.text()
            console.error('Session creation failed:', error)
            return NextResponse.json({ error: 'Failed to create session', details: error }, { status: response.status })
        }


        const data = await response.json()
        console.log('Session created successfully:', data)
        return NextResponse.json(data)

    } catch (error) {
        console.error('Error creating session:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {

    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
        return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('google_access_token')?.value

    const url = `https://photospicker.googleapis.com/v1/sessions/${sessionId}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('Session ${sessionId} deleted successfully.');
            return NextResponse.json({ message: 'Session deleted successfully.' });

        } else {
            const errorData = await response.json();
            console.error('Failed to delete session ${sessionId}:', errorData);
            return NextResponse.json({ error: 'Failed to delete session' }, { status: response.status })
        }
    } catch (error) {
        console.error('Error deleting session:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


