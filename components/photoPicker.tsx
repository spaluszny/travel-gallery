"use client"

import { useState } from 'react'
import Image from 'next/image'

interface PhotoPickerProps {
    accessToken: string
    apiKey: string
}

export default function PhotoPicker({ accessToken, apiKey }: PhotoPickerProps) {
    const [selectedPhotos, setSelectedPhotos] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [polling, setPolling] = useState(false)
    //const [sessionData, setSessionData] = useState()

    const fetchSelectedPhotos = async (sessionId: string) => {
        try {
            const response = await fetch(`/api/get-photos?sessionId=${sessionId}`)
            if (!response.ok) {
                throw new Error('Failed to fetch photos')
            }

            const data = await response.json()
            console.log('Selected photos:', data)
            setSelectedPhotos(data.mediaItems || [])
        } catch (error) {
            console.error('Error fetching photos:', error)
        }
    }

    const startPolling = (sessionId: string) => {
        console.log('Starting to poll with sessionId:', sessionId)
        setPolling(true)

        const intervalId = setInterval(async () => {
            const response = await fetch(`api/check-session?sessionId=${sessionId}`)
            try {
                if (!response.ok) {
                    console.error('Failed to check session')
                    return
                }

                const data = await response.json()
                console.log('Poll result:', data)
                if (data.mediaItemsSet) {
                    clearInterval(intervalId)
                    setPolling(false)
                    console.log('Photos selected! mediaItemsSet is true')
                    fetchSelectedPhotos(sessionId)
                }
            }
            catch (error) {
                console.error('Polling failed', error);
            }
        }, 5000)

    }
    const openPicker = async () => {
        setLoading(true)

        try {
            const response = await fetch('/api/create-session', {
                method: 'POST',
            })
            const data = await response.json()
            console.log('Session created:', data)

            if (data.pickerUri) {
                setSessionId(data.id)
                //setSessionData(data)

                window.open(data.pickerUri + '/autoclose', 'photoPicker', 'width=1000,height=800')

                console.log('Picker opened. Session ID:', data.id)
                console.log('This the data we have', data)
                startPolling(data.id)
            }

        } catch (error) {
            console.error('Error opening picker:', error)
            alert('Failed to open photo picker')
        } finally {
            setLoading(false)
        }
    }

    const deleteSession = async () => {
        if (!sessionId) {
            alert('No session to delete')
            return
        }

        try {
            const response = await fetch(`/api/create-session?sessionId=${sessionId}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                console.log('session deleted', { sessionId })
                setSessionId(null)
                setSelectedPhotos([])
            }

        } catch (error) {
            console.error('Error deleting SessionId:', error)
            alert('Failed delete SessionId')
        }

    }

    return (
        <div>
            <button
                className="disabled:opacity-50 btn-primary"
                disabled={loading}
                onClick={openPicker}
            >
                {loading ? 'Opening Picker...' : 'Add Photos'}
            </button>

            {sessionId && (
                <p className="mt-2 text-sm text-gray-600">
                    Session ID: {sessionId}
                </p>
            )}
            <button className="disabled:opacity-50 btn-primary"
                disabled={!sessionId}
                onClick={deleteSession}
            >
                Delete Selection
            </button>
            {selectedPhotos.map((photo) => {
                const { width, height } = photo.mediaFile.mediaFileMetadata
                const imageUrl = `${photo.mediaFile.baseUrl}=w${width}-h${height}`

                return (
                    <div key={photo.id} className="mb-4 break-inside-avoid">
                        <img
                            src={`/api/proxy-image?url=${encodeURIComponent(imageUrl)}`}
                            alt={photo.mediaFile.filename}
                            className="w-full h-auto"
                        />
                        {/* <p className="text-sm">{photo.mediaFile.filename}</p> */}
                    </div>
                )
            })}
        </div>
    )
}


