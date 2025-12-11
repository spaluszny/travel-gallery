/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from 'react'

interface PhotoMetadata {
    continent?: string
    country?: string
    state?: string
    description?: string
    takenBy?: string
}

export default function PhotoPicker() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedPhotos, setSelectedPhotos] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [polling, setPolling] = useState(false)
    const [photoMetadata, setPhotoMetadata] = useState<Record<string, PhotoMetadata>>({})
    //const [sessionData, setSessionData] = useState()

    const options = [
        { key: "south-america", value: "South America" },
        { key: "north-america", value: "North America" },
        { key: "asia", value: "Aisa" },
        { key: "africa", value: "Africa" },
        { key: "europe", value: "Europe" },
        { key: "oceania", value: "Oceania" },
    ]
    //const photoMetadata = 
    const updateMetadata = (photoId: string, field: string, value: string) => {
        setPhotoMetadata((prev) => ({
            ...prev,
            [photoId]: { ...prev[photoId], [field]: value }
        }))
    }

    const uploadPhotos = async () => {
        setLoading(true) // You'll need a loading state

        try {
            // Loop through each selected photo
            for (const photo of selectedPhotos) {

                const metadata = photoMetadata[photo.id] || {}

                // Call the upload API
                const response = await fetch('/api/upload-to-s3', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        baseUrl: photo.mediaFile.baseUrl,
                        filename: photo.mediaFile.filename,
                        width: photo.mediaFile.mediaFileMetadata.width,
                        height: photo.mediaFile.mediaFileMetadata.height,
                        googlePhotoId: photo.id,
                        photoDate: photo.createTime,
                        cameraMake: photo.mediaFile.mediaFileMetadata.cameraMake,
                        cameraModel: photo.mediaFile.mediaFileMetadata.cameraModel,
                        continent: metadata.continent || null,
                        country: metadata.country || null,
                        state: metadata.state || null,
                        description: metadata.description || null,
                        takenBy: metadata.takenBy || null,
                    })
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(`Failed to upload ${photo.mediaFile.filename}: ${error.error}`)
                }

                const data = await response.json()
                console.log('Uploaded:', data)
            }

            alert('All photos uploaded successfully!')

            // Clean up
            setSelectedPhotos([])
            setPhotoMetadata({})
            if (sessionId) {
                await deleteSession()
            }


        } catch (error) {
            console.error('Upload error:', error)
            alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'))

        } finally {
            setLoading(false)
        }
    }

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
            <div className='flex gap-5 pt-5'>
                <button
                    className="disabled:opacity-50 btn-primary"
                    disabled={loading || sessionId != null}
                    onClick={openPicker}
                >
                    {loading ? 'Opening Picker...' : 'Add Photos'}
                </button>
                <button className="disabled:hidden btn-primary"
                    disabled={!sessionId}
                    onClick={deleteSession}
                >
                    Delete Selection
                </button>

            </div>
            {selectedPhotos.map((photo) => {
                const { width, height } = photo.mediaFile.mediaFileMetadata
                const imageUrl = `${photo.mediaFile.baseUrl}=w${width}-h${height}`

                return (
                    <div key={photo.id} className="mb-4 break-inside-avoid pt-5 w-150">
                        <img
                            src={`/api/proxy-image?url=${encodeURIComponent(imageUrl)}`}
                            alt={photo.mediaFile.filename}
                            className="w-full h-auto"
                        />
                        {/* <p className="text-sm">{photo.mediaFile.filename}</p> */}
                        <div className='flex flex-col pt-5 gap-5'>
                            {/* <input
                                type="text"
                                placeholder="Continent"
                                value={photoMetadata[photo.id]?.continent || ''}
                                onChange={(e) => updateMetadata(photo.id, 'continent', e.target.value)}
                                className="border p-2 mb-2 w-full"
                                required
                            /> */}
                            <select id="options" value={photoMetadata[photo.id]?.continent || ''} onChange={(e) => updateMetadata(photo.id, 'continent', e.target.value)}>
                                <option value="">--Continent--</option>
                                <option value="Asia">Asia</option>
                                <option value="Africa">Africa</option>
                                <option value="Europe">Europe</option>
                                <option value="North America">North America</option>
                                <option value="South America">South America</option>
                                <option value="Oceania">Oceania</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Country"
                                value={photoMetadata[photo.id]?.country || ''}
                                onChange={(e) => updateMetadata(photo.id, 'country', e.target.value)}
                                className="border p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="City/State"
                                value={photoMetadata[photo.id]?.state || ''}
                                onChange={(e) => updateMetadata(photo.id, 'state', e.target.value)}
                                className="border p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                value={photoMetadata[photo.id]?.description || ''}
                                onChange={(e) => updateMetadata(photo.id, 'description', e.target.value)}
                                className="border p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="Taken By"
                                value={photoMetadata[photo.id]?.takenBy || ''}
                                onChange={(e) => updateMetadata(photo.id, 'takenBy', e.target.value)}
                                className="border p-2 mb-2 w-full"
                            />
                        </div>

                    </div>

                )
            })}
            <button className='disabled:hidden btn-primary'
                disabled={!sessionId}
                onClick={uploadPhotos}
            >Upload</button>
        </div>
    )
}


